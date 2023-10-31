package com.example.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JWTService {

    // SecretKey를 application.properties에서 주입받습니다.
    @Value("${jwt.secret}")
    private String secretKey;

    // Token의 유효시간을 설정합니다. 여기서는 1시간으로 설정하였습니다.
    private final long expirationTime = 3600000L;

    public String generateJWT(String email) {
        return Jwts.builder()
                .setSubject(email)  // 토큰의 주체 설정
                .setIssuedAt(new Date())  // 발행 시간 설정
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))  // 유효 시간 설정
                .signWith(SignatureAlgorithm.HS512, secretKey)  // 암호화 알고리즘과 키 설정
                .compact();
    }

    public Claims validateJWT(String token) {
        // 토큰을 파싱해서 Claims 객체를 반환합니다.
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }
}
