import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { Cookies } from "typescript-cookie";

interface GetDataParameter {
  path: string;
  headers: object;
  setState?: React.Dispatch<React.SetStateAction<unknown>>;
}

export const baseUrl = "https://upskilling-egypt.com:3005/api";

export const getData = ({
  path,
  headers,
  setState,
}: GetDataParameter): void => {
  axios
    .get(`${baseUrl}/${path}`, headers)
    .then((response) => {
      setState ? setState(response.data) : console.log(response.data);
    })
    .catch((error) => {
      toast.error(error.response?.data?.message || "Invalid Data");
    });
};

export const fetchDataForSlice = (path: string, fn: (data: unknown) => void): void => {
  axios
    .get(`${baseUrl}/${path}`, {
      headers: {
        Authorization: Cookies.get("userData")
          ? `Bearer ${JSON.parse(String(Cookies.get("userData"))).accessToken}`
          : null,
      },
    })
    .then((response) => {
      fn(response.data);
    })
    .catch((error) => {
      console.error(`Error fetching ${path}:`, error);
      toast.error(error.response?.data?.message || "Invalid Data");
      fn([]); // Set empty array to stop loading state
    });
};



