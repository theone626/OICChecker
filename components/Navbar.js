import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-purple-600">
                Verified Tax Resolution
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600">
                OIC Checker
              </Link>
              <Link href="/about" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-purple-600">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 