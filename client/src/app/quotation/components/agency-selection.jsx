"use client"
import { useState } from "react"

export default function AgencySelection({ formData, onInputChange, permitData }) {
  const [selectedAgency, setSelectedAgency] = useState("all") // "all" or agency name
  const [searchTerm, setSearchTerm] = useState("")

  // Get all permits from all agencies
  const allPermits = []
  Object.entries(permitData).forEach(([agencyName, agency]) => {
    agency.permits.forEach(permit => {
      allPermits.push({
        ...permit,
        agency: agencyName
      })
    })
  })

  // Filter permits based on selected agency and search term
  const filteredPermits = allPermits.filter(permit => {
    const matchesAgency = selectedAgency === "all" || permit.agency === selectedAgency
    const matchesSearch = permit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.agency.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesAgency && matchesSearch
  })

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Agency Selection - Left Side */}
      <div className="lg:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-3">Government Agency</label>
        <div className="space-y-2">
          {/* All Permits Option */}
          <div
            onClick={() => setSelectedAgency("all")}
            className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedAgency === "all"
                ? "border-[#106934] bg-[#106934]/5"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">All Permits</h4>
                <p className="text-xs text-gray-600">{allPermits.length} total permits</p>
              </div>
              {selectedAgency === "all" && (
                <div className="w-4 h-4 bg-[#106934] rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          {/* Individual Agencies */}
          {Object.entries(permitData).map(([key, agency]) => (
            <div
              key={key}
              onClick={() => setSelectedAgency(key)}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedAgency === key
                  ? "border-[#106934] bg-[#106934]/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{key}</h4>
                  <p className="text-xs text-gray-600">{agency.permits.length} permits</p>
                </div>
                {selectedAgency === key && (
                  <div className="w-4 h-4 bg-[#106934] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permit Types Selection - Right Side */}
      <div className="lg:col-span-2">
        <PermitTypeSelection 
          formData={formData} 
          onInputChange={onInputChange} 
          permitData={permitData}
          filteredPermits={filteredPermits}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedAgency={selectedAgency}
        />
      </div>
    </div>
  )
}

// Import PermitTypeSelection component for use within AgencySelection
function PermitTypeSelection({ formData, onInputChange, permitData, filteredPermits, searchTerm, setSearchTerm, selectedAgency }) {
  const handlePermitToggle = (permitName, agencyName) => {
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

  // Get all permits for selected permits summary
  const allPermits = []
  Object.entries(permitData).forEach(([agencyName, agency]) => {
    agency.permits.forEach(permit => {
      allPermits.push({
        ...permit,
        agency: agencyName
      })
    })
  })

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Permit Types * <span className="text-sm text-gray-500">(Select all that apply)</span>
      </label>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search permits..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#106934] focus:ring-2 focus:ring-[#106934]/20 transition-colors text-gray-900 bg-white placeholder:text-gray-500"
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 mb-3">
        Showing {filteredPermits.length} of {allPermits.length} permits
        {selectedAgency !== "all" && ` from ${selectedAgency}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Permits List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredPermits.length > 0 ? (
          filteredPermits.map((permit, index) => (
            <div
              key={index}
              onClick={() => handlePermitToggle(permit.name)}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected(permit.name)
                  ? "border-[#106934] bg-[#106934]/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                      isSelected(permit.name) ? "border-[#106934] bg-[#106934]" : "border-gray-300"
                    }`}
                  >
                    {isSelected(permit.name) && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{permit.name}</h4>
                    {selectedAgency === "all" && (
                      <p className="text-xs text-gray-500">Agency: {permit.agency}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {permit.time_estimate && (
                    <span className="text-sm font-semibold text-[#106934]">
                      {permit.time_estimate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? `No permits found matching "${searchTerm}"` : "No permits available"}
          </div>
        )}
      </div>

      {/* Custom Permit Input */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Permits (Optional)</label>
        <textarea
          value={formData.customPermits || ""}
          onChange={(e) => onInputChange("customPermits", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#106934] focus:ring-2 focus:ring-[#106934]/20 transition-colors resize-none text-gray-900 bg-white placeholder:text-gray-500"
          placeholder="Enter any custom permits not listed above (one per line)..."
          rows={2}
        />
      </div>

      {/* Selected Permits Summary */}
      {(formData.permitTypes || []).length > 0 && (
        <div className="mt-4 p-3 bg-[#106934]/5 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Selected Permits ({(formData.permitTypes || []).length}):</h5>
          <div className="flex flex-wrap gap-2">
            {(formData.permitTypes || []).map((permit, index) => {
              const selectedPermitData = allPermits.find(p => p.name === permit);
              return (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#106934] text-white"
                >
                  {permit}
                  {selectedPermitData?.time_estimate && (
                    <span className="text-xs ml-1">({selectedPermitData.time_estimate})</span>
                  )}
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
