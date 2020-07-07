import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../axios';
import { AuthContext } from '../context';

const LoginWrapper = styled.div`
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

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);

  const { isAuth, login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!username) errors.username = 'Please enter your username';
    if (!password) errors.password = 'Please enter your password';

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }

    axios({
      method: 'POST',
      url: '/api/auth/login',
      data: {
        username,
        password,
      },
    })
      .then((response) => {
        const { token } = response.data;
        login(token);
        // props.history.push('/');
      })
      .catch((err) => {
        if (err.response.data) {
          setError(err.response.data.message);
          setPassword('');
        }
        // console.log(err);
      });
  };

  const clearError = (field) => {
    const updatedErrors = { ...errors };
    delete updatedErrors[field];
    setErrors(updatedErrors);
    if (error) setError(null);
  };

  if (isAuth) return <Redirect to='/' />;

  return (
    <LoginWrapper>
      <div className='form'>
        <h1 className='text-center mb-3'>Login</h1>
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
    </LoginWrapper>
  );
};

export default Login;
