import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context';

const Header = () => {
  const { isAuth, logout } = useContext(AuthContext);

  return (
    <nav className='navbar navbar-expand-sm navbar-dark bg-dark'>
      <Link to='/' className='navbar-brand'>
        My Scheduler
      </Link>
      <div className='ml-auto'>
        {!isAuth && (
          <>
            <Link to='/login' className='btn btn-primary mr-2'>
              Login
            </Link>
            <Link to='/register' className='btn btn-outline-primary'>
              Register
            </Link>
          </>
        )}
        {isAuth && (
          <button className='btn btn-outline-primary' onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
