"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, LogIn, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services", dropdown: [
      { name: "Environmental Consulting", href: "#environmental-consulting" },
      { name: "Permit Acquisition", href: "#permit-acquisition" },
      { name: "Compliance Management", href: "#compliance-management" },
    ]},
    { name: "Clients", href: "#clients" },
    { name: "Contact", href: "#contact" },
  ];

  // Function to determine if a nav item is active
  const isActive = (href) => {
    if (href.startsWith('#')) return false;
    return pathname === href;
  };

  // Function to handle smooth scrolling
  const handleScroll = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const navContent = (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105">
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
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center relative text-gray-700 hover:text-[#106934] transition-colors duration-200 px-3 py-2 group ${
                      isActive(item.href) ? 'text-[#106934] font-semibold' : ''
                    }`}
                    onClick={(e) => handleScroll(e, item.href)}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-[#106934] transform ${
                      isActive(item.href) ? 'scale-x-100' : 'scale-x-0'
                    } group-hover:scale-x-100 transition-transform duration-200 ease-out`}></span>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div className="absolute z-10 left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-1 bg-white rounded-md shadow-lg border border-gray-200">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#106934]"
                            onClick={(e) => {
                              setIsOpen(false);
                              handleScroll(e, subItem.href);
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                 <div key={item.name}>
                   <div className="flex items-center justify-between">
                     <Link
                       href={item.href}
                       className={`relative block px-3 py-2 text-gray-700 hover:text-[#106934] transition-colors duration-200 group ${
                         isActive(item.href) ? 'text-[#106934] font-semibold' : ''
                       }`}
                       onClick={(e) => {
                         handleScroll(e, item.href);
                         if (!item.dropdown) setIsOpen(false);
                       }}
                     >
                       {item.name}
                       <span className={`absolute bottom-1 left-3 right-3 h-0.5 bg-[#106934] transform ${
                         isActive(item.href) ? 'scale-x-100' : 'scale-x-0'
                       } group-hover:scale-x-100 transition-transform duration-200 ease-out`}></span>
                     </Link>
                     {item.dropdown && (
                       <button 
                         onClick={() => {
                           const element = document.getElementById(`dropdown-${item.name}`);
                           element.classList.toggle('hidden');
                         }}
                         className="px-2 py-1 text-gray-500 hover:text-[#106934]"
                       >
                         <ChevronDown className="h-4 w-4" />
                       </button>
                     )}
                   </div>
                   
                   {item.dropdown && (
                     <div id={`dropdown-${item.name}`} className="hidden ml-4 mt-1 border-l-2 border-[#10693420] pl-2">
                       {item.dropdown.map((subItem) => (
                         <Link
                           key={subItem.name}
                           href={subItem.href}
                           className="block px-3 py-2 text-sm text-gray-700 hover:text-[#106934]"
                           onClick={(e) => {
                             handleScroll(e, subItem.href);
                             setIsOpen(false);
                           }}
                         >
                           {subItem.name}
                         </Link>
                       ))}
                     </div>
                   )}
                 </div>
               ))}
              <div className="px-3 py-2 space-y-2 mt-4">
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
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-sm shadow-lg' 
          : 'bg-white shadow-lg'
      }`}
    >
      {navContent}
    </nav>
  );
}
