"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Droplets, Recycle, Wind, TreePine, Building, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function Services() {
  const services = [
    {
      icon: FileText,
      title: "Environmental Impact Assessment",
      description: "Comprehensive evaluation of potential environmental effects of proposed projects and developments.",
      features: ["EIA Studies", "Risk Assessment", "Mitigation Planning", "Regulatory Compliance"],
    },
    {
      icon: Droplets,
      title: "Water & Wastewater Management",
      description: "Expert solutions for water quality monitoring, treatment systems, and wastewater management.",
      features: ["Water Quality Testing", "Treatment Design", "Monitoring Systems", "Compliance Reporting"],
    },
    {
      icon: Recycle,
      title: "Waste Management Solutions",
      description:
        "Sustainable waste management strategies to minimize environmental impact and maximize resource recovery.",
      features: ["Waste Audits", "Recycling Programs", "Disposal Solutions", "Zero Waste Planning"],
    },
    {
      icon: Wind,
      title: "Air Quality Monitoring",
      description: "Advanced air quality assessment and monitoring services to ensure clean air standards.",
      features: ["Emission Testing", "Air Quality Monitoring", "Pollution Control", "Compliance Support"],
    },
    {
      icon: TreePine,
      title: "Ecological Restoration",
      description: "Restoration and rehabilitation of damaged ecosystems to their natural state.",
      features: ["Habitat Restoration", "Biodiversity Planning", "Ecosystem Monitoring", "Conservation Strategies"],
    },
    {
      icon: Building,
      title: "Sustainability Consulting",
      description: "Strategic guidance to help organizations achieve their environmental and sustainability goals.",
      features: [
        "Sustainability Planning",
        "Green Building Certification",
        "Carbon Footprint Analysis",
        "ESG Reporting",
      ],
    },
  ]

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.25, 0.25, 1] }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Our Environmental Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.25, 0.25, 1] }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Comprehensive environmental consulting services tailored to meet your organization's unique sustainability
            challenges and regulatory requirements.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.25, 0.25, 0.25, 1] }}
            >
                             <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full !bg-white !border-gray-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#106934]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#106934]/20 transition-colors">
                    <service.icon className="h-6 w-6 text-[#106934]" />
                  </div>
                                     <CardTitle className="text-xl !text-gray-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                                     <p className="!text-gray-600">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                                             <li key={featureIndex} className="flex items-center text-sm !text-gray-700">
                        <div className="w-1.5 h-1.5 bg-[#106934] rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                                     <Button variant="ghost" className="group/btn p-0 h-auto font-normal !text-[#106934] hover:!text-[#106934] hover:!bg-[#106934]/10 bg-transparent">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.25, 0.25, 1] }}
          className="text-center mt-12"
        >
          <Button size="lg" className="bg-[#106934] hover:bg-[#106934]/90 text-white">
            View All Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
