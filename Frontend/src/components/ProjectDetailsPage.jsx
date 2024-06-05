import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axiosInstance from '../utils/axiosInstance';
import './css/project.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const ProjectDetailsPage = () => {
  const url = new URL(window.location.href);
  const projectId = url.pathname.split('/')[2]; // Extract the project ID from the URL
  const readOnlyMode = url.searchParams.has('readOnly'); // Check if URL parameters exist for read-only mode

  const [partproject, setPartProject] = useState({});
  const [members, setMembers] = useState([]);
  const [tlList, setTlList] = useState([]);
  const [selectedTl, setSelectedTl] = useState('');
  const [tlMembers, setTlMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [remarks, setRemarks] = useState({}); // State to hold remarks for each member

  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    try {
      const response = await axiosInstance.get(`/project/${projectId}`);
      console.log('Project details:', response.data);
      setPartProject(response.data);

      const membersResponse = await axiosInstance.get(`/project/${projectId}/members`);
      console.log('Project members:', membersResponse.data);
      setMembers(membersResponse.data.projectMembers);

      const tlsResponse = await axiosInstance.get(`/project/${projectId}/tls`);
      console.log('Team leads:', tlsResponse.data);
      setTlList(tlsResponse.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    if (selectedDate) {
      setCurrentMonth(getMonthFromDate(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (readOnlyMode) {
      const urlParams = new URLSearchParams(window.location.search);
      const readOnlyDate = urlParams.get('selectedDate');
      const readOnlyTl = urlParams.get('selectedTl');
      const readOnlyMember = urlParams.get('selectedMember');
      setSelectedDate(readOnlyDate);
      setSelectedTl(readOnlyTl);
      setSelectedMember(readOnlyMember);
    }
  }, [readOnlyMode]);

  const getMonthFromDate = (date) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dateObj = new Date(date);
    return monthNames[dateObj.getMonth()];
  };

  const handleTlChange = async (e) => {
    setSelectedTl(e.target.value);
    setSelectedMember('');

    try {
      const response = await axiosInstance.get(`/project/${projectId}/tls/${e.target.value}/members`);
      console.log('Team lead members:', response.data);
      setTlMembers(response.data.tlMembers);
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

      const uniqueId = uuidv4();
      const expirationTime = new Date(Date.now() + 30 * 1000).toISOString();

      const readOnlyLink = `http://localhost:5173/project/${projectId}?id=${uniqueId}&expires=${expirationTime}&selectedDate=${selectedDate}&selectedTl=${selectedTl}&selectedMember=${selectedMember}&readOnly=true`;

      await axiosInstance.post('/send-email', {
        recipientEmail: selectedMember,
        subject: 'Access Link for Project Details (Read-Only)',
        text: `Dear Team Member,\n\nYou have been assigned to review the project '${partproject.name}'.\n\nPlease find the read-only access link for the project details below:\n\n${readOnlyLink}\n\nThank you.`
      });

      console.log('Email sent successfully.');
      navigate('/assign-ticket');
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Failed to send emails. Please try again later.');
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    console.log('Selected date:', e.target.value);
  };

  const handleRemarkChange = (memberId, value) => {
    setRemarks({
      ...remarks,
      [memberId]: value
    });
  };

  return (
    <div>
      <Navbar />
      <div>
        <label className='member'>Select Date:</label>
        {readOnlyMode ? (
          <span className='selected-date'>{selectedDate}</span>
        ) : (
          <input className='select-date-input' type="date" value={selectedDate} onChange={handleDateChange} required />
        )}
      </div>
      {selectedDate && (
        <ul className='project-name'>
          <h3>Current Month: {getMonthFromDate(selectedDate)}</h3>
          <span className='heading-project'> Project Name: &nbsp;{partproject.name}</span>
        </ul>
      )}
      <div>
        <div>
          {readOnlyMode ? (
            <h3 className='member'>Members of the Project:</h3>
          ) : (
            <h3 className='member'>Project Details</h3>
          )}
          {readOnlyMode ? (
            <table className='members-table'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Member Name</th>
                  <th>Remarks 1</th>
                  <th>Remarks 2</th>
                  <th>Remarks 3</th>
                  <th>Remarks 4</th>
                  <th>Remarks 5</th>
                </tr>
              </thead>
              <tbody>
  {members.map((member, index) => (
    <tr key={member.id}>
      <td>{index + 1}</td>
      <td>{member.firstname} {member.lastname}</td>
      {[...Array(5).keys()].map((num) => (
        <td key={num}>
<select
  value={remarks[`${member.id}_${num}`] || '0'}
  onChange={(e) => handleRemarkChange(`${member.id}_${num}`, e.target.value)}
>
  {[...Array(6).keys()].map((num) => (
    <option key={num} value={num}>
      {num}
    </option>
  ))}
</select>

        </td>
      ))}
    </tr>
  ))}
</tbody>

            </table>
          ) : (
            <ul className='members'>
              {members.map((member, index) => (
                <li key={member.id}>
                  {index + 1}. {member.firstname} {member.lastname}
                  {/* <span>: N/A</span> */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* <h3 className='member'>Members of the Project:</h3>
        <ul className='members'>
          {members.map((member, index) => (
            <li key={member.id}>
              {index + 1}. {member.firstname} {member.lastname}
              {readOnlyMode && (
                <input
                  type="number"
                  placeholder={`Remarks for ${member.firstname}`}
                  value={remarks[member.id] || ''}
                  onChange={(e) => handleRemarkChange(member.id, e.target.value)}
                />
              )}
            </li>
          ))}
        </ul> */}
        {!readOnlyMode && (
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
        )}
      </div>
      <br /><br />
    </div>
  );
};

export default ProjectDetailsPage;
