import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
  constructor(message, cause) {
    super(message || 'Unauthorized', 401, cause);
  }
}
