// Frontend utility functions
const env = globalThis.process?.env;

export const config = {
  apiUrl: env?.NEXT_PUBLIC_API_URL || "http://localhost:4291",
  isDev: env?.NODE_ENV === 'development',
  isProd: env?.NODE_ENV === 'production'
} as const;

export const API_URL = config.apiUrl;

// Class name helper (simple cn alternative)
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}