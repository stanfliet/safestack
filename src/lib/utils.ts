export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 2 }).format(amount);
}
export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return '';
  return new Intl.DateTimeFormat('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));
}
export function getStatusColor(status: string): string {
  const c: Record<string,string> = {
    active:'bg-green-100 text-green-800', inactive:'bg-gray-100 text-gray-800',
    draft:'bg-yellow-100 text-yellow-800', completed:'bg-blue-100 text-blue-800',
    approved:'bg-green-100 text-green-800', rejected:'bg-red-100 text-red-800',
    pending:'bg-yellow-100 text-yellow-800', in_progress:'bg-blue-100 text-blue-800',
    closed:'bg-gray-100 text-gray-800', critical:'bg-red-100 text-red-800',
    high:'bg-orange-100 text-orange-800', medium:'bg-yellow-100 text-yellow-800',
    low:'bg-green-100 text-green-800', open:'bg-red-100 text-red-800',
    planning:'bg-purple-100 text-purple-800', construction:'bg-blue-100 text-blue-800',
    handover:'bg-green-100 text-green-800', scheduled:'bg-blue-100 text-blue-800',
    submitted:'bg-purple-100 text-purple-800', won:'bg-green-100 text-green-800',
    lost:'bg-red-100 text-red-800', cancelled:'bg-gray-100 text-gray-800',
    compliant:'bg-green-100 text-green-700', non_compliant:'bg-red-100 text-red-700',
    not_applicable:'bg-gray-100 text-gray-500',
    published:'bg-green-100 text-green-800', pending_payment:'bg-yellow-100 text-yellow-800',
    processing:'bg-blue-100 text-blue-800', pending_review:'bg-yellow-100 text-yellow-800',
    reviewed:'bg-blue-100 text-blue-800', issued:'bg-green-100 text-green-800',
    revoked:'bg-red-100 text-red-800', generating:'bg-blue-100 text-blue-800',
    beginner:'bg-green-100 text-green-700', intermediate:'bg-yellow-100 text-yellow-700',
    advanced:'bg-orange-100 text-orange-700',
  };
  return c[status] || 'bg-gray-100 text-gray-800';
}
export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
export function generateCertNumber(): string {
  const prefix = 'SC';
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}
