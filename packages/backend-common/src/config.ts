interface ConfigSchema {
  JWT_SECRET: string;
}

export const Config: ConfigSchema = {
    JWT_SECRET: process.env.JWT_SECRET ?? "SECRET",
}