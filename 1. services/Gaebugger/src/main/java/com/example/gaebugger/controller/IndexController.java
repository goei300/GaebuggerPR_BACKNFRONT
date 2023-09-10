package com.example.gaebugger.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping("/")
    public String indexPage(){
        System.out.println("test2");
        return "forward:/index.html";
    }

    @GetMapping("/about")
    public String serviceToUsers(){
        return "forward:/index.html";
    }
}
