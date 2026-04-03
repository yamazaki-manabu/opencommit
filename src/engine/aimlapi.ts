import OpenAI from 'openai';
import { normalizeEngineError } from '../utils/engineErrorHandler';
import { createJsonHttpClient, HttpClient } from '../utils/httpClient';
import { AiEngine, AiEngineConfig } from './Engine';

interface AimlApiConfig extends AiEngineConfig {}

export class AimlApiEngine implements AiEngine {
  client: HttpClient;

  constructor(public config: AimlApiConfig) {
    this.client = createJsonHttpClient({
      baseURL:
        config.baseURL || 'https://api.aimlapi.com/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'HTTP-Referer': 'https://github.com/di-sukharev/opencommit',
        'X-Title': 'opencommit',
        'Content-Type': 'application/json',
        ...config.customHeaders
      }
    });
  }

  public generateCommitMessage = async (
    messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>
  ): Promise<string | null> => {
    try {
      const response = await this.client.post<any>('', {
        model: this.config.model,
        messages
      });

      const message = response.data.choices?.[0]?.message;
      return message?.content ?? null;
    } catch (error) {
      throw normalizeEngineError(error, 'aimlapi', this.config.model);
    }
  };
}
