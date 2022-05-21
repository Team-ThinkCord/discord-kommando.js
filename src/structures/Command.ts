import { ChannelType } from 'discord-api-types/v9';
import { CommandInteraction } from 'discord.js';
import * as Builders from '@discordjs/builders';
import { SlashCommandBuilder } from '@discordjs/builders';

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

export interface CommandData {
    name: string,
    description: string,
    options?: OptionData[],
    requires?: string[]
}

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

export type SlashCommandBuilderAddOptionMethod = 
    'addStringOption' |
    'addIntegerOption' |
    'addNumberOption' |
    'addBooleanOption' |
    'addMentionableOption' |
    'addChannelOption' |
    'addRoleOption' |
    'addUserOption';

export type SlashCommandOptions = 
    Builders.SlashCommandStringOption |
    Builders.SlashCommandIntegerOption |
    Builders.SlashCommandNumberOption |
    Builders.SlashCommandBooleanOption |
    Builders.SlashCommandMentionableOption |
    Builders.SlashCommandChannelOption |
    Builders.SlashCommandRoleOption |
    Builders.SlashCommandUserOption;

export class Command {
    public name: string;
    public description: string;
    public requires: string[];
    public toJSON: typeof SlashCommandBuilder.prototype.toJSON;
    private data: SlashCommandBuilder;
    private callbacks: { default: (itr: CommandInteraction) => void, [key: string]: (itr: CommandInteraction) => void }
    
    constructor(data: CommandData) {
        this.name = data.name;
        this.description = data.description;
        this.requires = data.requires ?? [];
        this.callbacks = { default: () => {} };
        this.data = new SlashCommandBuilder();
        if (data.options) this.addOptions(data.options);

        this.toJSON = this.data.toJSON;
        
        this.build();
    }
    
    build(): SlashCommandBuilder {
       this.data
           .setName(this.name)
           .setDescription(this.description);
       
       return this.data;
    }
    
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
    
    addOptions(options: OptionData[]): Command {
        for (let i = 0; i < options.length; i++) this.addOption(options[i]);
        
        return this;
    }
    
    handle(callback: (itr: CommandInteraction) => void, subCommand?: string): Command {
        if (subCommand) this.callbacks[subCommand] = callback;

        this.callbacks.default = callback;
        
        return this;
    }
    
    call(itr: CommandInteraction): Command {
        if (itr.options.getSubcommand()) this.callbacks[(itr.options.getSubcommandGroup().length ? itr.options.getSubcommandGroup() + " " : "") + itr.options.getSubcommand()]?.(itr);
        this.callbacks.default(itr);
        
        return this;
    }
}