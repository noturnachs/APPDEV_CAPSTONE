import { toast } from 'sonner'

// Toast utility functions for consistent messaging
export const toastUtils = {
  // Success notifications
  success: (message, description = null) => {
    toast.success(message, {
      description,
      duration: 4000,
    })
  },

  // Error notifications
  error: (message, description = null) => {
    toast.error(message, {
      description,
      duration: 6000,
    })
  },

  // Info notifications
  info: (message, description = null) => {
    toast.info(message, {
      description,
      duration: 4000,
    })
  },

  // Warning notifications
  warning: (message, description = null) => {
    toast.warning(message, {
      description,
      duration: 5000,
    })
  },

  // Custom notifications with actions
  custom: (message, options = {}) => {
    toast(message, {
      duration: options.duration || 4000,
      description: options.description,
      action: options.action,
      ...options,
    })
  },

  // Quotation-specific notifications
  quotation: {
    created: () => toastUtils.success(
      'Quotation Created Successfully!',
      'Your quotation has been submitted and a confirmation email will be sent shortly.'
    ),
    
    updated: () => toastUtils.success(
      'Quotation Updated Successfully!',
      'The quotation details have been saved.'
    ),
    
    deleted: () => toastUtils.success(
      'Quotation Deleted Successfully!',
      'The quotation has been removed from the system.'
    ),
    
    sent: () => toastUtils.success(
      'Quotation Sent to Client!',
      'The estimate has been sent via QuickBooks.'
    ),
    
    error: (action = 'processing') => toastUtils.error(
      `Failed to ${action} quotation`,
      'Please try again or contact support if the problem persists.'
    ),
    
    copied: () => toastUtils.info(
      'Quotation ID Copied!',
      'The quotation ID has been copied to your clipboard.'
    ),
    
    emailSent: () => toastUtils.success(
      'Confirmation Email Sent!',
      'A confirmation email with your quotation details has been sent to your email address.'
    ),
  },

  // Authentication notifications
  auth: {
    loginSuccess: () => toastUtils.success(
      'Login Successful!',
      'Welcome back to Alpha Environmental Systems.'
    ),
    
    loginError: () => toastUtils.error(
      'Login Failed',
      'Please check your credentials and try again.'
    ),
    
    logout: () => toastUtils.info(
      'Logged Out Successfully',
      'You have been logged out of your account.'
    ),
    
    sessionExpired: () => toastUtils.warning(
      'Session Expired',
      'Please log in again to continue.'
    ),
  },

  // Form notifications
  form: {
    validationError: () => toastUtils.error(
      'Please Fix Form Errors',
      'Please check the highlighted fields and try again.'
    ),
    
    saved: () => toastUtils.success(
      'Changes Saved Successfully!',
      'Your changes have been saved.'
    ),
    
    unsavedChanges: () => toastUtils.warning(
      'Unsaved Changes',
      'You have unsaved changes. Please save before leaving.'
    ),
  },

  // API notifications
  api: {
    networkError: () => toastUtils.error(
      'Network Error',
      'Unable to connect to the server. Please check your connection.'
    ),
    
    serverError: () => toastUtils.error(
      'Server Error',
      'Something went wrong on our end. Please try again later.'
    ),
    
    timeout: () => toastUtils.error(
      'Request Timeout',
      'The request took too long. Please try again.'
    ),
  },

  // QuickBooks notifications
  quickbooks: {
    connected: () => toastUtils.success(
      'QuickBooks Connected!',
      'Your QuickBooks account has been successfully linked.'
    ),
    
    syncSuccess: () => toastUtils.success(
      'QuickBooks Sync Successful!',
      'Your data has been synchronized with QuickBooks.'
    ),
    
    syncError: () => toastUtils.error(
      'QuickBooks Sync Failed',
      'Unable to sync with QuickBooks. Please check your connection.'
    ),
  },
}

// Export the base toast function for custom usage
export { toast }

// Export default as toastUtils for easy import
export default toastUtils 