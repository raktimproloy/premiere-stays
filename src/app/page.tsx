import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      {/* Navbar */}
      <nav className="flex justify-center gap-8 mb-8 border-b border-gray-300 pb-4">
        <Link
          href="/signup"
          className="text-lg font-medium text-gray-700 hover:text-gray-900"
        >
          Signup
        </Link>
        <Link
          href="/login"
          className="text-lg font-medium text-gray-700 hover:text-gray-900"
        >
          Login
        </Link>
        <Link
          href="/admin/dashboard"
          className="text-lg font-medium text-gray-700 hover:text-gray-900"
        >
          Admin Dashboard
        </Link>
        <Link
          href="/superadmin/dashboard"
          className="text-lg font-medium text-gray-700 hover:text-gray-900"
        >
          Super Admin Dashboard
        </Link>
      </nav>

      <main className=" text-center font-bold">
        <h2>Admin Login</h2>
        <p>Email: admin@example.com</p>
        <p>Password: password123</p>
        <br />
        <h2>Super Admin Login</h2>
        <p>Email: superadmin@example.com</p>
        <p>Password: password123</p>
      </main>
    </div>
  );
}
