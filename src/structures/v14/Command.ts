import { ChannelType } from 'discord-api-types/v10';
import { ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandUserOption } from 'discord.js-14';
import { KommandoClient, Requirement } from '.';

const allowedChannelTypes = [
	ChannelType.GuildText,
	ChannelType.GuildVoice,
	ChannelType.GuildCategory,
	ChannelType.GuildAnnouncement,
	ChannelType.AnnouncementThread,
	ChannelType.PublicThread,
	ChannelType.PrivateThread,
	ChannelType.GuildStageVoice,
    ChannelType.GuildForum,
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
 * The subcommand data to create a subcommand.
 */
export interface SubcommandData {
    name: string,
    description: string,
    options?: OptionData[]
}

/**
 * The subcommand group data to create a subcommand group.
 */
export interface SubcommandGroupData {
    name: string,
    description: string,
    commands: SubcommandData[]
}

/**
 * The option data to be used in a command.
 */
export interface OptionData {
    name: string,
    description: string,
    choices?: unknown[],
    autocomplete?: boolean,
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
    SlashCommandStringOption |
    SlashCommandIntegerOption |
    SlashCommandNumberOption |
    SlashCommandBooleanOption |
    SlashCommandMentionableOption |
    SlashCommandChannelOption |
    SlashCommandRoleOption |
    SlashCommandUserOption;

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
    public requires: Array<Requirement | undefined>;

    /**
     * Make this class to API application command.
     */
    public toJSON: typeof SlashCommandBuilder.prototype.toJSON;

    /**
     * The raw requirements before load.
     */
    private readonly rawRequires: string[];

    /**
     * The data of the command.
     */
    private readonly data: SlashCommandBuilder;

    /**
     * The callbacks of the command.
     */
    private readonly callbacks: { default: (itr: ChatInputCommandInteraction) => void, [key: string]: (itr: ChatInputCommandInteraction) => void }
    
    /**
     * Create a new command handler.
     * @param data The data of the command.
     */
    constructor(data: CommandData) {
        this.name = data.name;
        this.description = data.description;
        this.callbacks = { default: () => {} };
        this.data = new SlashCommandBuilder();
        if (data.options) this.addOptions(data.options);

        this.rawRequires = data.requires ?? [];

        this.requires = [];

        this.toJSON = this.data.toJSON.bind(this.data);
        
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
        this.data[methodName]((option: SlashCommandOptions) => {
            let opt = (option)
                .setName(data.name)
                .setDescription(data.description)
                .setRequired(data.required ?? false);

            // @ts-ignore
            data.choices?.length && opt.addChoices(...data.choices.map(choice => { return { name: choice, value: choice }})); // @ts-ignore
            data.autocomplete != undefined && opt.setAutocomplete(data.autocomplete); // @ts-ignore
            data.channelTypes?.length && opt.addChannelTypes(...data.channelTypes); // @ts-ignore
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
        this.requires = this.rawRequires.map(requirement => client.requirements.get(requirement));

        this.requires.forEach((requirement, i) => { // Checks requirement is defined
            if (!requirement) throw new ReferenceError(`Requirement ${this.rawRequires[i]} not found in command ${this.name}`);
        });

        return this;
    }

    /**
     * Add sub command to the command.
     * @param input The sub command to add.
     */
    addSubcommand(input: SubcommandData): Command {
        let data = new SlashCommandSubcommandBuilder

        data
            .setName(input.name)
            .setDescription(input.description);

        if (input.options) {
            input.options.forEach(opti => {
                let optionName = opti.type.charAt(0).toUpperCase() + opti.type.slice(1);
                let methodName = `add${optionName}Option` as SlashCommandBuilderAddOptionMethod;
                // @ts-ignore
                data[methodName]((option: SlashCommandOptions) => {
                    let opt = (option)
                        .setName(opti.name)
                        .setDescription(opti.description)
                        .setRequired(opti.required ?? false);

                    // @ts-ignore
                    opti.choices?.length && opt.addChoices(...opti.choices.map(choice => { return { name: choice, value: choice }})); // @ts-ignore
                    opti.autocomplete != undefined && opt.setAutocomplete(opti.autocomplete); // @ts-ignore
                    opti.channelTypes?.length && opt.addChannelTypes(...opti.channelTypes); // @ts-ignore
                    opti.minValue != undefined && opt.setMinValue(opti.minValue); // @ts-ignore
                    opti.maxValue != undefined && opt.setMaxValue(opti.maxValue);

                    return opt;
                });
            });
        }

        this.data.addSubcommand(data);
        return this;
    }

    /**
     * Add sub command group to the command.
     * @param group The sub commands to add.
     */
    addSubcommandGroup(group: SubcommandGroupData): Command {
        let data = new SlashCommandSubcommandGroupBuilder();

        data
            .setName(group.name)
            .setDescription(group.description);
        
        group.commands.forEach(input => {
            let data1 = new SlashCommandSubcommandBuilder();

                data1
                    .setName(input.name)
                    .setDescription(input.description);

                if (input.options) {
                    input.options.forEach(opti => {
                        let optionName = opti.type.charAt(0).toUpperCase() + opti.type.slice(1);
                        let methodName: SlashCommandBuilderAddOptionMethod = `add${optionName}Option` as SlashCommandBuilderAddOptionMethod;

                        // @ts-ignore
                        data1[methodName]((option: SlashCommandOptions) => {
                            let opt = (option)
                                .setName(opti.name)
                                .setDescription(opti.description)
                                .setRequired(opti.required ?? false);

                            // @ts-ignore
                            opti.choices?.length && opt.addChoices(...opti.choices.map(choice => { return { name: choice, value: choice }})); // @ts-ignore
                            opti.autocomplete != undefined && opt.setAutocomplete(opti.autocomplete); // @ts-ignore
                            opti.channelTypes?.length && opt.addChannelTypes(...opti.channelTypes); // @ts-ignore
                            opti.minValue != undefined && opt.setMinValue(opti.minValue); // @ts-ignore
                            opti.maxValue != undefined && opt.setMaxValue(opti.maxValue);

                            return opt;
                        });
                    });
                }

                data.addSubcommand(data1);
        });

        this.data.addSubcommandGroup(data);
        return this;
    }

    /**
     * Add callback to the command.
     * @param callback The callback to add.
     * @param [subCommand] The sub command to add the callback to (Can contain spaces if it's subcommand group).
     */
    handle(callback: (itr: ChatInputCommandInteraction) => void, subCommand?: string): Command {
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
    async call(itr: ChatInputCommandInteraction) {
        if (this.requires.length) {
            let results: Array<boolean> = [];

            for (const requirement of this.requires) {
                if (results.includes(false)) break;
                results.push(await requirement!!.call(itr));
            }

            if (results.includes(false)) return;
        }

        if (itr.options.getSubcommand(false)) this.callbacks[(itr.options.getSubcommandGroup(false)?.length ? itr.options.getSubcommandGroup() + " " : "") + itr.options.getSubcommand()]?.(itr);
        else this.callbacks.default(itr);
        
        return this;
    }
}