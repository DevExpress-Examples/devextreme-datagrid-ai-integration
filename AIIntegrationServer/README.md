# AIIntegrationServer

AIIntegrationServer is an API-only Web API that acts as a proxy between a DevExtreme DataGrid `AIIntegration` component and [Azure OpenAI](https://azure.microsoft.com/en-us/pricing/details/azure-openai/). It exposes endpoints for AI-powered grid column transformations and an assistant chat, forwarding prompts to Azure OpenAI and returning the model response.

## Features

- **API-only architecture** - No Views or static files
- **Azure OpenAI integration** - Uses `Azure.AI.OpenAI` alongside `Microsoft.Extensions.AI`
- **Two endpoints** - Separate routes for grid column transformations and the AI assistant (with JSON schema response format)
- **Stateless** - No session storage, each request is independent
- **CORS enabled** - Allows cross-origin requests from client applications
- **snake_case JSON** - Request/response payloads use `snake_case` property naming
- **Port 5005** - Runs on HTTP port 5005 and HTTPS port 5006

## Project Structure

```
AIIntegrationServer/
├── Configuration/
│   └── AzureOpenAIOptions.cs        # Azure OpenAI configuration options
├── Controllers/
│   └── AIIntegrationController.cs   # API endpoints for AI completions
├── Models/
│   └── AIIntegrationRequest.cs      # Request and response payload models
├── Program.cs                       # App startup and chat client setup
├── appsettings.json                 # Application settings
└── AIIntegrationServer.csproj       # Project file
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)

## API Endpoints

### POST /api/ai/grid-column

Runs a chat completion for grid column transformations (temperature `0.7`).

### POST /api/ai/assistant

Runs a chat completion for the AI assistant (temperature `0.0`). If the request `data` contains a `responseSchema` property, it is forwarded to Azure OpenAI as a JSON schema response format; otherwise the response is returned as plain JSON.

**Request Body (application/json):**

```json
{
  "prompt": {
    "system": "You are a helpful assistant...",
    "user": "Text: ... Fields: ..."
  },
  "data": {
    "responseSchema": { }
  }
}
```

**Response Body (application/json):**

```json
{
  "content": "..."
}
```

## Configuration

Update `appsettings.json` with your Azure OpenAI credentials:

```json
{
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "ApiKey": "your-api-key",
    "ModelName": "your-deployment-name"
  }
}
```

## Run the Server

```bash
dotnet run
```

The server will start on:
- HTTP: http://localhost:5005
- HTTPS: https://localhost:5006

## CORS Policy

The server allows all HTTP methods and headers for requests from `http://localhost:5050`. This configuration is for development purposes only. For production, restrict allowed origins in [Program.cs](AIIntegrationServer/Program.cs) to specific domains.
