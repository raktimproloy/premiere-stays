'use client';

import React from 'react';

interface Statement {
  statementDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const OwnerStatementsTable = () => {
  // Sample data - replace with your API data
  const statements: Statement[] = [
    { statementDate: 'Mar 2025', amount: 2250, status: 'Paid' },
    { statementDate: 'Apr 2025', amount: 2250, status: 'Paid' },
    { statementDate: 'Jan 2025', amount: 2250, status: 'Paid' },
    { statementDate: 'Mar 2025', amount: 2250, status: 'Paid' },
    // Add more statements as needed
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Owner Statements</h2>
      
      <div className="overflow-x-auto rounded-t-xl">
        <table className="min-w-full divide-y divide-gray-200 rounded-t-xl">
          <thead className="bg-[#F3F0FF]">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">
                Statement Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statements.map((statement, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {statement.statementDate}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(statement.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(statement.status)}`}>
                    {statement.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerStatementsTable;
