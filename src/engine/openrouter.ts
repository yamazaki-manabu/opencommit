import OpenAI from 'openai';
import { normalizeEngineError } from '../utils/engineErrorHandler';
import { createJsonHttpClient, HttpClient } from '../utils/httpClient';
import { removeContentTags } from '../utils/removeContentTags';
import { AiEngine, AiEngineConfig } from './Engine';

interface OpenRouterConfig extends AiEngineConfig {}

export class OpenRouterEngine implements AiEngine {
  client: HttpClient;

  constructor(public config: OpenRouterConfig) {
    this.client = createJsonHttpClient({
      baseURL: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'HTTP-Referer': 'https://github.com/di-sukharev/opencommit',
        'X-Title': 'OpenCommit',
        'Content-Type': 'application/json'
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

      const message = response.data.choices[0].message;
      let content = message?.content;
      return removeContentTags(content, 'think');
    } catch (error) {
      throw normalizeEngineError(error, 'openrouter', this.config.model);
    }
  };
}
