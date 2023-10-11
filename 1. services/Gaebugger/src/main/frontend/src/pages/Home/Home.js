import React from 'react';
import { Helmet } from 'react-helmet';
import { useInView } from 'react-intersection-observer';
import './Home.css';
import Header from '../../components/header/header';
import Footer from '../../components/footer/Footer';
import '../../assets/fonts/fonts.css';
import solutionImage from '../../assets/images/pado_icon.png';
import { Button } from '@mui/material';
import {styled} from '@mui/material/styles';
import { Link } from 'react-router-dom';


function AnimatedSection({ className, title, content }) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    const StyledButton = styled(Button)({
        background: 'linear-gradient(45deg, #03A9F4 30%, #00BCD4 90%)', // 에메랄드 바닷빛 그라데이션
        width:"250px",
        height:"60px",
        fontSize:"24px",
        marginTop:"20px",
        borderRadius:"10px",
        fontFamily:"NotoSansKR-SemiBold",
        '&:hover': {
            backgroundColor: '#0056b3' // 호버 시 색상
        }
    });
    return (
        <section className={`section ${className}`}>
            <div ref={ref} className={`section-content ${inView ? 'is-visible' : ''}`}>
                <h2 style={{fontFamily:'NotoSansKR-Bold'}} className={inView ? 'animated fadeInText' : ''}>{title}</h2>
                <p style={{fontFamily:'NotoSansKR-SemiBold'}} className={inView ? 'animated fadeInText' : ''}>{content}</p>
                <StyledButton variant="contained" color="primary" href="/start/check" className={inView ? 'animated fadeInText' : ''}>바로 시작하기</StyledButton>
            </div>
            <div className="image-container">
                <img src={solutionImage} alt="Illustration" className={inView ? 'animated fadeInImage' : ''}/>
            </div>
        </section>
    );
}

function Home() {
    return (
        <div className="home-container">
            <Helmet>
                <title>파도 | 파일 하나로 개인정보 처리방침 점검</title>
            </Helmet>

            <Header />
            <main className="home-content">
            <div className="introduce-sec">
                <div className="introduce-content">
                    <AnimatedSection
                        className="introduction"
                        title={<><span>개인정보 처리방침을 위한</span><br /><span>빠른 솔루션, 파도</span></>}
                        content="파도로 손쉽게 진단해보세요."
                    />
                </div>
            </div>
            <div className="why-pado"style={{width:"100%", height:"1024px",textAlign:"center"}}>
                <div className="title" style={{fontFamily:"NotoSansKR-Bold",fontSize:"50px",marginTop:"50px"}}>
                    <span> 왜 파도여야 할까요?</span>

                </div>
            </div>
            </main>
            <Footer />
        </div>
    );
}

export default Home;    
