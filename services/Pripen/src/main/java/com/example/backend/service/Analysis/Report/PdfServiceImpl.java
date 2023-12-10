package com.example.backend.service.Analysis.Report;

import com.example.backend.model.Analysis.Analysis;
import com.example.backend.repository.Analysis.AnalysisRepository;
import com.example.backend.service.Analysis.DataProcessingService;
import com.itextpdf.io.font.FontConstants;
import com.itextpdf.io.font.FontProgram;
import com.itextpdf.io.font.FontProgramFactory;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import io.lettuce.core.SslOptions;
import jakarta.transaction.Transactional;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PdfServiceImpl implements PdfService {
    private final AnalysisRepository analysisRepository;
    private final S3Client s3Client;

    public PdfServiceImpl(AnalysisRepository analysisRepository,S3Client s3Client) {
        this.analysisRepository = analysisRepository;
        this.s3Client = s3Client;
    }
    public String createAndUploadPdf(List<MultipartFile> files,String userName, String companyName) throws IOException {


        String tempStoragePath = System.getenv("REPORT_STORAGE_PATH");
        if (tempStoragePath == null) {
            // 개발 환경에서 사용할 기본 경로
            tempStoragePath = "./TemporaryStorage";
        }
        String tempPdfFilePath = tempStoragePath + "/temp_generated_pdf.pdf";
        String finalPdfFilePath = tempStoragePath + "/generated_pdf.pdf"; // 최종 파일 경로

        // 임시 PDF 파일에 이미지 추가
        PdfWriter tempWriter = new PdfWriter(tempPdfFilePath);
        PdfDocument tempPdf = new PdfDocument(tempWriter);
        Document tempDocument = new Document(tempPdf);
        // 이미지 추가 로직

        // 표지 추가
        addCoverPage(tempDocument,userName,companyName);

        // 첫 페이지를 빈 페이지로 추가
        tempDocument.add(new AreaBreak(AreaBreakType.NEXT_PAGE));

        // 파일 이름에 따라 정렬
        List<MultipartFile> sortedFiles = files.stream()
                .sorted(Comparator.comparing(MultipartFile::getOriginalFilename))
                .collect(Collectors.toList());

        addContents(tempDocument, sortedFiles);
        tempDocument.close();

        // 임시 파일을 읽고 최종 파일에 워터마크 추가
        PdfReader reader = new PdfReader(tempPdfFilePath);
        PdfWriter writer = new PdfWriter(finalPdfFilePath);
        PdfDocument finalPdf = new PdfDocument(reader, writer);
        Document finalDocument = new Document(finalPdf);

        // 워터마크 추가 로직
        PdfFont waterMarkingFont = PdfFontFactory.createFont("./fonts/NotoSansKR-Thin.ttf", PdfEncodings.IDENTITY_H, true);
        addBorderAndWatermark(finalPdf, waterMarkingFont);
        finalDocument.close();

        // 임시 파일 삭제
        Files.delete(Paths.get(tempPdfFilePath));

        String bucketName = "pripen-s3"; // S3 버킷 이름
        String NanceValue = UUID.randomUUID().toString();  // 넌스값 (임의의 랜덤값)
        String objectKey = "ReportStorage/" + NanceValue; // S3 오브젝트 키
        String s3Uri = uploadFileToS3(finalPdfFilePath, bucketName, objectKey);
        return s3Uri;
    }


    private void addCoverPage(Document document,String userName, String companyName) throws IOException {
        // 한글 폰트 파일 경로
        String fontPath = "./fonts/NotoSansKR-SemiBold.ttf";

        // PDF 폰트 생성
        PdfFont koreanFont = PdfFontFactory.createFont(fontPath, PdfEncodings.IDENTITY_H, true);

        // 텍스트에 한글 폰트 적용
        Paragraph title = new Paragraph("프라이펜 개인정보 처리방침 진단 레포트").setFont(koreanFont).setFontSize(24).setBold();

        document.add(title);

        // 날짜 추가
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        Table table = new Table(1) // 1 열 테이블
                .setWidth(UnitValue.createPercentValue(30)) // 테이블 폭 설정
                .setFixedPosition(450, 50, 100); // x, y, width

        Color borderColor = new DeviceRgb(217, 217, 217); // #d9d9d9 색상

        // 날짜 행 추가
        Cell dateCell = new Cell().add(new Paragraph("날짜: " + currentDate).setFont(koreanFont).setFontSize(10));
        dateCell.setBorder(Border.NO_BORDER); // 외곽선 제거
        dateCell.setBorderBottom(new SolidBorder(borderColor, 1)); // 아래쪽 테두리 색상 설정
        table.addCell(dateCell);

        // 회사 이름 행 추가
        Cell companyCell = new Cell().add(new Paragraph("회사: " + companyName).setFont(koreanFont).setFontSize(10));
        companyCell.setBorder(Border.NO_BORDER);
        dateCell.setBorderBottom(new SolidBorder(borderColor, 1)); // 아래쪽 테두리 색상 설정
        table.addCell(companyCell);

        // 사용자 이름 행 추가
        Cell userCell = new Cell().add(new Paragraph("작성자: " + userName).setFont(koreanFont).setFontSize(10));
        userCell.setBorder(Border.NO_BORDER);
        table.addCell(userCell);

        document.add(table);
    }
    private void addBorderAndWatermark(PdfDocument pdf, PdfFont koreanFont) {
        PageSize a4 = PageSize.A4;

        System.out.println(pdf);
        System.out.println(pdf.getPage(1));
        int numberOfPages = pdf.getNumberOfPages();
        for (int i = 1; i <= numberOfPages; i++) {
            PdfPage page = pdf.getPage(i);
            Rectangle pageSize = page.getPageSizeWithRotation();
            float width = pageSize.getWidth();
            float height = pageSize.getHeight();

            if (page != null) {
                // 페이지 테두리 추가
                PdfCanvas canvas = new PdfCanvas(page);
                // 테두리 위치 및 크기 조정
                float inset = 10; // 여백
                canvas.rectangle(inset / 2, inset / 2, width - inset, height - inset);
                canvas.setStrokeColor(new DeviceRgb(173, 216, 230)); // 연한 파란색으로 설정
                canvas.setLineWidth(10);
                canvas.stroke();

                // 워터마크 추가
                Paragraph watermark = new Paragraph("@Copyright by Pripen")
                        .setFont(koreanFont)
                        .setFontSize(7)
                        .setFontColor(ColorConstants.GRAY);
                new Canvas(canvas, pdf, a4)
                        .showTextAligned(watermark, width / 2, 15, TextAlignment.CENTER);
            } else {
                System.out.println("페이지가 null입니다: " + i);
            }
        }
    }
    private void addContents(Document document, List<MultipartFile> files) throws IOException {
        String fontPath = "./fonts/NotoSansKR-SemiBold.ttf";
        PdfFont koreanFont = PdfFontFactory.createFont(fontPath, PdfEncodings.IDENTITY_H, true);

        String[] titles = {
                "1. 진단 유형 결과",
                "2. 평균 위반 수치 비교",
                "3. 위반 문장 확인",
                "4. 상세 테이블"
        };

        int chapter = 0;
        for (int i = 0; i < files.size(); i++) {
            // 새 챕터의 첫 이미지에 제목 추가
            if (i == 0 || i == 2 || i == 3 || i == 4) {
                String title = titles[chapter++];
                Paragraph titleParagraph = new Paragraph(title)
                        .setFontSize(16)
                        .setBold()
                        .setFont(koreanFont)
                        .setUnderline()
                        .setTextAlignment(TextAlignment.CENTER);
                document.add(titleParagraph);
            }

            // 이미지 추가
            MultipartFile file = files.get(i);
            byte[] bytes = file.getBytes();
            ImageData imageData = ImageDataFactory.create(bytes);
            Image image = new Image(imageData).setAutoScale(true);
            document.add(image);

            // 첫 챕터의 두 번째 이미지 이후, 그리고 그 이후의 각 이미지 후에 새 페이지 시작
            if ((i == 1 && files.size() > 2) || (i >= 2 && i < files.size() - 1)) {
                document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
            }
        }
    }
    @Transactional
    public void saveReportUri(String processId, String pdfFilePath) {
        Analysis analysis = analysisRepository.findById(processId)
                .orElseThrow(() -> new RuntimeException("Analysis not found"));
        analysis.setProcessReportUri(pdfFilePath);
        analysisRepository.save(analysis);
    }
    public String uploadFileToS3(String finalPdfFilePath, String bucketName, String objectKey) {
        // S3에 파일 업로드
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromFile(Paths.get(finalPdfFilePath)));

        return "s3://" + bucketName + "/" + objectKey;
    }

    public Resource downloadReportFromS3(String reportUri) throws IOException {
        // 버킷 이름과 오브젝트 키 추출
        URI uri = URI.create(reportUri);
        String bucketName = uri.getHost();
        String objectKey = uri.getPath().substring(1); // 첫 번째 '/' 문자 제거

        System.out.println("uri is " + uri);
        System.out.println("bucketName is " + bucketName);
        System.out.println("objectKey is " + objectKey);

        // S3에서 PDF 파일 다운로드
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();
        ResponseInputStream<GetObjectResponse> s3ObjectResponse = s3Client.getObject(getObjectRequest);

        // InputStream에서 데이터를 읽어 ByteArrayResource로 변환
        try (InputStream inputStream = s3ObjectResponse) {
            return new ByteArrayResource(inputStream.readAllBytes());
        }
    }
}