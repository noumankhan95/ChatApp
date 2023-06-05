import { createContext, useState } from "react";
export const langContext = createContext({
  language: "",
  setlanguage: () => {},
});

const LangaugeContextProvider = (props) => {
  const [language, chooselanguage] = useState();
  const setlanguage = (lang = "eng") => {
    chooselanguage((p) => lang);
  };
  const langctx = { language, setlanguage };
  return (
    <langContext.Provider value={langctx}>
      {props.children}
    </langContext.Provider>
  );
};

export default LangaugeContextProvider;
