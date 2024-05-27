import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const EmailSender = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [teamLeads, setTeamLeads] = useState([]);
  const [selectedTl, setSelectedTl] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMemberEmail, setSelectedMemberEmail] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectChange = async (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
    setSelectedTl('');
    setSelectedMemberEmail('');

    if (projectId) {
      fetchTeamLeads(projectId);
      fetchMembers(projectId);
    } else {
      setTeamLeads([]);
      setMembers([]);
    }
  };

  const fetchTeamLeads = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:3001/project/${projectId}/tls`);
      setTeamLeads(response.data);
    } catch (error) {
      console.error('Error fetching team leads:', error);
    }
  };

  const fetchMembers = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:3001/project/${projectId}/members`);
      setMembers(response.data.projectMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleEmailSend = async (e) => {
    e.preventDefault();
    try {
      if (!selectedProjectId || !selectedTl || !selectedMemberEmail) {
        alert('Please select a project, TL, and a member to send the email.');
        return;
      }

      const selectedProject = projects.find(project => project.id === parseInt(selectedProjectId));
      const projectName = selectedProject ? selectedProject.name : 'the project';

      await axios.post('http://localhost:3001/send-email', {
        recipientEmail: selectedMemberEmail,
        subject: 'Provide Remarks for Project Members',
        text: `Dear Team Member,\n\nYou have been assigned to review the project '${projectName}'.\n\nPlease provide your remarks for the project.\n\nThank you.\n\nLink to project: http://localhost:5173/tl/${selectedProjectId}`
      });

      console.log('Email sent successfully');
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    }
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleEmailSend}>
        <div>
          <label>Select Project:</label>
          <select value={selectedProjectId} onChange={handleProjectChange} required>
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Team Lead:</label>
          <select value={selectedTl} onChange={(e) => setSelectedTl(e.target.value)} required>
            <option value="">Select Team Lead</option>
            {teamLeads.map((tl) => (
              <option key={tl.tl_id} value={tl.tl_id}>
                {tl.tl_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Member Email:</label>
          <select value={selectedMemberEmail} onChange={(e) => setSelectedMemberEmail(e.target.value)} required>
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.email}>
                {member.firstname} {member.lastname} ({member.email})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
};

export default EmailSender;
