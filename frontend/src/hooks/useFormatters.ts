import { formatDistanceToNowStrict } from "date-fns";

export const useFormatNumber = (number: number) => {
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

export const useFormatTimestamp = (timestamp: Date) => {
  return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
};
