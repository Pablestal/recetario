import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
};

export const AuthModalProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  const openLogin = (redirectTo = null) => {
    setRegisterOpen(false);
    setLoginOpen(true);
    setRedirectAfterLogin(redirectTo);
  };

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const closeAll = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setRedirectAfterLogin(null);
  };

  return (
    <AuthModalContext.Provider
      value={{
        loginOpen,
        registerOpen,
        redirectAfterLogin,
        openLogin,
        openRegister,
        closeAll,
        setLoginOpen,
        setRegisterOpen,
        setRedirectAfterLogin,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};
