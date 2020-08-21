import React, { FC, createContext, useState, useEffect } from 'react';
import useApi from "../hooks/useApi";
import { useDispatch } from "react-redux";
import { setToken, clearToken } from "../store/auth/actions";
import useToken from "../hooks/useToken";

interface Auth {
    login: Function;
    logout: Function;
    isLogged: boolean;
    /* register: Function; */
}

const AuthContext = createContext({} as Auth);


export const AuthProvider: FC = ({ children }) => {
    const token = useToken();
    const dispatch = useDispatch()
    const api = useApi();
    
    // code for pre-loading the user's information if we have their token in
    // localStorage goes here
    // 🚨 this is the important bit.
    // Normally your provider components render the context provider with a value.
    // But we post-pone rendering any of the children until after we've determined
    // whether or not we have a user token and if we do, then we render a spinner
    // while we go retrieve that user's information.
    /* if (weAreStillWaitingToGetTheUserData) {
      return <FullPageSpinner />
    } */

    const [isLogged, setIsLogged]  = useState(false);
    useEffect(() => {
        if (token) {
            setIsLogged(true);
        }
    }, [])
    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.post('/auth/login', {
                username: email,
                password
            });
    
            const tokenNow = response.data.token;
            dispatch(setToken(tokenNow));
            setIsLogged(true);
        } catch (err) {
           console.log(err);
           setIsLogged(false);
        }

    } // make a login request
    // const register = () => {} // register the user
    const logout = () => {
        dispatch(clearToken());
        setIsLogged(false);
    } // clear the token in localStorage and the user data
    // note, I'm not bothering to optimize this `value` with React.useMemo here
    // because this is the top-most component rendered in our app and it will very
    // rarely re-render/cause a performance problem.

    return (
        <AuthContext.Provider value={{/* data, */ login, logout, isLogged/* , register */}} >{children}</AuthContext.Provider>
    )
  }
  // const useAuth = () => React.useContext(AuthContext)
  export default AuthContext;