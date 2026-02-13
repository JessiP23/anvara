export const queryKeys = {
    adSlots: {
        all: ['adSlots'] as const,
        paginated: () => [queryKeys.adSlots.all, 'paginated'] as const,
        detail: (id: string) => [queryKeys.adSlots.all, 'detail', id] as const,
    }
} as const;