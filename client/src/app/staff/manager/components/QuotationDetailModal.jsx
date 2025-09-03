"use client"

import React from 'react'
import { 
  X, 
  Eye, 
  ExternalLink,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const QuotationDetailModal = ({ 
  quotation, 
  isOpen, 
  onClose, 
  onViewFullDetails
}) => {



  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'approved': return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
      case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getServiceTypeDisplay = (type) => {
    switch (type) {
      case 'permit_acquisition': return 'Permit Acquisition'
      case 'monitoring': return 'Compliance Monitoring'
      default: return type
    }
  }

  if (!quotation || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5 text-[#106934]" />
            <h2 className="text-xl font-semibold text-gray-900">
              Quotation Summary
            </h2>
            <Badge className={getStatusColor(quotation.status)}>
              {quotation.status?.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onViewFullDetails(quotation)}
              className="bg-[#106934] hover:bg-[#0d4f29]"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <User className="h-5 w-5 text-[#106934]" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Client Name</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {quotation.first_name} {quotation.last_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{quotation.email}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{quotation.phone_number}</p>
                  </div>
                  {quotation.company_name && (
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{quotation.company_name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <FileText className="h-5 w-5 text-[#106934]" />
                    <span>Service Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Service Type</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getServiceTypeDisplay(quotation.service_type)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600">Created: </span>
                      <span className="text-gray-900">
                        {new Date(quotation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {quotation.quickbooks_estimate_amount && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Estimate: </span>
                        <span className="text-[#106934] font-semibold">
                          ₱{Number(quotation.quickbooks_estimate_amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Quotation ID</Label>
                    <p className="mt-1 text-gray-900 font-mono">#{quotation.id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Permits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <FileText className="h-5 w-5 text-[#106934]" />
                  <span>Selected Permits</span>
                  {quotation.permit_requests && quotation.permit_requests.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {quotation.permit_requests.length} permit{quotation.permit_requests.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quotation.permit_requests && quotation.permit_requests.length > 0 ? (
                  <div className="space-y-3">
                    {quotation.permit_requests.slice(0, 3).map((request, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">
                            {request.permit_type ? request.permit_type.name : request.custom_name}
                          </p>
                          {request.permit_type && request.permit_type.agency && (
                            <p className="text-sm text-gray-500">
                              {request.permit_type.agency.name}
                            </p>
                          )}
                        </div>
                        {request.permit_type && request.permit_type.price && (
                          <div className="text-right">
                            <p className="font-semibold text-[#106934]">
                              ₱{Number(request.permit_type.price).toLocaleString()}
                            </p>
                            {request.permit_type.time_estimate && (
                              <p className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {request.permit_type.time_estimate} days
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {quotation.permit_requests.length > 3 && (
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500">
                          ... and {quotation.permit_requests.length - 3} more permit{quotation.permit_requests.length - 3 !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No permits selected</p>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {quotation.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <FileText className="h-5 w-5 text-[#106934]" />
                    <span>Project Description</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {quotation.description.length > 200 
                      ? `${quotation.description.substring(0, 200)}...` 
                      : quotation.description
                    }
                  </p>
                  {quotation.description.length > 200 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Full description available in detailed view
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuotationDetailModal 