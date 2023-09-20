    import React from 'react';
    import { Link } from 'react-router-dom';
    import '../../assets/fonts/fonts.css';
    import './header.css';
    import logoImage from '../../assets/images/pado_font+icon.png';

    const Header = ({ active }) => {
        return (   
            <header className="header-container">
                <div className="logo">
                    <Link to="/">
                        <img src={logoImage} alt="LOGO" />
                    </Link>
                </div>
                <nav className="menu-structure">
                    <Link to="/contact" className={active === "contact" ? "active-link" : ""}>플랫폼 소개</Link>
                    <Link to="/services" className={active === "services" ? "active-link" : ""}>기능 소개</Link>
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
