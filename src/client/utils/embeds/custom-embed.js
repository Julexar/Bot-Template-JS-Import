import { APIEmbedField, ColorResolvable, EmbedBuilder, User } from 'discord.js';

export class CustomEmbed extends EmbedBuilder {
  /**
   *
   * @param {string} title
   * @param {string} description
   * @param {ColorResolvable | 0x00FFFF} color
   * @param {APIEmbedField[] | null} fields
   * @param {User} author
   */
  constructor(title, description, color = 0x00ffff, fields = null, author = undefined) {
    super({
      author: author && { name: author.displayName, iconURL: author.avatarURL() },
      title: title,
      description: description,
      footer: {
        text: 'Made by Julexar',
      },
      fields: fields || [],
      timestamp: Date.now(),
    });

    this.setColor(color);
  }
}
