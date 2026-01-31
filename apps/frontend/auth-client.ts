import { createAuthClient } from 'better-auth/react';
const env = globalThis.process?.env;
export const authClient = createAuthClient({
  baseURL: env?.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3847',
  fetchOptions: {
    credentials: 'include',
  },
});
