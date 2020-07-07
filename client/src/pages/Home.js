import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthContext } from '../context';
import axios from '../axios';
import Calendar from '../components/Calendar';
import DayEvent from '../components/DayEvent';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const { isAuth, userLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (userLoaded && isAuth) {
      axios({
        method: 'GET',
        url: '/api/events',
      })
        .then((response) => {
          setEvents(response.data.events);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userLoaded, isAuth]);

  const createEvent = (event) => {
    axios({
      method: 'POST',
      url: '/api/events',
      data: event,
    })
      .then(() => {
        return axios({
          method: 'GET',
          url: '/api/events',
        });
      })
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editEvent = (id, description) => {
    axios({
      method: 'PATCH',
      url: '/api/events',
      data: { id, description },
    })
      .then(() => {
        return axios({
          method: 'GET',
          url: '/api/events',
        });
      })
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteEvent = (id) => {
    axios({
      method: 'DELETE',
      url: '/api/events',
      data: { id },
    })
      .then(() => {
        return axios({
          method: 'GET',
          url: '/api/events',
        });
      })
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (userLoaded && !isAuth) return <Redirect to='/login' />;

  return (
    <div>
      <h1 className='text-center my-5'>Schedule</h1>

      <div className='container mt-2'>
        <div className='row'>
          <div className='d-sm-block col-sm-1 d-md-none d-lg-block col-lg-1' />
          <div className='col-sm-10 col-md-6 col-lg-5'>
            <Calendar
              events={events}
              date={date}
              setDate={setDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
          <div className='col-sm-10 col-md-6 col-lg-5 ml-auto mt-4 mt-md-0'>
            <DayEvent
              events={events}
              selectedDate={selectedDate}
              createEvent={createEvent}
              editEvent={editEvent}
              deleteEvent={deleteEvent}
            />
          </div>
          <div className='d-sm-block col-sm-1 d-md-none d-lg-block col-lg-1' />
        </div>
      </div>
    </div>
  );
};

export default Home;
