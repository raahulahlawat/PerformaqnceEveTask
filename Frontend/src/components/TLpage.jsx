import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const TLPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tl/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectClick = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tl/project/${projectId}`);
      setSelectedProject(response.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const handleRemarksChange = (memberId, e) => {
    // Update remarks for the member with memberId
  };

  const handleRemarksSubmit = async () => {
    try {
      // Logic to submit remarks
    } catch (error) {
      console.error('Error submitting remarks:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} onClick={() => handleProjectClick(project.id)}>
            {project.name}
          </li>
        ))}
      </ul>
      {selectedProject && (
        <div>
          <h3>{selectedProject.name}</h3>
          <ul>
            {selectedProject.members.map((member) => (
              <li key={member.id}>
                {member.name} -{' '}
                <input
                  type="text"
                  placeholder="Enter remarks"
                  value={member.remarks}
                  onChange={(e) => handleRemarksChange(member.id, e)}
                />
              </li>
            ))}
          </ul>
          <button onClick={handleRemarksSubmit}>Submit Remarks</button>
        </div>
      )}
    </div>
  );
};

export default TLPage;
