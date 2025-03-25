import { Treemap, Tooltip } from 'recharts';

const LevelDistributionChart = ({ data }) => {
    const colorPalette = [
        '#004B9A', '#B0BEC5', '#003A7A', '#8C9CA3', '#0056b3',
        '#c0ccd1', '#002851', '#66757f', '#001a3d', '#99a6ad'
    ];

    return (
        <div className="bg-white rounded-lg shadow-md ">
            <Treemap
                width={220}
                height={245}
                data={data}
                dataKey="value"
                aspectRatio={4/3}
                stroke="#fff"
                content={<CustomizedContent colorPalette={colorPalette} />}
            >
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload) {
                            const { name, value } = payload[0];
                            return (
                                <div className="bg-white rounded ">
                                    <p className="font-medium">{name}</p>
                                    <p>{`${value}%`}</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
            </Treemap>
        </div>
    );
};

const CustomizedContent = ({ root, depth, x, y, width, height, index, colors, colorPalette }) => {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={colorPalette[index % colorPalette.length]}
                stroke="#fff"
                strokeWidth={2}
            />
            <text
                x={x + width / 2}
                y={y + height / 2 + 7}
                textAnchor="middle"
                fill="#fff"
                fontSize={14}
            >
                {root.name}
            </text>
        </g>
    );
};

export default LevelDistributionChart;