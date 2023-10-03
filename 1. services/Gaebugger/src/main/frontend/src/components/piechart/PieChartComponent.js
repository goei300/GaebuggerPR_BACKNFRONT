import React, { useRef, useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import {  Typography } from '@mui/material';

const PieChartComponent = ({ pieData, total }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, 500);  
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} style={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', height: '600px', width: '600px', margin: '0 auto', opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }}>
            <ResponsivePie
                data={pieData}
                margin={{ top: 40, right: 120, bottom: 0, left: 120 }}
                innerRadius={0.8}
                padAngle={0.7}
                cornerRadius={3}
                colors={['#007BFF', '#4CAF50', '#2E8B57']}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                animate={true}
                motionStiffness={90}    
                motionDamping={15}
                theme={{
                    labels: {
                        fontSize: '16px', // 크기 조절
                        fontWeight: 'bold', // 볼드체 적용
                        fontFamily: 'NotoSansKR-SemiBold'
                    }
                }}
                label={data => `${data.label}: ${data.value}`}
                labelSkipWidth={16}
                labelSkipHeight={16}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            />
            <div style={{
                position: 'absolute',
                top: '53%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '50px',
                fontFamily: 'NotoSansKR-SemiBold',
                fontWeight: 'bold',
            }}>
                {total}건
            </div>
            <Typography variant='h5' style={{ 
                        fontFamily: "NotoSansKR-SemiBold",
                        textAlign: 'center',
                        marginTop: '0px',
                        color: '#333'
                    }}>
                        사용자님의 위험도 그래프
            </Typography>
        </div>
    );
};

export default PieChartComponent;
