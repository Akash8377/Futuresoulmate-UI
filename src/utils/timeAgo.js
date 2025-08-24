export function timeAgo(dateString) {
  if (!dateString) return "Unknown";

  // Try to parse the custom format "01 August 2025 at 3:28 pm"
  const parsed = parseCustomDate(dateString);
  if (!parsed) return "Invalid date";

  const now = new Date();
  const diffMs = now - parsed;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function parseCustomDate(dateStr) {
  try {
    const [datePart, timePart] = dateStr.split(" at ");
    if (!datePart || !timePart) return null;

    const date = new Date(`${datePart} ${timePart}`);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

// export const formatLastSeen = (timestamp) => {
//   if (!timestamp) return "Never seen";
//   if (timestamp === "online") return "Online";

//   const now = new Date();
//   const lastSeen = new Date(timestamp);
//   const diffInSeconds = Math.floor((now - lastSeen) / 1000);
  
//   // If same day
//   if (now.toDateString() === lastSeen.toDateString()) {
//     return `Today at ${lastSeen.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit'
//     })}`;
//   }

//   const days = Math.floor(diffInSeconds / (3600 * 24));
//   if (days === 1 || days === 0) return "Yesterday";
//   if (days <= 7) return `${days} days ago`;
  
//   return lastSeen.toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: days > 365 ? 'numeric' : undefined
//   });
// };

export const formatLastSeen = (timestamp) => {
  if (!timestamp) return "Never seen";
  if (timestamp === "online") return "Online";

  const now = new Date();
  const lastSeen = new Date(timestamp);
  const diffInSeconds = Math.floor((now - lastSeen) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);

  // If same day
  if (now.toDateString() === lastSeen.toDateString()) {
    if (diffInMinutes < 1) {
      return "Just now";
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return minutes > 0
      ? `${hours} hr ${minutes} min ago`
      : `${hours} hr ago`;
  }

  // Yesterday
  const days = Math.floor(diffInSeconds / (3600 * 24));
  if (days === 1 || days === 0) return "Yesterday";

  // Within last week
  if (days <= 7) return `${days} days ago`;

  // Older dates
  return lastSeen.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: days > 365 ? 'numeric' : undefined
  });
};
