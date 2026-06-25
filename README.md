<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/1271355141/26.1.3%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1330610)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
[![](https://img.shields.io/badge/💬_Leave_Feedback-feecdd?style=flat-square)](#does-this-example-address-your-development-requirementsobjectives)
<!-- default badges end -->
# DevExtreme DataGrid - AI Integration

This example demonstrates how to enhance the [DevExtreme DataGrid](https://js.devexpress.com/Documentation/Guide/UI_Components/DataGrid/Overview/) with two AI-powered features: an [AI column](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/ai/) that fills cells with values generated from row context, and the [AI Assistant](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/aiAssistant/) chat that lets end users control the grid (sort, filter, search, group, page, etc.) through natural-language requests.

![Example image](images/image-template.png)

## Implementation Details

### Setup the AI Integration Server

This example includes a pre-configured ASP.NET Core Web API server (see [AIIntegrationServer](/AIIntegrationServer/)) that acts as a proxy between the client and [Azure OpenAI](https://azure.microsoft.com/en-us/pricing/details/azure-openai/). The server runs at `http://localhost:5005` and exposes the following endpoints:
- `/api/ai/grid-column` (POST) - Used by the DataGrid AI column to generate cell values.
- `/api/ai/assistant` (POST) - Used by the AI Assistant to translate chat messages into DataGrid commands. When the request body contains a `responseSchema`, the server forwards it to Azure OpenAI as a structured JSON response format.

Credentials are read from [appsettings.json](AIIntegrationServer/appsettings.json) under the `AzureOpenAI` section (`Endpoint`, `ApiKey`, `ModelName`). The sample is preconfigured to use the public DevExpress demo endpoint; replace those values with your own Azure OpenAI deployment for production use. CORS is enabled for `http://localhost:5050` (the ASP.NET Core front-end) and the framework client dev servers.

### Configure the AIIntegration object

All framework projects share the same client-side pattern:

1. A `sendRequest` factory wraps `fetch` and posts `{ prompt, data }` to the chosen endpoint. The request is aborted via `AbortController` if the user cancels, and oversized prompts (≥ 5000 characters) are rejected before any network call.

2. Two separate [AIIntegration](https://js.devexpress.com/Documentation/ApiReference/Common_Types/AIIntegration) instances are created with `new DevExpress.aiIntegration.AIIntegration({ sendRequest })` - one bound to the column endpoint, one to the assistant endpoint. They are passed to the DataGrid via the [aiIntegration](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#aiIntegration) option and the [aiAssistant.aiIntegration](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/aiAssistant/#aiIntegration) sub-option respectively.

### Configure the DataGrid AI column

A column with `type: 'ai'` enables automatic cell value generation. The [ai](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/ai/) sub-options describe how the model should fill values:

- `prompt` - The natural-language instruction sent to the model with row data as context.
- `mode` - `'auto'` runs the AI for every visible row automatically; `'manual'` waits for user action.
- `noDataText` - Placeholder shown while values are being generated.

### Configure the DataGrid AI Assistant

The [aiAssistant](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/aiAssistant/) option turns on a chat panel that issues structured commands to the grid. The embedded [Chat](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxChat/) is configured with:

- `user` - Identifies the end user in the chat data source.
- `suggestions.items` - Quick-action chips (Help, Filter, Sort, Group). Each item carries a `prompt` payload.
- `suggestions.onItemClick` - Pushes the suggestion's prompt into the chat data source as a new user (or `help`) message.
- `onInitialized` - Stores the chat instance reference so suggestions can append messages directly to its data source.

## Run the Example

### Angular, React, Vue, and jQuery

1. **Start the AI Integration Server**

    ```bash
    cd AIIntegrationServer
    dotnet run
    ```

    The server starts on `http://localhost:5005`.

2. **Run the Client Application**

    - **Angular:** `cd Angular && npm install && npm start`
    - **React:** `cd React && npm install && npm run dev`
    - **Vue:** `cd Vue && npm install && npm run dev`
    - **jQuery:** `cd jQuery && npm install && npm start`

### ASP.NET Core

1. **Start the AI Integration Server**

    ```bash
    cd AIIntegrationServer
    dotnet run
    ```

2. **Run the ASP.NET Core front-end** in a separate terminal:

    ```bash
    cd "ASP.NET Core"
    dotnet run
    ```

    The front-end starts on `http://localhost:5050`.

## Files to Review

- *AI Integration Server*
    - [Program.cs](AIIntegrationServer/Program.cs) - App startup, Azure OpenAI client, CORS, and routing
    - [AIIntegrationController.cs](AIIntegrationServer/Controllers/AIIntegrationController.cs) - `/api/ai/grid-column` and `/api/ai/assistant` endpoints
    - [AIIntegrationRequest.cs](AIIntegrationServer/Models/AIIntegrationRequest.cs) - Request/response payload models
    - [AzureOpenAIOptions.cs](AIIntegrationServer/Configuration/AzureOpenAIOptions.cs) - Azure OpenAI configuration binding
- **Angular**
    - [app.component.html](Angular/src/app/app.component.html)
    - [app.component.ts](Angular/src/app/app.component.ts)
    - [ai.service.ts](Angular/src/app/ai.service.ts)
- **React**
    - [App.tsx](React/src/App.tsx)
    - [service.ts](React/src/service.ts)
- **Vue**
    - [App.vue](Vue/src/App.vue)
    - [HomeContent.vue](Vue/src/components/HomeContent.vue)
    - [service.ts](Vue/src/service.ts)
- **jQuery**
    - [index.html](jQuery/src/index.html)
    - [index.js](jQuery/src/index.js)
- **ASP.NET Core**
    - [Index.cshtml](ASP.NET%20Core/Views/Home/Index.cshtml)
    - [grid-ai-service.js](ASP.NET%20Core/wwwroot/js/grid-ai-service.js)
    - [Program.cs](ASP.NET%20Core/Program.cs)

## Documentation

- [DataGrid - AI-Powered Features Overview](https://js.devexpress.com/Documentation/Guide/AI_Features/Overview_of_AI-powered_Features/)
- [DataGrid - AI Column](https://js.devexpress.com/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Types/AI_Columns/)
- [DataGrid - AI Assistant](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/aiAssistant/)
- [AIIntegration Utility](https://js.devexpress.com/Documentation/ApiReference/Common_Types/AIIntegration/)

<!-- feedback -->
## Does This Example Address Your Development Requirements/Objectives?

[<img src="https://www.devexpress.com/support/examples/i/yes-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-datagrid-ai-integration&~~~was_helpful=yes) [<img src="https://www.devexpress.com/support/examples/i/no-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-datagrid-ai-integration&~~~was_helpful=no)

(you will be redirected to DevExpress.com to submit your response)
<!-- feedback end -->
