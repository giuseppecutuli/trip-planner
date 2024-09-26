function toNumber(value: string): number {
  return parseInt(value, 10)
}

function toBool(value: string): boolean {
  return value === 'true'
}

export function getOsEnv(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback
}

export function getOsEnvNumber(key: string, fallback: number): number {
  const value = toNumber(getOsEnv(key))

  if (isNaN(value)) {
    return fallback
  }

  return value
}

export function getOsEnvBoolean(key: string, fallback: boolean = false): boolean {
  return toBool(getOsEnv(key)) || fallback
}
