import React, { useState } from 'react';
import DropdownComponent from '../../../../components/select/select';
import { Box, Typography, Divider, Container,Paper, Button  } from '@mui/material';
import CustomizedSteppers from '../../../../components/StepIndicator/StepIndicator';
import {styled} from '@mui/material/styles';
import '../../../../assets/fonts/fonts.css';
import './Step2.css';
function Step2({ nextStep, prevStep, setCheckedItems, checkedItems, setProcessId  }) {

    const StyledPaper = styled(Paper)({
        padding: '30px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', // 부드러운 그림자
        borderRadius: '10px', // 둥근 모서리
    });
    
    const StyledButton = styled(Button)({
        backgroundColor: '#007BFF', // 버튼의 주색상
        '&:hover': {
            backgroundColor: '#0056b3' // 호버 시 색상
        }
    });

    const handleDropdownChange = (selectedOption, item) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [item.id]: selectedOption.value
        }));


    };

    const handleNextStep = () => {
        // 기존 checkedItems에 있는 것 중에 '기재'인 항목만 선택합니다.
        const selectedItems = Object.keys(checkedItems).filter(key => 
            checkedItems[key] === '기재'
        ).reduce((acc, key) => {
            acc[key] = '기재';
            return acc;
        }, {});
    
         // setCheckedItems(selectedItems);
        nextStep();
    };
    


    const items = [
        { id: 1, text: '개인정보 처리목적', type: 'text', default: '필수기재' },
        { id: 2, text: '개인정보의 처리 및 보유 기간 작성', type: 'text', default: '필수기재' },
        { id: 3, text: '처리하는 개인정보의 항목', type: 'text', default: '필수기재' },
        { id: 4, text: '만 14세 미만 아동의 개인정보 처리에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 5, text: '개인정보의 제3자 제공에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 6, text: '개인정보 처리업무의 위탁에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 7, text: '개인정보의 국외 이전에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 8, text: '개인정보의 파기 절차 및 방법에 관한 사항', type: 'text', default: '필수기재' },
        { id: 9, text: '미이용자의 개인정보 파기 등에 관한 조치', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 10, text: '정보주체와 법정대리인의 권리·의무 및 행사방법에 관한 사항', type: 'text', default: '필수기재' },
        { id: 11, text: '개인정보의 안전성 확보조치에 관한 사항', type: 'text', default: '필수기재' },
        { id: 12, text: '개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 13, text: '행태정보의 수집·이용·제공 및 거부 등에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 14, text: '추가적인 이용·제공 관련 판단 기준', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 15, text: '가명정보 처리에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 16, text: '개인정보 보호책임자에 관한 사항', type: 'text', default: '필수기재' },
        { id: 17, text: '국내대리인 지정에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 18, text: '개인정보의 열람청구를 접수·처리하는 부서', type: 'text', default: '필수기재' },
        { id: 19, text: '정보주체의 권익침해에 대한 구제방법', type: 'text', default: '필수기재' },
        { id: 20, text: '영상정보처리기기 운영·관리에 관한 사항', type: 'checkbox', options: ['기재', '기재안함'] },
        { id: 21, text: '개인정보 처리방침의 변경에 관한 사항', type: 'text', default: '필수기재' }
    ];


    return (
        <Container className="compact-container" >
            <CustomizedSteppers activeStep={1} />
            <div className="instruction" style={{ height: '200px' }}>해당하는 기재사항을 체크해주세요</div> {/* 20 px 여백을 실제로 추가 */}
            <StyledPaper elevation={3}>
                <Box display="flex" alignItems="center" my={3} >
                    <Box width={60} marginRight={4}>
                        <Typography variant="h6" color="textSecondary" style={{ fontFamily: 'NotoSansKR-Bold, sans-serif' }}>번호</Typography>
                    </Box>
                    <Box flex={1.5} marginRight={4}>
                        <Typography variant="h6" color="textSecondary" style={{ fontFamily: 'NotoSansKR-Bold, sans-serif' }} >내용</Typography>
                    </Box>
                    <Box flex={0.25} justifyContent="flex-end" alignItems="center">
                        <Typography variant="h6" color="textSecondary" style={{ fontFamily: 'NotoSansKR-Bold, sans-serif' }}>선택</Typography>
                    </Box>
                </Box>
                <Divider style={{ marginBottom: '20px' }} />
                {items.map(item => (
                    item.type === 'checkbox' ? (
                        <Box key={item.id} display="flex" justifyContent="center" alignItems="center" my={4}>
                            <Box width={60} marginRight={4}>
                                <Typography variant="h6" style={{ fontFamily: 'NotoSansKR-Bold, sans-serif' }}>{item.id}</Typography>
                            </Box>
                            <Box flex={1} marginRight={2}>
                                <Typography variant="body1" style={{ fontFamily: 'NotoSansKR-Medium, sans-serif' }}>{item.text}</Typography>
                            </Box>
                            <Box flex={1} display="flex" justifyContent="flex-end" alignItems="center">
                                <DropdownComponent 
                                    options={item.options.map(opt => ({ label: opt, value: opt }))}
                                    onChange={(selectedOption) => handleDropdownChange(selectedOption, item)}
                                    value={checkedItems[item.id] ? { label: checkedItems[item.id], value: checkedItems[item.id] } : null}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box key={item.id} display="flex" justifyContent="center" alignItems="center" my={4}>
                            <Box width={60} marginRight={4}>
                                <Typography variant="h6" style={{ fontFamily: 'NotoSansKR-Bold, sans-serif' }}>{item.id}</Typography>
                            </Box>
                            <Box flex={1} marginRight={2}>
                                <Typography variant="body1" style={{ fontFamily: 'NotoSansKR-Medium, sans-serif' }}>{item.text}</Typography>
                            </Box>
                            <Box flex={0.17} display="flex" alignItems="center">
                                <Typography variant="body1" style={{ fontFamily: 'NotoSansKR-Regular, sans-serif' }}>{item.default}</Typography>
                            </Box>
                        </Box>
                    )
                ))}
                <Divider style={{ marginTop: '20px' }} />
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="outlined" color="primary" onClick={prevStep}>
                        이전 단계
                    </Button>
                    <StyledButton variant="contained" color="primary" onClick={handleNextStep}>
                        진단 시작
                    </StyledButton>
                </Box>
            </StyledPaper>
        </Container>
    );

}

export default Step2;
