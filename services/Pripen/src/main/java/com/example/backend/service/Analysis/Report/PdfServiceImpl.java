package com.example.backend.service.Analysis.Report;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class PdfServiceImpl implements PdfService {

    @Override
    public String createPdf(List<MultipartFile> files) throws IOException {
        // PDF 파일 경로 설정
        String pdfFilePath = "./TemporaryStorage/generated_pdf.pdf";

        Path path = Paths.get(pdfFilePath).getParent();

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        PdfWriter writer = new PdfWriter(pdfFilePath);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        for (MultipartFile file : files) {
            byte[] bytes = file.getBytes();
            ImageData imageData = ImageDataFactory.create(bytes);
            Image image = new Image(imageData);
            document.add(image);
        }

        document.close();
        return pdfFilePath;
    }
}