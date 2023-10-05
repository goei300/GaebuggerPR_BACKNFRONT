import React from 'react';
import { Helmet } from 'react-helmet';
import { useInView } from 'react-intersection-observer';
import './Home.css';
import Header from '../../components/header/header';
import Footer from '../../components/footer/Footer';
import '../../assets/fonts/fonts.css';
import solutionImage from '../../assets/images/솔루션.png';

function AnimatedSection({ className, title, content }) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section className={`section ${className}`}>
            <div ref={ref} className={`section-content ${inView ? 'is-visible' : ''}`}>
                <h2 style={{fontFamily:'NotoSansKR-Bold'}} className={inView ? 'animated fadeInText' : ''}>{title}</h2>
                <p style={{fontFamily:'NotoSansKR-SemiBold'}} className={inView ? 'animated fadeInText' : ''}>{content}</p>
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
            <div className="why-pado">

            </div>
            </main>
            <Footer />
        </div>
    );
}

export default Home;    
