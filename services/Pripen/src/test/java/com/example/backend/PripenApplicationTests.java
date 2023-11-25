package com.example.backend;


import com.example.backend.service.EmailPostService;
import com.example.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class PripenApplicationTests {

	@MockBean
	private UserService userService;

	@Test
	public void testCheckEmailExists() {
		// 가정: 이메일이 존재하는 경우
		String existingEmail = "2@2";
		when(userService.existsByEmail(existingEmail)).thenReturn(true);

		boolean isAvailable = userService.existsByEmail(existingEmail);
		assertFalse(isAvailable); // 이메일이 존재하므로 사용할 수 없음
	}

	@Test
	public void testCheckEmailDoesNotExists() {
		// 가정: 이메일이 존재하지 않는 경우
		String nonExistingEmail = "nonexist@example.com";
		when(userService.existsByEmail(nonExistingEmail)).thenReturn(false);

		boolean isAvailable = userService.existsByEmail(nonExistingEmail);
		assertTrue(isAvailable); // 이메일이 존재하지 않으므로 사용할 수 있음
	}
	@Test
	void sendVerificationEmailTest() throws Exception {
		// 모의 객체 생성
		JavaMailSender mockMailSender = mock(JavaMailSender.class);
		EmailPostService service = new EmailPostService(mockMailSender);

		// 테스트를 위한 데이터
		String testEmail = "test@example.com";
		String testCode = "123456";

		// 메서드 호출
		service.sendVerificationEmail(testEmail, testCode);

		// send 메서드가 호출되었는지 검증
		verify(mockMailSender, times(1)).send(any(SimpleMailMessage.class));
	}
	@Test
	public void generateVerificationCodeTest() {
		JavaMailSender mockMailSender = mock(JavaMailSender.class);
		EmailPostService service = new EmailPostService(mockMailSender);
		String code = service.generateVerificationCode();

		// 코드 길이 검증
		assertEquals(6, code.length());

		// 코드가 올바른 문자 집합으로 구성되었는지 검증
		assertTrue(code.matches("[A-Za-z0-9]{6}"));
	}
}
