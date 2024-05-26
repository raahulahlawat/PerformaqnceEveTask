import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './css/project.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const ProjectDetailsPage = () => {
  const url = new URL(window.location.href);
  const idi = url.pathname;
  const fidi = idi.slice(10);
  const [partproject, setPartProject] = useState({});
  const [members, setMembers] = useState([]);
  const [tlList, setTlList] = useState([]);
  const [selectedTl, setSelectedTl] = useState('');
  const [tlMembers, setTlMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/project/${fidi}`);
      console.log("Project Details Response:", response.data);
      console.log("Fetching project details for ID:", fidi);
      setPartProject(response.data);

      const membersResponse = await axios.get(`http://localhost:3001/project/${fidi}/members`);
      console.log("Members Response:", membersResponse.data);
      setMembers(membersResponse.data.projectMembers);

      const tlsResponse = await axios.get(`http://localhost:3001/project/${fidi}/tls`);
      console.log("TLs Response:", tlsResponse.data);
      if (tlsResponse.data) {
        setTlList(tlsResponse.data);
      } else {
        console.error("TLs data is undefined");
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    setCurrentMonth(getCurrentMonth());
  }, []);

  const getCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[currentMonthIndex];
  };

  const handleTlChange = async (e) => {
    setSelectedTl(e.target.value);
    setSelectedMember('');

    try {
      const response = await axios.get(`http://localhost:3001/project/${fidi}/tls/${e.target.value}/members`);
      console.log("TL Members Response:", response.data);
      if (response.data && response.data.tlMembers) {
        console.log("TL members found:", response.data.tlMembers);
        setTlMembers(response.data.tlMembers);
      } else {
        console.error("TL members data is undefined");
        setTlMembers([]);
      }
    } catch (error) {
      console.error('Error fetching TL members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedMember) {
        alert('Please select a team member.');
        return;
      }

      const projectName = partproject.name || 'the project';
      const uniqueId = uuidv4(); // Generate a unique identifier
      // const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Set expiration time to 24 hours from now
      const expirationTime = new Date(Date.now() + 30 * 1000).toISOString(); 

      // Send email to the selected member
      await axios.post('http://localhost:3001/send-email', {
        recipientEmail: selectedMember,
        subject: 'Provide Remarks for Project Members',
        text: `Dear Team Member,\n\nYou have been assigned to review the project '${projectName}'.\n\nPlease provide your remarks for the project.\n\nThank you.\n\nLink to project: http://localhost:5173/tl/${fidi}?id=${uniqueId}&expires=${expirationTime}`
      });

      console.log('Email Sent');

      navigate('/assign-ticket');
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Failed to send emails. Please try again later.');
    }
  };

  return (
    <div>
      <Navbar />
      <ul className='project-name'>
        <h3>Current Month: {currentMonth}</h3>
        <span className='heading-project'> Project Name: &nbsp;{partproject.name}</span>
      </ul>
      <div>
        <h3 className='member'>Members of the Project:</h3>
        <ul className='members'>
          {members.map((member, index) => (
            <li key={member.id}>{index + 1}. {member.firstname} {member.lastname}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <div>
            <label className='tl'>Select Team Lead:</label>
            <select className='tl-dropdown' value={selectedTl} onChange={handleTlChange} required>
              <option value="">Select Team Lead</option>
              {tlList.map(tl => (
                <option key={tl.group_id} value={tl.tl_id}>{tl.tl_name}</option>
              ))}
            </select>
          </div>
          {selectedTl && (
            <div>
              <label className='tl'>Select Team Member:</label>
              <select className='tl-member-dropdown' value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} required>
                <option value="">Select Member</option>
                {tlMembers.map(member => (
                  <option key={member.user_id} value={member.login}>{member.firstname} {member.lastname}</option>
                ))}
              </select>
            </div>
          )}
          <button className='assign' type="submit">Submit</button>
        </form>
      </div>
      <br /><br />
    </div>
  );
};

export default ProjectDetailsPage;
