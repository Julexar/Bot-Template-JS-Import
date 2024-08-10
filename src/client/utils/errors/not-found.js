import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  constructor(message, cause) {
    super(message || 'Not Found', 404, cause);
  }
}
