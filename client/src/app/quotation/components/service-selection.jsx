"use client"

export default function ServiceSelection({ formData, onInputChange }) {
  const services = [
    {
      id: "permit-acquisition",
      title: "Permit Acquisition",
      description: "Complete permit application and acquisition services for environmental compliance",
      features: ["Permit research and analysis", "Application preparation", "Agency coordination", "Approval tracking"],
    },
    {
      id: "compliance-monitoring",
      title: "Quarterly & Semi-Annual Compliance Monitoring",
      description: "Ongoing monitoring and reporting services to maintain environmental compliance",
      features: ["Regular compliance assessments", "Monitoring reports", "Regulatory updates", "Violation prevention"],
    },
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Service Type *</label>
      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onInputChange("serviceType", service.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              formData.serviceType === service.id
                ? "border-[#106934] bg-[#106934]/5"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
                  formData.serviceType === service.id ? "border-[#106934] bg-[#106934]" : "border-gray-300"
                }`}
              >
                {formData.serviceType === service.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <h4 className="font-semibold text-gray-900 text-base">{service.title}</h4>
            </div>
            <p className="text-gray-600 mb-3 text-sm">{service.description}</p>
            <ul className="space-y-1">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 bg-[#106934] rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
