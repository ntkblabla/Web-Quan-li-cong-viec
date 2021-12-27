import codes from './codes';

const getErrorMessage = (code: number) => {
  switch (code) {
    case codes.USER_NOT_FOUND:
      return 'User is not found';
    case codes.WRONG_PASSWORD:
      return 'Wrong password';
    case codes.NOT_FOUND:
      return 'Request not found';
    default:
      return null;
  }
};

export default getErrorMessage;
