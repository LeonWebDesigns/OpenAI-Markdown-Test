import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@/config';

class OpenAIService {
  private openAI: OpenAI;

  constructor() {
    this.openAI = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }

  async getChatResponse(prompt: string) {
    try {
      const response = await this.openAI.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.log('error', error);
    }
  }
}

export default OpenAIService;
