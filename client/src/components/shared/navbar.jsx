"use client";

import { useState } from "react";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, LogIn } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Clients", href: "#clients" },
    { name: "Contact", href: "#contact" },
  ];

  const navContent = (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
                     <div className="flex items-center">
             <Link href="/" className="flex items-center space-x-2">
               <Leaf className="h-8 w-8 text-[#106934]" />
               <span className="text-xl font-bold text-[#106934]">
                 Alpha Environmental Systems
               </span>
             </Link>
           </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Links */}
                         <div className="flex items-center space-x-4">
               {navItems.map((item) => (
                 <Link
                   key={item.name}
                   href={item.href}
                   className="relative text-gray-700 hover:text-[#106934] transition-colors duration-200 px-3 py-2 group"
                   onClick={(e) => {
                     if (item.href.startsWith("#")) {
                       e.preventDefault();
                       document.querySelector(item.href)?.scrollIntoView({
                         behavior: "smooth",
                       });
                     }
                   }}
                 >
                   {item.name}
                   <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#106934] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"></span>
                 </Link>
               ))}
             </div>

                         {/* Separator */}
             <div className="h-6 w-px bg-border mx-4"></div>

            {/* Auth and CTA Buttons */}
            <div className="flex items-center space-x-3">
                             <Link href="/auth/signin">
                 <Button variant="ghost" size="sm" className="!text-[#106934] hover:!bg-[#106934] hover:!text-white bg-transparent">
                   <LogIn className="h-4 w-4 mr-2" />
                   Sign In
                 </Button>
               </Link>
              <Link href="/quotation">
                <ShimmerButton>Get Quote</ShimmerButton>
              </Link>
            </div>
          </div>

                     {/* Mobile menu button */}
           <div className="md:hidden flex items-center">
             <button
               onClick={() => setIsOpen(!isOpen)}
               className="text-gray-700 hover:text-[#106934]"
             >
               {isOpen ? (
                 <X className="h-6 w-6" />
               ) : (
                 <Menu className="h-6 w-6" />
               )}
             </button>
           </div>
        </div>

                 {/* Mobile Navigation */}
         {isOpen && (
           <div className="md:hidden">
             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
               {navItems.map((item) => (
                 <Link
                   key={item.name}
                   href={item.href}
                   className="relative block px-3 py-2 text-gray-700 hover:text-[#106934] transition-colors duration-200 group"
                   onClick={() => setIsOpen(false)}
                 >
                   {item.name}
                   <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#106934] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"></span>
                 </Link>
               ))}
              <div className="px-3 py-2 space-y-2">
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    className="w-full justify-start !text-[#106934] hover:!bg-[#106934] hover:!text-white bg-transparent"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/quotation" className="block">
                  <ShimmerButton className="w-full">Get Quote</ShimmerButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      {navContent}
    </nav>
  );
}
