import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import Navbar from './navbar';
import './css/home.css'; // Import CSS file

const Dashboard = () => {
  const [showProjects, setShowProjects] = useState(false);

  const projects = [
    'Project 1',
    'Project 2',
    'Project 3',
    'Project 4',
    'Project 5'
  ];

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="content">
        <h2>Welcome to the Performance Evaluation Tracker Website</h2>
        <br></br><br></br>
        <h3 className="heading" onClick={() => setShowProjects(!showProjects)}>Projects</h3>
        {showProjects && (
          <div className="projects-list">
            <ul>
              {projects.map(project => (
                <li key={project}>
                  <Link to={`/projects/${project}`}>{project}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
