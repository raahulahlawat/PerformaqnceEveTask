import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './css/home.css';
import {
  Button, Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons'; // Import the DeleteIcon
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { keycloak } from '../App'; // Import keycloak instance

const Home = () => {
  const navigate = useNavigate();
  const [, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // State to hold user info

  const projectDetail = (id) => {
    navigate(`projects/${id}`);
  };
  
  const deleteProjectRemarks = async () => {
    if (!projectIdToDelete) {
      alert("Please select a project first.");
      return;
    }
    if (!selectedMonth) {
      alert("Please select a month.");
      return;
    }
    const projectName = projects.find(project => project.id === projectIdToDelete)?.name;
    const confirmation = window.confirm(`Are you sure you want to delete the remarks for the project "${projectName}"?`);
    if (confirmation) {
      try {
        const month = selectedMonth.getMonth() + 1;
        const year = selectedMonth.getFullYear();
        await axios.delete(`http://rahul-ahlawat.io:3001/api/projects/${projectIdToDelete}/remarks?month=${month}&year=${year}`);
        alert('Remarks deleted successfully.');
        window.location.reload(); // Refresh the page
      } catch (error) {
        console.error('Error deleting remarks:', error);
        if (error.response && error.response.status === 404) {
          alert("No remarks found for the selected month and year.");
        } else {
          alert('Failed to delete remarks. Please try again later.');
        }
      }
    }
  };
  
  // Fetch user info and log it
  useEffect(() => {
    if (keycloak.authenticated) {
      keycloak.loadUserInfo()
      .then(userInfo => {
        console.log("User Info:", userInfo);
        setUserInfo(userInfo);
      })
      .catch(error => {
        console.error("Error fetching user info:", error);
      });
    
    }
    axios.get('http://rahul-ahlawat.io:3001/api/data')
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <br />
        <div className='project-drop'>
          <h1 className='welcome'>Welcome to the Performance Evaluation Tracker Website</h1>
          <br /> <br />
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Projects
            </MenuButton>
            <MenuList style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {projects.map(project => (
                <MenuItem key={project.id}>
                  <Flex justifyContent="space-between" width="100%">
                    <Tooltip label="Click to Assign Review form to TL" aria-label="Assign Review Tooltip">
                      <Button onClick={() => projectDetail(project.id)}>{project.name}</Button>
                    </Tooltip>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Tooltip label="Click to Delete existing remarks" aria-label="Delete Remarks Tooltip">
                      <IconButton 
                        colorScheme="red" 
                        icon={<DeleteIcon />} 
                        onClick={() => setProjectIdToDelete(project.id)}
                        aria-label="Delete Remarks"
                      />
                    </Tooltip>
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          {projectIdToDelete && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <br />
              <h2 style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '1.2em' }}>Select Month and Year to Delete Remarks</h2>
              <br />
              <h2 style={{ color:"Blue", marginBottom: '10px', fontWeight: 'bold', fontSize: '1.2em' }}>{projects.find(project => project.id === projectIdToDelete)?.name}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <br /> <br /><br /> <br />
                <DatePicker
                  selected={selectedMonth}
                  onChange={date => setSelectedMonth(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className="custom-date-picker"
                />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button colorScheme="red" onClick={deleteProjectRemarks}>Confirm Delete</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {userInfo && (
        <div>
          <h2>User Information:</h2>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
