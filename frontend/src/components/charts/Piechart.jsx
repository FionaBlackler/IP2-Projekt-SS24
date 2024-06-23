'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';




let processedData = data.result.fragen.map((frage, index) => {
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  frage.antwort_optionen.forEach(option => {
    if (option.ist_richtig) {
      correctAnswers += option.antwortenTrue;
    } else {
      incorrectAnswers += option.antwortenTrue;
    }
  });

  return {
    name: `Frage ${index + 1}`, 
    text: frage.text, 
    correctAnswers,
    incorrectAnswers
  };
});

const COLORS = ['#34d399', '#f87171'];

const PieChartComponent = () => {
  const { titel, beschreibung } = data.result.umfrage;

  return (
    <div className="text-center p-4">
      {/* <h1 className="text-3xl font-bold mb-2">{titel}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{beschreibung}</h2> */}
      {processedData.map((data, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{data.name}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Richtige Antworten', value: data.correctAnswers },
                  { name: 'Falsche Antworten', value: data.incorrectAnswers }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                <Cell key="cell-0" fill={COLORS[0]} />
                <Cell key="cell-1" fill={COLORS[1]} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default PieChartComponent;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const correctAnswers = payload.find(p => p.name === 'Richtige Antworten');
      const incorrectAnswers = payload.find(p => p.name === 'Falsche Antworten');
  
      return (
        <div className="p-4 bg-white text-black flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg">{payload[0].payload.text}</p> 
          {correctAnswers && (
            <p className="text-sm text-green-400">
              Richtige Antworten:
              <span className="ml-2">{correctAnswers.value}</span>
            </p>
          )}
          {incorrectAnswers && (
            <p className="text-sm text-red-400">
              Falsche Antworten:
              <span className="ml-2">{incorrectAnswers.value}</span>
            </p>
          )}
        </div>
      );
    }
  
    return null;
  };