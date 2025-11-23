export const formatFullName = (firstName?: string, lastName?: string, patronym?: string) => {
  return `${firstName || ''} ${lastName || ''} ${patronym || ''}`.trim();
}