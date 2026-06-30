using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ASP_NET_Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;

namespace ASP_NET_Core.Controllers;

[ApiController]
public class AIIntegrationController: ControllerBase {
    private readonly IChatClient _chatClient;
    private readonly ILogger<AIIntegrationController> _logger;

    public AIIntegrationController(IChatClient chatClient, ILogger<AIIntegrationController> logger) {
        _chatClient = chatClient;
        _logger = logger;
    }

    [HttpPost("/api/ai/grid-column")]
    public Task<IActionResult> GridColumn(
        [FromBody] AIIntegrationRequest request,
        CancellationToken cancellationToken)
        => RunAsync(
            request,
            new ChatOptions { Temperature = 0.7f },
            "AI column request failed",
            cancellationToken);

    [HttpPost("/api/ai/assistant")]
    public Task<IActionResult> Assistant(
        [FromBody] AIIntegrationRequest request,
        CancellationToken cancellationToken)
        => RunAsync(
            request,
            new ChatOptions {
                Temperature = 0.0f,
                ResponseFormat = BuildAssistantResponseFormat(request.Data),
            },
            "AI assistant request failed",
            cancellationToken);

    private async Task<IActionResult> RunAsync(
        AIIntegrationRequest request,
        ChatOptions options,
        string errorMessage,
        CancellationToken cancellationToken) {
        try {
            var response = await _chatClient.GetResponseAsync(
                [
                    new ChatMessage(ChatRole.System, request.Prompt.System),
                    new ChatMessage(ChatRole.User, request.Prompt.User),
                ],
                options,
                cancellationToken: cancellationToken);

            var rawContent = response.Text ?? string.Empty;

            return Ok(new AIIntegrationResponse { Content = rawContent });
        } catch(OperationCanceledException) {
            throw;
        } catch(Exception ex) {
            _logger.LogError(ex, errorMessage);
            return StatusCode(502, new { error = "AI service failed." });
        }
    }

    private static ChatResponseFormat BuildAssistantResponseFormat(JsonElement? data)
        => data is { ValueKind: JsonValueKind.Object } element
            && element.TryGetProperty("responseSchema", out var schema)
                ? new ChatResponseFormatJson(
                    schema,
                    "assistant_response",
                    "DevExtreme AI Assistant response schema")
                : ChatResponseFormat.Json;
}
