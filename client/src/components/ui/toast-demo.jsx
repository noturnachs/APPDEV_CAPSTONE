"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toastUtils from '@/lib/toast'

export function ToastDemo() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Toast Notifications Demo</h1>
        <p className="text-gray-600">Test all available toast notification types</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Toast Types */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Toast Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => toastUtils.success('Success!', 'Operation completed successfully.')}
              className="w-full"
            >
              Success Toast
            </Button>
            <Button 
              onClick={() => toastUtils.error('Error!', 'Something went wrong.')}
              variant="destructive"
              className="w-full"
            >
              Error Toast
            </Button>
            <Button 
              onClick={() => toastUtils.info('Info', 'Here is some information.')}
              variant="outline"
              className="w-full"
            >
              Info Toast
            </Button>
            <Button 
              onClick={() => toastUtils.warning('Warning', 'Please be careful.')}
              variant="outline"
              className="w-full"
            >
              Warning Toast
            </Button>
          </CardContent>
        </Card>

        {/* Quotation Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>Quotation Toasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => toastUtils.quotation.created()}
              className="w-full"
            >
              Quotation Created
            </Button>
            <Button 
              onClick={() => toastUtils.quotation.updated()}
              className="w-full"
            >
              Quotation Updated
            </Button>
            <Button 
              onClick={() => toastUtils.quotation.deleted()}
              className="w-full"
            >
              Quotation Deleted
            </Button>
            <Button 
              onClick={() => toastUtils.quotation.sent()}
              className="w-full"
            >
              Quotation Sent
            </Button>
            <Button 
              onClick={() => toastUtils.quotation.copied()}
              variant="outline"
              className="w-full"
            >
              ID Copied
            </Button>
          </CardContent>
        </Card>

        {/* Authentication Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Toasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => toastUtils.auth.loginSuccess()}
              className="w-full"
            >
              Login Success
            </Button>
            <Button 
              onClick={() => toastUtils.auth.loginError()}
              variant="destructive"
              className="w-full"
            >
              Login Error
            </Button>
            <Button 
              onClick={() => toastUtils.auth.logout()}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
            <Button 
              onClick={() => toastUtils.auth.sessionExpired()}
              variant="outline"
              className="w-full"
            >
              Session Expired
            </Button>
          </CardContent>
        </Card>

        {/* Form Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>Form Toasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => toastUtils.form.validationError()}
              variant="destructive"
              className="w-full"
            >
              Validation Error
            </Button>
            <Button 
              onClick={() => toastUtils.form.saved()}
              className="w-full"
            >
              Changes Saved
            </Button>
            <Button 
              onClick={() => toastUtils.form.unsavedChanges()}
              variant="outline"
              className="w-full"
            >
              Unsaved Changes
            </Button>
          </CardContent>
        </Card>

        {/* API Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>API Toasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => toastUtils.api.networkError()}
              variant="destructive"
              className="w-full"
            >
              Network Error
            </Button>
            <Button 
              onClick={() => toastUtils.api.serverError()}
              variant="destructive"
              className="w-full"
            >
              Server Error
            </Button>
            <Button 
              onClick={() => toastUtils.api.timeout()}
              variant="destructive"
              className="w-full"
            >
              Request Timeout
            </Button>
          </CardContent>
        </Card>

        {/* QuickBooks Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>QuickBooks Toasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => toastUtils.quickbooks.connected()}
              className="w-full"
            >
              QuickBooks Connected
            </Button>
            <Button 
              onClick={() => toastUtils.quickbooks.syncSuccess()}
              className="w-full"
            >
              Sync Success
            </Button>
            <Button 
              onClick={() => toastUtils.quickbooks.syncError()}
              variant="destructive"
              className="w-full"
            >
              Sync Error
            </Button>
          </CardContent>
        </Card>

        {/* Custom Toast */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Toast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => toastUtils.custom('Custom Message', {
                description: 'This is a custom toast with action',
                action: {
                  label: 'Undo',
                  onClick: () => console.log('Undo clicked')
                }
              })}
              className="w-full"
            >
              Custom Toast with Action
            </Button>
            <Button 
              onClick={() => toastUtils.custom('Long Duration Toast', {
                description: 'This toast will stay for 10 seconds',
                duration: 10000
              })}
              variant="outline"
              className="w-full"
            >
              Long Duration Toast
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 