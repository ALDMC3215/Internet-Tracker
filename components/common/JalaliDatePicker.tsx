import React, { useEffect, useMemo } from 'react';
import Select from './Select';
import { getJalaliNow, getDaysInJalaliMonth, JALALI_MONTHS } from '../../utils/date';

interface JalaliDatePickerProps {
  label?: string;
  value: string; // YYYY/MM/DD
  onChange: (date: string) => void;
}

const padZero = (num: number) => (num < 10 ? `0${num}` : String(num));

const JalaliDatePicker: React.FC<JalaliDatePickerProps> = ({ label, value, onChange }) => {
  const [year, month, day] = useMemo(() => {
    return value.split('/').map(Number);
  }, [value]);

  const currentJalaliYear = useMemo(() => new Date().toLocaleDateString('fa-IR-u-nu-latn').split('/')[0], []);
  
  const years = useMemo(() => {
    const startYear = Number(currentJalaliYear) - 10;
    const endYear = Number(currentJalaliYear) + 10;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }, [currentJalaliYear]);

  const daysInMonth = useMemo(() => {
    return getDaysInJalaliMonth(year, month);
  }, [year, month]);

  useEffect(() => {
    if (day > daysInMonth) {
      handleDayChange(daysInMonth);
    }
  }, [daysInMonth, day]);
  
  const handleYearChange = (newYear: number) => {
    onChange(`${newYear}/${padZero(month)}/${padZero(day)}`);
  };
  
  const handleMonthChange = (newMonth: number) => {
    const newDaysInMonth = getDaysInJalaliMonth(year, newMonth);
    const newDay = Math.min(day, newDaysInMonth);
    onChange(`${year}/${padZero(newMonth)}/${padZero(newDay)}`);
  };

  const handleDayChange = (newDay: number) => {
    onChange(`${year}/${padZero(month)}/${padZero(newDay)}`);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          aria-label="Year"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </Select>
        <Select
          value={month}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          aria-label="Month"
        >
          {JALALI_MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </Select>
        <Select
          value={day}
          onChange={(e) => handleDayChange(Number(e.target.value))}
          aria-label="Day"
        >
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default JalaliDatePicker;
