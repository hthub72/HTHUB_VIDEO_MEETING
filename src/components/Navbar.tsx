  "use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Home, Calendar, FileText, User, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>
      <nav className={`fixed left-0 top-0 h-full bg-gray-200 shadow-lg flex flex-col items-center justify-between py-6 transition-all duration-300 ease-in-out ${isOpen ? 'w-40' : 'w-0 md:w-16'} overflow-hidden`}>
        <div className="space-y-8 w-full px-2">
          <div className="flex justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
                  <User className="w-6 h-6 text-gray-600" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-12 h-12"
                  }
                }}
              />
            </SignedIn>
          </div>
          <NavItem href="/" icon={<Home className="w-5 h-5" />} label="New Meeting" />
          <NavItem href="/meetings" icon={<Calendar className="w-5 h-5" />} label="Meetings" />
          <NavItem href="/curriculum" icon={<FileText className="w-5 h-5" />} label="Curriculum" />
        </div>
      </nav>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link href={href} className="block group relative">
      <div className="flex flex-col items-center">
        <div className="p-2.5 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all duration-200 ease-in-out group-hover:bg-blue-50">
          {icon}
        </div>
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out whitespace-nowrap">
          {label}
        </span>
      </div>
    </Link>
  );
}