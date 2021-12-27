import getErrorMessage from './getErrorMessage';

class CustomError {
  private code: number;
  private message: string;

  constructor(code: number, message?: string) {
    this.code = code;
    this.message = getErrorMessage(code) || message;
  }
}

export default CustomError;
