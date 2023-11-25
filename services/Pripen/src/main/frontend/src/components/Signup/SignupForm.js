import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // 비밀번호 조건 검증
    const validatePassword = (password) => {
        const regex = /^(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/;
        return regex.test(password);
    }

    // 비밀번호 변경 핸들러
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (newPassword.length === 0) {
            setPasswordError("");
        } else if (!validatePassword(newPassword)) {
            setPasswordError("최소 8자, 최대 20자, 특수문자 (!@#$%^&*()_+) 포함");
        } else {
            setPasswordError("");
        }
    }

    // 비밀번호 확인 변경 핸들러
    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        if (newConfirmPassword.length === 0) {
            setConfirmPasswordError("");
        } else if (newConfirmPassword !== password) {
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPasswordError("");
        }
    }

    const handleSignup = async () => {
        if (!email || !password || !username || !confirmPassword) {
            setErrorMessage("모든 필드를 채워주세요.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }
        setErrorMessage(null);
        try {
            const response = await axios.post('https://backapi.pri-pen.com/userAuthentication/signup', {
                username: username,
                email: email,
                passwordHash: password,
            });
            if (response.status === 200) {
                navigate('/login');
            } else {
                setErrorMessage("계정을 만들 수 없습니다.");
            }
        } catch (error) {
            setErrorMessage("서버와의 연결이 불안정합니다.");
        }
    };

    return (
        <Box sx={{
            width: '300px',
            padding: '40px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
        }}>
            <Typography variant="h5" component="div" fontFamily="NotoSansKR-Bold">
                회원가입
            </Typography>

            <TextField
                label="사용자 이름"
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: '5px', fontFamily:"NotoSansKR-Bold"  }}
            />

            <TextField
                label="이메일"
                variant="outlined"
                size="small"
                fontFamily="NotoSansKR-Regular"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: '5px' }}
            />

            <TextField
                label="비밀번호"
                type="password"
                onChange={handlePasswordChange}
                fullWidth
                sx={{ marginBottom: '5px' }}
                variant="outlined"
                size="small"
                fontFamily="NotoSansKR-Regular"
            />
            <Typography color={passwordError ? 'error' : passwordError === "" ? 'inherit' : 'green'}>
                {passwordError || (password && "비밀번호 조건 충족")}
            </Typography>

            <TextField
                label="비밀번호 확인"
                variant="outlined"
                size="small"
                fontFamily="NotoSansKR-Regular"
                type="password"
                fullWidth
                onChange={handleConfirmPasswordChange}
            />
            <Typography color={confirmPasswordError ? 'error' : confirmPasswordError === "" ? 'inherit' : 'green'}>
                {confirmPasswordError || (confirmPassword && password === confirmPassword && "비밀번호 일치")}
            </Typography>

            <Typography
                color="error"
                style={{
                    height: '20px',
                    visibility: errorMessage ? 'visible' : 'hidden'
                }}
            >
                {errorMessage}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{fontFamily:"NotoSansKR-Bold",fontSize:'1.2rem'}}
                onClick={handleSignup}
            >
                다음
            </Button>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '20px'
            }}>
                <Typography style={{fontFamily:"NotoSansKR-SemiBold"}}> 이미 계정이 있으신가요?</Typography>
                <MuiLink
                    component={RouterLink}
                    to="/login"
                    color="primary"
                    fontFamily="NotoSansKR-SemiBold"
                    sx={{
                        textDecoration:"none",
                        '&:hover': {
                            fontWeight: 'bold',
                            color: 'secondary.main'
                        }
                    }}
                >
                    로그인
                </MuiLink>
            </Box>
        </Box>
    );
}

export default SignupForm;
