package com.example.gaebugger.controller;

import com.example.gaebugger.dto.ReceivedData;
import com.example.gaebugger.model.ProcessingStatus;
import com.example.gaebugger.service.DataProcessingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import com.example.gaebugger.service.DataProcessingService;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@RestController
@RequestMapping("/api")
public class ReceiveDataController {


    private ConcurrentMap<String, Boolean> processStatus = new ConcurrentHashMap<>();
    private final DataProcessingService dataProcessingService;

    public ReceiveDataController(DataProcessingService dataProcessingService) {
        this.dataProcessingService = dataProcessingService;
    }
    @PostMapping("/start")
    public ResponseEntity<Map<String, UUID>> receiveData(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") String receivedDataString) throws JsonProcessingException {

        // 문자열 형태의 JSON을 ReceivedData 객체로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        ReceivedData receivedData = objectMapper.readValue(receivedDataString, ReceivedData.class);

        List<Integer> checkedItems = receivedData.getCheckedItems();
        ReceivedData.DataObject dataObject = receivedData.getInfoData();
        MultipartFile userFile = file;
//
//
//        // processID를 응답으로 보냄
        UUID processID = dataProcessingService.initializeProcessingStatus(checkedItems, userFile);
        System.out.println("processID is :" + processID);

        Map<String, UUID> response = Map.of("processID", processID);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-response/{processId}")
    public SseEmitter checkResponse(@PathVariable String processId) throws IOException {
        UUID parsedProcessId;
        try {
            parsedProcessId = UUID.fromString(processId);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid UUID format");
        }
        SseEmitter emitter = new SseEmitter();
        CompletableFuture<Void> future = dataProcessingService.processData(parsedProcessId, emitter);
        future.join();  // 비동기 메서드가 완료될 때까지 기다림 (이 부분은 선택 사항이며 필요에 따라 제거할 수 있습니다.)
        return emitter;
    }


    // 프론트엔드에서 주기적으로 체크할 엔드포인트





//    @PostMapping("/checklist/submit")
//    public ResponseEntity<Map<String, Object>> submitData(@RequestParam("checkedItems") String checkedItemsString,
//                                                          @RequestParam("uploadedFile") MultipartFile uploadedFile) {
//
//        Map<String, Object> response = new HashMap<>();
//        try {
//            List<Integer> checkedItems = List.of(checkedItemsString.split(","));
//            UUID processId = dataProcessingService.initializeProcessingStatus(checkedItems, uploadedFile); // Modifying to store data for later processing
//            System.out.println(processId);  //주석
//            response.put("message", "Data received. Processing will start shortly.");
//            response.put("processId", processId.toString());
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            response.put("message", "Error receiving data.");
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//    }

//    @GetMapping("/check-response/{processId}")
//    public ResponseEntity<Map<String, Object>> checkResponse(@PathVariable("processId") String processId) {
//        Map<String, Object> response = new HashMap<>();
//        UUID uuid;
//        System.out.println("controller /check-response on");
//
//        try {
//            uuid = UUID.fromString(processId);
//        } catch (IllegalArgumentException e) {
//            response.put("message", "Invalid process ID format.");
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
//        }
//
//        DataProcessingService.ProcessingStatus status = dataProcessingService.getStatus(uuid);
//
//        if (status == null) {
//            response.put("message", "No such process or process ID is invalid.");
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//        }
//
//        if (!status.hasProcessingStarted()) {
//            dataProcessingService.processData(uuid); // Start the processing
//            response.put("message", "Data processing started.");
//            return ResponseEntity.status(HttpStatus.PROCESSING).body(response);
//        } else if (status.isProcessingComplete()) {
//            response.put("message", "Data processing complete.");
//            response.put("fileContent", status.getProcessedFileContent());
//            response.put("ans", status.getAns());
//            System.out.println(response);
//            return ResponseEntity.ok(response);
//        } else if (status.getError() != null) {
//            response.put("message", "Error during data processing.");
//            response.put("error", status.getError());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        } else {
//            response.put("message", "Data processing in progress.");
//            return ResponseEntity.status(HttpStatus.PROCESSING).body(response);
//        }
//    }
}
