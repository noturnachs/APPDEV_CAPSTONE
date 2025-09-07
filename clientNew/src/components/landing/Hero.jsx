import { useState, useEffect } from "react";
import NumberTicker from "../../components/ui/NumberTicker";
import Button from "../../components/ui/Button";
import {
  ArrowRight,
  Shield,
  Award,
  Users,
  Leaf,
  ChevronDown,
} from "lucide-react";

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e6f0eb] to-[#edf5ff]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/images/illustrations/quote1.svg')] bg-no-repeat bg-right-top opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#106934]/10"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#106934]/5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-[#106934]/10 text-[#106934] font-medium rounded-full text-sm mb-2">
              Environmental Consulting Services
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Your Partner in{" "}
              <span className="text-[#106934] relative">
                Environmental Compliance
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#106934]/30 rounded-full"></span>
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Alpha Environmental Systems Corporation is a professional
              consulting firm that helps businesses meet environmental
              requirements with confidence. Our client platform makes it easy to
              submit documents, track permit progress, and stay informed — all
              while backed by expert support every step of the way.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="group bg-[#106934] hover:bg-[#0d5429] text-white font-bold tracking-wide shadow-md"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#106934] text-[#106934] hover:bg-[#106934] hover:text-white font-bold tracking-wide"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              {[
                { icon: Shield, value: 15, label: "Years Experience" },
                { icon: Award, value: 500, label: "Projects Completed" },
                { icon: Users, value: 200, label: "Happy Clients" },
              ].map(({ icon: Icon, value, label }, index) => (
                <div key={index} className="relative">
                  <div className="absolute -top-2 -left-2">
                    <Icon className="h-8 w-8 text-[#106934]/20" />
                  </div>
                  <div className="pl-4">
                    <div className="text-3xl font-bold text-[#106934]">
                      <NumberTicker value={value} delay={500 + index * 100} />+
                    </div>
                    <div className="text-sm text-gray-600">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="/images/illustrations/quote1.svg"
                  alt="Environmental consulting team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#106934]/10 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-[#106934]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Certified Experts
                    </div>
                    <div className="text-sm text-gray-600">
                      ISO 14001 Compliant
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/4 -right-12 w-24 h-24 bg-[#106934]/10 rounded-full"></div>
            <div className="absolute -z-10 bottom-1/4 -left-8 w-16 h-16 bg-[#106934]/10 rounded-full"></div>
            <div className="absolute -z-10 top-1/2 left-1/2 w-32 h-32 bg-[#106934]/5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer transition-opacity duration-500 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
        onClick={scrollToAbout}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">
            Scroll to learn more
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-[#106934] flex items-center justify-center animate-bounce">
            <ChevronDown className="h-5 w-5 text-[#106934]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
