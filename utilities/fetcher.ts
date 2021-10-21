import { RESAS_API_KEY } from "react-native-dotenv";

export const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      "X-API-KEY": RESAS_API_KEY || "",
    },
  }).then((res) => res.json());
