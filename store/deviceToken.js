import { createContext, useState } from "react";
export const TokenContext = createContext({
  DeviceToken: "",
});

const TokenContextProvider = (props) => {
  const [token, choosetoken] = useState();
  const setToken = () => {
    choosetoken((p) => p);
  };
  const tokenctx = { token, setToken };
  return (
    <TokenContext.Provider value={tokenctx}>
      {props.children}
    </TokenContext.Provider>
  );
};

export default TokenContextProvider;
