# DevExtreme DataGrid – Azure OpenAI Integration (.NET AIIntegrationServer)

AIIntegrationServer is an API-only backend that connects [Azure OpenAI](https://azure.microsoft.com/en-us/pricing/details/azure-openai/) with AI-powered DevExtreme DataGrid features:

- [AI columns](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/ai/)
- [AI Assistant](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/aiAssistant/)

## Features

- **API-only architecture** - No Views or UI elements
- **AI .NET Library Integration** - Uses `Azure.AI.OpenAI` and `Microsoft.Extensions.AI`
- **Feature-specific endpoints** - Separate routes for AI columns and AI assistant
- **Stateless** - No session storage, each request is independent
- **CORS enabled** - Allows cross-origin requests from client applications
- **HTTP/HTTPS Support** - Runs on 5005 HTTP port and 5006 HTTPS port

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

Runs chat completions for AI columns. Uses `0.7` temperature value.

### POST /api/ai/assistant

Runs chat completions for the AI assistant. Uses `0.0` temperature value. Returns responses in JSON schemas (specified in a request `responseSchema` parameter). If `responseSchema` is not specified, returns dynamic JSON responses.

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

## Configure an AI Service

Add your Azure OpenAI credentials to `appsettings.json`:

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

The server allows all HTTP methods and headers for requests from `http://localhost:5050`. This configuration is for development purposes only. For production, update allowed origins in [Program.cs](AIIntegrationServer/Program.cs) to your production domains.
