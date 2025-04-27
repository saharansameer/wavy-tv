import { formatDistanceToNowStrict } from "date-fns";

export const getVideoViews = (views: number) => {
  if (views < 999) {
    return String(views);
  }

  if (views > 999 && views < 999999) {
    return String(`${(views / 1000).toFixed(1)}k`);
  }

  if (views > 999999 && views < 9999999) {
    return String(`${(views / 1000000).toFixed(1)}M`);
  }
};

export const getVideoTimestamp = (timestamp: Date) => {
  return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
};
