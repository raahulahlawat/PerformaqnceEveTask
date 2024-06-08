import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './css/home.css';
import {
  Button, Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const projectdetail = (id) => {
    navigate(`projects/${id}`)
  }

  useEffect(() => {
    axios.get('http://rahul-ahlawat.io:3001/api/data')
      .then((res) => {
        setProjects(res.data)
        setLoading(false);
      })
  }, [])
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
              <MenuList style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {projects.map(project => (
                  <MenuItem key={project.id}>
                    <Button onClick={() => projectdetail(project.id)}>{project.name}</Button>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
    );
  }

export default Home;
