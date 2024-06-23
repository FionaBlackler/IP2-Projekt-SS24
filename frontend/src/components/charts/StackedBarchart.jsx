import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const StackedBarchart = ({ data }) => {
  if (!Array.isArray(data)) {
    return <div>Invalid data format</div>;
  }

  const processedData = data.map((frage, frageIndex) => {
    let result = {
      name: `Frage ${frageIndex + 1}`,
      questionText: frage.text,
      ...frage.antworten.reduce((acc, option, idx) => {
        acc[`option${idx + 1}`] = option.antwortenTrue;
        acc[`option${idx + 1}Text`] = option.text;
        return acc;
      }, {}),
    };
    return result;
  });

  return (
    <div className="text-center p-4">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {Object.keys(processedData[0]).filter(key => key.startsWith('option') && !key.endsWith('Text')).map((key, index) => (
            <Bar key={index} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} name={`Option ${index + 1}`}>
              {processedData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white text-black flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{payload[0].payload.questionText}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.payload[`option${index + 1}Text`]}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default StackedBarchart;