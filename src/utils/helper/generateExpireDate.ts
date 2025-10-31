export function generateExpireDate(minutes: number): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}
