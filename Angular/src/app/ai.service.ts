import { Injectable } from '@angular/core';
import { AIIntegration } from 'devextreme-angular/common/ai-integration';
import type {
  RequestParams,
  Response,
} from 'devextreme-angular/common/ai-integration';
import { AI_ASSISTANT_URL, AI_COLUMN_URL } from './data';

@Injectable({ providedIn: 'root' })
export class AIService {
  readonly columnAiIntegration: AIIntegration;

  readonly assistantAiIntegration: AIIntegration;

  constructor() {
    this.columnAiIntegration = new AIIntegration({
      sendRequest: this.createSendRequest(AI_COLUMN_URL),
    });

    this.assistantAiIntegration = new AIIntegration({
      sendRequest: this.createSendRequest(AI_ASSISTANT_URL),
    });
  }

  private createSendRequest(url: string): (params: RequestParams) => Response {
    return ({ prompt, data }: RequestParams) => {
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
        .then((response) => response.json())
        .then((result) => result.content);

      return {
        promise,
        abort: () => controller.abort(),
      };
    };
  }
}
