<script setup lang="ts">
import { ref } from 'vue';

import 'devextreme/dist/css/dx.fluent.blue.light.css';
import DxDataGrid, {
  DxAI,
  DxAIAssistant,
  DxColumn,
  DxFilterRow,
  DxGroupPanel,
  DxHeaderFilter,
  DxPager,
  DxPaging,
  DxSearchPanel,
} from 'devextreme-vue/data-grid';
import type dxChat from 'devextreme/ui/chat';
import type { DxChatTypes } from 'devextreme-vue/chat';
import type { DxButtonGroupTypes } from 'devextreme-vue/button-group';

import AIService from '../service';
import { AI_ASSISTANT_URL, AI_COLUMN_URL, sales } from '../data';

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

const service = new AIService(AI_COLUMN_URL, AI_ASSISTANT_URL);
const chatRef = ref<dxChat | null>(null);

const chatOptions = {
  onInitialized: (e: DxChatTypes.InitializedEvent) => {
    chatRef.value = e.component ?? null;
  },
  user: { id: 'user' },
  suggestions: {
    items: [
      { text: '💡 Help', prompt: HELP_PROMPT },
      { text: '🔍 Filter Sector by Health', prompt: 'Filter Sector by Health' },
      { text: '↕️ Sort by Region', prompt: 'Sort by Region' },
      { text: '🧩 Group by Product', prompt: 'Group by Product', width: 170 },
    ],
    onItemClick: (e: DxButtonGroupTypes.ItemClickEvent) => {
      const { prompt, text } = e.itemData;
      const userId = text === '💡 Help' ? 'help' : 'user';

      const message = {
        id: Date.now(),
        timestamp: new Date(),
        author: { id: userId },
        text: prompt,
      };

      chatRef.value
        ?.getDataSource()
        .store()
        .push([
          {
            type: 'insert',
            data: message,
          },
        ]);
    },
  },
};
</script>

<template>
  <div class="demo-container">
    <DxDataGrid
      id="grid-container"
      :data-source="sales"
      :ai-integration="service.columnAiIntegration"
      :show-borders="true"
      key-expr="Id"
      :filter-sync-enabled="true"
    >
      <DxSearchPanel
        :visible="true"
        :width="240"
        placeholder="Search..."
      />
      <DxGroupPanel :visible="true"/>
      <DxHeaderFilter :visible="true"/>
      <DxFilterRow :visible="true"/>
      <DxPaging :page-size="10"/>
      <DxPager
        :visible="true"
        :allowed-page-sizes="allowedPageSizes"
        :show-page-size-selector="true"
      />

      <DxAIAssistant
        :enabled="true"
        :ai-integration="service.assistantAiIntegration"
        :chat="chatOptions"
      />

      <DxColumn data-field="Product"/>
      <DxColumn
        data-field="Amount"
        caption="Sale Amount"
        data-type="number"
        format="currency"
      />
      <DxColumn
        data-field="Region"
        data-type="string"
      />
      <DxColumn
        data-field="Sector"
        data-type="string"
      />
      <DxColumn
        data-field="SaleDate"
        data-type="date"
      />
      <DxColumn
        data-field="Customer"
        data-type="string"
      />
      <DxColumn
        name="AI column"
        caption="AI Column"
        type="ai"
        :width="200"
        :fixed="true"
        fixed-position="right"
        css-class="ai-cell"
      >
        <DxAI
          :prompt="`
            Identify the country where product is manufactured.
            When looking up a country, consider Sector and Customers.
          `"
          mode="auto"
          no-data-text="No data"
        />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>

<style>
.demo-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}

#grid-container {
  max-width: 1200px;
  width: 100%;
}

#grid-container .ai-cell {
  background-color: var(--dx-datagrid-row-alternation-bg);
}
</style>
