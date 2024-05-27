import { Configuration, OpenAIApi } from 'openai-edge';
import { env } from '@/env';

const apiKey = env.OPENAI_API_KEY;

const config = new Configuration({
	apiKey,
});

const openai = new OpenAIApi(config);

export default openai;
