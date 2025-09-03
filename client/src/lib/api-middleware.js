/**
 * Authentication middleware for Next.js API routes
 * Passes JWT token from request headers to backend
 */

import { NextResponse } from 'next/server';

/**
 * Middleware to protect API routes with authentication
 * @param {Function} handler - The API route handler function
 * @param {Object} options - Configuration options
 * @param {boolean} options.isPublic - Whether this route is publicly accessible
 * @param {Array} options.allowedRoles - Optional array of roles allowed to access the route
 * @returns {Function} - Enhanced handler with authentication check
 */
export function withAuth(handler, options = {}) {
  const { isPublic = false, allowedRoles = [] } = options;
  return async function (request, params) {
    try {
      // If route is public, skip authentication
      if (isPublic) {
        return handler(request, params);
      }
      
      // Get the authorization header
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Extract the token
      const token = authHeader.split(' ')[1]; // Bearer TOKEN format
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Invalid authorization format' },
          { status: 401 }
        );
      }

      // We don't verify the token in the frontend
      // Just pass it to the backend API
      // The backend will verify the token
      
      // Call the original handler
      return handler(request, params);
    } catch (error) {
      console.error('API middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'API middleware error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper function to forward authentication token to backend API calls
 * @param {Object} request - Next.js API route request
 * @returns {Object} - Headers object with Authorization if available
 */
export function getAuthHeaders(request) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }
  
  return headers;
}
