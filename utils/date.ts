export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
} 