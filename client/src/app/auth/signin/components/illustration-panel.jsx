"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function IllustrationPanel({ userType, userTypes, illustrations }) {
  return (
    <div className="sticky top-24">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 text-center"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={userType}
            initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            src={illustrations[userType]}
            alt={`${userType} sign in illustration`}
            className="w-full h-80 object-contain mb-6"
            style={{ willChange: "transform, opacity" }}
          />
        </AnimatePresence>
        <motion.h3
          className="text-xl font-bold text-gray-900 mb-2"
          key={`title-${userType}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {userTypes.find((type) => type.id === userType)?.title}
        </motion.h3>
        <motion.p
          className="text-gray-600"
          key={`desc-${userType}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {userTypes.find((type) => type.id === userType)?.description}
        </motion.p>
      </motion.div>
    </div>
  )
}
