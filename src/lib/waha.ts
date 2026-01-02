import config from '../config/config.js';
import { createInstance } from './axios.js';

// We initialize the specific WAHA client here
export const wahaClient = createInstance(config.WAHA_BASE_URL as string);

// if api ket aadded in future then, we can do createInstance(config.WAHA_BASE_URL,{'X-api-key'}: config.waha_api)
