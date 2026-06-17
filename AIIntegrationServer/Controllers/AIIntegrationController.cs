using AIIntegrationServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.AI;
using System.Text.Json;

namespace AIIntegrationServer.Controllers;

[ApiController]
public class AiIntegrationController(
    IChatClient chatClient,
    ILogger<AiIntegrationController> logger) : ControllerBase
{
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
            new ChatOptions
            {
                Temperature = 0.0f,
                ResponseFormat = BuildAssistantResponseFormat(request.Data),
            },
            "AI assistant request failed",
            cancellationToken
            );

    private async Task<IActionResult> RunAsync(
        AIIntegrationRequest request,
        ChatOptions options,
        string errorMessage,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await chatClient.GetResponseAsync(
                [
                    new ChatMessage(ChatRole.System, request.Prompt.System),
                    new ChatMessage(ChatRole.User, request.Prompt.User),
                ],
                options,
                cancellationToken: cancellationToken);

            var rawContent = response.Text ?? string.Empty;

            return Ok(new AIIntegrationResponse { Content = rawContent });
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, errorMessage);
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

