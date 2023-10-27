export function startOfDay(date: Date | string) {
  return new Date(date + 'T00:00:00.000-03:00');
}

export function endOfDay(date: Date | string): Date {
  return new Date(date + 'T23:59:59.999-03:00');
}

export function dateWithoutTz(date: Date): Date {
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - userTimezoneOffset);
}
