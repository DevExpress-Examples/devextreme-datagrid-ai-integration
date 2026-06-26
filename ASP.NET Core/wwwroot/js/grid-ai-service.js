const HELP_PROMPT = `💡 The DataGrid AI Assistant allows you to control the component using natural language. You can execute commands such as the following:
  • Sort records
  • Apply a filter
  • Search for a specific value
  • Group records by a field
  • Focus and select rows
  • Modify paging settings
  • Pin, resize, and reorder columns
  • Configure data summaries
  • Pick a suggestion or enter a custom request to get started.`;

function createSendRequest(url) {
    return ({ prompt, data }) => {
        const isValidRequest = JSON.stringify(prompt.user || prompt).length < 5000;
        if (!isValidRequest) {
            return {
                promise: Promise.reject(new Error('Request is too long. Specify a shorter prompt.')),
                abort: () => {},
            };
        }

        const controller = new AbortController();

        const promise = fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, data }),
            signal: controller.signal,
        })
            .then(response => response.json())
            .then(result => result.content);

        return {
            promise,
            abort: () => controller.abort(),
        };
    };
}

const columnAiIntegration = new DevExpress.aiIntegration.AIIntegration({
    sendRequest: createSendRequest(AI_COLUMN_URL),
});

const assistantAiIntegration = new DevExpress.aiIntegration.AIIntegration({
    sendRequest: createSendRequest(AI_ASSISTANT_URL),
});

let chatInstance;

function onChatInitialized(e) {
    chatInstance = e.component;
}

function onChatSuggestionItemClick(e) {
    const { prompt, text } = e.itemData;
    const userId = text === '💡 Help' ? 'help' : 'user';

    chatInstance.getDataSource().store().push([{
        type: 'insert',
        data: {
            id: Date.now(),
            timestamp: new Date(),
            author: { id: userId },
            text: prompt,
        },
    }]);
}
