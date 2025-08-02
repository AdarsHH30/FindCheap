export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Helper function to handle both Django CSRF cookie format and custom format
export function getCSRFToken(): string | null {
  // Try Django's default name first
  let token = getCookie('csrftoken');
  
  // Fall back to custom name if needed
  if (!token) {
    token = getCookie('csrfToken');
  }
  
  return token;
}
