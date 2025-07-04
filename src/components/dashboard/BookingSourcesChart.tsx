// components/BookingSourcesChart.tsx
'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BookingSourceData {
  source: string;
  value: number;
  color: string;
}

const BookingSourcesChart: React.FC = () => {
  // Sample data - replace with your actual data source
  const bookingSources: BookingSourceData[] = [
    { source: 'Airbnb', value: 45, color: '#586DF7' },
    { source: 'VRBO', value: 30, color: '#F7B730' },
    { source: 'Direct', value: 25, color: '#38C6F9' }
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate total for percentage calculations
  const total = bookingSources.reduce((sum, source) => sum + source.value, 0);

  const chartData = {
    labels: bookingSources.map(source => source.source),
    datasets: [
      {
        data: bookingSources.map(source => source.value),
        backgroundColor: bookingSources.map(source => source.color),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '40%',
    plugins: {
      legend: {
        position: 'left',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: 'Inter, sans-serif'
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i] as number;
                const percentage = ((value / total) * 100).toFixed(1);
                const backgroundColor = data.datasets[0].backgroundColor;
                const fillStyle = Array.isArray(backgroundColor) ? backgroundColor[i] : '#000000';
                return {
                  text: `${label}: ${percentage}% (${formatCurrency(value)})`,
                  fillStyle: fillStyle,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}% (${formatCurrency(value)})`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 ">
      <h2 className="text-xl font-bold text-gray-800 mb-0">Booking Sources</h2>
      <div className="h-64 w-full">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BookingSourcesChart;
