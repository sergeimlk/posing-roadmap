"use client";

import { useState, useMemo, useEffect } from "react";
import "./Calendar.css";

const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

export default function Calendar({ selected, onSelect, className = "" }) {
  // Use selected date or today as reference for current view
  const referenceDate = selected || new Date();
  const [currentMonth, setCurrentMonth] = useState(referenceDate.getMonth());
  const [currentYear, setCurrentYear] = useState(referenceDate.getFullYear());

  // Keep view in sync when selected date changes externally
  useEffect(() => { // eslint-disable-line react-hooks/set-state-in-effect -- Syncing local state from controlled prop
    if (selected) {
      setCurrentMonth(selected.getMonth());
      setCurrentYear(selected.getFullYear());
    }
  }, [selected]);

  // Generate years range (from 2 years ago to 8 years in the future)
  const years = useMemo(() => {
    const startYear = new Date().getFullYear() - 2;
    const endYear = startYear + 10;
    const list = [];
    for (let y = startYear; y <= endYear; y++) {
      list.push(y);
    }
    return list;
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Generate days grid (exactly 42 days, 6 rows of 7 days)
  const daysGrid = useMemo(() => {
    // Get day index of the first day of the month
    // 0 is Sunday, 1 is Monday...
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevTotalDays = new Date(currentYear, currentMonth, 0).getDate();

    const grid = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      grid.push({
        day: prevTotalDays - i,
        isCurrentMonth: false,
        date: new Date(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1, prevTotalDays - i)
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      grid.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i)
      });
    }

    // Next month filler days
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      grid.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentMonth === 11 ? currentYear + 1 : currentYear, currentMonth === 11 ? 0 : currentMonth + 1, i)
      });
    }

    return grid;
  }, [currentMonth, currentYear]);

  const isSelectedDate = (date) => {
    if (!selected) return false;
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  return (
    <div className={`custom-calendar ${className}`}>
      {/* Header */}
      <div className="calendar-header">
        <button type="button" className="calendar-nav-btn" onClick={handlePrevMonth} aria-label="Mois précédent">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        
        <div className="calendar-dropdowns">
          <div className="calendar-select-wrapper">
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
              className="calendar-select"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
            <span className="select-arrow">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>

          <div className="calendar-select-wrapper">
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
              className="calendar-select"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="select-arrow">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </div>

        <button type="button" className="calendar-nav-btn" onClick={handleNextMonth} aria-label="Mois suivant">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Weekdays */}
      <div className="calendar-weekdays">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Days grid */}
      <div className="calendar-days-grid">
        {daysGrid.map((item, idx) => {
          const selectedState = isSelectedDate(item.date);
          return (
            <button
              key={idx}
              type="button"
              className={`calendar-day-btn ${!item.isCurrentMonth ? "out-of-month" : ""} ${selectedState ? "selected" : ""}`}
              onClick={() => onSelect(item.date)}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
