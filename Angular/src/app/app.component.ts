import { Component, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import type dxChat from 'devextreme/ui/chat';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import type { DxButtonGroupTypes } from 'devextreme-angular/ui/button-group';
import { AIService } from './ai.service';
import { sales } from './data';
import type { Sale } from './types';

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

@Component({
  selector: 'app-root',
  imports: [DxDataGridModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly service = inject(AIService);

  private chatInstance: dxChat | null = null;

  readonly sales: Sale[] = sales;

  readonly allowedPageSizes = [10, 25, 50, 100];

  readonly columnAiIntegration = this.service.columnAiIntegration;

  readonly assistantAiIntegration = this.service.assistantAiIntegration;

  readonly chatOptions = {
    onInitialized: (e: DxChatTypes.InitializedEvent) => {
      this.chatInstance = e.component ?? null;
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

        this.chatInstance
          ?.getDataSource()
          .store()
          .push([{ type: 'insert', data: message }]);
      },
    },
  };
}
