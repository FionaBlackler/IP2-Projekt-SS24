import React, { useState } from 'react';
import Barchart from './Barchart';
import StackedBarchart from './StackedBarchart';

const ChartComponent = ({ data }) => {
  const [chartType, setChartType] = useState('bar');
  console.log("data in menu");
  console.log(data);

 

  const resultArray = Object.values(data.result);

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Barchart data={resultArray} />;
      case 'stackedBar':
        return <StackedBarchart data={resultArray} />;
      default:
        return null;
    }
  };

  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold mb-2">{data.umfrage.titel}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{data.umfrage.beschreibung}</h2>
      <div className="mb-4">
        <label htmlFor="chartType" className="mr-2">Diagrammtyp:</label>
        <select id="chartType" value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="bar">Balkendiagramm</option>
          <option value="stackedBar">Gestapeltes Balkendiagramm</option>
        </select>
      </div>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
