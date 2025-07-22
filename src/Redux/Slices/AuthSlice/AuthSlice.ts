import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./Interfaces";
import { Cookies } from "typescript-cookie";


const initialState: AuthState = {
  userData: Cookies.get("userData")
    ? JSON.parse(String(Cookies.get("userData")))
    : null,
  headers: {
    headers: {
      Authorization: Cookies.get("userData")
        ? `Bearer ${JSON.parse(String(Cookies.get("userData"))).accessToken}`
        : null,
    },
  },
  isAuthed: false,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      if (state.userData?.accessToken) {
        state.isAuthed = true;
        Cookies.set("userData", JSON.stringify(action.payload));
        state.headers= {
          headers: {
            Authorization: Cookies.get("userData")
              ? `Bearer ${JSON.parse(String(Cookies.get("userData"))).accessToken}`
              : null,
          },
        }
      }
    },
    logOut: (state) => {
      state.userData = null;
      state.isAuthed = false;

      state.headers = { headers: { Authorization: "" } };
      Cookies.remove("userData", {});
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setUserData, logOut } = authSlice.actions;
