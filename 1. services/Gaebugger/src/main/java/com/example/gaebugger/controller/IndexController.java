package com.example.gaebugger.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping({"/", "/services"})
    public String forward() {
        System.out.println("Forwarding request"); // Add this
        return "forward:/index.html";
    }

}
