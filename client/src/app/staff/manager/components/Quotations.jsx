"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search, Filter, Eye, Edit, Send, Loader2, Copy, Trash2, AlertTriangle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import QuotationDetailSection from './QuotationDetailSection'
import QuotationDetailModal from './QuotationDetailModal'
import toastUtils from '@/lib/toast'

// API client for quotations
const quotationsAPI = {
  getAll: async () => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch('/api/quotations', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    if (!response.ok) throw new Error('Failed to fetch quotations')
    const data = await response.json()
    return data.quotations || []
  },
  getById: async (id) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch(`/api/quotations/${id}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    if (!response.ok) throw new Error('Failed to fetch quotation')
    const data = await response.json()
    return data.quotation
  },
  update: async (id, data) => {
    const url = `/api/quotations/${id}`
    console.log('🔍 Making PUT request to:', url)
    console.log('🔍 Request data:', data)
    console.log('🔍 Full URL will be:', window.location.origin + url)
    
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data),
    })
    
    console.log('🔍 Response status:', response.status)
    console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Update quotation error:', response.status, errorData)
      throw new Error(`Failed to update quotation: ${response.status} ${errorData}`)
    }
    return await response.json()
  },
  delete: async (id) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch(`/api/quotations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    if (!response.ok) throw new Error('Failed to delete quotation')
    return await response.json()
  },
  send: async (id) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    // Use the custom email sender endpoint
    const response = await fetch(`/api/custom-quotations/${id}/send-custom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to send quotation')
    }
    return await response.json()
  },
  // Original QuickBooks send method (kept for backward compatibility)
  sendViaQuickBooks: async (id) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch(`/api/quotations/${id}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to send quotation')
    }
    return await response.json()
  },
  addPermit: async (quotationId, permitTypeId) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch(`/api/quotations/${quotationId}/permits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ permit_type_id: permitTypeId }),
    })
    if (!response.ok) throw new Error('Failed to add permit')
    return await response.json()
  },
  removePermit: async (quotationId, permitId) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch(`/api/quotations/${quotationId}/permits/${permitId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    if (!response.ok) throw new Error('Failed to remove permit')
    return await response.json()
  },
  getAvailablePermits: async () => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch('/api/quotations/available-permits', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    if (!response.ok) throw new Error('Failed to fetch available permits')
    const data = await response.json()
    return data.agencies || []
  },
  getQuotationPermits: async (quotationId) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch(`/api/quotations/${quotationId}/permits`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    if (!response.ok) throw new Error('Failed to fetch quotation permits')
    const data = await response.json()
    return data.permits || []
  }
}

