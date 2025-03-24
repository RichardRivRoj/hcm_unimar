'use client'

import React from 'react';
import { Tooltip, Treemap } from 'recharts';

const colorPalette = [
    '#004B9A', '#B0BEC5', '#003A7A', '#8C9CA3', '#0056b3',
    '#c0ccd1', '#002851', '#66757f', '#001a3d', '#99a6ad'
];

const MaritalStatusTreemap = ({ data }) => {
    const formattedData = data.map((item, index) => ({
        name: item.label,
        value: item.percentage,
        count: item.count,
        color: colorPalette[index % colorPalette.length]
    }));

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Treemap
                width={850}
                height={200}
                data={formattedData}
                dataKey="value"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#004B9A"
            >
                <text 
                    fill="white" 
                    fontSize={14}
                    fontFamily="Arial"
                    textAnchor="middle"
                    dominantBaseline="middle"
                />
                <Tooltip
                    content={({ payload }) => (
                        payload[0] && (
                            <div className="p-2 bg-white border rounded shadow">
                                <p>{payload[0].payload.name}</p>
                                <p>{`${payload[0].value}% (${payload[0].payload.count} empleados)`}</p>
                            </div>
                        )
                    )}
                />
            </Treemap>
        </div>
    );
};

export default MaritalStatusTreemap;