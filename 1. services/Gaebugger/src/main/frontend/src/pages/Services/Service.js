import React from 'react';
import { Link, Routes, Route, Outlet,useLocation } from 'react-router-dom';
import CheckEvaluate from "./check/CheckEvaluate";
import Step1 from './check/Step1';
import Step2 from './check/Step2';
import Header from '../header';
import { useInView } from 'react-intersection-observer';
import './Service.css';
import '../fonts.css';

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
    const location = useLocation();
    return (
        <div className="Service-container">
            <Header active="services" />

            <main className="Service-content">
                {location.pathname.startsWith('/services') && !location.pathname.includes('check') && (
                    <Section
                        className="introduction_service"
                        title="개인정보 처리방침 점검을 쉽고 간편하게"
                        content="점검하고자 하는 처리방침 자료들을 한 번에 평가 결과를 확인해보세요!"
                        button={<Link to="/services/check" className="start-button">개인정보 처리방침 평가 시작</Link>}
                    />
                )}

                <Routes>
                    <Route path="check" element={<CheckEvaluate />} />

                    {/* Include routes for other steps as required */}
                    <Route path="*" element={<Outlet />} />  // This acts as the placeholder for nested routes
                </Routes>
            </main>
        </div>
    );
}

export default Service;