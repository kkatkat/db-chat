import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import axios, { AxiosResponse } from 'axios';
import { ChatRequest, OllamaResponse } from './types.js';

const LLAMA_API_URL = "http://localhost:11434/api/generate";

const app = express();
app.use(bodyParser.json());

async function promptOllama(prompt: string, model: string = 'llama3.1:8b'): Promise<OllamaResponse> {
  const response: AxiosResponse<OllamaResponse> = await axios.post(LLAMA_API_URL, {
    model: model,
    prompt: prompt,
    stream: false,
  })

  return response.data
}

app.post('/ask', async (req, res) => {
    const body: ChatRequest = req.body;

    console.log(JSON.stringify(body.tablesDescription))

    try {
        const initialPrompt = `
            Generate a syntactically correct SQL query for the following question. Write no explanations, just the query as PLAIN TEXT (no markdown) and nothing else:
            Database structure: ${typeof body.tablesDescription == 'object' ? JSON.stringify(body.tablesDescription) : body.tablesDescription.toString()}
            Question: ${body.prompt}
            SQL query:
        `

        const { response: sqlQuery } = await promptOllama(initialPrompt);
        console.log('Generated SQL query:', sqlQuery);

        const db = await mysql.createConnection({
            host: body.dbHost,
            user: body.dbUser,
            password: body.dbPassword,
            database: body.dbName,
        })

        await db.connect();

        const [rows] = await db.query(sqlQuery);

        db.destroy();

        const resultPrompt = `
            This query was executed: ${sqlQuery}

            And the query produced the following results: ${JSON.stringify(rows)}

            Given the results, answer the original question with no more than a few sentences and no technical details: ${body.prompt}

            Your answer:
        `

        const { response: answer } = await promptOllama(resultPrompt);

        res.json({ answer, sql: sqlQuery });

    } catch (error) {
        res.status(500).json({ error: error });
    }
})

app.listen(3001, () => {
    console.log('Server running on port 3001');
})



