using System.Text.Json;
using System.Text.Json.Serialization;

namespace AIIntegrationServer.Models;

public sealed class AIIntegrationRequest
{
    [JsonPropertyName("prompt")]
    public PromptPayload Prompt { get; set; } = new();

    [JsonPropertyName("data")]
    public JsonElement? Data { get; set; }
}

public sealed class PromptPayload
{
    [JsonPropertyName("system")]
    public string System { get; set; } = string.Empty;

    [JsonPropertyName("user")]
    public string User { get; set; } = string.Empty;
}

public sealed class AIIntegrationResponse
{
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}
