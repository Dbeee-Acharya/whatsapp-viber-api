import axios, { type RawAxiosRequestHeaders } from "axios";

const generateHeaders = (
  headers?: RawAxiosRequestHeaders,
): RawAxiosRequestHeaders => {
  return {
    "Content-Type": "application/json",
    ...headers,
  };
};

export const createInstance = (
  baseURL: string,
  customHeaders?: RawAxiosRequestHeaders,
) => {
  return axios.create({
    baseURL,
    headers: generateHeaders(customHeaders),
  });
};
