// A lightweight, dependency-free Jalali date converter
function gregorianToJalali(gy: number, gm: number, gd: number): { jy: number; jm: number; jd: number } {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = (days < 186) ? (1 + Math.floor(days / 31)) : (7 + Math.floor((days - 186) / 30));
  const jd = 1 + (days % ((jm < 7) ? 31 : 30));
  return { jy, jm, jd };
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : String(num);
}

export const getJalaliNow = (): { date: string; time: string } => {
  const now = new Date();
  const { jy, jm, jd } = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const date = `${jy}/${padZero(jm)}/${padZero(jd)}`;
  const time = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
  return { date, time };
};

export const formatJalali = (dateString: string): string => {
  const parts = dateString.split('/');
  if (parts.length !== 3) return dateString;
  const [jy, jm, jd] = parts.map(p => parseInt(p, 10));
  return `${jy}/${padZero(jm)}/${padZero(jd)}`;
};

export const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export const isJalaliLeap = (jy: number): boolean => {
  // A common algorithm for determining Jalali leap years.
  const remainders = [1, 5, 9, 13, 17, 22, 26, 30];
  return remainders.includes(jy % 33);
};

export const getDaysInJalaliMonth = (jy: number, jm: number): number => {
  if (jm >= 1 && jm <= 6) return 31;
  if (jm >= 7 && jm <= 11) return 30;
  if (jm === 12) return isJalaliLeap(jy) ? 30 : 29;
  return 0; // Should not happen for valid months
};


export const getJalaliWeekday = (dateString: string): string => {
    try {
        const weekdays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
        // This logic is complex. A simplified Gregorian conversion is used to find the weekday.
        const [jy, jm, jd] = dateString.split('/').map(Number);
        
        let gy = jy + 621;
        
        // Find the Gregorian day of the year
        let gDayOfYear = (jm <= 6) ? ((jm - 1) * 31) + jd : (6 * 31) + ((jm - 7) * 30) + jd;
        gDayOfYear += 79;
        
        const isGLeap = (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0);
        const daysInGYear = isGLeap ? 366 : 365;

        if (gDayOfYear > daysInGYear) {
            gDayOfYear -= daysInGYear;
            gy++;
        }

        const gDate = new Date(gy, 0, 1); // Start from Jan 1st of the Gregorian year
        gDate.setDate(gDayOfYear); // Set the day of the year

        return weekdays[gDate.getDay()];
    } catch(e) {
        console.error("Could not determine weekday for", dateString, e);
        return '';
    }
};
