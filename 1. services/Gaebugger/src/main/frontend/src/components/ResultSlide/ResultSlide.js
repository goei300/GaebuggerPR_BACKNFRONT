import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Paper } from '@mui/material';
import "../../assets/fonts/fonts.css";
function ResultSlide() {
    const issues = [
        {
            id: 1,
            content: '이슈 본문 내용 1',
            info: '이슈 정보 1'
        },
        // ... 다른 이슈들
    ];

    // 슬라이드 설정
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="issueDetail">
            <h3 style={{ fontFamily: "NotoSansKR-SemiBold", marginLeft: "20px" }}>이슈 상세검토</h3>
            <Slider {...settings}>
                {issues.map(issue => (
                    <Paper key={issue.id} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '50%' }}>
                            {issue.content}
                        </div>
                        <div style={{ width: '50%' }}>
                            {issue.info}
                        </div>
                    </Paper>
                ))}
            </Slider>
        </div>
    );
}

export default ResultSlide;
