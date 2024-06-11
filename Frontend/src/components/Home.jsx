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
  Box
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);

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
        const response = await axios.delete(`http://rahul-ahlawat.io:3001/api/projects/${projectIdToDelete}/remarks`, {
          params: { month, year }
        });
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

  useEffect(() => {
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
                  <Flex justifyContent="space-between" width="100%">
                    <Button onClick={() => projectDetail(project.id)}>{project.name}</Button>
                    <Button colorScheme="red" onClick={() => setProjectIdToDelete(project.id)}>Delete Remarks</Button>
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          {projectIdToDelete && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '1.2em' }}>Select Month and Year to Delete Remarks</h2>
              <h2 style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '1em' }}>{projects.find(project => project.id === projectIdToDelete)?.name}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <DatePicker
                  selected={selectedMonth}
                  onChange={date => setSelectedMonth(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className="custom-date-picker"
                />
                <Button colorScheme="red" onClick={deleteProjectRemarks}>Confirm Delete</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Home;
