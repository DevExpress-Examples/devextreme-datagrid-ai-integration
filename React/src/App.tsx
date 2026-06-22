import { useMemo, useRef } from 'react';
import DataGrid, {
  AI,
  AIAssistant,
  Column,
  FilterRow,
  GroupPanel,
  HeaderFilter,
  Pager,
  Paging,
  SearchPanel,
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.fluent.blue.light.css';
import './App.css';

import AIService from './service';
import { AI_ASSISTANT_URL, AI_COLUMN_URL, sales } from './data';

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

const allowedPageSizes = [10, 25, 50, 100];

function App(): JSX.Element {
  const service = useMemo(() => new AIService(AI_COLUMN_URL, AI_ASSISTANT_URL), []);
  const chatRef = useRef<any>(null);

  const chatOptions = useMemo(() => ({
    onInitialized: (e: { component: unknown }) => {
      chatRef.current = e.component;
    },
    user: { id: 'user' },
    suggestions: {
      items: [
        { text: '💡 Help', prompt: HELP_PROMPT },
        { text: '🔍 Filter Sector by Health', prompt: 'Filter Sector by Health' },
        { text: '↕️ Sort by Region', prompt: 'Sort by Region' },
        { text: '🧩 Group by Product', prompt: 'Group by Product', width: 170 },
      ],
      onItemClick: (e: { itemData: { text: string; prompt: string } }) => {
        const { prompt, text } = e.itemData;
        const userId = text === '💡 Help' ? 'help' : 'user';

        const message = {
          id: Date.now(),
          timestamp: new Date(),
          author: { id: userId },
          text: prompt,
        };

        chatRef.current?.getDataSource().store().push([{
          type: 'insert',
          data: message,
        }]);
      },
    },
  }), []);

  return (
    <div className="main">
      <DataGrid
        dataSource={sales}
        aiIntegration={service.columnAiIntegration}
        showBorders
        keyExpr="Id"
        filterSyncEnabled
      >
        <SearchPanel visible width={240} placeholder="Search..." />
        <GroupPanel visible />
        <HeaderFilter visible />
        <FilterRow visible />
        <Paging defaultPageSize={10} />
        <Pager
          visible
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector
        />

        <AIAssistant
          enabled
          aiIntegration={service.assistantAiIntegration}
          chat={chatOptions}
        />

        <Column dataField="Product" />
        <Column dataField="Amount" caption="Sale Amount" dataType="number" format="currency" />
        <Column dataField="Region" dataType="string" />
        <Column dataField="Sector" dataType="string" />
        <Column dataField="SaleDate" dataType="date" />
        <Column dataField="Customer" dataType="string" />
        <Column
          name="AI column"
          caption="AI Column"
          type="ai"
          width={200}
          fixed
          fixedPosition="right"
          cssClass="ai__cell"
        >
          <AI
            prompt="Identify the country where product is manufactured. When looking up a country, consider Sector and Customers."
            mode="auto"
            noDataText="No data"
          />
        </Column>
      </DataGrid>
    </div>
  );
}

export default App;
