import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import '../../assets/fonts/fonts.css';
import './header.css';
import logoImage from '../../assets/images/pado_font+icon.png';
import { Button, Menu, MenuItem} from '@mui/material';



const Header = ({ active }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (   
        <header className="header-container">
            <div className="logo">
                <Link to="/">
                    <img src={logoImage} alt="LOGO" />
                </Link>
            </div>
                <nav className="menu-structure">
                    <Link to="/contact" className={active === "contact" ? "active-link" : ""}>플랫폼 소개</Link>
                    <Link 
                        to="/services"
                        onMouseEnter={handleOpen}
                        onMouseLeave={handleClose}
                        className={active === "services" ? "active-link" : ""}
                    >
                        기능 소개
                        <Menu
                            id="sub-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            sx={{
                                '& .MuiMenu-list': {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100px 100%',  // 박스 크기 조절
                                    padding: '5px',  // 내부 패딩 조절
                                },
                                marginTop: '15px' // 상위 메뉴와의 간격 조절
                            }}
                        >
                            <MenuItem 
                                sx={{ 
                                    fontFamily: 'NotoSansKR-Light',
                                    flex: 1, 
                                    padding: '0 15px', 
                                    borderRight: '1px solid lightgray', 
                                    fontSize: '0.9rem'  // 글씨 크기 조절
                                }}
                            >
                                <Link to="/services/checkinfo" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleClose}>
                                    개인정보 처리방침 진단
                                </Link>
                            </MenuItem>
                            <MenuItem 
                                onClick={handleClose} 
                                sx={{ 
                                    fontFamily: 'NotoSansKR-Light',
                                    flex: 1, 
                                    padding: '0 15px', 
                                    fontSize: '0.9rem'  // 글씨 크기 조절
                                }}
                            >
                                추후 개발.
                            </MenuItem>
                        </Menu>
                    </Link>
                <Link to="/guidelines" className={active === "guidelines" ? "active-link" : ""}>이용 방법</Link>
                <Link to="/start" className={active === "start" ? "active-link" : ""}>시작하기</Link>
            </nav>
            <div className="authentication">
                <Link to="/login">로그인</Link>
                <Link to="/mypage">마이 페이지</Link>
            </div>
        </header>
    );
}

export default Header;
