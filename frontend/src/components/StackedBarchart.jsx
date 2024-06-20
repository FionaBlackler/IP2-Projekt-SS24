
'use client';

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



let data = {"result": {
  "umfrage": {
      "id": 2,
      "admin_id": 1,
      "titel": "Umfrage 2024",
      "beschreibung": "In dieser Umfrage geht es um X",
      "erstellungsdatum": "2024-06-04",
      "archivierungsdatum": null,
      "status": "aktiv"
  },
  "fragen": [
      {
          "id": 4,
          "antwort_optionen": [
              {
                  "id": 14,
                  "text": "Paris",
                  "ist_richtig": true,
                  "antwortenTrue": 23,
                  "antwortenFalse": 4
              },
              {
                  "id": 15,
                  "text": "Berlin",
                  "ist_richtig": false,
                  "antwortenTrue": 3,
                  "antwortenFalse": 24
              },
              {
                  "id": 16,
                  "text": "London",
                  "ist_richtig": false,
                  "antwortenTrue": 7,
                  "antwortenFalse": 20
              },
              {
                  "id": 17,
                  "text": "Rom",
                  "ist_richtig": false,
                  "antwortenTrue": 11,
                  "antwortenFalse": 16
              }
          ],
          "punktzahl": 2,
          "text": "Wie lautet die Hauptstadt von Frankreich?",
          "umfrage_id": 2,
          "typ_id": "A",
          "bestaetigt": null,
          "verneint": null
      },
      {
          "id": 5,
          "antwort_optionen": [
              {
                  "id": 18,
                  "text": "Berlin",
                  "ist_richtig": true,
                  "antwortenTrue": 13,
                  "antwortenFalse": 0
              },
              {
                  "id": 19,
                  "text": "Hamburg",
                  "ist_richtig": true,
                  "antwortenTrue": 0,
                  "antwortenFalse": 0
              },
              {
                  "id": 20,
                  "text": "MÃ¼nchen",
                  "ist_richtig": true,
                  "antwortenTrue": 3,
                  "antwortenFalse": 0
              },
              {
                  "id": 21,
                  "text": "Paris",
                  "ist_richtig": false,
                  "antwortenTrue": 7,
                  "antwortenFalse": 0
              },
              {
                  "id": 22,
                  "text": "London",
                  "ist_richtig": false,
                  "antwortenTrue": 0,
                  "antwortenFalse": 0
              },
              {
                  "id": 23,
                  "text": "Rom",
                  "ist_richtig": false,
                  "antwortenTrue": 0,
                  "antwortenFalse": 0
              }
          ],
          "punktzahl": 1,
          "text": "Welche der folgenden StÃ¤dte liegt in Deutschland?",
          "umfrage_id": 2,
          "typ_id": "P",
          "bestaetigt": null,
          "verneint": null
      },
      {
          "id": 6,
          "antwort_optionen": [
              {
                  "id": 24,
                  "text": "Das Internet ist eine Erfindung des 20. Jahrhunderts'?",
                  "ist_richtig": true,
                  "antwortenTrue": 6,
                  "antwortenFalse": 0
              },
              {
                  "id": 25,
                  "text": "Trifft diese Aussage zu: 'Wasser besteht aus den Elementen Wasserstoff und Sauerstoff'?",
                  "ist_richtig": true,
                  "antwortenTrue": 6,
                  "antwortenFalse": 0
              },
              {
                  "id": 26,
                  "text": "Trifft diese Aussage zu: 'Die Sonne ist ein Planet'?",
                  "ist_richtig": false,
                  "antwortenTrue": 9,
                  "antwortenFalse": 0
              }
          ],
          "punktzahl": 2,
          "text": "welche der folgenden Antworten trifft zu ...:",
          "umfrage_id": 2,
          "typ_id": "K",
          "bestaetigt": "zutreffend",
          "verneint": "nicht zutreffend"
      },{
        "id": 7,
        "antwort_optionen": [
            {
                "id": 24,
                "text": "Das Internet ist eine Erfindung des 20. Jahrhunderts'?",
                "ist_richtig": true,
                "antwortenTrue": 11,
                "antwortenFalse": 5
            },
            {
                "id": 25,
                "text": "Trifft diese Aussage zu: 'Wasser besteht aus den Elementen Wasserstoff und Sauerstoff'?",
                "ist_richtig": true,
                "antwortenTrue": 16,
                "antwortenFalse": 8
            },
            {
                "id": 26,
                "text": "Trifft diese Aussage zu: 'Die Sonne ist ein Planet'?",
                "ist_richtig": false,
                "antwortenTrue": 9,
                "antwortenFalse": 0
            }
        ],
        "punktzahl": 2,
        "text": "welche der folgenden Antworten trifft zu ...:",
        "umfrage_id": 2,
        "typ_id": "K",
        "bestaetigt": "zutreffend",
        "verneint": "nicht zutreffend"
    },{
      "id": 8,
      "antwort_optionen": [
          {
              "id": 24,
              "text": "Das Internet ist eine Erfindung des 20. Jahrhunderts'?",
              "ist_richtig": true,
              "antwortenTrue": 6,
              "antwortenFalse": 13
          },
          {
              "id": 25,
              "text": "Trifft diese Aussage zu: 'Wasser besteht aus den Elementen Wasserstoff und Sauerstoff'?",
              "ist_richtig": true,
              "antwortenTrue": 6,
              "antwortenFalse": 25
          },
          {
              "id": 26,
              "text": "Trifft diese Aussage zu: 'Die Sonne ist ein Planet'?",
              "ist_richtig": false,
              "antwortenTrue": 19,
              "antwortenFalse": 10
          }
      ],
      "punktzahl": 2,
      "text": "welche der folgenden Antworten trifft zu ...:",
      "umfrage_id": 2,
      "typ_id": "K",
      "bestaetigt": "zutreffend",
      "verneint": "nicht zutreffend"
  },{
    "id": 9,
    "antwort_optionen": [
        {
            "id": 24,
            "text": "Das Internet ist eine Erfindung des 20. Jahrhunderts'?",
            "ist_richtig": true,
            "antwortenTrue": 6,
            "antwortenFalse": 0
        },
        {
            "id": 25,
            "text": "Trifft diese Aussage zu: 'Wasser besteht aus den Elementen Wasserstoff und Sauerstoff'?",
            "ist_richtig": true,
            "antwortenTrue": 6,
            "antwortenFalse": 0
        },
        {
            "id": 26,
            "text": "Trifft diese Aussage zu: 'Die Sonne ist ein Planet'?",
            "ist_richtig": false,
            "antwortenTrue": 9,
            "antwortenFalse": 0
        }
    ],
    "punktzahl": 2,
    "text": "welche der folgenden Antworten trifft zu ...:",
    "umfrage_id": 2,
    "typ_id": "K",
    "bestaetigt": "zutreffend",
    "verneint": "nicht zutreffend"
}
  ]
}
}

const COLORS = ['#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

let processedData = data.result.fragen.map((frage, index) => {
  let result = {
    name: `Frage ${index + 1}`,
    questionText: frage.text,
    ...frage.antwort_optionen.reduce((acc, option, idx) => {
      acc[`option${idx + 1}`] = option.antwortenTrue;
      acc[`option${idx + 1}Text`] = option.text;
      return acc;
    }, {}),
  };
  console.log(result)
  return result;
  
});

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


const StackedBarchart = () => {
  const { titel, beschreibung } = data.result.umfrage;

  return (
    <div className="text-center p-4">
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
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

export default StackedBarchart;