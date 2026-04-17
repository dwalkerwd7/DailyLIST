declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string
            PORT: string
            LOG_PATH: string
        }
    }
}

export {}
