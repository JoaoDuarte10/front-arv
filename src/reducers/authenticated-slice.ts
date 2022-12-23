import { createSlice } from "@reduxjs/toolkit";
import { ReducerActionType } from "./types/reducer-type";
import { LocalStorageService } from "../service/local-storage";
import { JwtService } from "../service/jwt";

type UserLoginInitial = {
  username?: string;
  access_token: string | null;
  refreshToken: string;
  redirectLoginPageUri?: string;
};

export type UserLogin = {
  username: string;
  access_token: string;
  refreshToken: string;
  redirectLoginPageUri: string;
};

const LOCAL_STORAGE_LOGIN_KEY = "8604-0f6d57165718";
const SECRET_TOKEN = process.env.REACT_APP_SECRET_TOKEN as string;

const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);
const jwtService = new JwtService(SECRET_TOKEN);

const loginInLocalStorage = localStorageService.getUserInLocalStorange();

const initialState: UserLoginInitial = {
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
      reducer(
        state: UserLoginInitial,
        action: ReducerActionType<UserLoginInitial>
      ) {
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
        payload: UserLoginInitial;
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
      reducer(state: UserLoginInitial, action: any) {
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
