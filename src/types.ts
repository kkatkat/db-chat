export type OllamaResponse = {
    response: string;
    context: number[];
    done: boolean;
    done_reason: string;
    created_at: Date;
}

export type DbColumn = {
    name: string;
    type: string;
}

export type DbTable = {
    tableName: string;
    columns: DbColumn[];
}

export type ChatRequest = {
    prompt: string;
    dbHost: string;
    dbPort: number;
    dbUser: string;
    dbPassword: string;
    dbName: string;
    tablesDescription: DbTable[] | string;
    model?: string;
    ollamaApiUrl?: string;
}