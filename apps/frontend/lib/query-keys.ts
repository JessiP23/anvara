export const queryKeys = {
    adSlots: {
        paginated: () => ['adSlots', 'paginated'] as const,
        detail: (id: string) => ['adSlots', 'detail', id] as const,
    }
} as const;