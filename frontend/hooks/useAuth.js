import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const authContext = useContext(AuthContext);

    useDebugValue(authContext.auth, (auth) =>
        auth?.username ? "User Logged In" : "User Logged Out"
    );

    return authContext;
};

export default useAuth;
