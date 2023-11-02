package com.example.backend.controller;


import com.example.backend.dto.ResponseMessage;
import com.example.backend.dto.UserDto;
import com.example.backend.model.User;
import com.example.backend.model.redis.RefreshToken;
import com.example.backend.service.RefreshTokenService;
import com.example.backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.backend.service.JWTService;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/userAuthentication")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @CrossOrigin(origins = "https://www.pri-pen.com")
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginUser, HttpServletResponse response) {
        try {
            // Spring Security 인증 과정 실행
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPasswordHash())
            );
            System.out.println("my login info is:");
            System.out.println(loginUser);
            // 인증된 사용자 세션에 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // JWT 토큰 생성
            String accessToken = jwtService.generateJWT(loginUser.getEmail());
            // refresh token 객체 생성
            RefreshToken refreshTokenObject = refreshTokenService.createRefreshToken(loginUser.getEmail());
            // Refresh Token을 Redis에 저장하는 로직 추가
            refreshTokenService.saveRefreshToken(refreshTokenObject);

            // Access Token 쿠키 설정
            Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setSecure(true); // HTTPS를 사용하는 경우에만 true로 설정
            accessTokenCookie.setPath("/"); // 쿠키를 전송할 요청 경로
            accessTokenCookie.setMaxAge((int) jwtService.getAccessTokenValidityInSeconds()); // 쿠키 만료 시간을 설정
            response.addCookie(accessTokenCookie);

            // Refresh Token 쿠키 설정
            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshTokenObject.getToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true); // HTTPS를 사용하는 경우에만 true로 설정
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge((int) refreshTokenService.getRefreshTokenValidityInSeconds()); // 쿠키 만료 시간을 설정
            response.addCookie(refreshTokenCookie);

            // 응답 바디 설정
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("status", "success");

            return ResponseEntity.ok(responseBody); // JWT 응답으로 전송
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Authentication failed");
        }
    }

    @CrossOrigin(origins = "https://www.pri-pen.com")
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        String refreshToken = Arrays.stream(cookies)
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No refresh token provided");
        }
        try {
            if (refreshToken != null && refreshTokenService.verifyExpiration(refreshToken)) {
                String newAccessToken = jwtService.generateJWT(refreshTokenService.findEmailByToken(refreshToken)); // 새로운 액세스 토큰 생성

                Cookie newAccessTokenCookie = new Cookie("accessToken", newAccessToken);
                newAccessTokenCookie.setHttpOnly(true);
                newAccessTokenCookie.setSecure(true);
                newAccessTokenCookie.setPath("/");
                newAccessTokenCookie.setMaxAge((int) jwtService.getAccessTokenValidityInSeconds());
                response.addCookie(newAccessTokenCookie);

                return ResponseEntity.ok("Access token refreshed successfully");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not refresh access token");
        }
    }

    @CrossOrigin(origins = "https://www.pri-pen.com")
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        if (userService.existsByEmail(userDto.getEmail())) {
            return new ResponseEntity<>(new ResponseMessage("Error: Email is already in use!"), HttpStatus.BAD_REQUEST);
        }
        System.out.println("userDto is:");
        System.out.println(userDto);
        if (userDto == null || userDto.getPassword() == null) {
            return new ResponseEntity<>(new ResponseMessage("Error: Invalid request data"), HttpStatus.BAD_REQUEST);
        }
        // 비밀번호 암호화하여 저장
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        User user = modelMapper.map(userDto, User.class);
        System.out.println("my signup password hash is:");
        System.out.println(user.getPasswordHash());
        System.out.println("user's info is:");
        System.out.println(user);
        // CompanyId를 1로 고정
        user.setCompanyId(1L);

        userService.save(user);

        return new ResponseEntity<>(new ResponseMessage("User registered successfully!"), HttpStatus.OK);
    }
}
