import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axiosInstance from '../utils/axiosInstance';
import './css/project.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


const ProjectDetailsPage = () => {
  const url = new URL(window.location.href);
  const projectId = url.pathname.split('/')[2];
  const readOnlyMode = url.searchParams.has('readOnly');
  const [partproject, setPartProject] = useState({});
  const [members, setMembers] = useState([]);
  const [tlList, setTlList] = useState([]);
  const [selectedTl, setSelectedTl] = useState('');
  const [tlMembers, setTlMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [remarks, setRemarks] = useState({});

  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    try {
      const response = await axiosInstance.get(`/project/${projectId}`);
      console.log('Project Details:', response.data);
      setPartProject(response.data);

      const membersResponse = await axiosInstance.get(`/project/${projectId}/members`);
      console.log('Project Members:', membersResponse.data.projectMembers);
      setMembers(membersResponse.data.projectMembers);

      const tlsResponse = await axiosInstance.get(`/project/${projectId}/tls`);
      console.log('TL List:', tlsResponse.data);
      setTlList(tlsResponse.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    if (selectedDate) {
      setCurrentMonth(getMonthFromDate(selectedDate));
      console.log('Selected Date:', selectedDate);
      console.log('Current Month:', getMonthFromDate(selectedDate));
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
      console.log('Read-Only Mode:', readOnlyMode);
      console.log('Read-Only Date:', readOnlyDate);
      console.log('Read-Only TL:', readOnlyTl);
      console.log('Read-Only Member:', readOnlyMember);
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
    const selectedTlValue = e.target.value;
    setSelectedTl(selectedTlValue);
    setSelectedMember('');
    console.log('Selected Team Lead:', selectedTlValue);

    try {
      const response = await axiosInstance.get(`/project/${projectId}/tls/${selectedTlValue}/members`);
      console.log('TL Members:', response.data.tlMembers);
      setTlMembers(response.data.tlMembers);
    } catch (error) {
      console.error('Error fetching TL members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit Clicked');
    console.log('Selected Member:', selectedMember);
    console.log('Selected Date:', selectedDate);
    console.log('Selected TL:', selectedTl);
  
    try {
      if (!selectedMember) {
        alert('Please select a team member.');
        return;
      }
  
      const uniqueId = uuidv4();
      const expirationTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const readOnlyLink = `http://rahul-ahlawat.io:5173/project/${projectId}?id=${uniqueId}&expires=${expirationTime}&selectedDate=${selectedDate}&selectedTl=${selectedTl}&selectedMember=${selectedMember}&readOnly=true`;
      console.log('Read-Only Link:', readOnlyLink);
  
      if (readOnlyMode) {
        await storeRemarks();
      } else {
        await sendEmailWithLink(readOnlyLink);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process. Please try again later.');
    }
  };
  
  const storeRemarks = async () => {
    try {
      const response = await axiosInstance.post(`/project/${projectId}/remarks`, {
        remarks,
        selectedMember
      });
      console.log("Remarks stored successfully:", response.data);
      alert("Remarks have been submitted");
    } catch (error) {
      console.error('Error storing remarks:', error);
      alert('Failed to store remarks. Please try again later.');
    }
  };
  
  

  const sendEmailWithLink = async (link) => {
    try {
      const selectedTlMember = tlMembers.find(member => member.login === selectedMember);
      const selectedTlMemberName = selectedTlMember ? `${selectedTlMember.firstname} ${selectedTlMember.lastname}` : '';
      
      const emailText = `Dear Team Member,\n\nYou have been assigned to review the project '${partproject.name}' with TL ${selectedTlMemberName}.\n\nPlease find the read-only access link for the project details below:\n\n${link}\n\nThank you.`;
      
      await axiosInstance.post('/send-email', {
        recipientEmail: selectedMember,
        subject: 'Access Link for Project Details (Read-Only)',
        text: emailText
      });
      console.log('Email sent with link:', link);
      navigate('/assign-ticket');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    }
  };
  

  const handleDateChange = (e) => {
    const selectedDateValue = e.target.value;
    setSelectedDate(selectedDateValue);
    console.log('Selected Date Changed:', selectedDateValue);
  };

  const handleRemarkChange = (memberId, index, value) => {
    const updatedRemarks = {
      ...remarks,
      [`${memberId}_${index}`]: value
    };
    setRemarks(updatedRemarks);
    console.log('Remarks Updated:', updatedRemarks);
  };

  return (
    <div>
      <Navbar showHomeButton={!readOnlyMode} />

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
        {readOnlyMode ? (
          <div>
            <h3 className='member'>Members of the Project:</h3>
            <table className='members-table'>
              <thead>
                <tr>
                  <th className='number-column'>#</th>
                  <th>Member Name</th>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <th key={i}>Remarks {i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.id}>
                    <td>{index + 1}</td>
                    <td>{member.firstname} {member.lastname}</td>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <td key={i}>
                        <select
                          value={remarks[`${member.id}_${i}`] || '0'}
                          onChange={(e) => handleRemarkChange(member.id, i, e.target.value)}
                        >
                          {Array.from({ length: 6 }).map((_, num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button className='assign' onClick={handleSubmit} disabled={!readOnlyMode}>Submit</button>
            <br />
            <br />
          </div>
        ) : (
          <ul className='members'>
            {members.map((member, index) => (
              <li key={member.id}>
                {index + 1}. {member.firstname} {member.lastname}
              </li>
            ))}
          </ul>
        )}
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
                <select className='tl-member-dropdown' value={selectedMember} onChange={(e) => {
                  const selectedMemberValue = e.target.value;
                  setSelectedMember(selectedMemberValue);
                  console.log('Selected Team Member:', selectedMemberValue);
                }} required>
                  <option value="">Select Member</option>
                  {tlMembers.map(member => (
                    <option key={member.user_id} value={member.login}>{member.firstname} {member.lastname}</option>
                  ))}
                </select>
              </div>
            )}
            <button className='assign' type="submit">Submit</button>
            <br />
            <br />
          </form>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
