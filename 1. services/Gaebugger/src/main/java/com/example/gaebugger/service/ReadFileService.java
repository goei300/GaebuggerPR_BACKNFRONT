package com.example.gaebugger.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReadFileService {

    private final String FLASK_URL = "http://localhost:5000/process-text";
    private final ObjectMapper objectMapper;

    public ReadFileService() {
        JsonFactory jsonFactory = new JsonFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, false);
        objectMapper = new ObjectMapper(jsonFactory);
    }
    public String processFileContent(MultipartFile file) {
        try {
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);

            Map<String, String> payloadMap = new HashMap<>();
            payloadMap.put("text", content);
            String jsonPayload = objectMapper.writeValueAsString(payloadMap);


            System.out.println(jsonPayload);
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            // Create an entity with the payload and headers
            HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

            // Call Flask service
            RestTemplate restTemplate = new RestTemplate();
            String result = restTemplate.postForObject(FLASK_URL, entity, String.class);

            System.out.println(content);
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Error processing the uploaded file.", e);
        }
    }
}
