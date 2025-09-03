"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProjectDescription({ formData, onInputChange }) {
  const projectTypes = [
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

  const handleInputChange = (field, value) => {
    onInputChange(field, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-[#106934] rounded-full flex items-center justify-center text-white font-bold">
          2
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Project Description
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Type *
          </label>
          <Select
            value={formData.projectType || ""}
            onValueChange={(value) => handleInputChange("projectType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lot Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lot Area (m²)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.lotArea || ""}
            onChange={(e) => handleInputChange("lotArea", e.target.value)}
            placeholder="Enter lot area in square meters"
            className="text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the total area of the project site
          </p>
        </div>
      </div>

      {/* Annual Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Annual Capacity
        </label>
        <Input
          type="text"
          value={formData.annualCapacity || ""}
          onChange={(e) => handleInputChange("annualCapacity", e.target.value)}
          placeholder="e.g., 5000 tons/year, 10MW, 100,000 liters/day"
          className="text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-1">
          Specify the expected annual production or processing capacity
        </p>
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Project Description *
        </label>
        <Textarea
          required
          value={formData.projectDescription || ""}
          onChange={(e) => handleInputChange("projectDescription", e.target.value)}
          placeholder="Provide a detailed description of your project including:
• Purpose and objectives
• Key activities and processes
• Environmental considerations
• Timeline and phases
• Any special requirements or concerns"
          rows={8}
          className="text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-1">
          The more detailed your description, the more accurate our quotation will be
        </p>
      </div>

      {/* Project Summary Card */}
      {(formData.projectType || formData.lotArea || formData.annualCapacity || formData.projectDescription) && (
        <div className="mt-6 p-4 bg-[#106934]/5 border border-[#106934]/20 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-5 h-5 bg-[#106934] rounded-full flex items-center justify-center text-white text-xs mr-2">✓</span>
            Project Summary
          </h4>
          <div className="space-y-2 text-sm">
            {formData.projectType && (
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900">
                  {projectTypes.find(type => type.value === formData.projectType)?.label}
                </span>
              </div>
            )}
            {formData.lotArea && (
              <div className="flex justify-between">
                <span className="text-gray-600">Lot Area:</span>
                <span className="font-medium text-gray-900">
                  {Number(formData.lotArea).toLocaleString()} m²
                </span>
              </div>
            )}
            {formData.annualCapacity && (
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Capacity:</span>
                <span className="font-medium text-gray-900">{formData.annualCapacity}</span>
              </div>
            )}
            {formData.projectDescription && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-600 block mb-1">Description:</span>
                <span className="text-gray-900 text-xs leading-relaxed">
                  {formData.projectDescription.length > 150 
                    ? `${formData.projectDescription.substring(0, 150)}...` 
                    : formData.projectDescription}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          💡 Tips for a Better Quotation
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about your project's environmental impact</li>
          <li>• Include any existing permits or previous environmental assessments</li>
          <li>• Mention any urgent deadlines or regulatory requirements</li>
          <li>• Describe the location and surrounding environment</li>
          <li>• Include any stakeholder or community considerations</li>
        </ul>
      </div>
    </div>
  );
}
