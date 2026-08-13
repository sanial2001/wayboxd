type ClassValue = string | false | null | undefined | 0 | 0n | '';

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
