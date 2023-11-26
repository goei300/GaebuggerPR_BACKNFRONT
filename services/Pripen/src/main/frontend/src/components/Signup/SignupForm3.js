import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import axios from 'axios';

const SignupForm3 = () => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [companyAddress, setCompanyAddress] = useState('');
    const [businessRegistrationFile, setBusinessRegistrationFile] = useState(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        document.head.appendChild(script);

        if (inputValue === '') {
            setOptions([]);
            return;
        }

        const fetchCompanyData = async () => {
            try {
                console.log("inputdata is : " , inputValue);
                const response = await axios.get(`https://backapi.pri-pen.com/userAuthentication/company-search?query=${inputValue}`);
                console.log("response data is ", response.data);
                setOptions(response.data);
                console.log("options? :", options);
            } catch (error) {
                console.error('회사 정보 검색 중 오류 발생:', error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchCompanyData();
        }, 500);

        return () => {
            clearTimeout(delayDebounceFn);
            document.head.removeChild(script);
        };
    }, [inputValue]);

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                setCompanyAddress(data.address);
            }
        }).open();
    };

    const handleFileChange = (event) => {
        setBusinessRegistrationFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div style={{background:'white' , borderRadius:'50px', padding:'100px'}}>
            <div>
                <Autocomplete
                    freeSolo
                    options={options.map(option => option.companyName)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="회사명 검색"
                            variant="outlined"
                            onChange={(event) => setInputValue(event.target.value)}
                        />
                    )}
                />
            </div>

            <div>
                <TextField
                    fullWidth
                    label="회사 주소"
                    value={companyAddress}
                    variant="outlined"
                    margin="normal"
                    onClick={handleAddressSearch}
                    readOnly
                />
            </div>

            <div>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ marginTop: '1rem' }}
                />
            </div>
            <div>
                <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: '2rem' }}>
                    제출
                </Button>
            </div>
        </div>
    );
};

export default SignupForm3;