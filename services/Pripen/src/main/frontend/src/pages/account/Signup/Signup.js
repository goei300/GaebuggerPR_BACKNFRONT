import React, { useState } from "react";
import axios from "axios";
const Signup = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 서버에 데이터 전송 로직
        axios.post('https://www.pri-pen.com/userAuthentication/signup', formData)
            .then(response => {
                console.log('Success:', response);
                // 추가적인 응답 처리 로직 (예: 응답 메시지 표시, 페이지 리디렉션 등)
            })
            .catch(error => {
                console.error('Error:', error);
                // 오류 처리 로직 (예: 오류 메시지 표시)
            });
    }

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Signup;
