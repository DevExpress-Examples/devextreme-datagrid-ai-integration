import { AIIntegration } from 'devextreme-react/common/ai-integration';
import type {
  RequestParams,
  Response,
} from 'devextreme-react/common/ai-integration';

export default class AIService {
    columnAiIntegration: AIIntegration;
    assistantAiIntegration: AIIntegration;

  constructor(columnUrl: string,  assistantUrl: string) {
    this.columnAiIntegration = new AIIntegration({
      sendRequest: this.createSendRequest(columnUrl),
    });

    this.assistantAiIntegration = new AIIntegration({
      sendRequest: this.createSendRequest(assistantUrl),
    });
  }

  createSendRequest(url: string): (params: RequestParams) => Response {
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