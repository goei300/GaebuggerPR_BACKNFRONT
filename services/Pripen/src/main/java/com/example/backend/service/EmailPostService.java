package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailPostService {


    private final JavaMailSender mailSender;

    @Autowired
    public EmailPostService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }


    public void sendVerificationEmail(String email, String verificationCode) throws Exception {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("goei4559@gmail.com"); // 발신자 이메일 주소 설정
        message.setTo(email); // 수신자 이메일 주소 설정
        message.setSubject("인증 코드"); // 메일 제목 설정
        message.setText("귀하의 인증 코드는 " + verificationCode + "입니다."); // 메일 본문 설정
        mailSender.send(message);

    }

    public String generateVerificationCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(characters.length());
            code.append(characters.charAt(index));
        }
        return code.toString(); // 임시 코드
    }
}
