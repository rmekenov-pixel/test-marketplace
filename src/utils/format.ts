export const formatKZT = (amount: number): string => {
  return new Intl.NumberFormat('ru-KZ', {
    maximumFractionDigits: 0,
  }).format(amount) + ' ₸';
};

export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
};
