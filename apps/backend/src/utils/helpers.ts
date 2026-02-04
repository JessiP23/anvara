// Utility helpers for the API
export function getParam(param: unknown): string {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && typeof param[0] === 'string') return param[0];
  return '';
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
}

export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

export function parsePagination(query: {page?: string; limit?: string}): { page: number; limit: number; skip: number } {
  const page = parseInt(query.page ?? '1', 10) || 1;
  const limit = parseInt(query.limit ?? '10', 10) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const buildFilters = (query: Record<string, string | undefined>, allowedFields: string[]): Record<string, string> => {
  const filters: Record<string, string> = {};

  for (const field of allowedFields) {
    const value = query[field];
    if (value !== undefined) {
      filters[field] = value;
    }
  }

  return filters;
};

export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatDate(date: Date): string {
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString();
}
