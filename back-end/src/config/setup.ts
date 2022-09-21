import { config as dotenvConfig } from 'dotenv';

const path = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenvConfig({ path });
