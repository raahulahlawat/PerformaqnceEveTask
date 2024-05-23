import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const TLPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const projectId = window.location.pathname.split('/').pop();
    fetchProjectDetails(projectId);
  }, []);

  const fetchProjectDetails = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tl/project/${projectId}`);
      setSelectedProject(response.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const handleRemarksChange = (memberId, e) => {
  };

  const handleRemarksSubmit = async () => {
    try {
    } catch (error) {
      console.error('Error submitting remarks:', error);
    }
  };

  return (
    <div>
      <Navbar />
      {selectedProject && (
        <div>
          <h2>{selectedProject.name}</h2>
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
