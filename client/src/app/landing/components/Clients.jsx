"use client"

import { useState, useEffect } from "react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { motion } from "framer-motion"

export default function Clients() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  const clients = [
    { name: "EcoTech Industries", logo: "/images/clients/1.png" },
    { name: "Green Solutions Corp", logo: "/images/clients/2.png" },
    { name: "Sustainable Energy Co", logo: "/images/clients/3.png" },
    { name: "CleanWater Systems", logo: "/images/clients/4.png" },
    { name: "Environmental Partners", logo: "/images/clients/5.png" },
    { name: "GreenBuild Construction", logo: "/images/clients/6.png" },
    { name: "Renewable Resources Ltd", logo: "/images/clients/7.png" },
    { name: "EcoManufacturing Inc", logo: "/images/clients/8.png" },
    { name: "Advanced Materials Corp", logo: "/images/clients/9.png" },
    { name: "Sustainable Logistics", logo: "/images/clients/10.png" },
    { name: "Clean Energy Solutions", logo: "/images/clients/11.png" },
  ]

  return (
    <section id="clients" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.25, 0.25, 1] }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Trusted by Industry Leaders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.25, 0.25, 1] }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We're proud to partner with forward-thinking organizations committed to environmental excellence and
            sustainable business practices.
          </motion.p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {clients.map((client, index) => {
            const MotionDiv = isClient ? motion.div : 'div'
            return (
              <MotionDiv
                key={index}
                {...(isClient ? {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-50px" },
                  transition: { duration: 0.5, delay: 0.05 * index, ease: [0.25, 0.25, 0.25, 1] }
                } : {})}
                className="group relative aspect-square flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={client.logo || "/images/clients/1.png"}
                  alt={`${client.name} logo`}
                  className="h-8 md:h-10 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                  {client.name}
                </div>
              </MotionDiv>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.25, 0.25, 1] }}
          className="mt-16 bg-[#106934]/5 rounded-2xl p-8 md:p-12"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Growing Network of Satisfied Clients</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              From startups to Fortune 500 companies, we've helped organizations across industries achieve their
              environmental goals and regulatory compliance.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.25, 0.25, 1] }}
              >
                <div className="text-3xl font-bold text-[#106934] mb-2">
                  <NumberTicker value={200} />+
                </div>
                <div className="text-gray-600">Happy Clients</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.25, 0.25, 1] }}
              >
                <div className="text-3xl font-bold text-[#106934] mb-2">
                  <NumberTicker value={98} />%
                </div>
                <div className="text-gray-600">Client Satisfaction</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.25, 0.25, 1] }}
              >
                <div className="text-3xl font-bold text-[#106934] mb-2">
                  <NumberTicker value={15} />+
                </div>
                <div className="text-gray-600">Industries Served</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
