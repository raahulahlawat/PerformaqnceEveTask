import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axiosInstance from '../utils/axiosInstance';
import './css/project.css';
import './css/home.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Menu, MenuButton, MenuList, MenuItem, Button, Select } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

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
      setPartProject(response.data);

      const membersResponse = await axiosInstance.get(`/project/${projectId}/members`);
      setMembers(membersResponse.data.projectMembers);

      const tlsResponse = await axiosInstance.get(`/project/${projectId}/tls`);
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
      setSelectedDate(urlParams.get('selectedDate'));
      setSelectedTl(urlParams.get('selectedTl'));
      setSelectedMember(urlParams.get('selectedMember'));
    }
  }, [readOnlyMode]);

  const getMonthFromDate = (date) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[new Date(date).getMonth()];
  };

  const handleTlChange = async (tlId) => {
    setSelectedTl(tlId);
    setSelectedMember('');
    try {
      const response = await axiosInstance.get(`/project/${projectId}/tls/${tlId}/members`);
      setTlMembers(response.data.tlMembers);
    } catch (error) {
      console.error('Error fetching TL members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) {
      alert('Please select a team member.');
      return;
    }

    try {
      const uniqueId = uuidv4();
      const expirationTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const readOnlyLink = `http://rahul-ahlawat.io:5173/project/${projectId}?id=${uniqueId}&expires=${expirationTime}&selectedDate=${selectedDate}&selectedTl=${selectedTl}&selectedMember=${selectedMember}&readOnly=true`;

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
      await axiosInstance.post(`/project/${projectId}/remarks`, {
        remarks,
        selectedMember
      });
      navigate('/marks-submitted');
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
      navigate('/assign-ticket');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleRemarkChange = (memberId, index, value) => {
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [`${memberId}_${index}`]: value
    }));
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
        </ul>
      )}
      <div>
        <div>
          <br />
          <span className='project-name'> Project Name: &nbsp;{partproject.name}</span>
        </div>
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
                        <Select
                          value={remarks[`${member.id}_${i}`] || '0'}
                          onChange={(e) => handleRemarkChange(member.id, i, e.target.value)}
                        >
                          {Array.from({ length: 6 }).map((_, num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </Select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <Button className='assign' onClick={handleSubmit} disabled={!readOnlyMode}>Submit</Button>
            <br />
            <br />
          </div>
        ) : (
          <ul className='members-horizontal'>
            {members.map((member, index) => (
              <li key={member.id}>
                {index + 1}. {member.firstname} {member.lastname}
              </li>
            ))}
          </ul>
        )}
        {!readOnlyMode && (
          <form onSubmit={handleSubmit}>
            <div className='project-drop'>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {selectedTl ? tlList.find(tl => tl.tl_id === selectedTl).tl_name : 'Select Team Lead'}
                </MenuButton>
                <MenuList maxHeight="200px" overflowY="auto">
                  {tlList.map(tl => (
                    <MenuItem key={tl.group_id} onClick={() => handleTlChange(tl.tl_id)}>
                      {tl.tl_name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
            {selectedTl && (
              <div className='project-drop' >
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    {selectedMember ? tlMembers.find(member => member.login === selectedMember).firstname : 'Select Member'}
                  </MenuButton>
                  <MenuList maxHeight="200px" overflowY="auto">
                    {tlMembers.map(member => (
                      <MenuItem key={member.user_id} onClick={() => setSelectedMember(member.login)}>
                        {member.firstname} {member.lastname}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </div>
            )}
            <Button className='assign' type="submit">Submit</Button>
            <br />
            <br />
          </form>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
