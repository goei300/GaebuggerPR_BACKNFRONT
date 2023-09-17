package com.example.gaebugger.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    public UUID initializeProcessingStatus() {
        UUID uuid = UUID.randomUUID();
        statusMap.put(uuid, new ProcessingStatus());
        return uuid;
    }

    @Async
    public CompletableFuture<Void> processData(UUID processId, List<String> checkedItems, MultipartFile file) {
        ProcessingStatus status = statusMap.get(processId);
        try {
            status.setProcessedFileContent(new String(file.getBytes()));

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");

            Map<String, Object> requestBody = Map.of(
                    "text", status.getProcessedFileContent(),
                    "checkedItem", checkedItems
            );

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    "http://localhost:5000/process-text",
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            JsonNode rootNode = objectMapper.readTree(response.getBody());
            if (rootNode.has("result")) {
                status.setAns(rootNode.get("result").asText());
            } else {
                throw new Exception("Result key not found in response.");
            }
            status.setProcessingComplete(true);
        } catch (Exception e) {
            e.printStackTrace();
            status.setError(e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    public ProcessingStatus getStatus(UUID processId) {
        return statusMap.get(processId);
    }

    public static class ProcessingStatus {
        private boolean isProcessingComplete = false;
        private String processedFileContent;
        private String ans;
        private String error;

        public boolean isProcessingComplete() {
            return isProcessingComplete;
        }

        public void setProcessingComplete(boolean processingComplete) {
            isProcessingComplete = processingComplete;
        }

        public String getProcessedFileContent() {
            return processedFileContent;
        }

        public void setProcessedFileContent(String processedFileContent) {
            this.processedFileContent = processedFileContent;
        }

        public String getAns() {
            return ans;
        }

        public void setAns(String ans) {
            this.ans = ans;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }
}
