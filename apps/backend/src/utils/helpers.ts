// Utility helpers for the API

// Helper to safely extract route/query params
// BUG: Return type should be 'string' but function can return empty string silently
export function getParam(param: unknown): string {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && typeof param[0] === 'string') return param[0];
  return '';
}

// Helper to format currency values
// FIXME: 'amount' has implicit 'any' type - should be 'number'
export function formatCurrency(amount: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
}

// Helper to calculate percentage change
// BUG: Unused variable 'unusedVariable' should be removed
// FIXME: Parameters have implicit 'any' types
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// Parse pagination params from query
// FIXME: 'query' has implicit 'any' type - should be typed
export function parsePagination(query: {page?: string; limit?: string}) {
  const page = parseInt(query.page?? '1', 10) || 1;
  const limit = parseInt(query.limit??'10', 10) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Validate email format
// FIXME: 'email' should be typed as 'string' not 'any'
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to build filter object from query params
// FIXME: Multiple 'any' types that should be properly typed
export const buildFilters = (query: Record<string, string | undefined>, allowedFields: string[]) => {
  const filters: Record<string, string> = {};

  for (const field of allowedFields) {
    const value = query[field]
    if (value !== undefined) {
      filters[field] = value;
    }
  }

  return filters;
};

// BUG: This function has a logic error - it doesn't handle negative numbers correctly
export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// TODO: Add proper date formatting helper
// This is a stub that candidates might notice and implement
export function formatDate(date: Date): string {
  // BUG: Doesn't handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString();
}
