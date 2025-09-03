"use client"

import { motion } from "framer-motion"

export default function UserTypeSelector({ userTypes, selectedType, onTypeChange }) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-4">Select Portal</label>
      <div className="grid grid-cols-2 gap-4">
        {userTypes.map((type) => (
          <motion.div
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden ${
              selectedType === type.id
                ? "border-[#106934] bg-[#106934]/5"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  selectedType === type.id ? "bg-[#106934] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                <type.icon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{type.title}</h4>
                <p className="text-xs text-gray-600">{type.description}</p>
              </div>
            </div>
            {/* Bottom accent line */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-[#106934] transform transition-transform duration-300 origin-left ${
                selectedType === type.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
