// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('jwt'));


    const isLoggedIn = () => {
        return authToken != null;
    };
    // 로그인 상태를 확인하는 함수
    const login = (token) => {
        localStorage.setItem('jwt', token);
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
