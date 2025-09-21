import dayjs from "./dayjs";

export function formatDates(_start: Date, _end?: Date) {
  const start = dayjs(_start);
  const end = dayjs(_end || _start);

  if (start.isSame(end, "day")) {
    return start.format("Do MMMM YYYY");
  }
  if (start.isSame(end, "month")) {
    return `${start.format("Do")}-${end.format("Do MMMM YYYY")}`;
  }
  if (start.isSame(end, "year")) {
    return `${start.format("Do MMMM")}-${end.format("Do MMMM YYYY")}`;
  }
  return `${start.format("Do MMMM YYYY")}-${end.format("Do MMMM YYYY")}`;
}
