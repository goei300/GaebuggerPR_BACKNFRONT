package com.example.backend.service.Analysis.Report;

import com.itextpdf.io.font.FontConstants;
import com.itextpdf.io.font.FontProgram;
import com.itextpdf.io.font.FontProgramFactory;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.layout.element.Paragraph;
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
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
        // 표지 추가
        addCoverPage(document);

        // 파일 이름에 따라 정렬
        List<MultipartFile> sortedFiles = files.stream()
                .sorted(Comparator.comparing(MultipartFile::getOriginalFilename))
                .collect(Collectors.toList());

        for (MultipartFile file : sortedFiles) {
            byte[] bytes = file.getBytes();
            ImageData imageData = ImageDataFactory.create(bytes);
            Image image = new Image(imageData);
            document.add(image);
        }

        document.close();
        return pdfFilePath;
    }

    private void addCoverPage(Document document) throws IOException {
        // 한글 폰트 파일 경로
        String fontPath = "./fonts/NotoSansKR-Bold.ttf";

        // PDF 폰트 생성
        PdfFont koreanFont = PdfFontFactory.createFont(fontPath, PdfEncodings.IDENTITY_H, true);

        // 텍스트에 한글 폰트 적용
        Paragraph title = new Paragraph("제목").setFont(koreanFont).setFontSize(24).setBold();
        Paragraph subtitle = new Paragraph("부제목").setFont(koreanFont).setFontSize(18);

        document.add(title);
        document.add(subtitle);
    }

    private void addTableOfContents(Document document) {
        // 목차 구현...
    }
}