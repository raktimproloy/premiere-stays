// app/admin/dashboard/page.tsx
import AdminLayout from "@/components/layout/AdminLayout";

export default function DashboardPage() {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>
        
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Bookings" value="134+" />
                <StatCard title="Revenue Generated" value="$5,460" />
                <StatCard title="Occupancy Rate" value="90%" />
                <StatCard title="Total Customer" value="12,00+" />
                </div>
        
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TotalRevenueCard />
                    <BookingCalendar />
                </div>
                
                <div className="space-y-6">
                    <BookingSources />
                    <OwnerStatements />
                </div>
                </div>
            </div>
        </AdminLayout>
    );
  }
  
  // StatCard component
  function StatCard({ title, value }: { title: string; value: string }) {
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    );
  }
  
  // Total Revenue Card
  function TotalRevenueCard() {
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">$156,135</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
              Last Month
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Running Month
            </button>
          </div>
        </div>
        <div className="mt-4 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Revenue chart visualization</span>
        </div>
      </div>
    );
  }
  
  // Booking Calendar
  function BookingCalendar() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dates = [
      ['26', '27', '28', '29', '30', '31', ''],
      ['2', '3', '4', '5', '6', '7', '8'],
      ['9', '10', '11', '12', '13', '14', '15'],
      ['16', '17', '18', '19', '20', '21', '22'],
      ['23', '24', '25', '26', '27', '28', '29'],
      ['31', '1', '2', '3', '4', '5', '6']
    ];
  
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Calendar</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {dates.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((date, dateIndex) => (
                  <div 
                    key={dateIndex} 
                    className={`h-12 flex items-center justify-center rounded ${
                      date ? 'bg-gray-50 hover:bg-blue-50' : ''
                    } ${
                      date === '15' ? 'border-2 border-blue-500' : ''
                    }`}
                  >
                    {date}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Booking Sources
  function BookingSources() {
    const sources = [
      { name: 'Airbnb', percentage: 60 },
      { name: 'VRBO', percentage: 30 },
      { name: 'Direct', percentage: 10 }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Sources</h3>
        <div className="space-y-4">
          {sources.map((source, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{source.name}</span>
                <span className="text-gray-500">{source.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Owner Statements
  function OwnerStatements() {
    const statements = [
      { date: 'Mar 2025', amount: '$2,250', status: 'Paid' },
      { date: 'Apr 2025', amount: '$2,250', status: 'Paid' },
      { date: 'Jan 2025', amount: '$2,250', status: 'Paid' },
      { date: 'Mar 2025', amount: '$2,250', status: 'Paid' }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Owner Statements</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-2">Statement Date</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {statements.map((statement, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-sm">{statement.date}</td>
                  <td className="py-3 font-medium">{statement.amount}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
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
  }