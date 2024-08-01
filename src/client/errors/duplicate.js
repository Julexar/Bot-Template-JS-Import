import { CustomError } from './custom-error';

export class DuplicateError extends CustomError {
  constructor(message, cause) {
    super(message || 'Duplicate Record', 409, cause);
  }
}
