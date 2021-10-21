import useSWR from "swr";
import { RESAS_API_URL } from "react-native-dotenv";
import { fetcher } from "../utilities/fetcher";

export const usePrefectures = () => {
  const { data, error } = useSWR(RESAS_API_URL, fetcher);

  return {
    prefectures: data?.result,
    isLoading: !error && !data,
    isError: error,
  };
};
