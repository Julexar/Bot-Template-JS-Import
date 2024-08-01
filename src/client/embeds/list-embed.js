import { CustomEmbed } from './custom-embed';

export class ListEmbed extends CustomEmbed {
  /**
   *
   * @param {string} title
   * @param {string} description
   * @param {APIEmbedField[]} fields
   */
  constructor(title, description, fields) {
    super(title, description, 0x00ffff, fields);
  }
}
