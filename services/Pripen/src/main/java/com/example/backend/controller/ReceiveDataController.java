package com.example.backend.controller;

import com.example.backend.dto.ApiResponseDTO;
import com.example.backend.dto.ReceivedDataDTO;
import com.example.backend.model.Analysis.Analysis;
import com.example.backend.repository.Analysis.AnalysisRepository;
import com.example.backend.service.Analysis.DataProcessingService;
import com.example.backend.service.Analysis.Report.PdfService;
import com.example.backend.service.Authentication.Login.CookieService;
import com.example.backend.service.Authentication.Login.JWTService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.Response;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@RestController
@RequestMapping("/api")
public class ReceiveDataController {

    private ConcurrentMap<String, Boolean> processStatus = new ConcurrentHashMap<>();
    private final DataProcessingService dataProcessingService;
    private final PdfService pdfService;
    private final AnalysisRepository analysisRepository;

    private final JWTService jwtService;

    private final CookieService cookieService;

    public ReceiveDataController(DataProcessingService dataProcessingService, PdfService pdfService, AnalysisRepository analysisRepository,JWTService jwtService, CookieService cookieService) {
        this.dataProcessingService = dataProcessingService;
        this.pdfService = pdfService;
        this.analysisRepository = analysisRepository;
        this.jwtService = jwtService;
        this.cookieService = cookieService;
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, UUID>> receiveData(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") String receivedDataString) throws JsonProcessingException {

        // 문자열 형태의 JSON을 ReceivedData 객체로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        ReceivedDataDTO receivedData = objectMapper.readValue(receivedDataString, ReceivedDataDTO.class);

        List<Integer> checkedItems = receivedData.getCheckedItems();
        MultipartFile userFile = file;

        // processID를 응답으로 보냄
        UUID processID = dataProcessingService.initializeProcessingStatus(checkedItems, userFile);
        System.out.println("processID is :" + processID);

        Map<String, UUID> response = Map.of("processID", processID);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("userName") String userName,
            @RequestParam("companyName") String companyName,
            @RequestParam("process_id") String processId ) throws IOException {


        System.out.println("hihihi im on!");

        // 만일 db에 process_id에 대한 "process_reporturi가 빈 스트링이 아니라면 return 이미 있다는 의미의 응답 반환.

        // 이미 처리된 process_id인지 확인
        Optional<Analysis> analysis = analysisRepository.findByProcessIdAndProcessReportUriIsNotNull(processId);
        if (analysis.isPresent()) {
            // process_reporturi가 비어 있지 않은 경우
            return ResponseEntity.badRequest().body("Report already exists for this process ID.");
        }

        System.out.println(userName);
        System.out.println(companyName);
        System.out.println(processId);

        String pdfFilePath = pdfService.createAndUploadPdf(files, userName, companyName);

        // db에 pdfFilePath uri 저장 column 명은 "process_reporturi"

        pdfService.saveReportUri(processId, pdfFilePath);

        // 성공 응답 반환
        return ResponseEntity.ok("Report uploaded successfully.");
    }

    @GetMapping("/download")
    public ResponseEntity<?> downloadReport{

        // step1 props로 받은 process_id로부터 db의 "process_reporturi"값을 찾음.

        // step2 "process_reporturi"는 s3 경로임. 이 경로를 통해 s3로 부터 다운로드함.

        // step3 클라이언트에게 제공

        // report 다운로드 s3
        return ResponseEntity.ok("hihi");
    }

    @GetMapping("/check-response/{processId}")
    public SseEmitter checkResponse(@PathVariable String processId, HttpServletRequest request) throws Exception {
        UUID parsedProcessId;

        String accessToken = cookieService.getCookieValue(request, "accessToken");

        String actor = jwtService.getUserEmailFromJWT(accessToken); // 요청 받은 클라이언트의 accesstoken값을 통해 email을 가져옴.

        try {
            parsedProcessId = UUID.fromString(processId);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid UUID format");
        }
        SseEmitter emitter = new SseEmitter();

        // real-mode
        //CompletableFuture<Void> future = dataProcessingService.processData(parsedProcessId, emitter,actor);

        // test-mode
        CompletableFuture<Void> future = dataProcessingService.processData_test(parsedProcessId, emitter, actor);

        return emitter;
    }

    // test endpoint
//    @CrossOrigin(origins = "http://localhost:3000")

    @PostMapping("/test-mock")
    public ResponseEntity<Map<String, Object>> getMockData(@RequestBody String process_ID) {
        ObjectMapper mapper = new ObjectMapper();
        ApiResponseDTO apiResponse = null;

        try {

            InputStream inputStream = TypeReference.class.getResourceAsStream("/MockFile.json");
            System.out.println(inputStream);
            apiResponse = mapper.readValue(inputStream, ApiResponseDTO.class);

            // process_ID에 해당하는 데이터가 있는지 확인
            // 예를 들어, apiResponse 객체에서 process_ID를 확인하고 처리하는 로직
            if (apiResponse != null ) {
                // DTO를 Map으로 변환
                Map<String, Object> responseData = mapper.convertValue(apiResponse, new TypeReference<Map<String, Object>>(){});
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            } else {
                // 일치하는 데이터가 없을 경우
                System.out.println("its nono data");
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
