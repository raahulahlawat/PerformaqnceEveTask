import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { keycloak } from '../App';

const Home = () => {
  const navigate = useNavigate();
  const [, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [projectsWithRemarks, setProjectsWithRemarks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null); // Initialize as null
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const projectDetail = (id) => {
    navigate(`projects/${id}`);
  };

  const deleteProjectRemarks = async () => {
    if (!projectIdToDelete) {
      alert("Please select a project first.");
      return;
    }
    if (!selectedMonth) {
      alert("Please select a month and year.");
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
        window.location.reload();
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
    console.log('Fetching data from server...');
    axios.get('http://rahul-ahlawat.io:3001/api/data')
      .then((res) => {
        console.log('Data received from server:', res.data);
        setProjects(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

    axios.get('http://rahul-ahlawat.io:3001/api/projects_with_remarks')
      .then((res) => {
        console.log('Projects with remarks data received from server:', res.data);
        if (res.data && res.data.length > 0) {
          // Remove duplicates based on project name
          const uniqueProjects = res.data.filter((project, index, self) =>
            index === self.findIndex((p) => p.project_name === project.project_name)
          );
          setProjectsWithRemarks(uniqueProjects);
        } else {
          console.warn('No projects with remarks found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching projects with remarks data:', error);
      });

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
  }, []);

  const fetchRemarksForProject = async (projectId) => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const remarksResponse = await axios.get(`http://localhost:3001/project/${projectId}/remarks?month=${month}&year=${year}`);
      console.log('Remarks Response:', remarksResponse.data);
      navigate(`/remarks/${projectId}`, { state: { remarks: remarksResponse.data } });
    } catch (error) {
      console.error('Error fetching remarks:', error);
      if (error.response && error.response.status === 404) {
        alert("No remarks found for the selected project.");
      } else {
        alert('Failed to fetch remarks. Please try again later.');
      }
    }
  };

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
                    <Tooltip label="Click to view Project and Assign Review form to TL" aria-label="Assign Review Tooltip">
                      <Button onClick={() => projectDetail(project.id)}>{project.name}</Button>
                    </Tooltip>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Tooltip label="Click to Delete existing remarks of members" aria-label="Delete Remarks Tooltip">
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Projects with Remarks
            </MenuButton>
            <MenuList style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {projectsWithRemarks.map((project, index) => (
                <MenuItem key={index}>
                  <Flex justifyContent="space-between" width="100%">
                    <Tooltip label="Click to view Project Remarks" aria-label="View Remarks Tooltip">
                      <Button onClick={() => fetchRemarksForProject(project.project_id)}>
                        {project.project_name}
                      </Button>
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
              <h2 style={{ color: "Blue", marginBottom: '10px', fontWeight: 'bold', fontSize: '1.2em' }}>{projects.find(project => project.id === projectIdToDelete)?.name}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <br /> <br /><br /> <br />
                <DatePicker
                  selected={selectedMonth}
                  onChange={date => setSelectedMonth(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  placeholderText="MM/yyyy"
                  className="custom-date-picker"
                />
                &nbsp;
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
