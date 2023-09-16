package com.example.gaebugger.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class DataProcessingService {

    private static boolean isProcessingComplete = false;
    private static List<String> processedCheckedItems;
    private static String processedFileContent;

    public void processData(List<String> checkedItems, MultipartFile file) {
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

    // 다른 필요한 메서드들도 이곳으로 이동
}
