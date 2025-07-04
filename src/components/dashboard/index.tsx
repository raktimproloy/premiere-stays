import AdminLayout from "@/components/layout/AdminLayout";
import Image from "next/image";
import RevenueChart from "./RevenueDashboard";
import BookingSourcesChart from "./BookingSourcesChart";
import BookingCalendar from "./BookingCalendar";
import OwnerStatementsTable from "./OwnerStatementsTable";

const BookingImage = "/images/booking.png"
const RevenueImage = "/images/revenue.png"
const RateImage = "/images/rate.png"
const CustomerImage = "/images/customer.png"

export default function Index() {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>
        
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Bookings" value="134+" icon={BookingImage} background="#475BE81A" />
                <StatCard title="Revenue Generated" value="$5,460" icon={RevenueImage} background="#FD85391A" />
                <StatCard title="Occupancy Rate" value="90%" icon={RateImage} background="#2ED4801A" />
                <StatCard title="Total Customer" value="12,00+" icon={CustomerImage} background="#FE6D8E1A" />
                </div>
                <div className="">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 space-y-6">
                      <div className="md:col-span-3">
                      <RevenueChart />
                    </div>
                    <div className="md:col-span-2 mb-6">
                      <BookingCalendar />
                    </div>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 space-y-6">
                    <div className="md:col-span-2 mt-6 md:mt-0">
                      <BookingSourcesChart />
                    </div>
                    <div className="md:col-span-3">
                      <OwnerStatementsTable />
                    </div>
                  </div>
                </div>
            </div>
        </AdminLayout>
    );
  }
  
  // StatCard component
  function StatCard({ title, value, icon, background }: { title: string; value: string; icon:string; background: string }) {
    
    return (
        <div className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
            <div className="">
                <h3 className="text-[#4E5258] text-sm font-medium mb-3">{title}</h3>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div 
              className="w-14 h-14 flex items-center justify-center rounded-full" 
              style={{ backgroundColor: background }} 
            >
                <Image src={icon} alt="" width={28} height={28} quality={100} />
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
