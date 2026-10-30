import { API_BASE } from "../services/api";

/**
 * Checks if the current user session is valid via /profile
 */
export async function checkAuthProfile() {
  return fetch(`${API_BASE}/profile`, {
    method: "GET",
    credentials: "include",
  });
}

/**
 * Checks if the current authenticated user has admin privileges via /admin/me
 */
export async function checkAdminStatus() {
  return fetch(`${API_BASE}/admin/me`, {
    method: "GET",
    credentials: "include",
  });
}

/**
 * Retrieves the CSRF token needed for state-changing requests
 */
export async function getCsrfToken() {
  return fetch(`${API_BASE}/csrf`, {
    method: "GET",
    credentials: "include",
  });
}

/**
 * Sends logout request with CSRF token header
 */
export async function logoutUser(csrfToken) {
  return fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
}

/**
 * Submits registration data
 */
export async function registerUser(formData) {
  return fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
}

/**
 * Submits OTP verification data
 */
export async function verifyEmailOtp(verificationData) {
  return fetch(`${API_BASE}/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verificationData),
  });
}

/**
 * Submits login credentials
 */
export async function loginUser(loginData) {
  return fetch(`${API_BASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
}
