import { OpenAI } from 'openai';
import { normalizeEngineError } from '../utils/engineErrorHandler';
import { createJsonHttpClient, HttpClient } from '../utils/httpClient';
import { removeContentTags } from '../utils/removeContentTags';
import { AiEngine, AiEngineConfig } from './Engine';

interface OllamaConfig extends AiEngineConfig {}

export class OllamaEngine implements AiEngine {
  config: OllamaConfig;
  client: HttpClient;

  constructor(config: OllamaConfig) {
    this.config = config;

    const headers = {
      'Content-Type': 'application/json',
      ...config.customHeaders
    };

    this.client = createJsonHttpClient({
      baseURL: config.baseURL
        ? `${config.baseURL}/${config.apiKey}`
        : 'http://localhost:11434/api/chat',
      headers
    });
  }

  async generateCommitMessage(
    messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>
  ): Promise<string | undefined> {
    const params = {
      model: this.config.model ?? 'mistral',
      messages,
      options: { temperature: 0, top_p: 0.1 },
      stream: false
    };
    try {
      const response = await this.client.post<any>('', params);

      const { message } = response.data;
      let content = message?.content;
      return removeContentTags(content, 'think');
    } catch (error) {
      throw normalizeEngineError(error, 'ollama', this.config.model);
    }
  }
}
