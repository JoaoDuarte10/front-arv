import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "./reducers/authenticated-slice";

export function PrivateRoute({ children }: any) {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const auth = useSelector((state: any) => state.authenticated);

  useEffect(() => {
    dispatch(validateToken(auth.access_token));
    if (!auth.access_token) {
      navigate(auth.redirectLoginPageUri, { replace: true });
    }
  }, []);

  return children;
}
