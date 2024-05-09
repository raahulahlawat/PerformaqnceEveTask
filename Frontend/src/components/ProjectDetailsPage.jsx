import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './css/project.css'

const ProjectDetailsPage = () => {
  const url = new URL(window.location.href);
  const idi = url.pathname;
  const fidi = idi.slice(10)
  const [partproject, setpartProject] = useState([])

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/project/${fidi}`);
      setpartProject(response.data);
      // console.log(partproject)
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };



  useEffect(() => {
    fetchProjectDetails();
  }, []); // Include projectId in the dependency array to refetch project details when it changes

  const getCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[currentMonthIndex];
  };
  // console.log(project)
  return (
    <div>
      <Navbar />
      {
        <ul className='project-name' >
          {
            partproject.map((part) => (
              <li key={part.id}>{part.name} </li>
            ))}
        </ul>
      }

    </div>
  );
};

export default ProjectDetailsPage;
