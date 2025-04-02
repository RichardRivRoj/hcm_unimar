import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const AgePyramidChart = ({ data }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <BarChart
                width={500}
                height={200}
                data={data}
                layout="vertical"
                margin={{ top: 2, right: 3, left: 2, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                    type="category" 
                    dataKey="range" 
                    width={80}
                    tickFormatter={value => `${value} años`}
                />
                <Tooltip />
                <Legend />
                <Bar 
                    dataKey="male" 
                    name="Hombres"
                    fill="#004B9A" 
                    stackId="a"
                />
                <Bar 
                    dataKey="female" 
                    name="Mujeres"
                    fill="#B0BEC5" 
                    stackId="a" 
                />
            </BarChart>
        </div>
    )
}

export default AgePyramidChart