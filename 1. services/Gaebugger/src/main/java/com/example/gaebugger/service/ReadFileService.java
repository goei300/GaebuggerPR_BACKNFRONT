package com.example.gaebugger.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.io.IOException;

@Service
public class ReadFileService {

    public String processFileContent(MultipartFile file) {
        try {
            // Reading the content of the file
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            // Handle the exception, for instance by logging it and returning a default/error message.
            throw new RuntimeException("Error processing the uploaded file.", e);
        }
    }
}
