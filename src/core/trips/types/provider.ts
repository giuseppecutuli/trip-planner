export const PROVIDER = {
  bizaway: 'bizaway',
} as const

export type Provider = keyof typeof PROVIDER
