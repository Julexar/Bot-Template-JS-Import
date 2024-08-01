import { CustomEmbed } from './custom-embed';

export class SuccessEmbed extends CustomEmbed {
  /**
   *
   * @param {string} title
   * @param {string} description
   */
  constructor(title, description) {
    super(title, description, 0x65fe08);
  }
}
