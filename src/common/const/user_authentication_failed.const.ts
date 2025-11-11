export const AuthenticationFailReason = {
  NOT_MATCHED: 'Code does not match.',
  EXPIRED: 'The code has expired.',
  ALREADY_VERIFIED: 'This authentication has already been verified.',
  CANCELLED: 'This authentication attempt was cancelled.',
  INVALID_TOKEN: 'The provided token is invalid.',
  MAX_ATTEMPTS_REACHED: 'Maximum attempts reached. Please request a new code.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};
