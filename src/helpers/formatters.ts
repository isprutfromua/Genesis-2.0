export const formatTime = (duration: number) => {
  if (duration <= 60) return `${duration} sec`;

  const min = Math.floor(duration / 60);
  const sec = duration % 60;

  return `${min} min ${sec} sec`;
};

export const truncateText = (description: string, size: number) => {
  return description.length > size
    ? description.substring(0, size).replace(/\s\S*$/, " ...")
    : description;
};

export const sortArrayByDateDesc = <T extends { [key: string]: any }>(
  array: T[],
  dateField: keyof T
): T[] => {
  if (!Array.isArray(array)) {
    throw new Error("Invalid input: array must be an array");
  }

  const sortedArray = array.map((obj) => JSON.parse(JSON.stringify(obj)));

  sortedArray.sort((a, b) => {
    const dateA = new Date(a[dateField])?.getTime() ?? 0;
    const dateB = new Date(b[dateField])?.getTime() ?? 0;
    return dateB - dateA;
  });

  return sortedArray;
};
