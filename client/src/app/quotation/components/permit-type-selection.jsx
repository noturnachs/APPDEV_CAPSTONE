"use client"
import { Check } from "lucide-react"

export default function PermitTypeSelection({ formData, onInputChange, permitData }) {
  // This component is now integrated into AgencySelection for horizontal layout
  // Keep this file for backward compatibility but it won't be used directly
  if (!formData.agency) return null

  const handlePermitToggle = (permitName) => {
    const currentPermits = formData.permitTypes || []
    let updatedPermits

    if (currentPermits.includes(permitName)) {
      updatedPermits = currentPermits.filter((permit) => permit !== permitName)
    } else {
      updatedPermits = [...currentPermits, permitName]
    }

    onInputChange("permitTypes", updatedPermits)
  }

  const isSelected = (permitName) => {
    return (formData.permitTypes || []).includes(permitName)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Permit Types * <span className="text-sm text-gray-500">(Select all that apply)</span>
      </label>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {permitData[formData.agency].permits.map((permit, index) => (
          <div
            key={index}
            onClick={() => handlePermitToggle(permit.name)}
            className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isSelected(permit.name)
                ? "border-[#106934] bg-[#106934]/5"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3 flex-1">
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-0.5 transition-colors ${
                    isSelected(permit.name) ? "border-[#106934] bg-[#106934]" : "border-gray-300"
                  }`}
                >
                  {isSelected(permit.name) && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{permit.name}</h4>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-[#106934] ml-2">
                <span className="text-sm font-medium">{permit.timeline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Permit Input */}
      {isSelected("Others") && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Please specify the permits you need *</label>
          <textarea
            required
            value={formData.customPermits || ""}
            onChange={(e) => onInputChange("customPermits", e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-[#106934] focus:ring-2 focus:ring-[#106934]/20 transition-colors resize-none text-gray-900 bg-white placeholder:text-gray-500"
            placeholder="Enter the specific permits you need (one per line)..."
            rows={3}
          />
        </div>
      )}

      {/* Selected Permits Summary */}
      {(formData.permitTypes || []).length > 0 && (
        <div className="mt-3 p-2 bg-[#106934]/5 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-2">
            Selected Permits ({(formData.permitTypes || []).length}):
          </h5>
          <div className="flex flex-wrap gap-2">
            {(formData.permitTypes || []).map((permit, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#106934] text-white"
              >
                {permit}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePermitToggle(permit)
                  }}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
