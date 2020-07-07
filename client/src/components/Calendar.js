import React, { useRef } from 'react';
import styled from 'styled-components';

const CalendarWrapper = styled.div`
  .today {
    background-color: var(--info);
    color: #fff;
  }

  .legit-day {
    cursor: pointer;

    &:hover {
      background-color: #eee;
      color: #000;
    }
  }

  .active {
    background-color: #eee;
    color: #000;
  }

  .calendar-header {
    position: relative;
  }

  .prev,
  .next {
    position: absolute;
    top: 0;
    width: 50px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    cursor: pointer;
  }

  .prev:hover,
  .next:hover {
    background-color: #ccc;
  }

  .prev {
    left: 0;
  }

  .next {
    left: calc(100% - 50px);
  }

  table {
    margin: 0;
    padding: 0;
    border: 2px solid black !important;
  }

  thead {
    tr {
      td {
        font-weight: bold;
        text-align: center;
      }
    }
  }
`;

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const Calendar = ({ date, setDate, setSelectedDate }) => {
  const activeEl = useRef();

  const generateTable = () => {
    let dayCount = 1;
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDay = new Date(currentYear, currentMonth).getDay();
    const todayDate = new Date();
    let todayDay;
    if (
      todayDate.getFullYear() === currentYear &&
      todayDate.getMonth() === currentMonth
    ) {
      todayDay = todayDate.getDate();
    }

    return [...Array(6)].map((_, i) => {
      if (i * 7 > daysInMonth(currentMonth, currentYear)) return null;
      return (
        <tr key={i}>
          {[...Array(7)].map((_, j) => {
            if (
              dayCount > daysInMonth(currentMonth, currentYear) ||
              (i === 0 && j < firstDay)
            )
              return <td key={j}></td>;
            return (
              <td
                key={j}
                className={
                  todayDay && todayDay === dayCount
                    ? 'legit-day text-center today'
                    : 'legit-day text-center'
                }
                data-value={new Date(currentYear, currentMonth, dayCount)}
                onClick={handleClick}
              >
                {dayCount++}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  const daysInMonth = (month, year) => 32 - new Date(year, month, 32).getDate();

  const handleClick = (e) => {
    if (activeEl.current) activeEl.current.classList.remove('active');
    activeEl.current = e.target;
    e.target.classList.add('active');
    const date = new Date(e.target.dataset.value);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    setSelectedDate({ day, month, year });
  };

  const handlePrevious = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    if (month == 0) setDate(new Date(year - 1, 11));
    else setDate(new Date(year, month - 1));
  };

  const handleNext = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    if (month == 11) setDate(new Date(year + 1, 0));
    else setDate(new Date(year, month + 1));
  };

  return (
    <CalendarWrapper>
      <div className='calendar-header'>
        <div className='prev' onClick={handlePrevious}>
          ⮈
        </div>
        <h3 className='card-header text-center'>
          {months[date.getMonth()] + ' ' + date.getFullYear()}
        </h3>
        <div className='next' onClick={handleNext}>
          ⮊
        </div>
      </div>

      <div className='table-responsive'>
        <table className='table table-bordered' id='calendar'>
          <thead>
            <tr>
              <td>Sun</td>
              <td>Mon</td>
              <td>Tue</td>
              <td>Wed</td>
              <td>Thu</td>
              <td>Fri</td>
              <td>Sat</td>
            </tr>
          </thead>
          <tbody>{generateTable()}</tbody>
        </table>
      </div>
    </CalendarWrapper>
  );
};

export default Calendar;
