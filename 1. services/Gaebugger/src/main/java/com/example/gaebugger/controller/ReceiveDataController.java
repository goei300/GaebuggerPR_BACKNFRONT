package com.example.gaebugger.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import com.example.gaebugger.service.DataProcessingService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ReceiveDataController {

    private final DataProcessingService dataProcessingService;

    public ReceiveDataController(DataProcessingService dataProcessingService) {
        this.dataProcessingService = dataProcessingService;
    }

    @PostMapping("/checklist/submit")
    public ResponseEntity<Map<String, Object>> submitData(@RequestParam("checkedItems") String checkedItemsString,
                                                          @RequestParam("uploadedFile") MultipartFile uploadedFile) {

        Map<String, Object> response = new HashMap<>();
        try {
            List<String> checkedItems = List.of(checkedItemsString.split(","));
            UUID processId = dataProcessingService.initializeProcessingStatus(checkedItems, uploadedFile); // Modifying to store data for later processing
            System.out.println(processId);  //주석
            response.put("message", "Data received. Processing will start shortly.");
            response.put("processId", processId.toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error receiving data.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/check-response/{processId}")
    public ResponseEntity<Map<String, Object>> checkResponse(@PathVariable("processId") String processId) {
        Map<String, Object> response = new HashMap<>();
        UUID uuid;
        System.out.println("controller /check-response on");

        try {
            uuid = UUID.fromString(processId);
        } catch (IllegalArgumentException e) {
            response.put("message", "Invalid process ID format.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        DataProcessingService.ProcessingStatus status = dataProcessingService.getStatus(uuid);

        if (status == null) {
            response.put("message", "No such process or process ID is invalid.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (!status.hasProcessingStarted()) {
            dataProcessingService.processData(uuid); // Start the processing
            response.put("message", "Data processing started.");
            return ResponseEntity.status(HttpStatus.PROCESSING).body(response);
        } else if (status.isProcessingComplete()) {
            response.put("message", "Data processing complete.");
            response.put("fileContent", status.getProcessedFileContent());
            response.put("ans", status.getAns());
            System.out.println(response);
            return ResponseEntity.ok(response);
        } else if (status.getError() != null) {
            response.put("message", "Error during data processing.");
            response.put("error", status.getError());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } else {
            response.put("message", "Data processing in progress.");
            return ResponseEntity.status(HttpStatus.PROCESSING).body(response);
        }
    }
}
