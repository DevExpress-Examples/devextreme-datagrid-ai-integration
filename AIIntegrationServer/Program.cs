using Azure.AI.OpenAI;
using AIIntegrationServer.Configuration;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Options;
using System.ClientModel;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Configure URLs
builder.WebHost.UseUrls("http://localhost:5005", "https://localhost:5006");

// Configure Azure OpenAI options
builder.Services
    .AddOptions<AzureOpenAIOptions>()
    .Bind(builder.Configuration.GetSection(AzureOpenAIOptions.SectionName))
    .ValidateOnStart();

// Configure Chat Client
builder.Services.AddSingleton<IChatClient>(sp => {
    var opts = sp.GetRequiredService<IOptions<AzureOpenAIOptions>>().Value;
    var client = new AzureOpenAIClient(new Uri(opts.Endpoint), new ApiKeyCredential(opts.ApiKey));
    return client.GetChatClient(opts.ModelName).AsIChatClient();
});

// Configure CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowWeb", policy => {
        policy.WithOrigins("http://localhost:5050")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services
    .AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

var app = builder.Build();

app.UseCors("AllowWeb");
app.UseAuthorization();
app.MapControllers();

app.Run();