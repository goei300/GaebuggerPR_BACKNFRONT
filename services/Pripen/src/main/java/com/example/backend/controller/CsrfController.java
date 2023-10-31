package com.example.backend.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {


    @CrossOrigin(origins = "https://www.pri-pen.com")
    @GetMapping("/csrf-token")
    public String getCsrfToken(CsrfToken csrfToken) {
        System.out.println("weare on!!");
        System.out.println(csrfToken.getToken());
        return csrfToken.getToken();
    }
}
