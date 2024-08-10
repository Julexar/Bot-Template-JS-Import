import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  constructor(message, cause) {
    super(message || 'Bad Request', 400, cause);
  }
}
