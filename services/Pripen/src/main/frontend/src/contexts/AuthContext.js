import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // 현재 사용자가 로그인했는지 여부를 상태로 관리합니다.
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 상태를 확인하는 로직을 추가합니다.
    // 예를 들어, 서버로부터의 응답이나 적절한 상태를 통해 로그인 여부를 결정할 수 있습니다.

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


// 이 함수는 서버에서 토큰의 유효성을 검증하는 API 요청을 보내는 역할을 합니다.
const verifyTokenAPI = async (token) => {
    // 여기에 API 요청 

};


