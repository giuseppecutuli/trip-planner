export const sortBy = {
  fastest: 'fastest',
  cheapest: 'cheapest',
} as const

export type SortBy = keyof typeof sortBy
