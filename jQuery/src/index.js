$(() => {
  function createSendRequest(url) {
    return ({ prompt, data }, b) => {
      const isValidRequest = JSON.stringify(prompt.user || prompt).length < 5000;
      if (!isValidRequest) {
        return {
          promise: Promise.reject(new Error('Request is too long. Specify a shorter prompt.')),
          abort: () => {},
        };
      }

      const controller = new AbortController();
      const signal = controller.signal;

      const promise = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, data }),
        signal,
      })
        .then(response => response.json())
        .then(result => {
          return result.content;
        });

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

  $('#gridContainer').dxDataGrid({
    dataSource: sales,
    aiIntegration: columnAiIntegration,
    showBorders: true,
    keyExpr: 'Id',
    searchPanel: {
      visible: true,
      width: 240,
      placeholder: 'Search...',
    },
    groupPanel: {
      visible: true,
    },
    headerFilter: {
      visible: true,
    },
    filterRow: {
      visible: true,
    },
    filterSyncEnabled: true,
    paging: {
      pageSize: 10,
    },
    pager: {
      visible: true,
      allowedPageSizes: [10, 25, 50, 100],
      showPageSizeSelector: true,
    },
    aiAssistant: {
      enabled: true,
      aiIntegration: assistantAiIntegration,
      chat: {
        onInitialized(e) {
          chatInstance = e.component;
        },
        user: {
          id: 'user',
        },
        suggestions: {
          items: [
            {
              text: '💡 Help',
              prompt: `💡 The DataGrid AI Assistant allows you to control the component using natural language. You can execute commands such as the following:
  • Sort records
  • Apply a filter
  • Search for a specific value
  • Group records by a field
  • Focus and select rows
  • Modify paging settings
  • Pin, resize, and reorder columns
  • Configure data summaries
  • Pick a suggestion or enter a custom request to get started.`,
            },
            {
              text: '🔍 Filter Sector by Health',
              prompt: 'Filter Sector by Health',
            },
            {
              text: '↕️ Sort by Region',
              prompt: 'Sort by Region',
            },
            {
              text: '🧩 Group by Product',
              prompt: 'Group by Product',
              width: 170,
            },
          ],
          onItemClick(e) {
            const { prompt, text } = e.itemData;
            const userId = text === '💡 Help' ? 'help' : 'user';

            const message = {
              id: Date.now(),
              timestamp: new Date(),
              author: { id: userId },
              text: prompt,
            };

            chatInstance.getDataSource().store().push([{
              type: 'insert',
              data: message,
            }]);
          },
        },
      },
    },
    columns: [
      {
        dataField: 'Product',
      },
      {
        dataField: 'Amount',
        caption: 'Sale Amount',
        dataType: 'number',
        format: 'currency',
      },
      {
        dataField: 'Region',
        dataType: 'string',
      },
      {
        dataField: 'Sector',
        dataType: 'string',
      },
      {
        dataField: 'SaleDate',
        dataType: 'date',
      },
      {
        dataField: 'Customer',
        dataType: 'string',
      },
      {
        name: 'AI column',
        caption: 'AI Column',
        type: 'ai',
        ai: {
          prompt: 'Identify the country where product is manufactured. When looking up a country, consider Sector and Customers.',
          mode: 'auto',
          noDataText: 'No data',
        },
        width: 200,
        fixed: true,
        fixedPosition: 'right',
        cssClass: 'ai__cell',
      },
    ],
  });
});
