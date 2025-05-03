import { formatDistanceToNowStrict } from "date-fns";

export const getFormatNumber = (number: number) => {
  if (number < 1000) {
    return String(number);
  }

  if (number >= 1000 && number < 999999) {
    const formatted = (number / 1000).toFixed(1);
    if (formatted.endsWith(".0")) {
      return `${formatted.slice(0, -2)}k`;
    }
    return `${formatted}k`;
  }

  if (number >= 1000000 && number < 999999999) {
    const formatted = `${(number / 1000000).toFixed(1)}M`;
    if (formatted.endsWith(".0")) {
      return `${formatted.slice(0, -2)}k`;
    }
    return `${formatted}k`;
  }

  if (number >= 1000000000 && number < 999999999999) {
    const formatted = `${(number / 1000000000).toFixed(1)}B`;
    if (formatted.endsWith(".0")) {
      return `${formatted.slice(0, -2)}k`;
    }
    return `${formatted}k`;
  }
};

export const getFormatTimestamp = (timestamp: Date) => {
  return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
};

export const getFormatDuration = (sec: number) => {
  const minutes = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");

  if (sec >= 3600) {
    const hours = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
};
