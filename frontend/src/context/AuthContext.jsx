import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { lerAuth, salvarAuth, limparAuth } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => lerAuth());

  const entrar = useCallback(({ token, usuario }) => {
    const novoAuth = { token, usuario };
    salvarAuth(novoAuth);
    setAuth(novoAuth);
  }, []);

  const sair = useCallback(() => {
    limparAuth();
    setAuth(null);
  }, []);

  const valor = useMemo(
    () => ({
      token: auth?.token || null,
      usuario: auth?.usuario || null,
      estaLogado: Boolean(auth?.token),
      ehAdmin: auth?.usuario?.role === "admin",
      entrar,
      sair
    }),
    [auth, entrar, sair]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa estar dentro de um AuthProvider");
  }
  return contexto;
}
