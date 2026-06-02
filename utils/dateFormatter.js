const moment = require('moment-jalaali');

moment.loadPersian({ dialect: 'persian-modern' });

// date & time format
exports.toJalali = (date, format = 'jYYYY/jMM/jDD HH:mm') => {
  if (!date) return '-';
  return moment(date).format(format);
};
// just date
exports.toJalaliDate = (date) => {
  if (!date) return '-';
  return moment(date).format('jYYYY/jMM/jDD');
};

// just time
exports.toJalaliTime = (date) => {
  if (!date) return '-';
  return moment(date).format('HH:mm');
};

// date format
exports.toJalaliShort = (date) => {
  if (!date) return '-';
  return moment(date).format('jYYYY/jMM/jDD');
};