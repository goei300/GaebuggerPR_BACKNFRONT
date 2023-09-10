import React from 'react';
import { useInView } from 'react-intersection-observer';
import '../fonts.css';
import './Service.css';


function Section({ className, title, content, button }) {
    const [ref, inView] = useInView({
        triggerOnce: true,  // Only trigger this effect once
        threshold: 0.1,     // Percentage of the element that's visible before triggering
    });

    return (
        <section ref={ref} className={`section ${className} ${inView ? 'is-visible' : ''}`}>
            <h2>{title}</h2>
            <p>{content}</p>
            {button && <div className="section-button-container">{button}</div>}
        </section>
    );
}


function Service() {
    return (
        <div className="Service-container">
            <header className="Service-header">
                <div className="logo">LOGO</div>
                <nav className="nav-links">
                    <a href="services" className="active-link">시작하기</a>
                    <a href="guides">가이드</a>
                    <a href="about">더보기</a>
                </nav>
                <div className="user-actions">
                    <a href="login">로그인</a>
                    <a href="mypage">마이페이지</a>
                </div>
            </header>

            <main className="Service-content">
                <Section
                    className="introduction_service"
                    title="개인정보 처리방침 점검을 쉽고 간편하게"
                    content="점검하고자 하는 처리방침 자료들을 한 번에 점검 결과를 확인해보세요!"
                    button={<a href="services/check" className="start-button">개인정보 처리방침 점검 시작</a>}
                />
            </main>
        </div>
    );
}

export default Service;