import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BitcoinCharts = ({ data }) => {
  // Prepare data for line chart
  const lineChartData = {
    labels: ['24h ago', '12h ago', 'Now'],
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: [data.price_24h_ago, data.price_12h_ago, data.current_price],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for pie chart
  const pieChartData = {
    labels: ['High Fee', 'Medium Fee', 'Low Fee'],
    datasets: [
      {
        data: [data.high_fee_per_kb, data.medium_fee_per_kb, data.low_fee_per_kb],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bitcoin Price History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fee Distribution',
      },
    },
  };

  return (
    <div className="bitcoin-charts">
      <div className="chart">
        <Line data={lineChartData} options={lineOptions} />
      </div>
      <div className="chart">
        <Pie data={pieChartData} options={pieOptions} />
      </div>
    </div>
  );
};

export default BitcoinCharts;