# Toast Notification System

This project uses **Sonner** for toast notifications, integrated with shadcn/ui design patterns.

## 🚀 Quick Start

### Import the toast utilities:
```javascript
import toastUtils from '@/lib/toast'
```

### Basic Usage:
```javascript
// Success notification
toastUtils.success('Operation completed!', 'Details here')

// Error notification
toastUtils.error('Something went wrong', 'Error details')

// Info notification
toastUtils.info('Information', 'Additional details')

// Warning notification
toastUtils.warning('Warning', 'Be careful')
```

## 📋 Available Toast Categories

### 1. **Quotation Toasts**
```javascript
toastUtils.quotation.created()     // Quotation created successfully
toastUtils.quotation.updated()     // Quotation updated successfully
toastUtils.quotation.deleted()     // Quotation deleted successfully
toastUtils.quotation.sent()        // Quotation sent to client
toastUtils.quotation.copied()      // Quotation ID copied
toastUtils.quotation.error('save') // Generic quotation error
```

### 2. **Authentication Toasts**
```javascript
toastUtils.auth.loginSuccess()     // Login successful
toastUtils.auth.loginError()       // Login failed
toastUtils.auth.logout()           // Logout successful
toastUtils.auth.sessionExpired()   // Session expired
```

### 3. **Form Toasts**
```javascript
toastUtils.form.validationError()  // Form validation failed
toastUtils.form.saved()            // Changes saved
toastUtils.form.unsavedChanges()   // Unsaved changes warning
```

### 4. **API Toasts**
```javascript
toastUtils.api.networkError()      // Network connection error
toastUtils.api.serverError()       // Server error
toastUtils.api.timeout()           // Request timeout
```

### 5. **QuickBooks Toasts**
```javascript
toastUtils.quickbooks.connected()  // QuickBooks connected
toastUtils.quickbooks.syncSuccess() // Sync successful
toastUtils.quickbooks.syncError()   // Sync failed
```

## 🎨 Custom Toasts

### Basic Custom Toast:
```javascript
toastUtils.custom('Custom Message', {
  description: 'Additional details',
  duration: 5000 // 5 seconds
})
```

### Toast with Action:
```javascript
toastUtils.custom('Action Required', {
  description: 'Do you want to proceed?',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo clicked')
  }
})
```

## 📍 Toast Positioning

Toasts appear in the **top-right corner** by default. The position is configured in the `Toaster` component.

## ⏱️ Duration Settings

- **Success/Info**: 4 seconds
- **Warning**: 5 seconds  
- **Error**: 6 seconds
- **Custom**: Configurable

## 🎯 Usage Examples

### In Quotation Management:
```javascript
// Copy quotation ID
const handleCopyId = async (quotation) => {
  try {
    await navigator.clipboard.writeText(quotation.id.toString())
    toastUtils.quotation.copied()
  } catch (error) {
    toastUtils.error('Failed to copy ID', 'Please try again')
  }
}
```

### In Form Submission:
```javascript
const handleSubmit = async (data) => {
  try {
    await api.submit(data)
    toastUtils.quotation.created()
  } catch (error) {
    toastUtils.quotation.error('submit')
  }
}
```

### In Authentication:
```javascript
const handleLogin = async (credentials) => {
  try {
    const response = await authAPI.login(credentials)
    toastUtils.auth.loginSuccess()
    // Redirect...
  } catch (error) {
    toastUtils.auth.loginError()
  }
}
```

## 🔧 Configuration

The toast system is configured in:
- `client/src/components/ui/sonner.jsx` - Toaster component
- `client/src/lib/toast.js` - Toast utilities
- `client/src/app/layout.js` - Global Toaster placement

## 🎨 Styling

Toasts follow your project's design system:
- **Colors**: Green theme (#106934)
- **Typography**: Consistent with app fonts
- **Spacing**: Matches component spacing
- **Shadows**: Subtle elevation

## 🚀 Demo

Use the `ToastDemo` component to test all toast types:
```javascript
import { ToastDemo } from '@/components/ui/toast-demo'
```

---

**Built with:** [Sonner](https://ui.shadcn.com/docs/components/sonner) + shadcn/ui 