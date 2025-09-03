import Link from "next/link"
import { Leaf, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-[#106934]" />
              <span className="text-xl font-bold text-[#106934]">Alpha Environmental</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Established by Engr. Alex Eslawan, the firm has been serving Cebu's industry leaders since 1994. We ensure companies follow regulations set by the Philippines to keep a healthy and livable environment.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold mb-4 text-[#106934]">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-3 text-gray-600">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#106934]" />
                <div>
                  <p className="text-sm">The Persimmon Condominium - Tower 3</p>
                  <p className="text-sm">Cebu City, Philippines</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-gray-600">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#106934]" />
                <div className="space-y-1">
                  <p className="text-sm">09494782611 - Viber/Wechat</p>
                  <p className="text-sm">09061228371 - Viber</p>
                  <p className="text-sm">(032) 513-5081 - Landline</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-gray-600">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#106934]" />
                <div className="space-y-1">
                  <p className="text-sm break-all">admin@alphaenvi.onmicrosoft.com</p>
                  <p className="text-sm break-all">Engrann@alphaenvi.onmicrosoft.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Alpha Environmental Systems Corporation. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-[#106934] transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-[#106934] transition-colors font-medium">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-[#106934] transition-colors font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
