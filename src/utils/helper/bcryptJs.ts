import bcrypt from 'bcryptjs';

export const hashPassword = async (plainPassword: string, saltRounds = 8) => {
  if (typeof plainPassword !== 'string' || !plainPassword.trim()) {
    throw new Error('Password must be a non-empty string');
  }
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainPassword, salt);
};

export const verifyPassword = async (plainPassword: string, hash: string) => {
  if (typeof plainPassword !== 'string' || typeof hash !== 'string') {
    throw new Error('Invalid arguments to verifyPassword');
  }
  return await bcrypt.compare(plainPassword, hash);
};
