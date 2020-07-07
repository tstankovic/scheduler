import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const DayEventWrapper = styled.div`
  height: 100%;
  border: 1.2px solid #333;
  padding: 0.5rem;

  .selected-day {
    text-align: center;
    h1 {
      font-size: 4rem;
    }
  }

  .event-info {
    background-color: #fafafa;
    border: 1px solid #333;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
  }

  .edit-event {
    width: 100%;
    background-color: #fafafa;
    border: 1px solid #333;
  }
`;

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DayEvent = ({
  events,
  selectedDate,
  createEvent,
  editEvent,
  deleteEvent,
}) => {
  const [eventDescription, setEventDescription] = useState('');
  const [editMode, setEditMode] = useState(false);

  const textareaEl = useRef();

  useEffect(() => {
    setEventDescription('');
  }, [selectedDate]);

  let day, event;
  if (selectedDate) {
    const date = new Date(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day
    );
    day = days[date.getDay()];

    event = events.find(
      (event) =>
        event.year === selectedDate.year &&
        event.month === selectedDate.month &&
        event.day === selectedDate.day
    );
  }

  const handleSubmit = (e) => {
    const newEvent = {
      description: eventDescription,
      year: selectedDate.year,
      month: selectedDate.month,
      day: selectedDate.day,
    };
    createEvent(newEvent);
  };

  const handleSave = (event) => {
    const text = textareaEl.current.value;
    editEvent(event._id, text);
    setEditMode(false);
  };

  const handleDelete = () => {
    setEventDescription('');
    deleteEvent(event._id);
  };

  return (
    <DayEventWrapper>
      {!selectedDate && (
        <h3 className='text-center mt-2'>
          Please select a date to see event for
        </h3>
      )}
      {selectedDate && (
        <>
          <div className='selected-day'>
            <h1>{selectedDate.day}</h1>
            <h2>{day}</h2>
          </div>
          {!event && (
            <>
              <p className='text-center mt-4'>There is no event for this day</p>
              <p className='text-center text-muted'>
                <i>Add new event:</i>
              </p>
              <div className='event mt-2'>
                <div className='input-group input-group-sm'>
                  <div className='input-group-prepend'>
                    <span className='input-group-text'>Event description</span>
                  </div>
                  <textarea
                    className='form-control'
                    aria-label='Event description'
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className='btn-wrapper mt-2'>
                <button
                  className='btn btn-primary btn-block'
                  onClick={handleSubmit}
                  disabled={!eventDescription}
                >
                  Submit
                </button>
              </div>
            </>
          )}
          {event && !editMode && (
            <div className='event-wrapper mt-5'>
              <p className='text-center mt-4'>Event for this day:</p>
              <div className='mt-4'>
                <p className='event-info p-2'>{event.description}</p>
              </div>
              <div className='event-actions'>
                <button
                  className='btn btn-warning mr-2'
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
                <button className='btn btn-danger' onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          )}
          {event && editMode && (
            <div className='event-wrapper mt-5'>
              <div className='mt-4'>
                <small>You can edit your event below:</small>
                <form>
                  <textarea
                    className='edit-event p-2'
                    defaultValue={event.description}
                    ref={textareaEl}
                  ></textarea>
                </form>
              </div>
              <div className='event-actions mt-2'>
                <button
                  className='btn btn-success mr-2'
                  onClick={() => handleSave(event)}
                >
                  Save
                </button>
                <button
                  className='btn btn-secondary'
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </DayEventWrapper>
  );
};

export default DayEvent;
