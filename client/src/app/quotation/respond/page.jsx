"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle, Loader2, AlertTriangle, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function QuotationResponsePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [loading, setLoading] = useState(true)
  const [tokenInfo, setTokenInfo] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState(null)

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("No token provided")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/custom-quotations/verify-token?token=${token}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to verify token")
        }
        
        setTokenInfo(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  // Handle response submission
  const handleSubmitResponse = async () => {
    if (!token || submitting) return
    
    try {
      setSubmitting(true)
      
      const response = await fetch('/api/custom-quotations/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process response")
      }
      
      setResponse(data)
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quotation Response</CardTitle>
            <CardDescription>Verifying your request...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-[#106934]" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-2xl text-red-600">Error</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              The link you followed appears to be invalid or expired. Please contact Alpha Systems for assistance.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button className="bg-[#106934] hover:bg-[#0d5a2c]">
                Return to Homepage
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Already responded state
  if (tokenInfo?.quotation?.status === 'approved' || tokenInfo?.quotation?.status === 'rejected') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
            <CardTitle className="text-2xl">Already Processed</CardTitle>
            <CardDescription>
              This quotation has already been {tokenInfo.quotation.status}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600">
                  You have already responded to this quotation. If you need to change your response, please contact Alpha Systems directly.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">Quotation Summary</h3>
                  <a 
                    href={`/api/custom-quotations/${tokenInfo?.quotation?.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200 hover:bg-blue-100"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    View PDF
                  </a>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Client:</span> {tokenInfo?.quotation?.first_name} {tokenInfo?.quotation?.last_name}
                  </p>
                  {tokenInfo?.quotation?.company_name && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Company:</span> {tokenInfo?.quotation?.company_name}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Service:</span> {tokenInfo?.quotation?.service_type === 'permit_acquisition' 
                      ? 'Permit Acquisition' 
                      : 'Compliance Monitoring'}
                  </p>
                  {tokenInfo?.quotation?.quickbooks_estimate_amount && (
                    <p className="text-sm font-medium text-green-700">
                      <span className="font-medium">Total Amount:</span> PHP {Number(tokenInfo.quotation.quickbooks_estimate_amount).toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tokenInfo?.quotation?.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tokenInfo?.quotation?.status?.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button className="bg-[#106934] hover:bg-[#0d5a2c]">
                Return to Homepage
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Success state after submission
  if (submitted && response) {
    const isApproved = response.status === 'approved' || tokenInfo?.action === 'approve'
    
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {isApproved ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            )}
            <CardTitle className="text-2xl">
              {isApproved ? 'Quotation Approved' : 'Quotation Declined'}
            </CardTitle>
            <CardDescription>
              Thank you for your response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600">
                  {isApproved 
                    ? 'We have received your approval. Our team will contact you shortly to proceed with the next steps.'
                    : 'We have received your decision to decline this quotation. If you would like to discuss other options, please feel free to contact us.'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">Quotation Summary</h3>
                  <a 
                    href={`/api/custom-quotations/${tokenInfo?.quotation?.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200 hover:bg-blue-100"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    View PDF
                  </a>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Client:</span> {tokenInfo?.quotation?.first_name} {tokenInfo?.quotation?.last_name}
                  </p>
                  {tokenInfo?.quotation?.company_name && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Company:</span> {tokenInfo?.quotation?.company_name}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Service:</span> {tokenInfo?.quotation?.service_type === 'permit_acquisition' 
                      ? 'Permit Acquisition' 
                      : 'Compliance Monitoring'}
                  </p>
                  {tokenInfo?.quotation?.quickbooks_estimate_amount && (
                    <p className="text-sm font-medium text-green-700">
                      <span className="font-medium">Total Amount:</span> PHP {Number(tokenInfo.quotation.quickbooks_estimate_amount).toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isApproved ? 'APPROVED' : 'DECLINED'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button className="bg-[#106934] hover:bg-[#0d5a2c]">
                Return to Homepage
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Confirmation page
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {tokenInfo?.action === 'approve' ? 'Approve Quotation' : 'Decline Quotation'}
          </CardTitle>
          <CardDescription>
            Please confirm your decision for Quotation #{tokenInfo?.quotationId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">Quotation Details</h3>
                <a 
                  href={`/api/custom-quotations/${tokenInfo?.quotation?.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200 hover:bg-blue-100"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  View PDF
                </a>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Client Information</h4>
                  <p className="text-sm text-gray-600">Name: {tokenInfo?.quotation?.first_name} {tokenInfo?.quotation?.last_name}</p>
                  <p className="text-sm text-gray-600">Company: {tokenInfo?.quotation?.company_name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Email: {tokenInfo?.quotation?.email || 'N/A'}</p>
                  {tokenInfo?.quotation?.phone_number && (
                    <p className="text-sm text-gray-600">Phone: {tokenInfo?.quotation?.phone_number}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Service Details</h4>
                  <p className="text-sm text-gray-600">
                    Service Type: {tokenInfo?.quotation?.service_type === 'permit_acquisition' 
                      ? 'Permit Acquisition' 
                      : 'Compliance Monitoring'}
                  </p>
                  {tokenInfo?.quotation?.quickbooks_estimate_amount && (
                    <p className="text-sm font-medium text-green-700">
                      Total Amount: PHP {Number(tokenInfo.quotation.quickbooks_estimate_amount).toLocaleString()}
                    </p>
                  )}
                </div>

                {tokenInfo?.quotation?.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Description</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {tokenInfo.quotation.description}
                    </p>
                  </div>
                )}

                {tokenInfo?.quotation?.permit_requests && tokenInfo.quotation.permit_requests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Requested Permits</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {tokenInfo.quotation.permit_requests.map((permit, index) => (
                        <li key={index}>
                          {permit.permit_type 
                            ? `${permit.permit_type.agency?.name || ''} - ${permit.permit_type.name}` 
                            : permit.custom_name || 'Custom Permit'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Quotation Status</h4>
                  <p className="text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tokenInfo?.quotation?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      tokenInfo?.quotation?.status === 'approved' ? 'bg-green-100 text-green-800' :
                      tokenInfo?.quotation?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      tokenInfo?.quotation?.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tokenInfo?.quotation?.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    {tokenInfo?.action === 'approve' 
                      ? 'You are about to approve this quotation' 
                      : 'You are about to decline this quotation'}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    {tokenInfo?.action === 'approve'
                      ? 'By approving, you agree to the terms and conditions outlined in the quotation.'
                      : 'If you decline, the quotation will be canceled. You can contact us if you change your mind.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button 
            onClick={handleSubmitResponse}
            disabled={submitting}
            className={tokenInfo?.action === 'approve' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {tokenInfo?.action === 'approve' ? 'Confirm Approval' : 'Confirm Decline'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
