export const formatTime = (duration) => {
  if (duration <= 60) return `${duration}m`;

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return `${hours}h ${minutes}m`;
};

export const truncateText = (description, size) => {
  return description.length > size
    ? description.substring(0, size).replace(/\s\S*$/, " ...")
    : description;
};
