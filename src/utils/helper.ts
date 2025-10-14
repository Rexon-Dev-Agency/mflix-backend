export const formatDate = (date: Date): string => date.toISOString();

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const isEmpty = (value: any): boolean =>
  value === undefined || value === null || value === "";