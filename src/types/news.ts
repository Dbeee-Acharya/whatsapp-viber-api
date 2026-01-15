export type News = {
  id: number;
  pub_date: string;
  news_date: string;
  title: string;
  title_en: string;
  summary: string;
  summary_en: string;
  thumb_path: string;
  permalink: string;
  story: string;
  category: string;
  ai_summary: Array<string>;
};

export type BusinessNews = {
  news_id: number;
  pub_date: string;
  title: string;
  deck: string;
  thumb_path: string;
  url: string;
};
