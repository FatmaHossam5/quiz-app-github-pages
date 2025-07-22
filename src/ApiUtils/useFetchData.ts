import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl } from "./ApiUtils";
import { RootState } from "../types";

interface UseFetchData {
  fetchedData: unknown;
  getData: (path: string, student?: boolean) => void;
  isLoading: boolean;
}

const useFetchData = (): UseFetchData => {
  const [fetchedData, setFetchedData] = useState<unknown>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { headers } = useSelector((state: RootState) => state.userData);

  const getData = (path: string, student?: boolean) => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/${path}`, headers)
      .then((response) => {
        student 
          ? setFetchedData(response.data.student)
          : setFetchedData(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message || "Invalid Data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return { fetchedData, getData, isLoading };
};

export default useFetchData;
