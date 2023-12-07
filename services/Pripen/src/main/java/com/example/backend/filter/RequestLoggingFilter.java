package com.example.backend.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.Collections;

public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        System.out.println("Incoming request data:");

        // 요청 헤더 로깅
        Collections.list(httpRequest.getHeaderNames()).forEach(headerName ->
                System.out.println(headerName + ": " + httpRequest.getHeader(headerName)));

        // 필터 체인 계속
        chain.doFilter(request, response);
    }
}