const requiredServerEnvs = [
  'MONGO_URI',
  'NODE_ENV',
  'PORT',
  'SMTP_HOST',
  'SMTP_PASS',
  'SMTP_USER',
] as const

type RequiredServerEnvKeys = (typeof requiredServerEnvs)[number]

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<RequiredServerEnvKeys, string>{}
  }
}

export {}