package com.example.gaebugger.service;

// ... (import statements remain the same)

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

    public UUID initializeProcessingStatus(List<String> checkedItems, MultipartFile file) {
        UUID uuid = UUID.randomUUID();
        ProcessingStatus status = new ProcessingStatus();
        try {
            status.setProcessedFileContent(new String(file.getBytes()));
            status.setCheckedItems(checkedItems);
            statusMap.put(uuid, status);
        } catch (IOException e) {
            e.printStackTrace();
            status.setError("Error initializing processing status.");
        }
        return uuid;
    }
    private final Object lock = new Object();
    @Async
    public CompletableFuture<Void> processData(UUID processId) {
        synchronized (lock) {
            ProcessingStatus status = statusMap.get(processId);

            status.setProcessingStarted(true);
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Type", "application/json");

                Map<String, Object> requestBody = Map.of(
                        "text", status.getProcessedFileContent(),
                        "checkedItem", status.getCheckedItems()
                );

                System.out.println("now start api calling");
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
            System.out.println("process done!!");
            status.setProcessingComplete(true);
            return CompletableFuture.completedFuture(null);
        }
    }

    public ProcessingStatus getStatus(UUID processId) {
        return statusMap.get(processId);
    }

    public static class ProcessingStatus {
        private boolean isProcessingComplete = false;
        private boolean processingStarted = false; // To track if the processing has been started

        private String processedFileContent;
        private String ans;
        private String error;
        private List<String> checkedItems;  // Store checked items

        public boolean isProcessingComplete() {
            return isProcessingComplete;
        }

        public boolean hasProcessingStarted() {
            return processingStarted;
        }

        public void setProcessingStarted(boolean processingStarted) {
            this.processingStarted = processingStarted;
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

        public List<String> getCheckedItems() {
            return checkedItems;
        }

        public void setCheckedItems(List<String> checkedItems) {
            this.checkedItems = checkedItems;
        }
    }
}
