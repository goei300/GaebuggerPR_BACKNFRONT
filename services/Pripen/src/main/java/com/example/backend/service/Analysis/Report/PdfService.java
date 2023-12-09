package com.example.backend.service.Analysis.Report;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface PdfService {
    String createAndUploadPdf(List<MultipartFile> files, String userName, String companyName) throws IOException;
    void saveReportUri(String processId, String pdfFilePath);
    Resource downloadReportFromS3(String reportUri) throws IOException;
}