package com.example.backend.controller;


import com.example.backend.dto.ResponseMessage;
import com.example.backend.dto.UserDto;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @CrossOrigin(origins = "https://www.pri-pen.com")
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginUser) {
        Optional<User> user = userService.authenticate(loginUser.getEmail(), loginUser.getPasswordHash());
        if (user.isPresent()) {
            String jwt = jwtService.generateJWT(user.get().getEmail());
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("token", jwt);
            return ResponseEntity.ok(responseBody); // JWT 응답으로 전송
        } else {
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

        System.out.println("user's info is:");
        System.out.println(user);
        // CompanyId를 1로 고정
        user.setCompanyId(1L);

        userService.save(user);

        return new ResponseEntity<>(new ResponseMessage("User registered successfully!"), HttpStatus.OK);
    }
}
