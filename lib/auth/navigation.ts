// Full page load after sign-in/sign-out. A client-side router navigation can
// race the new auth cookies, leaving the old page rendered while the navbar
// already shows the new session; a real load makes middleware and server
// components read the updated cookies.
export function navigateAfterAuthChange(path: string) {
  window.location.assign(path)
}
