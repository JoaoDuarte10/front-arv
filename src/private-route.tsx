import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "./reducers/authenticated-slice";
import { ReduceStore } from "./app/store";
import { RulesService } from "./service/rules";
import { LocalStorageService } from "./service/local-storage";

export function PrivateRoute(props: { children: any, rules?: string[] }) {
  const { children, rules } = props;
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const auth = useSelector((state: ReduceStore) => state.authenticated);

  const LOCAL_STORAGE_LOGIN_KEY = process.env
    .REACT_APP_LOCAL_STORAGE_KEY as string;

  const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);

  const ruleService = new RulesService(localStorageService);

  useEffect(() => {
    dispatch(validateToken(auth.access_token));
    if (!auth.access_token) {
      navigate(auth.redirectLoginPageUri, { replace: true });
      return;
    }

    if (rules && rules.length) {
      for (const rule of rules) {
        if (!ruleService.userHasPermission(rule)) {
          navigate("/home", { replace: true });
          alert("Você não tem permissão para acessar essa página!");
          return;
        }
      }
    }
  });

  return children;
}
