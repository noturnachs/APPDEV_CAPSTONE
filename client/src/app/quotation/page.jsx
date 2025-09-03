"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BlurIn } from "@/components/ui/blur-in";
import { FadeIn } from "@/components/ui/fade-in";
import ServiceSelection from "./components/service-selection";
import ProjectDescription from "./components/project-description";
import AgencySelection from "./components/agency-selection";
import ConfirmationSummary from "@/components/quotation/confirmation-summary";
import { quotationAPI, agenciesAPI } from "@/lib/api";
import toastUtils from '@/lib/toast';

export default function QuotationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [validationError, setValidationError] = useState(false); // NEW: warning state
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",

    // Service Selection
    serviceType: "",

    // Project Description (new step)
    projectType: "",
    lotArea: "",
    annualCapacity: "",
    projectDescription: "",

    // Project Details (for permit acquisition)
    permitTypes: [],
    customPermits: "",

    // Compliance Monitoring Details
    currentPermits: "",
    monitoringFrequency: "",
    complianceDescription: "",
  });

  // Mark as animated after initial load
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permitData, setPermitData] = useState({}); 

  // Replace the existing useEffect that fetches from QuickBooks with this:
  useEffect(() => {
    const fetchPermitData = async () => {
      setLoading(true);
      try {
        const { data } = await agenciesAPI.getAll();

        // The backend now returns { agencies: [...] } after refactoring
        const agencies = data.agencies || data; // Handle both old and new format
        if (agencies && Array.isArray(agencies)) {
          // Transform the data to match your component's expected format
          const transformedData = {};
          agencies.forEach((agency) => {
            transformedData[agency.name] = {
              name: agency.name,
              permits: agency.permit_types.map((permit) => ({
                name: permit.name,
                timeline: permit.time_estimate || permit.description || "Varies", // Use time_estimate first
                price: permit.price || 0,
                time_estimate: permit.time_estimate || null,
              })),
            };
          });
          setPermitData(transformedData);
        } else {
          console.error("Invalid data structure received:", data, "agencies:", agencies);
          setPermitData({});
        }
      } catch (error) {
        console.error("Error fetching permit data:", error);
        setPermitData({});
      } finally {
        setLoading(false);
      }
    };

    fetchPermitData();
  }, []);

  // Filter and group only permits
  const permitItems = permits.filter(
    (permit) =>
      permit.category === "Permits" ||
      permit.name.toLowerCase().includes("permit") ||
      permit.name.toLowerCase().includes("clearance") ||
      permit.name.toLowerCase().includes("inspection")
  );

  // Group permits by category (should only be Permits category now)
  const groupedPermits = permitItems.reduce((acc, permit) => {
    const category = permit.category || "Permits";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permit);
    return acc;
  }, {});

  // Validation logic for each step
  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.firstName.trim() &&
        formData.lastName.trim() &&
        formData.email.trim() &&
        formData.phone.trim() &&
        formData.serviceType.trim()
      );
    }
    if (currentStep === 2) {
      // Project Description step
      return (
        formData.projectType.trim() &&
        formData.projectDescription.trim()
      );
    }
    if (currentStep === 3) {
      if (formData.serviceType === "permit-acquisition") {
        return (
          formData.permitTypes.length > 0 || formData.customPermits.trim()
        );
      }
      if (formData.serviceType === "compliance-monitoring") {
        return (
          formData.currentPermits.trim() &&
          formData.monitoringFrequency.trim() &&
          formData.complianceDescription.trim()
        );
      }
      // If no serviceType, not valid
      return false;
    }
    return true;
  };

  // Show warning for 2 seconds, or clear on input
  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => setValidationError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

  // Clear warning on input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError(false);
  };

  // Next button handler with validation
  const handleNext = (e) => {
    // Prevent form submission when clicking Next
    if (e) {
      e.preventDefault();
    }
    
    if (!isStepValid()) {
      setValidationError(true);
      toastUtils.form.validationError();
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (e) => {
    // Prevent form submission when clicking Previous
    if (e) {
      e.preventDefault();
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Submit the form data and get the response
      const response = await quotationAPI.submit(formData);
      
      // Extract the quotation data from the response
      const quotationData = response.data.quotation;
      
      // Update formData with the quotation ID for reference
      setFormData(prevData => ({
        ...prevData,
        quotationId: quotationData?.id
      }));
      
      // Show success toast
      toastUtils.quotation.created();
      
      // Success! Move to step 5 (Thank You)
      setCurrentStep(5);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Something went wrong. Please try again.");
      toastUtils.quotation.error('submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Contact Information",
      description: "Tell us about yourself",
      illustration: "/images/illustrations/quote1.svg",
    },
    {
      number: 2,
      title: "Project Description",
      description: "Describe your project details",
      illustration: "/images/illustrations/quote2.svg",
    },
    {
      number: 3,
      title: "Service Details",
      description: "Select your specific needs",
      illustration: "/images/illustrations/quote3.svg",
    },
    {
      number: 4,
      title: "Review & Submit",
      description: "Confirm your information",
      illustration: "/images/illustrations/quote1.svg",
    },
    {
      number: 5,
      title: "Thank You!",
      description: "Your quotation has been submitted",
      illustration: "/images/illustrations/quote2.svg",
    },
  ];

  const getCurrentIllustration = () => {
    return steps[currentStep - 1]?.illustration;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-4">
      {/* Popup Warning */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setValidationError(false)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            
            {/* Popup Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", damping: 15 }}
                  src="/images/illustrations/question.svg"
                  alt="Please fill all required fields"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Please Complete All Fields
                </h3>
                <p className="text-gray-600 mb-6">
                  All required fields must be filled before proceeding to the
                  next step.
                </p>
                <Button
                  onClick={() => setValidationError(false)}
                  className="w-full bg-[#106934] hover:bg-[#106934]/90 text-white"
                >
                  Got it
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back to Home Button */}
        <div className="flex justify-start mb-6">
          <Link href="/" className="group">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl text-slate-700 hover:text-[#106934] transition-all duration-300"
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="mr-2"
                initial={{ x: 0 }}
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.div>
              <span className="font-medium">Back to Home</span>
            </motion.div>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          {!hasAnimated ? (
            <>
              <BlurIn duration={1}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Get Your Environmental Consulting Quote
                </h1>
              </BlurIn>
              <FadeIn delay={0.3}>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Fill out this form to receive a customized quote for your
                  environmental consulting needs.
                </p>
              </FadeIn>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Get Your Environmental Consulting Quote
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Fill out this form to receive a customized quote for your
                environmental consulting needs.
              </p>
            </>
          )}
        </div>

        {/* Progress Steps */}
        {!hasAnimated ? (
          <FadeIn delay={0.5}>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                          currentStep >= step.number
                            ? "bg-[#106934] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {currentStep > step.number ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <div className="ml-3 hidden sm:block">
                        <p
                          className={`text-sm font-medium transition-colors duration-300 ${
                            currentStep >= step.number
                              ? "text-[#106934]"
                              : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                          currentStep > step.number
                            ? "bg-[#106934]"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                        currentStep >= step.number
                          ? "bg-[#106934] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p
                        className={`text-sm font-medium transition-colors duration-300 ${
                          currentStep >= step.number
                            ? "text-[#106934]"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                        currentStep > step.number
                          ? "bg-[#106934]"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content with Illustration */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Illustration Side */}
          <motion.div
            initial={
              !hasAnimated ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: !hasAnimated ? 0.2 : 0 }}
            className="lg:col-span-3 order-2 lg:order-1"
          >
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <motion.div
                  key={`illustration-${currentStep}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mb-6 text-center"
                >
                  <img
                    src={
                      getCurrentIllustration() ||
                      "/images/illustrations/quote1.svg"
                    }
                    alt={`Step ${currentStep} illustration`}
                    className="w-full h-48 md:h-56 object-contain"
                  />
                </motion.div>
                <motion.div
                  key={`content-${currentStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-2 text-center"
                >
                  <h3 className="text-xl font-bold text-gray-900">
                    {steps[currentStep - 1]?.title}
                  </h3>
                  <p className="text-gray-600">
                    {steps[currentStep - 1]?.description}
                  </p>
                </motion.div>

                {/* Step-specific tips */}
                <motion.div
                  key={`tips-${currentStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-6 p-4 bg-[#106934]/5 rounded-lg"
                >
                  {currentStep === 1 && (
                    <div className="text-left">
                      <h4 className="font-semibold text-[#106934] mb-2">
                        💡 Quick Tips:
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Use your business email for faster processing</li>
                        <li>• Include your direct phone number</li>
                        <li>• Company details help us understand your needs</li>
                      </ul>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="text-left">
                      <h4 className="font-semibold text-[#106934] mb-2">
                        🏗️ Project Description:
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Choose the most accurate project type</li>
                        <li>• Provide detailed project description</li>
                        <li>• Include environmental considerations</li>
                        <li>• Mention project timeline if known</li>
                      </ul>
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="text-left">
                      <h4 className="font-semibold text-[#106934] mb-2">
                        🎯 Service Selection:
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Be specific about your permit needs</li>
                        <li>• Select all applicable permits</li>
                        <li>• Add custom permits if needed</li>
                        <li>• Mention any urgent requirements</li>
                      </ul>
                    </div>
                  )}
                  {currentStep === 4 && (
                    <div className="text-left">
                      <h4 className="font-semibold text-[#106934] mb-2">
                        ✅ Almost Done:
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Review all information carefully</li>
                        <li>• We'll respond within 2-3 business days</li>
                        <li>• Check your email for our response</li>
                      </ul>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={
              !hasAnimated ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: !hasAnimated ? 0.4 : 0 }}
            className="lg:col-span-9 order-1 lg:order-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Contact Information + Service Selection */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-[#106934] rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Contact Information
                        </h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <Input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            placeholder="Enter your first name"
                            className="text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <Input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            placeholder="Enter your last name"
                            className="text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="your.email@company.com"
                            className="text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <Input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            placeholder="+1 (555) 123-4567"
                            className="text-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company/Organization
                        </label>
                        <Input
                          type="text"
                          value={formData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          placeholder="Your company name"
                          className="text-gray-900"
                        />
                      </div>

                      <div className="border-t pt-4">
                        <ServiceSelection
                          formData={formData}
                          onInputChange={handleInputChange}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Project Description */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <ProjectDescription
                        formData={formData}
                        onInputChange={handleInputChange}
                      />
                    </motion.div>
                  )}

                  {/* Step 3: Service Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-[#106934] rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {formData.serviceType === "permit-acquisition"
                            ? "Permit Selection"
                            : "Compliance Monitoring Details"}
                        </h2>
                      </div>

                      {formData.serviceType === "permit-acquisition" ? (
                        <>
                          {loading ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#106934] mx-auto mb-4"></div>
                              <p className="text-gray-500">
                                Loading agencies and permits...
                              </p>
                            </div>
                          ) : Object.keys(permitData).length > 0 ? (
                            <div className="space-y-6">
                              <AgencySelection
                                formData={formData}
                                onInputChange={handleInputChange}
                                permitData={permitData}
                              />
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>No agencies or permits found.</p>
                              <p className="text-sm mt-1">
                                Please check your database connection.
                              </p>
                            </div>
                          )}
                        </>
                      ) : formData.serviceType === "compliance-monitoring" ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Permits *
                            </label>
                            <Textarea
                              required
                              value={formData.currentPermits}
                              onChange={(e) =>
                                handleInputChange(
                                  "currentPermits",
                                  e.target.value
                                )
                              }
                              placeholder="List your current environmental permits that need monitoring..."
                              rows={3}
                              className="text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Monitoring Frequency *
                            </label>
                            <select
                              required
                              value={formData.monitoringFrequency}
                              onChange={(e) =>
                                handleInputChange(
                                  "monitoringFrequency",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#106934] focus:border-[#106934] text-gray-900"
                            >
                              <option value="">
                                Select monitoring frequency
                              </option>
                              <option value="quarterly">
                                Quarterly Monitoring
                              </option>
                              <option value="semi-annual">
                                Semi-Annual Monitoring
                              </option>
                              <option value="both">
                                Both Quarterly & Semi-Annual
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Compliance Description *
                            </label>
                            <Textarea
                              required
                              value={formData.complianceDescription}
                              onChange={(e) =>
                                handleInputChange(
                                  "complianceDescription",
                                  e.target.value
                                )
                              }
                              placeholder="Describe your compliance monitoring requirements and any specific concerns..."
                              rows={4}
                              className="text-gray-900"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <img
                            src="/images/illustrations/question.svg"
                            alt="Select service"
                            className="w-32 h-32 mx-auto mb-4 opacity-50"
                          />
                          <p className="text-gray-500">
                            Please go back and select a service type to
                            continue.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Review & Submit */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-[#106934] rounded-full flex items-center justify-center text-white font-bold">
                          4
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Review Your Information
                        </h2>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Contact Information
                          </h3>
                          <p className="text-gray-600">
                            {formData.firstName} {formData.lastName}
                            <br />
                            {formData.email}
                            <br />
                            {formData.phone}
                            <br />
                            {formData.company && `${formData.company}`}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Service Type
                          </h3>
                          <p className="text-gray-600">
                            {formData.serviceType === "permit-acquisition"
                              ? "Permit Acquisition"
                              : "Quarterly & Semi-Annual Compliance Monitoring"}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Project Information
                          </h3>
                          <p className="text-gray-600">
                            <strong>Project Type:</strong> {formData.projectType}
                            <br />
                            {formData.lotArea && (
                              <>
                                <strong>Lot Area:</strong> {Number(formData.lotArea).toLocaleString()} m²
                                <br />
                              </>
                            )}
                            {formData.annualCapacity && (
                              <>
                                <strong>Annual Capacity:</strong> {formData.annualCapacity}
                                <br />
                              </>
                            )}
                            <strong>Description:</strong> {formData.projectDescription}
                          </p>
                        </div>

                        {formData.serviceType === "permit-acquisition" && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Permit Details
                            </h3>
                            <p className="text-gray-600">
                              <strong>
                                Selected Permits (
                                {(formData.permitTypes || []).length}):
                              </strong>
                              <br />
                              {(formData.permitTypes || []).map((permit, index) => {
                                const selectedPermitData = permitData[formData.agency]?.permits.find(p => p.name === permit);
                                return (
                                <span
                                  key={index}
                                  className="inline-block bg-[#106934]/10 text-[#106934] px-2 py-1 rounded text-sm mr-2 mb-1"
                                >
                                  {permit}
                                    {selectedPermitData?.time_estimate && (
                                      <span className="text-xs ml-1">({selectedPermitData.time_estimate})</span>
                                    )}
                                </span>
                                );
                              })}
                              {formData.customPermits && (
                                <>
                                  <br />
                                  <strong>Custom Permits:</strong>{" "}
                                  {formData.customPermits}
                                </>
                              )}
                            </p>
                          </div>
                        )}

                        {formData.serviceType === "compliance-monitoring" && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Compliance Monitoring Details
                            </h3>
                            <p className="text-gray-600">
                              <strong>Current Permits:</strong>{" "}
                              {formData.currentPermits}
                              <br />
                              <strong>Monitoring Frequency:</strong>{" "}
                              {formData.monitoringFrequency}
                              <br />
                              <strong>Description:</strong>{" "}
                              {formData.complianceDescription}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#106934]/5 border border-[#106934]/20 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          By submitting this form, you agree to be contacted by
                          Alpha Environmental Systems Corporation regarding your
                          environmental consulting needs. We will review your
                          information and provide a customized quote within 2-3
                          business days.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Thank You */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", damping: 15 }}
                          className="w-20 h-20 bg-[#106934] rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <CheckCircle className="w-10 h-10 text-white" />
                        </motion.div>
                        
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl font-bold text-gray-900 mb-4"
                        >
                          Thank You!
                        </motion.h2>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-lg text-gray-600 mb-8"
                        >
                          Your quotation request has been successfully submitted.
                        </motion.p>
                      </div>

                      {/* Email Confirmation Notice */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center mb-6"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800">Email Notifications</h4>
                          <p className="text-sm text-blue-700">
                            A confirmation email will be sent to <span className="font-semibold">{formData.email}</span> with your quotation details and reference number.
                          </p>
                        </div>
                      </motion.div>

                      {/* Quotation Summary */}
                      <ConfirmationSummary formData={formData} />

                      <div className="bg-[#106934]/5 border border-[#106934]/20 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-6 h-6 bg-[#106934] rounded-full flex items-center justify-center text-white text-sm mr-3">1</span>
                          What happens next?
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#106934] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-gray-700 font-medium">Review Process</p>
                              <p className="text-gray-600 text-sm">Our team will review your requirements within 24-48 hours</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#106934] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-gray-700 font-medium">Detailed Estimate</p>
                              <p className="text-gray-600 text-sm">We'll create a comprehensive quotation with pricing and timelines</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#106934] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-gray-700 font-medium">Email Delivery</p>
                              <p className="text-gray-600 text-sm">Your formal quotation will be sent to: <span className="font-medium text-[#106934]">{formData.email}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">2</span>
                          Need immediate assistance?
                        </h3>
                        <p className="text-gray-600 mb-4">
                          If you have urgent questions or need to make changes to your request, please contact us:
                        </p>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-medium">Email:</span> info@alphaenvironmental.com
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Phone:</span> +63 2 1234 5678
                          </p>
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <Link href="/">
                          <Button>
                            Return to Home
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Display */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-600 text-sm">{submitError}</p>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                  {currentStep !== 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center !border-[#106934] !text-[#106934] hover:!bg-[#106934] hover:!text-white bg-transparent transition-all duration-200 hover:scale-105"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  )}

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center bg-[#106934] hover:bg-[#106934]/90 text-white transition-all duration-200 hover:scale-105"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : currentStep === 4 ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center bg-[#106934] hover:bg-[#106934]/90 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                      Submit Quote Request
                      <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                  )}
                    </Button>
                  ) : null}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
