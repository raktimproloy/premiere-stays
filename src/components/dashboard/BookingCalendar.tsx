'use client';

import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';

// interface RevenueChartProps {
//   bookings: Booking[];
// }

const BookingCalendar = () => {
  const today = new Date();
  const currentYear = today.getFullYear()
  const presentMonth = today.getMonth() + 1
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(currentYear, today.getMonth(), 1)); // First day of current month

  // Generate days for the current month view
  const generateDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);

    // Adjust to show full weeks (including days from previous/next month)
    startDate.setDate(monthStart.getDate() - getDay(monthStart));
    endDate.setDate(monthEnd.getDate() + (6 - getDay(monthEnd)));

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const days = generateDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Sample booking data - replace with your actual data
  const bookings = [
    new Date(2025, 6, 12),
    new Date(2025, 6, 20),
    new Date(2025, 6, 21)
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 pb-0 md:pb-9">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Booking Calendar</h2>
        <div className="flex items-center space-x-4 text-sm md:text-md">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium text-gray-700">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2 text-xs sm:text-sm border-b-2 border-[#EBEBFF] mb-4">
            {day}
          </div>
        ))}

        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isBooked = bookings.some(bookingDate => isSameDay(day, bookingDate));
          const isToday = isSameDay(day, today);

          // Determine styles
          let bgColor = '';
          let textColor = '';
          let borderColor = '';

          if (isToday) {
            bgColor = 'bg-[#586DF7]';
            textColor = 'text-[#FFFFFF]';
            borderColor = 'border-[#586DF7]';
          } else if (isBooked) {
            bgColor = 'bg-[#00CC9133]';
            textColor = 'text-[#00CC91]';
            borderColor = 'border-[#00CC91]';
          } else {
            bgColor = 'bg-white';
            textColor = isCurrentMonth ? 'text-gray-800' : 'text-gray-400';
            borderColor = 'border-gray-100';
          }

          return (
            <div
              key={i}
              className={`p-1 flex justify-center`}
            >
              <div className={`p-2 h-7 w-7 sm:h-8 sm:w-8 border text-center rounded-full ${bgColor} ${textColor} ${borderColor}`}>
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={`text-xs sm:text-sm ${isCurrentMonth ? 'font-medium' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
