import { MapPin, Phone, Mail, Clock, ArrowRight, Send } from "lucide-react";
import Button from "../../components/ui/Button";

const Contact = () => {
  // Contact information
  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Location",
      details: [
        "The Persimmon Condominium - Tower 3",
        "Cebu City, Philippines",
      ],
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "09494782611 - Viber/Wechat",
        "09061228371 - Viber",
        "(032) 513-5081 - Landline",
      ],
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "admin@alphaenvi.onmicrosoft.com",
        "Engrann@alphaenvi.onmicrosoft.com",
      ],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 12:00 PM",
        "Sunday: Closed",
      ],
    },
  ];

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-[#f8f9fa]">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#e6f0eb] opacity-60"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#e6f0eb] opacity-60"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-[#106934] opacity-20"></div>
        <div className="absolute top-1/4 right-1/3 w-6 h-6 rounded-full bg-[#106934] opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full bg-[#106934] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 bg-[#106934]/10 text-[#106934] font-medium rounded-full text-sm mb-4">
            Contact Us
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get in touch with our{" "}
            <span className="text-[#106934]">experts</span>
          </h2>
          <p className="text-lg text-gray-600">
            Have questions about our environmental consulting services? Our team
            is ready to help you navigate regulatory requirements and find
            sustainable solutions.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="group">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:bg-[#106934] group-hover:text-white transition-colors duration-300">
                    <info.icon className="h-6 w-6 text-[#106934] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {info.title}
                  </h4>
                  <div className="space-y-2">
                    {info.details.map((detail, detailIndex) => (
                      <p
                        key={detailIndex}
                        className={`text-gray-600 ${
                          info.title === "Email Addresses"
                            ? "text-sm break-all"
                            : "text-sm"
                        }`}
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row">
          <div className="md:w-5/12 bg-[#106934] p-10 text-white">
            <h3 className="text-2xl font-bold mb-6">
              Let's discuss your project
            </h3>
            <p className="mb-8 text-white/80">
              Fill out the form and our team will get back to you within 24
              hours.
            </p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <Phone className="h-5 w-5" />
                </div>
                <span>(032) 513-5081</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <Mail className="h-5 w-5" />
                </div>
                <span>admin@alphaenvi.onmicrosoft.com</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>Cebu City, Philippines</span>
              </div>
            </div>
          </div>
          <div className="md:w-7/12 p-10">
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#106934] focus:border-[#106934] outline-none transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#106934] focus:border-[#106934] outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#106934] focus:border-[#106934] outline-none transition"
                  placeholder="How can we help?"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#106934] focus:border-[#106934] outline-none transition"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <Button className="bg-[#106934] hover:bg-[#0d5429] text-white font-medium px-6">
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
