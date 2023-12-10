package com.example.backend.service.Authentication.Login;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    public void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        // 쿠키 생성
        // 쿠키 문자열을 생성하고 SameSite=None; Secure 추가
        String cookieString = String.format("%s=%s; Path=/; Max-Age=%d; SameSite=None; Secure",
                name, value, maxAge);

        // 응답 헤더에 쿠키 추가
        response.addHeader("Set-Cookie", cookieString);
    }
    public void setCookie(HttpServletResponse response, String name) {

        // 쿠키 문자열을 생성하고 SameSite=None; Secure 추가
        String cookieString = String.format("%s=%s; Path=/; Max-Age=0; SameSite=None; Secure",
                name, 0);

        // 응답 헤더에 쿠키 추가
        response.addHeader("Set-Cookie", cookieString);
    }

    public String getCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null; // 쿠키가 없는 경우
    }
}
