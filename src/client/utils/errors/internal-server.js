import { CustomError } from './custom-error';

export class InternalServerError extends CustomError {
  constructor(message, cause) {
    super(message || 'Internal Server Error', 500, cause);
  }
}
