import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    // 로그인 함수
    const login = () => {
        setIsLoggedIn(true);
    };

    // 로그아웃 함수
    const logout = () => {
        setIsLoggedIn(false);
        try {
            // 백엔드 로그아웃 API 호출
            axios.post('https://www.pri-pen.com/userAuthentication/logout');
            
            // 로그아웃 후 처리, 예를 들어 홈페이지로 리다이렉션
            window.location.href = "/";
        } catch (error) {
            console.error('Logout failed', error);
            // 에러 처리 로직
        }
    };

    // AuthContext에 전달할 값
    const authContextValue = {
        isLoggedIn,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

