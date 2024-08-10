import { CustomEmbed } from './custom-embed';

export class ErrorEmbed extends CustomEmbed {
  /**
   *
   * @param {import('../errors').CustomError} error
   * @param {boolean} custom
   */
  constructor(error, custom) {
    if (custom) super('An Error occurred...', `${error} - ${error.cause}`, 0xff0000);
    else super(`${error}`, `${error.cause}`, 0xff0000);
  }
}
