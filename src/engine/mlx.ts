import { OpenAI } from 'openai';
import { normalizeEngineError } from '../utils/engineErrorHandler';
import { createJsonHttpClient, HttpClient } from '../utils/httpClient';
import { removeContentTags } from '../utils/removeContentTags';
import { AiEngine, AiEngineConfig } from './Engine';

interface MLXConfig extends AiEngineConfig {}

export class MLXEngine implements AiEngine {
  config: MLXConfig;
  client: HttpClient;

  constructor(config: MLXConfig) {
    this.config = config;
    this.client = createJsonHttpClient({
      baseURL: config.baseURL
        ? `${config.baseURL}/${config.apiKey}`
        : 'http://localhost:8080/v1/chat/completions',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async generateCommitMessage(
    messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>
  ): Promise<string | undefined> {
    const params = {
      messages,
      temperature: 0,
      top_p: 0.1,
      repetition_penalty: 1.5,
      stream: false
    };
    try {
      const response = await this.client.post<any>('', params);

      const choices = response.data.choices;
      const message = choices[0].message;
      let content = message?.content;
      return removeContentTags(content, 'think');
    } catch (error) {
      throw normalizeEngineError(error, 'mlx', this.config.model);
    }
  }
}
