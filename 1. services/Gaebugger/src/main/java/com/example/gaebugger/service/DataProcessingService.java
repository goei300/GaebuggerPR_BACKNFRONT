package com.example.gaebugger.service;

// ... (import statements remain the same)

import com.example.gaebugger.dto.ApiResponseDTO;
import com.example.gaebugger.model.ProcessingStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DataProcessingService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final ConcurrentHashMap<UUID, ProcessingStatus> statusMap = new ConcurrentHashMap<>();

    public UUID initializeProcessingStatus(List<Integer> checkedItems, MultipartFile file) {
        UUID uuid = UUID.randomUUID();
        ProcessingStatus status = new ProcessingStatus();
        try {
            status.setUuid(uuid); // uuid를 ProcessingStatus에 설정
            status.setProcessedFileContent(new String(file.getBytes(), StandardCharsets.UTF_8)); // 명시적으로 문자셋을 설정
            status.setCheckedItems(checkedItems);
            statusMap.put(uuid, status);
        } catch (IOException e) {
            e.printStackTrace();
            status.setError("Error initializing processing status.");
        }
        return uuid;
    }

    private final Object lock = new Object();
    private final WebClient webClient = WebClient.create("http://localhost:5000");
    @Async
    public CompletableFuture<Void> processData(UUID processId, SseEmitter emitter) throws IOException {
        synchronized (lock) {
            ProcessingStatus status = statusMap.get(processId);

            status.setProcessingStarted(true);
//            try {
//                Map<String, Object> requestBody = Map.of(
//                        "process_Id", processId,
//                        "user_input", status.getCheckedItems(),
//                        "text", status.getProcessedFileContent()
//
//                );
//
//
//                String responseBody = webClient.post()
//                        .uri("/process-text")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .bodyValue(requestBody)
//                        .retrieve()
//                        .bodyToMono(String.class)
//                        .block();
//
//                handleApiResponse(responseBody, status);
//                emitter.send(SseEmitter.event().name("message").data("{\"completed\":true}"));
//                emitter.complete();
//
//            } catch (Exception e) {
//                e.printStackTrace();
//                status.setError(e.getMessage());
//            }
            try {
                // 5초 (5000밀리초) 동안 대기
                Thread.sleep(15000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            emitter.send(SseEmitter.event().name("message").data("{\"completed\":true}"));
            emitter.complete();

            System.out.println("process done!!");
            status.setProcessingComplete(true);
            return CompletableFuture.completedFuture(null);
        }
    }
    private void handleApiResponse(String responseBody, ProcessingStatus status) throws Exception {
        ApiResponseDTO responseDTO = objectMapper.readValue(responseBody, ApiResponseDTO.class);

        System.out.println(responseDTO);
    }
//    private final Object lock = new Object();

    //    @Async
//    public CompletableFuture<Void> processData(UUID processId) {
//        synchronized (lock) {
//            ProcessingStatus status = statusMap.get(processId);
//
//            status.setProcessingStarted(true);
//            try {
//                HttpHeaders headers = new HttpHeaders();
//                headers.add("Content-Type", "application/json");
//
//                Map<String, Object> requestBody = Map.of(
//                        "process_id", status.getuuid
//                        "text", status.getProcessedFileContent(),
//                        "user_input", status.getCheckedItems()
//                );
//
//                System.out.println("now start api calling");
//                HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
//                ResponseEntity<String> response = restTemplate.exchange(
//                        "http://localhost:5000/process-text",
//                        HttpMethod.POST,
//                        requestEntity,
//                        String.class
//                );
//
//                JsonNode rootNode = objectMapper.readTree(response.getBody());
//                if (rootNode.has("result")) {
//                    status.setAns(rootNode.get("result").asText());
//                } else {
//                    throw new Exception("Result key not found in response.");
//                }
//                status.setProcessingComplete(true);
//            } catch (Exception e) {
//                e.printStackTrace();
//                status.setError(e.getMessage());
//            }
//            System.out.println("process done!!");
//            status.setProcessingComplete(true);
//            return CompletableFuture.completedFuture(null);
//        }
//    }

    public ProcessingStatus getStatus(UUID processId) {
        return statusMap.get(processId);
    }

}
