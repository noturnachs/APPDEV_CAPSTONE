"use client";

import { motion } from "framer-motion";

export default function ConfirmationSummary({ formData }) {
  // Helper function to get project type label
  const getProjectTypeLabel = (value) => {
    const projectTypes = [ //more project types in the future!!!!!!!!!!!!!!!!!!!!
      { value: "industrial", label: "Industrial" },
      { value: "commercial", label: "Commercial" },
      { value: "residential", label: "Residential" },
      { value: "agricultural", label: "Agricultural" },
      { value: "mining", label: "Mining" },
      { value: "energy", label: "Energy/Power Generation" },
      { value: "infrastructure", label: "Infrastructure" },
      { value: "healthcare", label: "Healthcare Facility" },
      { value: "educational", label: "Educational Facility" },
      { value: "other", label: "Other" },
    ];
    
    return projectTypes.find(type => type.value === value)?.label || value;
  };

  // Use the actual database ID as the reference number
  // The backend returns this ID in the response after submission
  const referenceNumber = formData.quotationId 
    ? `QT-${formData.quotationId}` 
    : "Pending";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="w-6 h-6 bg-[#106934] rounded-full flex items-center justify-center text-white text-sm mr-3">📋</span>
        Quotation Summary
      </h3>

      <div className="space-y-6">
        {/* Reference Number */}
        <div className="bg-[#106934]/5 p-4 rounded-lg text-center mb-6">
          <p className="text-sm text-gray-600">Quotation Reference Number</p>
          <p className="text-xl font-bold text-[#106934]">{referenceNumber}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formData.quotationId 
              ? "Please reference this number in all communications" 
              : "Your official reference number will be assigned and included in the confirmation email"}
          </p>
        </div>

        {/* Contact Information */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{formData.firstName} {formData.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{formData.phone}</p>
            </div>
            {formData.company && (
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium">{formData.company}</p>
              </div>
            )}
          </div>
        </div>

        {/* Service Type */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Service Type</h4>
          <div className="inline-block bg-[#106934]/10 text-[#106934] px-3 py-1.5 rounded-full text-sm font-medium">
            {formData.serviceType === "permit-acquisition" 
              ? "Permit Acquisition" 
              : "Quarterly & Semi-Annual Compliance Monitoring"}
          </div>
        </div>

        {/* Project Details */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Project Details</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Project Type</p>
              <p className="font-medium">{getProjectTypeLabel(formData.projectType)}</p>
            </div>
            {formData.lotArea && (
              <div>
                <p className="text-sm text-gray-600">Lot Area</p>
                <p className="font-medium">{Number(formData.lotArea).toLocaleString()} m²</p>
              </div>
            )}
            {formData.annualCapacity && (
              <div>
                <p className="text-sm text-gray-600">Annual Capacity</p>
                <p className="font-medium">{formData.annualCapacity}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Project Description</p>
              <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1 whitespace-pre-wrap">{formData.projectDescription}</p>
            </div>
          </div>
        </div>

        {/* Service-specific Details */}
        {formData.serviceType === "permit-acquisition" && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Permit Details</h4>
            {formData.agency && (
              <div className="mb-3">
                <p className="text-sm text-gray-600">Selected Agency</p>
                <p className="font-medium">{formData.agency}</p>
              </div>
            )}
            
            {/* Selected Permits */}
            {(formData.permitTypes && formData.permitTypes.length > 0) && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Selected Permits ({formData.permitTypes.length})</p>
                <div className="flex flex-wrap gap-2">
                  {formData.permitTypes.map((permit, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#106934]/10 text-[#106934]"
                    >
                      {permit}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Custom Permits */}
            {formData.customPermits && (
              <div>
                <p className="text-sm text-gray-600">Custom Permits</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{formData.customPermits}</p>
              </div>
            )}
          </div>
        )}

        {/* Compliance Monitoring Details */}
        {formData.serviceType === "compliance-monitoring" && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Compliance Monitoring Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Current Permits</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{formData.currentPermits}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monitoring Frequency</p>
                <p className="font-medium">
                  {formData.monitoringFrequency === "quarterly" && "Quarterly Monitoring"}
                  {formData.monitoringFrequency === "semi-annual" && "Semi-Annual Monitoring"}
                  {formData.monitoringFrequency === "both" && "Both Quarterly & Semi-Annual"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliance Description</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1 whitespace-pre-wrap">{formData.complianceDescription}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