const Quotations = () => {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [syncStatus, setSyncStatus] = useState("")

  // Detail section state
  const [showDetailSection, setShowDetailSection] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalQuotation, setModalQuotation] = useState(null)
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [quotationToDelete, setQuotationToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Send confirmation modal state
  const [showSendModal, setShowSendModal] = useState(false)
  const [quotationToSend, setQuotationToSend] = useState(null)
  const [isSending, setIsSending] = useState(false)

  // Filter states
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fetch quotations from API
  const fetchQuotations = async () => {
    try {
      setLoading(true)
      const data = await quotationsAPI.getAll()
      setQuotations(data)
    } catch (err) {
      setError(err.message)
      toastUtils.api.networkError()
    } finally {
      setLoading(false)
    }
  }

  // Handle view/edit detail section
  const handleViewEdit = React.useCallback(async (quotation) => {
    try {
      setLoading(true)
      setError("") // Clear any previous errors
      const data = await quotationsAPI.getById(quotation.id)
      setSelectedQuotation(data)
      setShowDetailSection(true)
    } catch (err) {
      console.error('Error fetching quotation details:', err)
      toastUtils.error(
        'Failed to load quotation details', 
        'Please make sure the backend server is running and try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle back to quotations list
  const handleBackToList = React.useCallback(() => {
    setShowDetailSection(false)
    setSelectedQuotation(null)
  }, [])

  // Handle view quotation summary modal
  const handleViewSummary = React.useCallback((quotation) => {
    setModalQuotation(quotation)
    setShowModal(true)
  }, [])

  // Handle close modal
  const handleCloseModal = React.useCallback(() => {
    setShowModal(false)
    setModalQuotation(null)
  }, [])

  // Handle "Full Details" button from modal
  const handleViewFullDetails = React.useCallback(async (quotation) => {
    // Close modal first
    setShowModal(false)
    setModalQuotation(null)
    
    // Then open full detail section
    try {
      setLoading(true)
      setError("") // Clear any previous errors
      const data = await quotationsAPI.getById(quotation.id)
      setSelectedQuotation(data)
      setShowDetailSection(true)
    } catch (error) {
      console.error('Error fetching quotation details:', error)
      setError('Failed to load quotation details')
      toastUtils.quotation.error('load')
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle save quotation
  const handleSaveQuotation = React.useCallback(async (updatedData) => {
    try {
      console.log('handleSaveQuotation called with:', updatedData)
      console.log('selectedQuotation.id:', selectedQuotation?.id)
      
      // Filter the data to only include fields that the backend expects
      const filteredData = {
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        email: updatedData.email,
        phone_number: updatedData.phone_number,
        company_name: updatedData.company_name,
        service_type: updatedData.service_type,
        description: updatedData.description,
        status: updatedData.status
      }
      
      console.log('Sending filtered data:', filteredData)
      console.log('Making PUT request to:', `/api/quotations/${selectedQuotation.id}`)
      
      const result = await quotationsAPI.update(selectedQuotation.id, filteredData)
      
      // Update the selected quotation with the response data
      setSelectedQuotation(result.quotation)
      
      // Update the quotation in the list without full refresh
      setQuotations(prev => prev.map(q => 
        q.id === selectedQuotation.id 
          ? { ...q, ...result.quotation }
          : q
      ))
      
      toastUtils.quotation.updated()
      return result
    } catch (error) {
      console.error('Error saving quotation:', error)
      toastUtils.quotation.error('save')
      throw error
    }
  }, [selectedQuotation])



  // Handle send to client (show modal)
  const handleSendToClient = React.useCallback((quotation) => {
    // Check if already sent
    if (quotation.status === 'sent') {
      toastUtils.error(
        'Already sent',
        'This quotation has already been sent to the client.'
      )
      return
    }

    // For custom email, we still prefer to have a QuickBooks estimate but it's not required
    if (!quotation.quickbooks_estimate_id) {
      console.warn('No QuickBooks estimate found, but proceeding with custom email sender')
    }

    setQuotationToSend(quotation)
    setShowSendModal(true)
  }, [])

  // Handle copy ID
  const handleCopyId = React.useCallback(async (quotation) => {
    try {
      await navigator.clipboard.writeText(quotation.id.toString())
      toastUtils.quotation.copied()
    } catch (error) {
      console.error('Error copying ID:', error)
      toastUtils.error('Failed to copy quotation ID', 'Please try again or copy manually.')
    }
  }, [])

  // Handle delete quotation (from table)
  const handleDelete = React.useCallback((quotation) => {
    setQuotationToDelete(quotation)
    setShowDeleteModal(true)
  }, [])

  // Confirm delete quotation (handles both table and detail section)
  const handleConfirmDelete = React.useCallback(async () => {
    if (!quotationToDelete) return
    
    try {
      setIsDeleting(true)
      console.log('Deleting quotation:', quotationToDelete.id)
      await quotationsAPI.delete(quotationToDelete.id)
      
      // Remove the quotation from the local state without full refresh
      setQuotations(prev => prev.filter(q => q.id !== quotationToDelete.id))
      
      // Close modal and reset state first
      setShowDeleteModal(false)
      setQuotationToDelete(null)
      
      // If we're in detail section, close it since the quotation is deleted
      if (showDetailSection && selectedQuotation?.id === quotationToDelete.id) {
        // Use setTimeout to ensure clean state transitions
        setTimeout(() => {
          setShowDetailSection(false)
          setSelectedQuotation(null)
          // Also ensure no modal state is left over
          setShowModal(false)
          setModalQuotation(null)
        }, 100)
      }
      
      toastUtils.quotation.deleted()
    } catch (error) {
      console.error('Error deleting quotation:', error)
      toastUtils.quotation.error('delete')
    } finally {
      setIsDeleting(false)
    }
  }, [quotationToDelete, showDetailSection, selectedQuotation])

  // Handle delete quotation (from detail section)
  const handleDeleteQuotation = React.useCallback((quotation) => {
    setQuotationToDelete(quotation)
    setShowDeleteModal(true)
  }, [])

  // Cancel delete
  const handleCancelDelete = React.useCallback(() => {
    setShowDeleteModal(false)
    setQuotationToDelete(null)
  }, [])

  // Handle confirm send
  const handleConfirmSend = React.useCallback(async () => {
    if (!quotationToSend) return
    
    try {
      setIsSending(true)
      console.log('📧 Sending quotation to client:', quotationToSend.id)
      
      const result = await quotationsAPI.send(quotationToSend.id)
      
      // Update the quotation status in local state
      setQuotations(prev => prev.map(q => 
        q.id === quotationToSend.id 
          ? { ...q, status: 'sent' }
          : q
      ))

      // If we're in detail view and this is the selected quotation, update it too
      if (selectedQuotation?.id === quotationToSend.id) {
        setSelectedQuotation(prev => ({ ...prev, status: 'sent' }))
      }

      // Close modal and reset state
      setShowSendModal(false)
      setQuotationToSend(null)

      toastUtils.quotation.sent()
      console.log('✅ Quotation sent successfully:', result)
    } catch (error) {
      console.error('❌ Error sending to client:', error)
      toastUtils.quotation.error('send')
    } finally {
      setIsSending(false)
    }
  }, [quotationToSend, selectedQuotation])

  // Handle cancel send
  const handleCancelSend = React.useCallback(() => {
    setShowSendModal(false)
    setQuotationToSend(null)
  }, [])

  // Define columns inside component to access functions
  const columns = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "company_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Client Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">
          <div>{row.getValue("company_name")}</div>
          <div className="text-sm text-gray-500">
            {row.original.first_name} {row.original.last_name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "service_type",
      header: "Service Type",
      cell: ({ row }) => {
        const serviceType = row.getValue("service_type")
        const displayName = serviceType === 'permit_acquisition' ? 'Permit Acquisition' : 'Compliance Monitoring'
        return <div className="capitalize">{displayName}</div>
      },
    },
    {
      accessorKey: "quickbooks_estimate_amount",
      header: "Estimate Amount",
      cell: ({ row }) => {
        const estimateAmount = row.getValue("quickbooks_estimate_amount")
        return (
          <div>
            {estimateAmount ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
                ₱{Number(estimateAmount).toLocaleString()}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                Not Created
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        const statusStyles = {
          pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
          approved: "bg-green-100 text-green-700 border border-green-200",
          rejected: "bg-red-100 text-red-700 border border-red-200",
          sent: "bg-blue-100 text-blue-700 border border-blue-200",
        }
        
        return (
          <Badge className={`${statusStyles[status] || "bg-gray-100 text-gray-700 border border-gray-200"}`}>
            {status.toUpperCase()}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "send",
      header: "Send",
      enableHiding: false,
      cell: ({ row }) => {
        const quotation = row.original
        return (
          <Button
            variant="ghost"
            size="sm"
            disabled={quotation.status === 'sent'}
            onClick={(e) => {
              e.stopPropagation()
              handleSendToClient(quotation)
            }}
            className="text-gray-700 hover:text-[#106934] hover:bg-transparent disabled:text-gray-400 disabled:hover:text-gray-400"
          >
            <Send className="mr-2 h-4 w-4" />
            {quotation.status === 'sent' ? 'Sent' : 'Send'}
          </Button>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const quotation = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewEdit(quotation)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                View & Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyId(quotation)
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(quotation)
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [handleViewEdit, handleCopyId, handleDelete, handleSendToClient])

  // Fetch quotations on component mount
  useEffect(() => {
    fetchQuotations()
  }, [])

  // Filter data based on active tab (service), search query, and status filter
  const filteredData = React.useMemo(() => {
    let filtered = quotations

    // Filter by service tab
    if (activeTab !== "all") {
      filtered = filtered.filter(item => {
        const serviceType = item.service_type
        if (activeTab === "permit") {
          return serviceType === 'permit_acquisition'
        }
        if (activeTab === "compliance") {
          return serviceType === 'monitoring'
        }
        return true
      })
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [quotations, activeTab, searchQuery, statusFilter])

  // Get counts for each service type
  const serviceCounts = React.useMemo(() => {
    const counts = { all: quotations.length, permit: 0, compliance: 0 }
    quotations.forEach(item => {
      if (item.service_type === 'permit_acquisition') {
        counts.permit++
      } else if (item.service_type === 'monitoring') {
        counts.compliance++
      }
    })
    return counts
  }, [quotations])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  if (loading) {
    return (
      <div className="w-full p-6 bg-white">
      <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#106934]" />
            <span className="text-gray-600">Loading quotations...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
  return (
      <div className="w-full p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {error.includes('Failed to fetch') 
                  ? 'Unable to connect to the server. Please make sure the backend server is running on port 3001.'
                  : error
                }
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    setError("")
                    fetchQuotations()
                  }} 
                  className="bg-[#106934] hover:bg-[#0d4f29] w-full"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()} 
                  className="w-full"
                >
                  Refresh Page
                </Button>
        </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show detail section if selected
  if (showDetailSection && selectedQuotation) {
    return (
      <>
        <QuotationDetailSection
          quotation={selectedQuotation}
          onBack={handleBackToList}
          onSave={handleSaveQuotation}
          onDelete={handleDeleteQuotation}
          onSendToClient={handleSendToClient}
        />
        
        {/* Modals - Always available even in detail view */}
        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Delete Quotation</span>
              </DialogTitle>
              <DialogDescription className="pt-2">
                Are you sure you want to delete quotation <span className="font-semibold">#{quotationToDelete?.id}</span>?
              </DialogDescription>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">This action will:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Permanently delete the quotation from the database</li>
                    <li>Remove the associated QuickBooks estimate</li>
                    <li>Delete all related permit requests</li>
                  </ul>
                </div>
                <p className="text-red-600 font-medium text-sm">This action cannot be undone.</p>
              </div>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Quotation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Confirmation Modal */}
        <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-green-600" />
                <span>Send Quotation to Client</span>
              </DialogTitle>
              <DialogDescription className="pt-2">
                Are you sure you want to send quotation <span className="font-semibold">#{quotationToSend?.id}</span> to the client?
              </DialogDescription>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">This action will:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Email the quotation PDF to <strong>{quotationToSend?.email}</strong></li>
                    <li>Include approval and decline buttons in the email</li>
                    <li>Mark the quotation status as "sent"</li>
                    <li>Send via Alpha Systems custom email system</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-600 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Client: {quotationToSend?.first_name} {quotationToSend?.last_name}</p>
                      <p className="text-sm text-blue-700">Company: {quotationToSend?.company_name || 'N/A'}</p>
                      <p className="text-sm text-blue-700">Amount: ₱{quotationToSend?.quickbooks_estimate_amount ? Number(quotationToSend.quickbooks_estimate_amount).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCancelSend}
                disabled={isSending}
                className="flex items-center space-x-2"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSend}
                disabled={isSending}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m12 2 1.09 3.26L16 4l-1.74 3.26L12 10l-2.26-2.74L8 4l2.91 1.26L12 2z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send to Client
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Show quotations list
  return (
    <div className="w-full p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quotations Management</h1>
        <p className="text-gray-600 mt-2">Manage and track all quotation requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#106934]">{quotations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {quotations.filter(q => q.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-green-600">
              {quotations.filter(q => q.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QuickBooks Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {quotations.filter(q => q.quickbooks_estimate_id).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search quotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
              />
            </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-green-50 text-green-700" : ""}
              >
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter("pending")}
                className={statusFilter === "pending" ? "bg-green-50 text-green-700" : ""}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter("approved")}
                className={statusFilter === "approved" ? "bg-green-50 text-green-700" : ""}
              >
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter("rejected")}
                className={statusFilter === "rejected" ? "bg-green-50 text-green-700" : ""}
              >
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter("sent")}
                className={statusFilter === "sent" ? "bg-green-50 text-green-700" : ""}
              >
                Sent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
          </div>

      {/* Service Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="all" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)] data-[state=active]:shadow-sm">
            All Services
          </TabsTrigger>
          <TabsTrigger value="permit" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)] data-[state=active]:shadow-sm">
            Permit Acquisition
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-muted-foreground/20 text-muted-foreground rounded-full data-[state=active]:bg-[var(--primary-foreground)]/20 data-[state=active]:text-[var(--primary-foreground)]">
              {serviceCounts.permit}
            </span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)] data-[state=active]:shadow-sm">
            Compliance & Assessment
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-muted-foreground/20 text-muted-foreground rounded-full data-[state=active]:bg-[var(--primary-foreground)]/20 data-[state=active]:text-[var(--primary-foreground)]">
              {serviceCounts.compliance}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-white">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-gray-900 font-semibold border-b border-gray-200">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 transition-colors bg-white border-b border-gray-100 cursor-pointer"
                      onClick={() => handleViewSummary(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-gray-900">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-500"
                    >
                      {quotations.length === 0 ? "No quotations found in database." : "No quotations match your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-gray-600">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
            <div className="flex-1 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious 
                    onClick={() => table.previousPage()}
                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                  {Array.from({ length: table.getPageCount() }, (_, i) => (
                    <PaginationLink
                      key={i}
                      onClick={() => table.setPageIndex(i)}
                      isActive={table.getState().pagination.pageIndex === i}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  ))}
                  <PaginationNext 
                    onClick={() => table.nextPage()}
                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationContent>
              </Pagination>
            </div>
            <div className="flex-1"></div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quotation Summary Modal */}
      <QuotationDetailModal
        quotation={modalQuotation}
        isOpen={showModal}
        onClose={handleCloseModal}
        onViewFullDetails={handleViewFullDetails}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Delete Quotation</span>
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete quotation <span className="font-semibold">#{quotationToDelete?.id}</span>?
            </DialogDescription>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">This action will:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                  <li>Permanently delete the quotation from the database</li>
                  <li>Remove the associated QuickBooks estimate</li>
                  <li>Delete all related permit requests</li>
                </ul>
              </div>
              <p className="text-red-600 font-medium text-sm">This action cannot be undone.</p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
              <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
              </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Quotation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-green-600" />
              <span>Send Quotation to Client</span>
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to send quotation <span className="font-semibold">#{quotationToSend?.id}</span> to the client?
            </DialogDescription>
            <div className="mt-4 space-y-3">
                              <div>
                  <p className="text-sm text-gray-600 mb-2">This action will:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Email the quotation PDF to <strong>{quotationToSend?.email}</strong></li>
                    <li>Include approval and decline buttons in the email</li>
                    <li>Mark the quotation status as "sent"</li>
                    <li>Send via Alpha Systems custom email system</li>
                  </ul>
                </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Client: {quotationToSend?.first_name} {quotationToSend?.last_name}</p>
                    <p className="text-sm text-blue-700">Company: {quotationToSend?.company_name || 'N/A'}</p>
                    <p className="text-sm text-blue-700">Amount: ₱{quotationToSend?.quickbooks_estimate_amount ? Number(quotationToSend.quickbooks_estimate_amount).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
                  </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
                <Button
                  variant="outline"
              onClick={handleCancelSend}
              disabled={isSending}
              className="flex items-center space-x-2"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
                    </Button>
                    <Button 
              onClick={handleConfirmSend}
              disabled={isSending}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m12 2 1.09 3.26L16 4l-1.74 3.26L12 10l-2.26-2.74L8 4l2.91 1.26L12 2z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to Client
                  </>
                )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Quotations
