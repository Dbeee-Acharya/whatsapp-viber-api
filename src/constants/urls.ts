import config from "../config/config.js";

const URLS = {
  ekantipur: {
    getLatestSocialNews: `${config.EKANTIPUR_BASE_URL}/kantipur/v4/social/newslist`,
    getLatestBusinessNews: `${config.EKANTIPUR_BASE_URL}/kantipur/v4/social/businessnews`,
  },
};

export default URLS;
