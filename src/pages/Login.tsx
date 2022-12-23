import "../css/main.css";

import React, { useState } from "react";
import logo from "../img/raise-value-logo.png";
import { IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useDispatch } from "react-redux";
import { loginAdded } from "../reducers/authenticated-slice";
import { CircularIndeterminate } from "../components/loaders/CircularLoader";
import { AlertError } from "../components/alerts/AlertError";
import { TIMEOUT } from "../utils/constants";

export function Login(props: any) {
  const { loginService } = props;
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState({
    password: "",
    showPassword: false
  });
  const [loaderSignIn, setLoaderSignIn] = useState<boolean>(false);
  const [invalidCredentials, setinvalidCredentials] = useState<boolean | null>(
    null
  );
  const [serverError, setServerError] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handlePasswordChange = (prop: any) => (
    event: React.BaseSyntheticEvent
  ) => {
    event.preventDefault();
    setPassword({ ...password, [prop]: event.target.value });
  };

  const signIn = async () => {
    setLoaderSignIn(true);
    const { data, unauthorized, error } = await loginService.signIn({
      user,
      password: password.password
    });
    setLoaderSignIn(false);

    if (unauthorized) {
      setinvalidCredentials(true);
      return;
    }

    if (error) {
      setServerError(true);
      return;
    }

    dispatch(loginAdded({ access_token: data.access_token, refreshToken: "" }));
  };

  let loader = null;
  if (loaderSignIn) {
    loader = <CircularIndeterminate />;
  } else {
    loader = null;
  }

  if (invalidCredentials) {
    setTimeout(() => setinvalidCredentials(null), TIMEOUT.THREE_SECCONDS);
  }

  if (serverError) {
    setTimeout(() => setServerError(false), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <div id="login_container">
      {loader}
      <div className="text-center pt-5">
        <img id="img-logo" alt="logo_raise_value" src={logo}></img>
      </div>
      <div className="card-body card-login">
        <form className="pb-4 card-body card-login" id="form_login">
          <div className="text-center">
            <h2 className="text-center">Faça seu Login</h2>
            <p className="text-primary font-weight-bold">
              Seja Bem-Vindo!
              <small className="form-text text-muted mb-2">
                Faça Login para entrar no sistema.
              </small>
            </p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">@</div>
              </div>
              <input
                type="text"
                className="form-control"
                value={user}
                onChange={e => setUser(e.target.value)}
                id="name"
                placeholder="Digite o nome do usuário"
                required={true}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-key"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                    <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
                </div>
              </div>
              <input
                type={password.showPassword ? "text" : "password"}
                className="form-control"
                value={password.password}
                onChange={handlePasswordChange("password")}
                id="password"
                placeholder="Digite a senha"
                required={true}
              />
              <div className="input-group-append">
                <IconButton
                  onClick={_e =>
                    setPassword({
                      ...password,
                      showPassword: !password.showPassword
                    })
                  }
                  onMouseDown={e => e.preventDefault()}
                  className="input-group-text"
                >
                  {password.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </div>
            </div>
          </div>
          <div id="btn_group">
            <button
              type="button"
              className="btn btn-primary mt-2"
              id="btn_login"
              onClick={signIn}
            >
              Entrar
            </button>
          </div>
          <div className="mt-3">
            {invalidCredentials ? (
              <AlertError title="Usuário ou senha incorretos!" />
            ) : null}
            {serverError === true ? (
              <AlertError title="Erro ao processar sua requisição." />
            ) : null}
          </div>
        </form>
      </div>
      <p className="mt-5 mb-3 text-center text-white">
        ARV - Controll &copy; 2022
      </p>
    </div>
  );
}
