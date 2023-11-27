import React from "react";
import { Button, List, ListItem, ListItemText, Switch, Typography, Divider } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    listItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5' // 호버 시 배경색 변경
        }
    },
    selected: {
        backgroundColor: '#e0e0e0' // 선택된 항목의 배경색
    }
});

const SignupForm3Duplication = ({ nextStep, handleModalClose, options, createCompanyData, userData, setUserData }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isUnique, setIsUnique] = useState(false);

    const classes = useStyles();

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsUnique(false); // 회사를 선택하면 '겹치는 것 없다'를 비활성화
    };

    const handleToggleUnique = () => {
        setIsUnique(!isUnique);
        setSelectedOption(null); // '겹치는 것 없다'를 활성화하면 선택된 회사 초기화
    };

    const handleConfirm = () => {
        if (isUnique) {
            createCompanyData();
        } else if (selectedOption) {
            // 선택된 회사의 companyId로 userData 업데이트
            setUserData({...userData, companyId: selectedOption.companyId});
        }
        handleModalClose();
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <Typography variant="h6">회사 선택</Typography>
            <List>
                {options.map((option) => (
                    <ListItem
                        key={option.companyId}
                        className={`${classes.listItem} ${selectedOption === option ? classes.selected : ''}`}
                        onClick={() => handleOptionClick(option)}
                    >
                        <ListItemText primary={option.companyName} secondary={option.companyAddress} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                <Switch
                    checked={isUnique}
                    onChange={handleToggleUnique}
                    color="primary"
                />
                <Typography variant="body1">회사와 겹치는 것 없다</Typography>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                style={{ float: 'right' }}
            >
                확인
            </Button>
        </div>
    );
};

export default SignupForm3Duplication;
