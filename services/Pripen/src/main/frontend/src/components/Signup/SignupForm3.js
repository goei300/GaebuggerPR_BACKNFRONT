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
                const response = await axios.get(`https://backapi.pri-pen.com/userAuthenticaion/company-search?query=${inputValue}`);
                setOptions(response.data);
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
        <div>
            <Autocomplete
                freeSolo
                options={options.map(option => option.name)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="회사명 검색"
                        variant="outlined"
                        onChange={(event) => setInputValue(event.target.value)}
                    />
                )}
            />
            <TextField
                fullWidth
                label="회사 주소"
                value={companyAddress}
                variant="outlined"
                margin="normal"
                onClick={handleAddressSearch}
                readOnly
            />
            <input
                type="file"
                onChange={handleFileChange}
                style={{ marginTop: '1rem' }}
            />
            <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: '2rem' }}>
                제출
            </Button>
        </div>
    );
};

export default SignupForm3;