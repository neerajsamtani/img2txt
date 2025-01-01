declare global {
    namespace NodeJS {
        interface ProcessEnv {
            OPENAI_API_KEY: string;
            AUTH_PASSWORD: string;
        }
    }
}