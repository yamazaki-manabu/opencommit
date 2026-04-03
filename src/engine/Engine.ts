import AnthropicClient from '@anthropic-ai/sdk';
import { OpenAIClient as AzureOpenAIClient } from '@azure/openai';
import { GoogleGenerativeAI as GeminiClient } from '@google/generative-ai';
import { OpenAI as OpenAIClient } from 'openai';
import { Mistral as MistralClient } from '@mistralai/mistralai';
import { HttpClient as RawHttpClient } from '../utils/httpClient';

export interface AiEngineConfig {
  apiKey: string;
  model: string;
  maxTokensOutput: number;
  maxTokensInput: number;
  baseURL?: string;
  customHeaders?: Record<string, string>;
}

type Client =
  | OpenAIClient
  | AzureOpenAIClient
  | AnthropicClient
  | RawHttpClient
  | GeminiClient
  | MistralClient;

export interface AiEngine {
  config: AiEngineConfig;
  client: Client;
  generateCommitMessage(
    messages: Array<OpenAIClient.Chat.Completions.ChatCompletionMessageParam>
  ): Promise<string | null | undefined>;
}
