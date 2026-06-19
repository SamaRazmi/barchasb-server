import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

// date & time format
export const toJalali = (
  date: Date | string | null | undefined,
  format: string = "jYYYY/jMM/jDD HH:mm",
): string => {
  if (!date) return "-";
  return moment(date).format(format);
};

// just date
export const toJalaliDate = (
  date: Date | string | null | undefined,
): string => {
  if (!date) return "-";
  return moment(date).format("jYYYY/jMM/jDD");
};

// just time
export const toJalaliTime = (
  date: Date | string | null | undefined,
): string => {
  if (!date) return "-";
  return moment(date).format("HH:mm");
};

// short date format
export const toJalaliShort = (
  date: Date | string | null | undefined,
): string => {
  if (!date) return "-";
  return moment(date).format("jYYYY/jMM/jDD");
};
