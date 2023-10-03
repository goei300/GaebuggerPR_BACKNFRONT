import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';

const BarChartComponent = ({ data }) => {
    const [isVisible, setIsVisible] = useState(false); // 기본적으로는 보이지 않게 설정
    const chartRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, 500);  // 1.5초 기다린 후 에니메이션 시작
                    if (chartRef.current) {
                        observer.unobserve(chartRef.current);
                    }
                }
            });
        });
    
        if (chartRef.current) {
            observer.observe(chartRef.current);
        }
    
        return () => {
            if (chartRef.current) {
                observer.unobserve(chartRef.current);
            }
        };
    }, []);

    return (
        <div ref={chartRef} style={{ height: '400px' }}>
            {isVisible && (

            <ResponsiveBar
                data={data}
                keys={['사용자', '평균']}
                indexBy="name"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                layout="vertical"
                borderRadius={4}
                padding={0.6}
                enableGridX={false}
                enableGridY={false}
                fontFamily="NotoSansKR-SemiBold"
                groupMode="grouped"
                colors={['#0000FF', '#B0E0E6']}
                theme={{
                    fontFamily:"NotoSansKR-SemiBold",
                    fontSize: 14,
                    axis: {
                        domain: {
                            line: {
                                stroke: "#D9D9D9",
                                strokeWidth: 1
                            }
                        },
                        ticks: {
                            line: {
                                stroke: "#D9D9D9",
                                strokeWidth: 0.5
                            }
                        },
                        
                    },
                    grid: {
                        line: {
                            stroke: "#ddd",
                            strokeWidth: 0.5
                        }
                    },
                    labels: {
                        text: {
                            fill: "#FF0000"
                        }
                    }
                }}


                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '항목',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '건수',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    tickValues:[0,2,4,6,8,10],
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                
                labelTextColor="#FFFFFF"
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false, 
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1  
                                }
                            }
                        ]
                    }
                ]}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
            )}
        </div>
    );
};

export default BarChartComponent;
