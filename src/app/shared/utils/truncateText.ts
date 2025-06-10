export const truncateText = (text: string, maxLength: number): string => {
  if (!text) {
    return '';
  }

  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  } else {
    return text;
  }
};
