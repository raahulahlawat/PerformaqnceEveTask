import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Navbar from './Navbar';
import './css/home.css'


import {
  Button, ButtonGroup, Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import axios from 'axios';

const Home = () => {


  const navigate= useNavigate();
  const [projects, setProjects] = useState([]);


  const fetchProjects = async () => {
    try {
   await axios.get('http://localhost:3001/api/data')
   .then((res)=>{
    setProjects(res.data)
   })
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };




const projectdetail=  (id)=>{
navigate(`projects/${id}`)
}

useEffect(() => {
  fetchProjects();
},[])

  return (
    <div>
      <Navbar />
      <div>
        <div className='project-drop'>
          <h1 className='welcome'>Welcome to the Performance Evaluation Tracker Website</h1>
          <br />
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Projects
            </MenuButton>
            <MenuList>
              {projects.map(project => (
                <MenuItem key={project.id}>
                  <Button onClick={()=>projectdetail(project.id)}>{project.name}</Button>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Home;
