import { ChannelType } from 'discord-api-types/v9';
import { CommandInteraction } from 'discord.js';
import * as Builders from '@discordjs/builders';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import { KommandoClient, Requirement } from '.';

const allowedChannelTypes = [
  ChannelType.GuildText,
  ChannelType.GuildVoice,
  ChannelType.GuildCategory,
  ChannelType.GuildNews,
  ChannelType.GuildStore,
  ChannelType.GuildNewsThread,
  ChannelType.GuildPublicThread,
  ChannelType.GuildPrivateThread,
  ChannelType.GuildStageVoice
] as const;

/**
 * The command data to create a command.
 */
export interface CommandData {
    name: string,
    description: string,
    options?: OptionData[],
    requires?: string[]
}

/**
 * An option data to be used in a command.
 */
export interface OptionData {
    name: string,
    description: string,
    choices?: Array<[ unknown, unknown ]>,
    autocomplete: boolean,
    required?: boolean,
    minValue?: number,
    maxValue?: number,
    channelTypes?: Array<typeof allowedChannelTypes[number]>,
    type: 'string' | 'integer' | 'number' | 'boolean' | 'mentionable' | 'channel' | 'role' | 'user'
}

/**
 * Method to add option to a command
 */
export type SlashCommandBuilderAddOptionMethod = 
    'addStringOption' |
    'addIntegerOption' |
    'addNumberOption' |
    'addBooleanOption' |
    'addMentionableOption' |
    'addChannelOption' |
    'addRoleOption' |
    'addUserOption';

/**
 * The slash command options
 */
export type SlashCommandOptions = 
    Builders.SlashCommandStringOption |
    Builders.SlashCommandIntegerOption |
    Builders.SlashCommandNumberOption |
    Builders.SlashCommandBooleanOption |
    Builders.SlashCommandMentionableOption |
    Builders.SlashCommandChannelOption |
    Builders.SlashCommandRoleOption |
    Builders.SlashCommandUserOption;

/**
 * The command will load into kommando.
 */
export class Command {
    /**
     * The name of the command.
     */
    public name: string;

    /**
     * The description of the command.
     */
    public description: string;

    /**
     * The requirements of the command.
     */
    public requires: Requirement[];

    /**
     * Make this class to API application command.
     */
    public toJSON: typeof SlashCommandBuilder.prototype.toJSON;

    /**
     * The raw requirements before loading
     */
    private rawRequires: string[];

    /**
     * The data of the command.
     */
    private readonly data: SlashCommandBuilder;

    /**
     * The callbacks of the command.
     */
    private readonly callbacks: { default: (itr: CommandInteraction) => void, [key: string]: (itr: CommandInteraction) => void }

    /**
     * The kommando client.
     */
    private client?: KommandoClient;
    
    constructor(data: CommandData) {
        this.name = data.name;
        this.description = data.description;
        this.callbacks = { default: () => {} };
        this.data = new SlashCommandBuilder();
        if (data.options) this.addOptions(data.options);

        this.rawRequires = data.requires ?? [];

        this.requires = [];

        this.toJSON = this.data.toJSON;
        
        this.build();
    }

    /**
     * Build application command base
     */
    build(): SlashCommandBuilder {
       this.data
           .setName(this.name)
           .setDescription(this.description);
       
       return this.data;
    }

    /**
     * Add option to the command.
     * @param data The options to add.
     */
    addOption(data: OptionData): Command {
        let optionName = data.type.charAt(0).toUpperCase() + data.type.slice(1);
        let methodName: SlashCommandBuilderAddOptionMethod = `add${optionName}Option` as SlashCommandBuilderAddOptionMethod;
        
        // @ts-ignore
        this.data[methodName](<T extends unknown>(option: T) => {
            let opt = (option as SlashCommandOptions)
                .setName(data.name)
                .setDescription(data.description)
                .setRequired(data.required ?? false);
            
            // @ts-ignore
            data.choices?.length &&  opt.setChoices(data.choices); // @ts-ignore
            data.autocomplete != undefined && opt.setAutocomplete(data.autocomplete); // @ts-ignore
            data.channelTypes?.length && opt.addChannelTypes(data.channelTypes); // @ts-ignore
            data.minValue != undefined && opt.setMinValue(data.minValue); // @ts-ignore
            data.maxValue != undefined && opt.setMaxValue(data.maxValue);

            return opt;
        });
        
        return this;
    }

    /**
     * Add options to the command.
     * @param options The options to add.
     */
    addOptions(options: OptionData[]): Command {
        for (let i = 0; i < options.length; i++) this.addOption(options[i]);
        
        return this;
    }

    /**
     * Register client into the command.
     * @param client The client to register.
     */
    register(client: KommandoClient) {
        this.client = client;

        this.requires = this.rawRequires.map(requirement => client.requirements.get(requirement)!!);

        return this;
    }

    /**
     * Add sub command to the command.
     * @param input The sub command to add.
     */
    addSubcommand(
        input:
                      SlashCommandSubcommandBuilder |
                      ((subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)
    ): Command {
        this.data.addSubcommand(input);
        return this;
    }

    /**
     * Add sub command group to the command.
     * @param group The sub commands to add.
     */
    addSubcommandGroup(
        group:
            SlashCommandSubcommandGroupBuilder |
            ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder)
    ): Command {
        this.data.addSubcommandGroup(group);
        return this;
    }

    /**
     * Add callback to the command.
     * @param callback The callback to add.
     * @param [subCommand] The sub command to add the callback to (Can contain spaces if it's subcommand group).
     */
    handle(callback: (itr: CommandInteraction) => void, subCommand?: string): Command {
        if (subCommand) {
            this.callbacks[subCommand] = callback;
        } else {
            this.callbacks.default = callback;
        }
        
        return this;
    }

    /**
     * Execute the command.
     * @param itr The interaction to execute the command with.
     */
    async call(itr: CommandInteraction) {
        if (this.requires.length) {
            let results: Array<boolean> = [];

            for (const requirement of this.requires) {
                results.push(await requirement.call(itr));
            }

            if (results.includes(false)) return;
        }

        if (itr.options.getSubcommand()) this.callbacks[(itr.options.getSubcommandGroup().length ? itr.options.getSubcommandGroup() + " " : "") + itr.options.getSubcommand()]?.(itr);
        this.callbacks.default(itr);
        
        return this;
    }
}