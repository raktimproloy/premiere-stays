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
  // Add other booking properties as needed
}

interface ApiResponse {
  items: Booking[];
  limit: number;
  next_page_url?: string;
  offset: number;
}

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
        const response = await fetch('/api/bookings?since=2025-01-01T00:00:00Z&limit=50');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setBookings(data.items);
        console.log('Booking data:', data);

        // Calculate statistics
        const activeBookings = data.items.filter(b => b.status === 'active');
        const totalBookings = activeBookings.length;
        
        // In a real app, you would calculate these based on your business logic
        const occupancyRate = calculateOccupancyRate(activeBookings);
        const revenueGenerated = calculateRevenue(activeBookings);

        setStats({
          occupancyRate,
          revenueGenerated,
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

  // Mock calculation functions - replace with your actual business logic
  const calculateOccupancyRate = (bookings: Booking[]): string => {
    // This should be replaced with your actual occupancy calculation
    const occupiedDays = bookings.reduce((total, booking) => {
      const arrival = new Date(booking.arrival);
      const departure = new Date(booking.departure);
      const days = (departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24);
      return total + days;
    }, 0);
    
    // Assuming 10 properties available
    const totalPossibleDays = 10 * 365; // 10 properties * 365 days
    const rate = (occupiedDays / totalPossibleDays) * 100;
    return `${Math.round(rate)}%`;
  };

  const calculateRevenue = (bookings: Booking[]): number => {
    // This should be replaced with your actual revenue calculation
    // For now, we'll just return a mock value
    return bookings.length * 500; // $500 per booking as example
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Bookings" 
            value={loading ? "Loading..." : `${stats.totalBookings}+`} 
            icon={BookingImage} 
            background="#475BE81A" 
          />
          <StatCard 
            title="Revenue Generated" 
            value={loading ? "Loading..." : `$${stats.revenueGenerated.toLocaleString()}`} 
            icon={RevenueImage} 
            background="#FD85391A" 
          />
          <StatCard 
            title="Occupancy Rate" 
            value={stats.occupancyRate} 
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
              <BookingCalendar />
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