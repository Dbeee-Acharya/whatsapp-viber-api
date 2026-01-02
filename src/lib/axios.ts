import axios from 'axios';
import config from '../config/config.js';

export const createInstance = (baseURL:string,extraHEaders = {}) =>{
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// export const wahaClient = axios.create({
//   baseURL: config.WAHA_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
