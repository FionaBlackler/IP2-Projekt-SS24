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
} from 'recharts';

const BarChartComponent = ({ data }) => {
  if (!Array.isArray(data)) {
    return <div>Invalid data format</div>;
  }

  const processedData = data.map((frage, frageIndex) => {
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    frage.antworten.forEach(option => {
      if (option.ist_richtig) {
        correctAnswers += option.antwortenTrue;
      } else {
        incorrectAnswers += option.antwortenTrue;
      }
    });

    return {
      name: `Frage ${frageIndex + 1}`,
      text: frage.text,
      correctAnswers,
      incorrectAnswers
    };
  });

  return (
    <div className="text-center p-4">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={processedData}
          margin={{ right: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => value === 'correctAnswers' ? 'Richtige Antworten' : 'Falsche Antworten'} />
          <Bar dataKey="correctAnswers" fill="#34d399" /> {/* Dunkleres Grün für richtige Antworten */}
          <Bar dataKey="incorrectAnswers" fill="#f87171" /> {/* Dunkleres Rot für falsche Antworten */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white text-black flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{payload[0].payload.text}</p>
        <p className="text-sm" style={{ color: '#2d6a4f' }}>
          Richtige Antworten:
          <span className="ml-2">{payload[0].value}</span>
        </p>
        <p className="text-sm" style={{ color: '#d00000' }}>
          Falsche Antworten:
          <span className="ml-2">{payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default BarChartComponent;