import React from 'react';
import './header.css';
import { IoNotifications } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="header">
      <div className="search_container">
        <div className="search_box">
          <FiSearch className="search_icon" />
          <input type="text" placeholder="Search" className="search_input" />
        </div>
        <IoNotifications className="notification_icon" />
      </div>
    </header>
  );
};

export default Header;
