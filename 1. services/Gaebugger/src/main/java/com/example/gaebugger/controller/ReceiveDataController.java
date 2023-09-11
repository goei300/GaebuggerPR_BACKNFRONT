package com.example.gaebugger.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/checklist")
public class ReceiveDataController {

    @PostMapping("/submit")
    public ResponseEntity<String> submitData(@RequestBody List<String> checkedItems) {
        // Process the checked items
        // For now, just print them
        System.out.println(checkedItems);
        return ResponseEntity.ok("Data received");
    }
}