import React,{useEffect,useState} from "react";
import SignupForm2 from "../../../components/Signup/SignupForm2";
import "./Signup.css";
import axios from "axios";
const Signup2 = ({userData, nextStep}) => {
    const email = userData.email;
    const [code, setCode] = useState(''); // 인증 코드 상태
    const [codeError, setCodeError] = useState(''); // 인증 코드 에러 메시지 상태

    // 이메일 전송 함수
    const sendEmail = async () => {
        try {
            // 이메일 전송 API 호출
            await axios.post('http://localhost:8080/userAuthentication/email-post', {email});
            
        } catch (error) {
            setCodeError('메시지 전송 실패');
        }
    };

    // 인증 코드 확인 함수
    const verifyCode = async () => {
        try {
            // 인증 코드 확인 API 호출
            const response = await axios.post('http://localhost:8080/userAuthentication/email-validity', { email, code });
            if(response.data.isValid){
                nextStep();
            }
        } catch (error) {
            setCodeError('인증 코드 검증 실패');
        }
    };

    // 이메일 코드 전송 
    // 컴포넌트 마운트 시 이메일 전송
    useEffect(() => {
        sendEmail();
    }, []);

    return(
        
        <div className="Signup2">
            <SignupForm2 verifyCode={verifyCode} code={code} setCode={setCode} />
        </div>
    );
};

export default Signup2;