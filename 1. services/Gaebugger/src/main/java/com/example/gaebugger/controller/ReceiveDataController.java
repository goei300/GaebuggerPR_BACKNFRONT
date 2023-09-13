package com.example.gaebugger.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReceiveDataController {

    private static boolean isProcessingComplete = false;
    private static List<String> processedCheckedItems;
    private static String processedFileContent;

    @PostMapping("/checklist/submit")
    public ResponseEntity<String> submitData(@RequestParam("checkedItems") String checkedItemsString,
                                             @RequestParam("uploadedFile") MultipartFile uploadedFile) {

        try {
            // Deserialize checked items
            List<String> checkedItems = List.of(checkedItemsString.split(","));

            // For demonstration purposes, just print received items and the file's original name.
            System.out.println("Checked Items: " + checkedItems);
            System.out.println("Uploaded File Original Name: " + uploadedFile.getOriginalFilename());

            // Simulate processing
            processData(checkedItems, uploadedFile);

            return ResponseEntity.ok("Data received and processing started.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing data.");
        }
    }

    private void processData(List<String> checkedItems, MultipartFile file) {
        try {
            // 파일의 내용을 즉시 읽습니다.
            processedFileContent = new String(file.getBytes());
            System.out.println(processedFileContent);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        // Simulate some processing here.
        new Thread(() -> {
            try {
                Thread.sleep(5000); // 5 seconds delay
                processedCheckedItems = checkedItems;
                isProcessingComplete = true;
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }

    @GetMapping("/check-response")
    public ResponseEntity<Map<String, Object>> checkResponse() {
        Map<String, Object> response = new HashMap<>();

        if (isProcessingComplete) {
            response.put("message", "Data processing complete.");
            response.put("checkedItems", processedCheckedItems);
            response.put("fileContent", processedFileContent);
            System.out.println(response);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Data processing in progress.");
            return ResponseEntity.status(HttpStatus.PROCESSING).body(response);
        }
    }
}
