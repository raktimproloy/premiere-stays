import { useAuth } from '@/components/common/AuthContext';
import Image from 'next/image';
import React from 'react'
import { FiHome, FiCalendar, FiDollarSign, FiUsers, FiSettings, FiMenu, FiX, FiLogOut, FiPieChart } from 'react-icons/fi';

const Logo = "/images/logo.png"
const Dashboard = "/images/icons/dashboard.svg"
const Property = "/images/icons/property.svg"
const Booking = "/images/icons/booking.svg"
const Calendar = "/images/icons/calendar.svg"
const Analytics = "/images/icons/analytics.svg"
const Reviews = "/images/icons/reviews.svg"
const Profile = '/images/icons/user.svg'
const Settings = '/images/icons/setting.svg'
const Help = '/images/icons/help.svg'

export default function Sidebar({sidebarOpen}: { sidebarOpen: boolean }) {
    const { isAuthenticated, logout } = useAuth();
  return (
    <aside 
    className={`fixed inset-y-0 left-0 z-30 w-64 bg-white text-black transition-transform duration-300 ease-in-out transform shadow-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:z-auto`}
  >
    <div className="flex flex-col h-full">
      <div className="p-4">
        {/* <h1 className="text-xl font-bold flex items-center gap-2">
          <FiPieChart className="text-blue-400" />
          Admin Panel
        </h1> */}
        <Image src={Logo} alt='logo' width={157} height={70} ></Image>
      </div>
      
      <nav className="flex-1 p-4 pb-0">
        <ul className="space-y-2">
          <NavItem icon={Dashboard} active>
            Dashboard
          </NavItem>
          <NavItem icon={Property}>
            Manage Property
          </NavItem>
          <NavItem icon={Booking}>
            Bookings
          </NavItem>
          <NavItem icon={Calendar}>
            Calendar
          </NavItem>
          <NavItem icon={Analytics}>
            Analytics
          </NavItem>
          <NavItem icon={Reviews}>
            Reviews
          </NavItem>
        </ul>
      </nav>

      <p className='m-4 pb-2 text-sm text-[#969FB7] border-b-2 font-medium border-[#CDD7F1]'>ADMIN PORTAL</p>
      <nav className="flex-1 p-4 pt-0">
        <ul className="space-y-2">
          <NavItem icon={Profile}>
            Profile
          </NavItem>
          <NavItem icon={Settings}>
            Settings
          </NavItem>
          <NavItem icon={Help}>
            Help
          </NavItem>
        </ul>
      </nav>
      <p className='m-4 mt-0 pt-2 text-sm text-center text-[#4E5258] border-t-2 font-medium border-[#CDD7F1]'>Copyright ©2025. <br/> PremierestaysMiami. All Rights <br/>Reserved.</p>
      {/* <div className="p-4 border-t border-gray-700">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-700"
        >
          <FiLogOut />
          Logout
        </button>
        
      </div> */}
    </div>
  </aside>
  )
}


// NavItem component
function NavItem({ 
    children, 
    icon,
    active = false
  }: { 
    children: React.ReactNode, 
    icon: string,
    active?: boolean 
  }) {
    return (
      <li>
<a 
  href="#" 
  className={`flex items-center text-[#1E293B] gap-3 p-3 rounded-lg transition-colors nav-item-after-bar ${
    active 
      ? 'bg-[#EBA83A] text-[#1E293B] active' 
      : 'hover:bg-[#EBA83A] hover:text-[#1E293B]'
  }`}
>
          <Image src={icon} alt='icon' width={22} height={22}></Image>
          <span>{children}</span>
        </a>
      </li>
    );
  }
