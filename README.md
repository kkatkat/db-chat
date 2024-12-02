# 💬 db-chat

Chat with an LLM to retrieve information from your MySQL database without writing SQL.

### Prerequisite: Ollama

1. Download and install Ollama from [https://ollama.com/](https://ollama.com/)
2. In a terminal, do `ollama run llama3.1:8b` (or another model of choice)

### Run the project

1. `npm install`
2. `npm run start`
3. By default, the server should start on port 3001

### Example usage

##### Request

POST: `localhost:3001/ask`

Request body (JSON):
```json
{
    "prompt": "How many employees are there in the 'Shoes' department?",
    "dbName": "dunder_mifflin",
    "dbUser": "root",
    "dbPassword": "root",
    "dbHost": "localhost",
    "dbPort": "3306",
    "tablesDescription": "table employees ( id INT, first_name VARCHAR(50), last_name VARCHAR(50), email VARCHAR(50), gender VARCHAR(50), city VARCHAR(50), department VARCHAR(50) )"
}
```

##### Response

```json
{
    "answer": "There are 3 employees in the 'Shoes' department.",
    "sql": "SELECT COUNT(id) FROM employees WHERE department = 'Shoes';"
}
```

