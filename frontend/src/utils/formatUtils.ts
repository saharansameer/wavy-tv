import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const getFormatTimestamp = (timestamp: Date) => {
  return dayjs(timestamp).fromNow();
};

export const getFormatNumber = (number: number) => {
  if (number < 1000) {
    return String(number);
  }

  if (number >= 1000 && number < 999999) {
    const formatted = `${(number / 1000).toFixed(1)}`;
    if (formatted.endsWith(".0")) {
      return `${formatted.slice(0, -2)}k`;
    }
    return `${formatted}k`;
  }

  if (number >= 1000000 && number < 999999999) {
    const formatted = `${(number / 1000000).toFixed(1)}`;
    if (formatted.endsWith(".0")) {
      return `${formatted.slice(0, -2)}M`;
    }
    return `${formatted}M`;
  }

  if (number >= 1000000000 && number < 999999999999) {
    const formatted = `${(number / 1000000000).toFixed(1)}`;
    if (formatted.endsWith(".0")) {
      return `${formatted.slice(0, -2)}B`;
    }
    return `${formatted}B`;
  }
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
