import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import Navbar from './Navbar';
import './css/home.css'
import {
  Button, ButtonGroup, Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import {ChevronDownIcon} from '@chakra-ui/icons'
const Home = () => {

  return (
    <div>
      <Navbar />

      <div>
      
      <div className='project-drop'>
      <h1>Welcome to the Performance Evaluation Tracker Website</h1>
      <br />
      <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Projects
          </MenuButton>
          <MenuList>
            <MenuItem>Project 1</MenuItem>
            <MenuItem>Project 2</MenuItem>
            <MenuItem>Project 3</MenuItem>
            <MenuItem>Project 4</MenuItem>
            <MenuItem>Project 5</MenuItem>
          </MenuList>
        </Menu>
      </div>
      
        






        
      </div>
    </div>
  );
};

export default Home;
