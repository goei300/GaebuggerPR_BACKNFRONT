package com.example.backend.controller;


import com.example.backend.dto.ResponseMessage;
import com.example.backend.dto.UserDto;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
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
    private AuthenticationManager authenticationManager;

    @CrossOrigin(origins = "https://www.pri-pen.com")
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginUser) {
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
            String jwt = jwtService.generateJWT(loginUser.getEmail());

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("token", jwt);

            return ResponseEntity.ok(responseBody); // JWT 응답으로 전송
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Authentication failed");
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
