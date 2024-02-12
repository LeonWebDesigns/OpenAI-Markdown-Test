import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@/config';

class OpenAIService {
  private openAI: OpenAI;

  constructor() {
    this.openAI = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }
}

export default OpenAIService;
