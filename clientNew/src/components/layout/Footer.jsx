import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Our Services", href: "#services" },
        { name: "Our Clients", href: "#clients" },
        { name: "Careers", href: "#" },
        { name: "Contact Us", href: "#contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Environmental Impact Assessment", href: "#" },
        { name: "Water & Wastewater Management", href: "#" },
        { name: "Waste Management Solutions", href: "#" },
        { name: "Air Quality Monitoring", href: "#" },
        { name: "Sustainability Consulting", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="/images/logo.svg"
                alt="Alpha Environmental Systems"
                className="h-10 w-auto"
              />
              <span className="ml-3 font-bold text-xl text-white">
                Alpha Environmental
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Professional environmental consulting services helping businesses
              meet regulatory requirements with confidence since 1994.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  The Persimmon Condominium - Tower 3, Cebu City, Philippines
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  (032) 513-5081 | 09494782611
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  admin@alphaenvi.onmicrosoft.com
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex justify-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Alpha Environmental Systems Corporation. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
