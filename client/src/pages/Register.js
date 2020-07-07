import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../axios';
import { AuthContext } from '../context';

const RegisterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;

  .form {
    transform: translateY(-50px);

    form {
      width: 375px;
    }
  }
`;

const Register = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const { isAuth } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!username) errors.username = 'Please choose a username';
    if (password.length < 8)
      errors.password = 'Password must be at least 8 characters long';
    else {
      const specialChars = '(/*-+_@&$#%)';
      let letter = false,
        uppercase = false,
        number = false,
        special = false;
      for (const c of password) {
        if (c >= 'a' && c <= 'z') letter = true;
        if (c >= 'A' && c <= 'Z') uppercase = true;
        if (c >= '0' && c <= '9') number = true;
        if (specialChars.indexOf(c) > -1) special = true;
      }
      if (!letter)
        errors.password = 'Password must contain at least one letter';
      else if (!uppercase)
        errors.password = 'Password must contain at least one uppercase letter';
      else if (!number)
        errors.password = 'Password must contain at least one number';
      else if (!special)
        errors.password =
          'Password must contain at least one special character';
    }

    if (Object.keys(errors).length) {
      setErrors(errors);
      setPassword('');
      return;
    }

    axios({
      method: 'POST',
      url: '/api/auth/register',
      data: {
        username,
        password,
      },
    })
      .then(() => {
        props.history.push('/login');
      })
      .catch((err) => {
        if (err.response.data.message) {
          setError(err.response.data.message);
          setPassword('');
        }
      });
  };

  const clearError = (field) => {
    const updatedErrors = { ...errors };
    delete updatedErrors[field];
    setErrors(updatedErrors);
    if (error && field === 'username') setError(null);
  };

  if (isAuth) return <Redirect to='/' />;

  return (
    <RegisterWrapper>
      <div className='form'>
        <h1 className='text-center mb-3'>Register</h1>
        {error && (
          <div className='alert alert-danger' role='alert'>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              className='form-control'
              id='username'
              placeholder='Enter username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onClick={() => clearError('username')}
            />
            {errors.username && (
              <small className='form-text text-danger'>{errors.username}</small>
            )}
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              className='form-control'
              id='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onClick={() => clearError('password')}
            />
            {errors.password && (
              <small className='form-text text-danger'>{errors.password}</small>
            )}
          </div>

          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        </form>
      </div>
    </RegisterWrapper>
  );
};

export default Register;
