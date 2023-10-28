import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { validateToken } from './reducers/authenticated-slice';
import { RulesService } from './service/api/rules/rules';
import { LocalStorageService } from './service/localStorage/local-storage';

export function PrivateRoute(props: { children: any; rules?: string[] }) {
  const { children, rules } = props;
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const LOCAL_STORAGE_LOGIN_KEY = process.env
    .REACT_APP_LOCAL_STORAGE_KEY as string;

  const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);

  const ruleService = new RulesService(localStorageService);

  useEffect(() => {
    const auth = localStorageService.getUser();

    if (!auth || !auth.access_token) {
      navigate('/login', { replace: true });
      return;
    }

    dispatch(validateToken(auth.access_token));

    if (rules && rules.length) {
      for (const rule of rules) {
        if (!ruleService.userHasPermission(rule)) {
          navigate('/home', { replace: true });
          alert('Você não tem permissão para acessar essa página!');
          return;
        }
      }
    }
  }, [children]);

  return children;
}
