import { createSlice } from "@reduxjs/toolkit";
import { ReducerActionType } from "./types/reducer-type";
import { LocalStorageService } from "../service/local-storage";
import { JwtService } from "../service/jwt";

export type UserLogin = {
  username?: string | null;
  access_token: string | null;
  refreshToken: string;
  redirectLoginPageUri?: string;
};

const LOCAL_STORAGE_LOGIN_KEY = "user-info-arv";
const SECRET_TOKEN = process.env.REACT_APP_SECRET_TOKEN as string;

const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);
const jwtService = new JwtService(SECRET_TOKEN);

const loginInLocalStorage = localStorageService.getUserInLocalStorange();

const initialState: UserLogin = {
  username: loginInLocalStorage ? loginInLocalStorage.username : null,
  access_token: loginInLocalStorage ? loginInLocalStorage.access_token : null,
  refreshToken: loginInLocalStorage ? loginInLocalStorage.refreshToken : null,
  redirectLoginPageUri: "/login"
};

const authenticatedSlice = createSlice({
  name: "authenticated",
  initialState,
  reducers: {
    loginAdded: {
      reducer(state: UserLogin, action: ReducerActionType<UserLogin>) {
        localStorageService.cleanUserInLocalStorange();
        const userInfos = {
          ...action.payload,
          username: jwtService.getUserName(
            action.payload.access_token as string
          )
        };
        localStorageService.saveLoginInLocalStorage(userInfos);
        state.username = userInfos.username;
        state.access_token = action.payload.access_token;
      },
      prepare(params: {
        access_token: string;
        refreshToken: string;
      }): {
        payload: UserLogin;
      } {
        return {
          payload: {
            access_token: params.access_token,
            refreshToken: params.refreshToken
          }
        };
      }
    },
    validateToken: {
      reducer(state: UserLogin, action: any) {
        if (jwtService.isValid(action.payload)) {
          return;
        }
        state.access_token = null;
        localStorageService.cleanUserInLocalStorange();
      },
      prepare(params) {
        return { payload: params };
      }
    }
  }
});

export const { loginAdded, validateToken } = authenticatedSlice.actions;

export default authenticatedSlice.reducer;
