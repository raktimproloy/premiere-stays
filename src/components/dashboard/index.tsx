// app/dashboard/page.tsx
'use client';
import AdminLayout from "@/components/layout/AdminLayout";
import Image from "next/image";
import RevenueChart from "./RevenueDashboard";
import BookingSourcesChart from "./BookingSourcesChart";
import BookingCalendar from "./BookingCalendar";
import OwnerStatementsTable from "./OwnerStatementsTable";
import { useEffect, useState } from "react";

const BookingImage = "/images/booking.png";
const RevenueImage = "/images/revenue.png";
const RateImage = "/images/rate.png";
const CustomerImage = "/images/customer.png";

interface Booking {


  id: number;
  arrival: string;
  departure: string;
  status: string;
  property: {
    id: number;
    name: string;
  };
  currency_code: string;
  platform_reservation_number: string;
  listing_site: string;
  is_block: boolean;
  notes?: string;
  amounts?: {
    total?: number;
  };
}

interface ApiResponse {
  items: Booking[];
  limit: number;
  next_page_url?: string;
  offset: number;
}

// Currency conversion rates (simplified - use real API in production)
const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.51,
};

export default function Index() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    occupancyRate: "0%",
    revenueGenerated: 0,
    totalBookings: 0,
    totalCustomers: "1,200+"
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Get current month dates
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Format dates for API
        const startDate = firstDayOfMonth.toISOString().split('T')[0];
        const endDate = lastDayOfMonth.toISOString().split('T')[0];
        
        // Use default since_utc value of 2025-01-01T00:00:00Z
        const response = await fetch(
          `/api/bookings?start_date=${startDate}&end_date=${endDate}&since_utc=2025-01-01T00:00:00Z`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setBookings(data.items);
        console.log('Booking data:', data);

        // Calculate statistics
        const { totalBookings, totalRevenue, totalNights } = calculateMonthlyStats(data.items);
        const propertyCount = parseInt(process.env.NEXT_PUBLIC_PROPERTY_COUNT || '1');
        const occupancyRate = calculateOccupancyRate(
          totalNights, 
          propertyCount, 
          firstDayOfMonth, 
          lastDayOfMonth
        );

        setStats({
          occupancyRate: `${occupancyRate}%`,
          revenueGenerated: totalRevenue,
          totalBookings,
          totalCustomers: "1,200+" // This would need actual calculation
        });

      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate monthly statistics
  const calculateMonthlyStats = (bookings: Booking[]) => {
    let totalBookings = 0;
    let totalRevenue = 0;
    let totalNights = 0;

    bookings.forEach(booking => {
      // Calculate booking nights
      const arrival = new Date(booking.arrival);
      const departure = new Date(booking.departure);
      const nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
      
      // Convert currency to USD
      const rate = CURRENCY_RATES[booking.currency_code] || 1;
      const revenueUSD = (booking.amounts?.total ?? 0) * rate;
      
      totalBookings++;
      totalRevenue += revenueUSD;
      totalNights += nights;
    });

    return { totalBookings, totalRevenue, totalNights };
  };

  // Calculate occupancy rate
  const calculateOccupancyRate = (
    bookedNights: number, 
    propertyCount: number,
    start: Date,
    end: Date
  ) => {
    if (propertyCount === 0) return 0;
    
    // Calculate days in month
    const daysInMonth = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalPossibleNights = propertyCount * daysInMonth;
    
    return Math.round((bookedNights / totalPossibleNights) * 100);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Bookings" 
            value={loading ? "Loading..." : `${stats.totalBookings}`} 
            icon={BookingImage} 
            background="#475BE81A" 
          />
          <StatCard 
            title="Revenue Generated" 
            value={loading ? "Loading..." : `$${stats.revenueGenerated.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} 
            icon={RevenueImage} 
            background="#FD85391A" 
          />
          <StatCard 
            title="Occupancy Rate" 
            value={loading ? "Loading..." : stats.occupancyRate} 
            icon={RateImage} 
            background="#2ED4801A" 
          />
          <StatCard 
            title="Total Customers" 
            value={stats.totalCustomers} 
            icon={CustomerImage} 
            background="#FE6D8E1A" 
          />
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-medium">Error loading booking data</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Try again
            </button>
          </div>
        )}

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 space-y-6">
            <div className="md:col-span-3">
              <RevenueChart/>
            </div>
            <div className="md:col-span-2 mb-6">
              <BookingCalendar bookings={bookings} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 space-y-6">
            <div className="md:col-span-2 mt-6 md:mt-0">
              <BookingSourcesChart bookings={bookings} />
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
function StatCard({ title, value, icon, background }: { 
  title: string; 
  value: string; 
  icon: string; 
  background: string 
}) {
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
        <Image 
          src={icon} 
          alt={title} 
          width={28} 
          height={28} 
          quality={100} 
          className="object-contain"
        />
      </div>
    </div>
  );
}