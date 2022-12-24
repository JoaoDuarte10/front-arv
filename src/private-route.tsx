import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "./reducers/authenticated-slice";
import { ReduceStore } from "./app/store";
import { RulesService } from './service/rules';

export function PrivateRoute({ children, rules }: any) {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const auth = useSelector((state: ReduceStore) => state.authenticated);

  const ruleService = new RulesService();

  useEffect(() => {
    dispatch(validateToken(auth.access_token));
    if (!auth.access_token) {
      navigate(auth.redirectLoginPageUri, { replace: true });
    }

    if (rules && rules.length) {
      for (const rule of rules) {
        if (!ruleService.userHasPermission(rule)) {
          navigate('/home', { replace: true });
          alert('Você não tem permissão para acessar essa página!');
          return;
        }
      }
    }
  }, []);

  return children;
}
