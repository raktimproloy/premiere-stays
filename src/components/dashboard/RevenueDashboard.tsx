// components/RevenueDashboard.tsx
'use client';

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaArrowUp } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RevenueData {
  month: string;
  primaryRevenue: number;
  secondaryRevenue: number;
  isLastMonth?: boolean;
  isCurrentMonth?: boolean;
}

const RevenueDashboard: React.FC = () => {
  // Generate sample data with two revenue streams
  const generateRevenueData = (): RevenueData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const currentMonthIndex = new Date().getMonth();
    const displayedMonths = months.slice(0, Math.min(currentMonthIndex + 1, months.length));
    
    const primaryRevenue = [789000, 630000, 560000, 440000, 675000, 610000, 499500];
    const secondaryRevenue = [450410, 300800, 360000, 190000, 575000, 510000, 199500];
    
    return displayedMonths.map((month, index) => ({
      month,
      primaryRevenue: primaryRevenue[index],
      secondaryRevenue: secondaryRevenue[index],
      isLastMonth: index === currentMonthIndex - 1,
      isCurrentMonth: index === currentMonthIndex
    }));
  };

  const revenueData = generateRevenueData();
  const currentMonthData = revenueData.find(item => item.isCurrentMonth);
  const lastMonthData = revenueData.find(item => item.isLastMonth);

  const calculatePercentageChange = (): number => {
    if (!currentMonthData || !lastMonthData) return 0;
    const currentTotal = currentMonthData.primaryRevenue + currentMonthData.secondaryRevenue;
    const lastTotal = lastMonthData.primaryRevenue + lastMonthData.secondaryRevenue;
    return ((currentTotal - lastTotal) / lastTotal) * 100;
  };

  const percentageChange = calculatePercentageChange();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Chart.js data configuration for grouped bars
  const chartData = {
    labels: revenueData.map(item => item.month),
    datasets: [
      {
        label: 'Primary Revenue',
        data: revenueData.map(item => item.primaryRevenue),
        backgroundColor: '#586DF7',
        borderColor: '#586DF7',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#3A56F5',
      },
      {
        label: 'Secondary Revenue',
        data: revenueData.map(item => item.secondaryRevenue),
        backgroundColor: '#FFE09E',
        borderColor: '#FFE09E',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#FFD570',
      }
    ]
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            return `${label}: ${formatCurrency(value)}`;
          },
          afterLabel: (context) => {
            if (context.datasetIndex === 1) { // Only show total on second dataset
              const primary = context.chart.data.datasets[0].data[context.dataIndex] as number;
              const secondary = context.chart.data.datasets[1].data[context.dataIndex] as number;
              return `Total: ${formatCurrency(primary + secondary)}`;
            }
            return '';
          }
        }
      }
    },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280'
            },
            stacked: false, // Side-by-side bars
          },
          y: {
            beginAtZero: true,
            max: 800000, // Fixed max value for consistent scale
            grid: {
              color: '#f3f4f6'
            },
            ticks: {
              color: '#6b7280',
              stepSize: 200000,
              callback: (value) => {
                const numValue = Number(value);
                return `$${numValue / 1000}K`;
              }
            }
          }
        }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-0">
        <div className='flex justify-between align-middle'>
          <h1 className="text-xl font-bold text-gray-800">Total Revenue</h1>
          <div>
          <div className='flex align-middle gap-3'>
            <p className='h-3 text-sm text-[#969FB7] before:inline-block before:w-3 before:h-3 before:rounded-full before:bg-[#586DF7] before:mr-2'>Last Month</p>
            <p className='h-3 text-sm text-[#969FB7] before:inline-block before:w-3 before:h-3 before:rounded-full before:bg-[#FFE09E] before:mr-2'>Running Month</p>
            <BsThreeDots className='mt-1 mx-3' />
          </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-4">
          <div className="mb-4 sm:mb-0 flex gap-5 align-middle">
            <p className="text-2xl font-semibold text-gray-900">
              {currentMonthData ? formatCurrency(currentMonthData.primaryRevenue + currentMonthData.secondaryRevenue) : '$0'}
            </p>
            <div className={`flex items-center`}>
              <FaArrowUp className='p-2 rounded-full w-8 h-8 text-white bg-[#586DF7] mr-2' />
              <div>
                <p className="text-[#586DF7] font-bold">
                  0.8%
                </p>
                <p className="text-xs text-[#969FB7]">Than last Month</p>
              </div>
            </div>
          </div>
          
          {/* <div className="flex space-x-6">
            <div>
              <p className="text-xs text-gray-500">Last Month</p>
              <p className="text-sm font-medium text-gray-700">
                {lastMonthData ? formatCurrency(lastMonthData.primaryRevenue + lastMonthData.secondaryRevenue) : '$0'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Running Month</p>
              <p className="text-sm font-medium text-gray-700">
                {currentMonthData ? formatCurrency(currentMonthData.primaryRevenue + currentMonthData.secondaryRevenue) : '$0'}
              </p>
            </div>
          </div> */}
        </div>
      </div>

      <div className="h-64 w-full">
        <Bar 
          data={chartData} 
          options={chartOptions}
          plugins={[{
            id: 'customYAxisLabels',
            afterDraw: (chart) => {
              const ctx = chart.ctx;
              const yAxis = chart.scales.y;
              const yLabels = ['0K', '200K', '400K', '600K', '800K'];
              
              yLabels.forEach((label, i) => {
                const y = yAxis.getPixelForValue(i * 200000);
                ctx.fillStyle = '#6b7280';
                ctx.textAlign = 'right';
                ctx.fillText(label, yAxis.left - 10, y + 4);
              });
            }
          }]}
        />
      </div>
    </div>
  );
};

export default RevenueDashboard;