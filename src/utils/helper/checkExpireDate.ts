// src/common/utils/code.util.ts

/**
 * Checks if the given expiration date has passed
 * @param expireDate - Date object or ISO string
 * @returns true if expired, false if still valid
 */
export function isExpired(expireDate: Date | string): boolean {
  const now = new Date();
  const exp = expireDate instanceof Date ? expireDate : new Date(expireDate);
  return now > exp;
}
