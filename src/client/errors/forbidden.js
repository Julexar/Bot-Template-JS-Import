import { CustomError } from './custom-error';

export class ForbiddenError extends CustomError {
  constructor(message, cause) {
    super(message || 'Forbidden', 403, cause);
  }
}
