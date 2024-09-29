export const SORT_BY = {
  fastest: 'fastest',
  cheapest: 'cheapest',
} as const

export type SortBy = keyof typeof SORT_BY
