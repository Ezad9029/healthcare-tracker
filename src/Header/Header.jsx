import React from 'react';
import './header.css';
import { IoNotifications } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = ({ isMenuOpen, toggleMenu }) => {
  return (
    <header className="header">
      <div className="header_content">
        <div className="hamburger_menu" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <div className="search_container">
          <div className="search_box">
            <FiSearch className="search_icon" />
            <input type="text" placeholder="Search" className="search_input" />
          </div>
          <IoNotifications className="notification_icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
