package com.example.backend.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping({"/", "/services/*","/guidelines","/start/*","/contact"})
    public String forward() {
        System.out.println("Forwarding request");
        return "forward:/index.html";
    }

}
