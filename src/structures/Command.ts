import { ChannelType } from 'discord-api-types';
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
    Builders.SlashCommandRoleOption
    Builders.SlashCommandUserOption;

export class Command {
    public name: string;
    public description: string;
    public requires: string[];
    private data: SlashCommandBuilder;
    private callback: (itr: CommandInteraction) => void;
    
    constructor(data: CommandData) {
        this.name = data.name;
        this.description = data.description;
        this.requires = data.requires ?? [];
        this.callback = () => {}
        this.data = new SlashCommandBuilder();
        if (data.options) this.addOptions(data.options);
        
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
        
        // @ts-expect-error
        this.data[methodName](<T extends unknown>(option: T) => {
            let opt = (option as SlashCommandOptions)
                .setName(data.name)
                .setDescription(data.description)
                .setRequired(data.required ?? false);
                
            // @ts-expect-error
            data.choices?.length &&  opt.setChoices(data.choices); // @ts-expect-error
            data.autocomplete != undefined && opt.setAutocomplete(data.autocomplete); // @ts-expect-error
            data.channelTypes?.length && opt.addChannelTypes(data.channelTypes);
            return opt;
        });
        
        return this;
    }
    
    addOptions(options: OptionData[]): Command {
        for (let i = 0; i < options.length; i++) this.addOption(options[i]);
        
        return this;
    }
    
    handle(callback: (itr: CommandInteraction) => void): Command {
        this.callback = callback;
        
        return this;
    }
    
    call(itr: CommandInteraction): Command {
        this.callback(itr);
        
        return this;
    }
}