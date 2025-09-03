"use client";

import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Users, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeIn = (direction = "up", delay = 0) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : 0,
      x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return {
    variants,
    initial: "hidden",
    whileInView: "visible",
    transition: { duration: 0.8, delay, ease: [0.25, 0.25, 0.25, 1] },
    viewport: { once: true, amount: 0.4 },
  };
};

export default function Hero() {
  return (
    <section className="pt-16 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
              {...fadeIn("up", 0)}
            >
              Your Partner in{" "}
              <span className="text-[#106934]">Environmental Compliance</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 leading-relaxed"
              {...fadeIn("up", 0.2)}
            >
              Alpha Environmental Systems Corporation is a professional
              consulting firm that helps businesses meet environmental
              requirements with confidence. Our client platform makes it easy to
              submit documents, track permit progress, and stay informed — all
              while backed by expert support every step of the way.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              {...fadeIn("up", 0.4)}
            >
              <Link href="/quotation">
                <Button size="lg" className="group bg-[#106934] hover:bg-[#106934]/90 text-white">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#about">
                <Button variant="outline" size="lg" className="!border-[#106934] !text-[#106934] hover:!bg-[#106934] hover:!text-white bg-transparent">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8"
              {...fadeIn("up", 0.6)}
            >
              {[
                { icon: Shield, value: 15, label: "Years Experience" },
                { icon: Award, value: 500, label: "Projects Completed" },
                { icon: Users, value: 200, label: "Happy Clients" },
              ].map(({ icon: Icon, value, label }, index) => (
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 text-[#106934] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    <NumberTicker value={value} delay={500 + index * 100} />+
                  </div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right image */}
          <motion.div className="relative" {...fadeIn("right", 0.2)}>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/illustrations/quote1.svg"
                alt="Environmental consulting team"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg"
              {...fadeIn("left", 0.4)}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
