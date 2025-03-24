import { Treemap, Tooltip } from 'recharts';

const LevelDistributionChart = ({ data }) => {
    const colorPalette = [
        '#004B9A', '#B0BEC5', '#003A7A', '#8C9CA3', '#0056b3',
        '#c0ccd1', '#002851', '#66757f', '#001a3d', '#99a6ad'
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Distribución por Nivel</h3>
            <Treemap
                width={400}
                height={400}
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
                                <div className="p-2 bg-white border rounded shadow">
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