import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    const activeStyle = { color: '#f1582a' };

    return (
        <nav>
            <NavLink to='/' activeStyle={activeStyle} exact>Home</NavLink>{' | '}
            <NavLink to='/courses' activeStyle={activeStyle} >Courses</NavLink>{' | '}
            <NavLink to='/about' activeStyle={activeStyle} >About</NavLink>
        </nav>
    );
}

export default Header;