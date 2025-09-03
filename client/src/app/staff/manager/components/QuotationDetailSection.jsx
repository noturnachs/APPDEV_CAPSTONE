"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit3,
  Eye,
  Save,
  RotateCcw,
  Send,
  Copy,
  Trash2,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import toastUtils from '@/lib/toast'

// API functions for permit management
const permitAPI = {
  addPermit: async (quotationId, permitTypeId) => {
    const response = await fetch(`/api/quotations/${quotationId}/permits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permit_type_id: permitTypeId }),
    })
    if (!response.ok) throw new Error('Failed to add permit')
    return await response.json()
  },
  removePermit: async (quotationId, permitId) => {
    const response = await fetch(`/api/quotations/${quotationId}/permits/${permitId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to remove permit')
    return await response.json()
  },
  getAvailablePermits: async () => {
    const response = await fetch('/api/quotations/available-permits')
    if (!response.ok) throw new Error('Failed to fetch available permits')
    const data = await response.json()
    return data.agencies || []
  },
  refreshQuotation: async (quotationId) => {
    const response = await fetch(`/api/quotations/${quotationId}`)
    if (!response.ok) throw new Error('Failed to refresh quotation')
    const data = await response.json()
    return data.quotation
  }
}

const QuotationDetailSection = ({
  quotation,
  onBack,
  onSave,
  onDelete,
  onSendToClient,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [availablePermits, setAvailablePermits] = useState([]);
  const [loadingPermits, setLoadingPermits] = useState(false);
  const [addingPermit, setAddingPermit] = useState(false);
  const [removingPermitId, setRemovingPermitId] = useState(null);
  const [lastActiveTab, setLastActiveTab] = useState("overview");

  // Initialize form data when quotation changes
  useEffect(() => {
    if (quotation) {
      setFormData({
        first_name: quotation.first_name || "",
        last_name: quotation.last_name || "",
        email: quotation.email || "",
        phone_number: quotation.phone_number || "",
        company_name: quotation.company_name || "",
        service_type: quotation.service_type || "",
        description: quotation.description || "",
        status: quotation.status || "pending",
        quickbooks_estimate_amount: quotation.quickbooks_estimate_amount || "",
        permit_requests: quotation.permit_requests || [],
      });
    }
  }, [quotation]);

  // Load available permits when component mounts
  useEffect(() => {
    const loadAvailablePermits = async () => {
      try {
        setLoadingPermits(true)
        console.log('🔍 Loading available permits...')
        const permits = await permitAPI.getAvailablePermits()
        console.log('📋 Available permits loaded:', permits)
        setAvailablePermits(permits)
      } catch (error) {
        console.error('Error loading available permits:', error)
        toastUtils.error('Failed to load available permits')
      } finally {
        setLoadingPermits(false)
      }
    }

    loadAvailablePermits()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log('Saving quotation with data:', formData)
      const result = await onSave(formData)
      
      // Update local quotation object to reflect saved changes
      if (result && result.quotation) {
        Object.assign(quotation, result.quotation)
      }
      
      setIsEditing(false)
      toastUtils.quotation.updated()
    } catch (error) {
      console.error('Error saving quotation:', error)
      toastUtils.quotation.error('save')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      first_name: quotation.first_name || "",
      last_name: quotation.last_name || "",
      email: quotation.email || "",
      phone_number: quotation.phone_number || "",
      company_name: quotation.company_name || "",
      service_type: quotation.service_type || "",
      description: quotation.description || "",
      status: quotation.status || "pending",
      quickbooks_estimate_amount: quotation.quickbooks_estimate_amount || "",
      permit_requests: quotation.permit_requests || [],
    });
    setIsEditing(false);
  };

  const handleAddPermit = async (permitTypeId) => {
    try {
      setAddingPermit(true)
      await permitAPI.addPermit(quotation.id, permitTypeId)
      
      // Refresh the quotation data to get updated permits
      const updatedQuotation = await permitAPI.refreshQuotation(quotation.id)
      
      // Update the form data and the original quotation prop locally
      setFormData(prev => ({
        ...prev,
        permit_requests: updatedQuotation.permit_requests || []
      }))
      
      // Update the quotation object directly to avoid parent refresh
      Object.assign(quotation, {
        permit_requests: updatedQuotation.permit_requests,
        quickbooks_estimate_amount: updatedQuotation.quickbooks_estimate_amount
      })
      
      toastUtils.success('Permit added successfully')
      
      // Stay on the same tab - don't switch back
      // setActiveTab("permits") - removed to keep user on current tab
    } catch (error) {
      console.error('Error adding permit:', error)
      toastUtils.error('Failed to add permit')
    } finally {
      setAddingPermit(false)
    }
  }

  const handleRemovePermit = async (permitRequestId) => {
    try {
      setRemovingPermitId(permitRequestId)
      await permitAPI.removePermit(quotation.id, permitRequestId)
      
      // Refresh the quotation data to get updated permits
      const updatedQuotation = await permitAPI.refreshQuotation(quotation.id)
      
      // Update the form data and the original quotation prop locally
      setFormData(prev => ({
        ...prev,
        permit_requests: updatedQuotation.permit_requests || []
      }))
      
      // Update the quotation object directly to avoid parent refresh
      Object.assign(quotation, {
        permit_requests: updatedQuotation.permit_requests,
        quickbooks_estimate_amount: updatedQuotation.quickbooks_estimate_amount
      })
      
      toastUtils.success('Permit removed successfully')
      
      // No parent refresh - keep user on current tab and avoid page refresh
    } catch (error) {
      console.error('Error removing permit:', error)
      toastUtils.error('Failed to remove permit')
    } finally {
      setRemovingPermitId(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "sent":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getServiceTypeDisplay = (type) => {
    switch (type) {
      case "permit_acquisition":
        return "Permit Acquisition";
      case "monitoring":
        return "Compliance Monitoring";
      default:
        return type;
    }
  };

  if (!quotation) return null;

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Quotations</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <Edit3 className="h-5 w-5 text-[#106934]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#106934]" />
                  )}
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit Quotation" : "View Quotation"}
                  </h1>
                </div>
                <Badge className={getStatusColor(formData.status)}>
                  {formData.status?.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  {quotation.quickbooks_estimate_id && (
                    <Button
                      variant="outline"
                      onClick={() => onSendToClient(quotation)}
                      disabled={quotation.status === 'sent'}
                      className={`flex items-center space-x-2 ${
                        quotation.status === 'sent' 
                          ? 'text-gray-400' 
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                      {quotation.status === 'sent' ? 'Already Sent' : 'Send to Client'}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[#106934] hover:bg-[#0d4f29]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Side - Tabs */}
          <div className="flex-1">
            <Tabs
              value={activeTab}
              onValueChange={(newTab) => {
                setLastActiveTab(activeTab)
                setActiveTab(newTab)
              }}
              className="w-full"
            >
              <div className="border-b border-gray-200 mb-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="permits">Permits</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-[#106934]" />
                        <span>Contact Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            First Name
                          </Label>
                          {isEditing ? (
                            <Input
                              value={formData.first_name}
                              onChange={(e) =>
                                handleInputChange("first_name", e.target.value)
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">
                              {quotation.first_name}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Last Name
                          </Label>
                          {isEditing ? (
                            <Input
                              value={formData.last_name}
                              onChange={(e) =>
                                handleInputChange("last_name", e.target.value)
                              }
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">
                              {quotation.last_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">
                            {quotation.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>Phone</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.phone_number}
                            onChange={(e) =>
                              handleInputChange("phone_number", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">
                            {quotation.phone_number}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>Company</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.company_name}
                            onChange={(e) =>
                              handleInputChange("company_name", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">
                            {quotation.company_name}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-[#106934]" />
                        <span>Service Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Service Type
                        </Label>
                        <p className="mt-1 text-gray-900">
                          {getServiceTypeDisplay(quotation.service_type)}
                        </p>
                        {isEditing && (
                          <p className="text-xs text-gray-500 mt-1">
                            Service type cannot be changed after creation
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Status
                        </Label>
                        {isEditing ? (
                          <Select
                            value={formData.status}
                            onValueChange={(value) =>
                              handleInputChange("status", value)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            className={`mt-1 ${getStatusColor(
                              quotation.status
                            )}`}
                          >
                            {quotation.status?.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created Date</span>
                        </Label>
                        <p className="mt-1 text-gray-900">
                          {new Date(quotation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {quotation.quickbooks_estimate_amount && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>Estimate Amount</span>
                          </Label>
                          <p className="mt-1 text-[#106934] font-semibold">
                            ₱
                            {Number(
                              quotation.quickbooks_estimate_amount
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      {/* Selected Permits */}
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>Selected Permits</span>
                          {quotation.permit_requests && quotation.permit_requests.length > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              {quotation.permit_requests.length}
                            </Badge>
                          )}
                        </Label>
                        {quotation.permit_requests && quotation.permit_requests.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {quotation.permit_requests.slice(0, 3).map((request, index) => (
                              <div key={index} className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded">
                                <span className="text-gray-700 truncate">
                                  {request.permit_type
                                    ? request.permit_type.name
                                    : request.custom_name ||
                                      `Permit Type #${request.permit_type_id}`}
                                </span>
                                {request.permit_type && request.permit_type.price && (
                                  <span className="text-[#106934] font-medium ml-2">
                                    ₱{Number(request.permit_type.price).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            ))}
                            {quotation.permit_requests.length > 3 && (
                              <div className="text-xs text-gray-500 text-center py-1">
                                +{quotation.permit_requests.length - 3} more permits
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="mt-1 text-xs text-gray-500">
                            No permits selected
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                {quotation.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-[#106934]" />
                        <span>Description</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          rows={4}
                          placeholder="Enter description..."
                        />
                      ) : (
                        <p className="text-gray-700">{quotation.description}</p>
                      )}
                    </CardContent>
                  </Card>
                )}


              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quotation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Quotation ID
                        </Label>
                        <p className="mt-1 text-gray-900 font-mono">
                          #{quotation.id}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          QuickBooks Estimate ID
                        </Label>
                        <p className="mt-1 text-gray-900 font-mono">
                          {quotation.quickbooks_estimate_id || "Not created"}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Last Updated
                      </Label>
                      <p className="mt-1 text-gray-900">
                        {new Date(
                          quotation.updated_at || quotation.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Permits Tab */}
              <TabsContent value="permits" className="space-y-6">
                {/* Selected Permits */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Selected Permits</CardTitle>
                    {isEditing && (
                      <Button
                        size="sm"
                        onClick={() => setActiveTab("add-permits")}
                        className="bg-[#106934] hover:bg-[#0d4f29]"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Permit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {quotation.permit_requests &&
                    quotation.permit_requests.length > 0 ? (
                      <div className="space-y-3">
                        {quotation.permit_requests.map((request, index) => (
                          <div
                            key={request.id || index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox checked={true} disabled />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {request.permit_type
                                    ? request.permit_type.name
                                    : request.custom_name ||
                                      `Permit Type #${request.permit_type_id}`}
                                </p>
                                {request.permit_type &&
                                  request.permit_type.agency && (
                                    <p className="text-sm text-gray-500">
                                      {request.permit_type.agency.name}
                                    </p>
                                  )}
                                {request.permit_type &&
                                  request.permit_type.time_estimate && (
                                    <p className="text-xs text-green-600">
                                      {request.permit_type.time_estimate}
                                    </p>
                                  )}
                                {!request.permit_type && (
                                  <p className="text-xs text-gray-400">
                                    Custom permit request
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                {request.permit_type &&
                                request.permit_type.price ? (
                                  <p className="font-semibold text-[#106934]">
                                    ₱
                                    {Number(
                                      request.permit_type.price
                                    ).toLocaleString()}
                                  </p>
                                ) : (
                                  <>
                                    <p className="font-semibold text-[#106934]">
                                      ₱--,---
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Price not available
                                    </p>
                                  </>
                                )}
                              </div>
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemovePermit(request.id)}
                                  disabled={removingPermitId === request.id}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  {removingPermitId === request.id ? (
                                    <RotateCcw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">
                          No permits selected
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Click "Add Permit" to select permits for this quotation.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Add Permits Tab */}
              <TabsContent value="add-permits" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Add Permits</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab(lastActiveTab === "add-permits" ? "permits" : lastActiveTab)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to {lastActiveTab === "add-permits" ? "Permits" : "Selected"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loadingPermits ? (
                      <div className="text-center py-8">
                        <RotateCcw className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
                        <p className="text-gray-500">Loading available permits...</p>
                      </div>
                    ) : availablePermits.length > 0 ? (
                      <div className="space-y-6">
                        {availablePermits.map((agency) => (
                          <div key={agency.id}>
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                              <Building className="h-4 w-4 mr-2 text-[#106934]" />
                              {agency.name}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {agency.permit_types.map((permit) => {
                                const isAlreadySelected = quotation.permit_requests?.some(
                                  req => req.permit_type_id === permit.id
                                )
                                
                                return (
                                  <div
                                    key={permit.id}
                                    className={`p-4 border rounded-lg ${
                                      isAlreadySelected 
                                        ? 'border-gray-200 bg-gray-50 opacity-50' 
                                        : 'border-gray-200 bg-white hover:border-[#106934] hover:bg-green-50'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">
                                          {permit.name}
                                        </h4>
                                        {permit.description && (
                                          <p className="text-sm text-gray-500 mt-1">
                                            {permit.description}
                                          </p>
                                        )}
                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                                          {permit.price && (
                                            <span className="font-medium text-[#106934]">
                                              ₱{Number(permit.price).toLocaleString()}
                                            </span>
                                          )}
                                          {permit.time_estimate && (
                                            <span className="flex items-center">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {permit.time_estimate}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant={isAlreadySelected ? "ghost" : "outline"}
                                        onClick={() => handleAddPermit(permit.id)}
                                        disabled={isAlreadySelected || addingPermit}
                                        className={isAlreadySelected ? "text-gray-400" : "text-[#106934] hover:text-[#0d4f29]"}
                                      >
                                        {isAlreadySelected ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : addingPermit ? (
                                          <RotateCcw className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Plus className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">
                          No permits available
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Contact your administrator to add permit types.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#106934] rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Quotation Created</p>
                          <p className="text-sm text-gray-500">
                            {new Date(quotation.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {quotation.quickbooks_estimate_id && (
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">
                              QuickBooks Estimate Created
                            </p>
                            <p className="text-sm text-gray-500">
                              Estimate ID: {quotation.quickbooks_estimate_id}
                            </p>
                          </div>
                        </div>
                      )}
                      {quotation.status !== "pending" && (
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">
                              Status Updated to {quotation.status}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                quotation.updated_at || quotation.created_at
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Actions */}
          <div className="w-80">
            <div className="sticky top-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      navigator.clipboard.writeText(quotation.id.toString());
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Quotation ID
                  </Button>

                  {quotation.quickbooks_estimate_id && (
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${
                        quotation.status === 'sent' 
                          ? 'text-gray-400' 
                          : 'text-green-600 hover:text-green-700'
                      }`}
                      onClick={() => onSendToClient(quotation)}
                      disabled={quotation.status === 'sent'}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {quotation.status === 'sent' ? 'Already Sent' : 'Send to Client'}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full justify-start text-blue-600 hover:text-blue-700"
                    onClick={() =>
                      window.open(
                        `/api/quotations/${quotation.id}/pdf`,
                        "_blank"
                      )
                    }
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quotation Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium">#{quotation.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(quotation.status)}>
                      {quotation.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">
                      {getServiceTypeDisplay(quotation.service_type)}
                    </span>
                  </div>
                  {quotation.quickbooks_estimate_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-[#106934]">
                        ₱
                        {Number(
                          quotation.quickbooks_estimate_amount
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 border-red-200"
                    onClick={() => onDelete(quotation)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Quotation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetailSection;
