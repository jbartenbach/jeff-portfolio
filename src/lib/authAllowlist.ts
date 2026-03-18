export function getAdminEmailAllowlist(): string[] {
  const raw = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase()
  if (!raw) return []
  return raw
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedAdminEmail(email: string | null | undefined) {
  const list = getAdminEmailAllowlist()
  if (!list.length || !email) return false
  return list.includes(email.toLowerCase())
}

export function adminFirstName() {
  return (import.meta.env.VITE_ADMIN_FIRST_NAME || 'Jeff').trim() || 'Jeff'
}
