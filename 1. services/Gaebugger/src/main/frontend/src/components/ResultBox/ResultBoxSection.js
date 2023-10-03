import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';

const ResultBoxSection = ({ serverData, handleOpen }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, 250);  
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
        <Box ref={containerRef} display="flex" justifyContent="space-between" my={4} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }}>
            {[
                { key: 'lawViolate', label: '법률 위반', color: '#007BFF' },
                { key: 'lawDanger', label: '법률 위반 위험', color: '#4CAF50' },
                { key: 'guideViolate', label: '작성지침 미준수', color: '#2E8B57' },
            ].map(({ key, label, color }) => (
                <Box key={key} p={2} border={`2px solid ${color}`} borderRadius={16} textAlign="center" flexGrow={1} mx={2} width="200px" height="200px">
                    <Typography variant="h6" style={{ fontFamily: "NotoSansKR-SemiBold", color: color }}>
                        {label}
                    </Typography>
                    <br/>
                    <Typography variant="h4" style={{ color: color, fontWeight: 'bold', fontFamily: "NotoSansKR-Bold", margin: '12px 0' }}>
                        {serverData[key]}건
                    </Typography>
                    <br/>
                    <Button onClick={() => handleOpen(key)} variant="outlined" size="small" style={{ borderColor: color, color: color, fontFamily: "NotoSansKR-Regular" }}>
                        자세히보기
                    </Button>
                </Box>
            ))}
        </Box>
    );
};

export default ResultBoxSection;
