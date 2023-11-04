import React,{ useState,useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import {useAuth} from '../../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';
const LoginForm = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const { isLoggedIn, login } = useAuth();
    const getCsrfToken = async () => {
        const response = await axios.get('https://www.pri-pen.com/csrf-token');
        console.log("csrftoken is get!");
        console.log(response);
        return response.data;
    }
    // 로그인 후 페이지 리다이렉션 처리
    useEffect(() => {
        if (isLoggedIn) {
            console.log("logged in!!");
            window.location.href = "/";
        }
    }, [isLoggedIn]);
    const handleLogin = async () => {

        // const csrfToken = await getCsrfToken();
        // const headers = {
        //     'X-CSRF-TOKEN': csrfToken
        // };

        if (!email) {
            setErrorMessage("이메일을 입력하세요.");
            return;
        }
        else if(!password){
            setErrorMessage("비밀번호를 입력하세요.");
            return;
        }
        setErrorMessage(null); // 오류 메시지 초기화
        try {
            const response = await axiosInstance.post('/userAuthentication/login', {
                email: email,
                passwordHash: password
            });
            // 응답 처리
            if (response.status === 200) {
                login(); //` AuthContext의 login 함수를 호출하여 쿠키와 상태를 업데이트합니다.
            } else {
                setErrorMessage("해당 정보를 찾을 수 없습니다.");
                return;
            }
        } catch (error) {
            setErrorMessage("서버와의 연결이 불안정합니다.");
            return;
            // 네트워크 오류나 서버 에러 처리
        }
    };


    return (
        <Box
            sx={{
                width: '300px',
                padding: '40px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
            }}
        >
            <Typography variant="h5" component="div" fontFamily="NotoSansKR-Bold">
                로그인
            </Typography>

            <TextField
                label="이메일"
                variant="outlined"
                size="small"
                fontFamily="NotoSansKR-Regular"
                fullWidth
                placeholder="nickname@company.com"
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: '5px' }}
            />

            <TextField
                label="비밀번호"
                variant="outlined"
                size="small"
                fontFamily="NotoSansKR-Regular"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
            />

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
                fontFamily="NotoSansKR-Bold"
                fullWidth
                onClick={handleLogin}
                >
                로그인
            </Button>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px'
                }}
            >
                <MuiLink
                    component={RouterLink}
                    to="/signup"
                    color="primary"
                    fontFamily="NotoSansKR-SemiBold"
                    sx={{
                        textDecoration:"none",
                        '&:hover': {
                            fontWeight: 'bold',     // 폰트 두께 변경
                            color: 'secondary.main' // hover 시 색상 변경 (예: secondary 색상 사용)
                        }
                    }}
                >
                    회원가입
                </MuiLink>
                |
                <MuiLink
                    component={RouterLink}
                    to="/findpass"
                    color="primary"
                    fontFamily="NotoSansKR-SemiBold"
                    sx={{
                        textDecoration:"none",
                        '&:hover': {
                            fontWeight: 'bold',     // 폰트 두께 변경
                            color: 'secondary.main' // hover 시 색상 변경 (예: secondary 색상 사용)
                        }
                    }}
                >
                    비밀번호 찾기
                </MuiLink>
            </Box>
        </Box>
    );
}

export default LoginForm;
