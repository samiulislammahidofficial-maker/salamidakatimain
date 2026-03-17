export function formatDistanceToNow(timestamp: number): string {
  const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (diffInSeconds < 60) return 'এইমাত্র';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ঘণ্টা আগে`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} দিন আগে`;
  
  return new Date(timestamp).toLocaleDateString('bn-BD');
}
