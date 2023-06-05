import { createContext, useCallback, useState } from "react";
export const Userctx = createContext({
  userInfo: {
    c_id: "",
    c_name: "",
    c_email: "",
    c_contact: "",
    c_password: "",
    c_type: "",
    c_address: "",
    c_status: "",
  },
  setuserInfo: () => {},
});

const UserContextProvider = (props) => {
  const [UserInfo, setUserInfo] = useState({
    c_id: "",
    c_name: "",
    c_email: "",
    c_contact: "",
    c_password: "",
    c_type: "",
    c_address: "",
    c_status: "",
  });
  const changeUserInfoHandler = useCallback(
    (val) => {
      console.log(val, "inval");
      setUserInfo((p) => val);
    },
    [UserInfo]
  );
  const ctx = { userInfo: UserInfo, setuserInfo: changeUserInfoHandler };
  return <Userctx.Provider value={ctx}>{props.children}</Userctx.Provider>;
};

export default UserContextProvider;
