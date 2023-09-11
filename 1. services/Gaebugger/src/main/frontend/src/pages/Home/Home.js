import React from 'react';
import { useInView } from 'react-intersection-observer';
import './Home.css';
import Header from '../header';

function Section({ className, title, content }) {
    const [ref, inView] = useInView({
        triggerOnce: true,  // Only trigger this effect once
        threshold: 0.1,     // Percentage of the element that's visible before triggering
    });

    return (
        <section ref={ref} className={`section ${className} ${inView ? 'is-visible' : ''}`}>
            <h2>{title}</h2>
            <p>{content}</p>
        </section>
    );
}

function Home() {
    return (
        <div className="home-container">
            <Header />

            <main className="home-content">
                <Section className="introduction" title="개인정보 뭐시기" content="으아아악!" />
                <Section className="new-info-protection" title="새로 개인정보 보호법이 개정되면서 처리방침이 중요해졌습니다." content="너무 오래걸리는 처리방침 점검. 이제 [이름]으로 쉽고 간편하게 점검하세요!" />
                <Section className="why-use-name" title="새롭게 개정된 법" content="뭐시기 회사 1000 군데, 인당 100개의 위탁사 관리. 예상 시간 3일!" />
                <Section className="some-content" title="뭐쓸까" content="깔깔" />
            </main>
            {/* ... other content ... */}
        </div>
    );
}

export default Home;
