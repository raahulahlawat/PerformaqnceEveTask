// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import axios from 'axios';
// import './css/project.css';
// import { useNavigate } from 'react-router-dom';

// const ProjectDetailsPage = () => {
//   const url = new URL(window.location.href);
//   const idi = url.pathname;
//   const fidi = idi.slice(10);
//   const [partproject, setPartProject] = useState({});
//   const [members, setMembers] = useState([]);
//   const [currentMonth, setCurrentMonth] = useState('');
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate();

//   const fetchProjectDetails = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3001/project/${fidi}`);
//       setPartProject(response.data);
//       const membersResponse = await axios.get(`http://localhost:3001/project/${fidi}/members`);
//       setMembers(membersResponse.data);
//     } catch (error) {
//       console.error('Error fetching project details:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProjectDetails();
//     setCurrentMonth(getCurrentMonth());
//   }, []);

//   const getCurrentMonth = () => {
//     const currentDate = new Date();
//     const currentMonthIndex = currentDate.getMonth();
//     const monthNames = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return monthNames[currentMonthIndex];
//   };

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!email.endsWith('@fosteringlinux.com') && !email.endsWith('@keenable.in') && !email.endsWith('@gmail.com')) {
//         alert('Please enter a valid email address from fosteringlinux.com, keenable.in, or gmail.com domains.');
//         return;
//       }

//       const projectName = partproject.name || 'the project';
//       const memberList = members.map((member, index) => `${index + 1}. ${member.firstname} ${member.lastname}`).join('\n');

//       await axios.post('http://localhost:3001/send-email', {
//         recipientEmail: email,
//         subject: 'Provide Remarks for Project Members',
//         text: `Dear Team Lead,\n\nYou have been assigned to review the project '${projectName}'.\n\nProject Members:\n${memberList}\n\nPlease provide your remarks for each member in the following format:\n1. Remarks for Member 1\n2. Remarks for Member 2\n...\n\nThank you.\n\nLink to project: http://localhost:5173/tl/${fidi}`
//       });
//       console.log('Email Sent');
//       setEmail('');

//       navigate('/assign-ticket');
//     } catch (error) {
//       console.error('Error sending email:', error);
//       alert('Failed to send email. Please try again later.');
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <ul className='project-name'>
//         <h3>Current Month: {currentMonth}</h3>
//         <span className='heading-project'> Project Name: &nbsp;{partproject.name}</span>
//       </ul>
//       <div>
//         <h3 className='member'>Members of the Project:</h3>
//         <ul className='members'>
//           {members.map((member, index) => (
//             <li key={member.id}>{index + 1}. {member.firstname} {member.lastname}</li>
//           ))}
//         </ul>
//         <form onSubmit={handleSubmit}>
//           <input className='email' type="email" placeholder="Enter email address" value={email} onChange={handleEmailChange} required />
//           <button className='assign' type="submit">Submit</button>
//         </form>
//       </div>
//       <br /><br />
//     </div>
//   );
// };

// export default ProjectDetailsPage;



// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import axios from 'axios';
// import './css/project.css';
// import { useNavigate } from 'react-router-dom';

// const ProjectDetailsPage = () => {
//   const url = new URL(window.location.href);
//   const idi = url.pathname;
//   const fidi = idi.slice(10);
//   const [partproject, setPartProject] = useState({});
//   const [members, setMembers] = useState([]);
//   const [tlList, setTlList] = useState([]);
//   const [selectedTl, setSelectedTl] = useState('');
//   const [currentMonth, setCurrentMonth] = useState('');
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate();

//   const fetchProjectDetails = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3001/project/${fidi}`);
//       setPartProject(response.data);
//       const membersResponse = await axios.get(`http://localhost:3001/project/${fidi}/members`);
//       setMembers(membersResponse.data.projectMembers);
//       const tlsResponse = await axios.get(`http://localhost:3001/project/${fidi}/tls`); // Fetch TLs
//       setTlList(tlsResponse.data.teamLeads); // Update TL state
//     } catch (error) {
//       console.error('Error fetching project details:', error);
//     }
//   };


//   useEffect(() => {
//     fetchProjectDetails();
//     setCurrentMonth(getCurrentMonth());
//   }, []);

//   const getCurrentMonth = () => {
//     const currentDate = new Date();
//     const currentMonthIndex = currentDate.getMonth();
//     const monthNames = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return monthNames[currentMonthIndex];
//   };

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handleTlChange = (e) => {
//     setSelectedTl(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!email.endsWith('@fosteringlinux.com') && !email.endsWith('@keenable.in') && !email.endsWith('@gmail.com')) {
//         alert('Please enter a valid email address from fosteringlinux.com, keenable.in, or gmail.com domains.');
//         return;
//       }

//       const projectName = partproject.name || 'the project';
//       const memberList = members.map((member, index) => `${index + 1}. ${member.firstname} ${member.lastname}`).join('\n');

//       await axios.post('http://localhost:3001/send-email', {
//         recipientEmail: email,
//         subject: 'Provide Remarks for Project Members',
//         text: `Dear Team Lead,\n\nYou have been assigned to review the project '${projectName}'.\n\nProject Members:\n${memberList}\n\nPlease provide your remarks for each member in the following format:\n1. Remarks for Member 1\n2. Remarks for Member 2\n...\n\nThank you.\n\nLink to project: http://localhost:5173/tl/${fidi}`
//       });
//       console.log('Email Sent');
//       setEmail('');

//       navigate('/assign-ticket');
//     } catch (error) {
//       console.error('Error sending email:', error);
//       alert('Failed to send email. Please try again later.');
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <ul className='project-name'>
//         <h3>Current Month: {currentMonth}</h3>
//         <span className='heading-project'> Project Name: &nbsp;{partproject.name}</span>
//       </ul>
//       <div>
//         <h3 className='member'>Members of the Project:</h3>
//         <ul className='members'>
//           {members.map((member, index) => (
//             <li key={member.id}>{index + 1}. {member.firstname} {member.lastname}</li>
//           ))}
//         </ul>
//         <form onSubmit={handleSubmit}>
//         <select className='tl-dropdown' value={selectedTl} onChange={handleTlChange} required>
//   <option value="">Select Team Lead</option>
//   {tlList && tlList.map(tl => ( // Add a check for tlList
//     <option key={tl.user_id} value={tl.user_id}>{tl.firstname} {tl.lastname}</option>
//   ))}
// </select>

//           {/* <input className='email' type="email" placeholder="Enter email address" value={email} onChange={handleEmailChange} required /> */}
//           <button className='assign' type="submit">Submit</button>
//         </form>
//       </div>
//       <br /><br />
//     </div>
//   );
// };

// export default ProjectDetailsPage;

// =============================================================

// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import axios from 'axios';
// import './css/project.css';
// import { useNavigate } from 'react-router-dom';

// const ProjectDetailsPage = () => {
//   const url = new URL(window.location.href);
//   const idi = url.pathname;
//   const fidi = idi.slice(10);
//   const [partproject, setPartProject] = useState({});
//   const [members, setMembers] = useState([]);
//   const [tlList, setTlList] = useState([]);
//   const [selectedTl, setSelectedTl] = useState('');
//   const [currentMonth, setCurrentMonth] = useState('');
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate();

//   const fetchProjectDetails = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3001/project/${fidi}`);
//       setPartProject(response.data);
//       const membersResponse = await axios.get(`http://localhost:3001/project/${fidi}/members`);
//       setMembers(membersResponse.data.projectMembers);
//       const tlsResponse = await axios.get(`http://localhost:3001/project/${fidi}/tls`); // Fetch TLs
//       console.log("TLs response:", tlsResponse); // Log TLs response
//       console.log("TLs data:", tlsResponse.data); // Log TLs data
//       if (tlsResponse.data) {
//         setTlList(tlsResponse.data); // Update TL state
//       } else {
//         console.error("TLs data is undefined");
//       }
//     } catch (error) {
//       console.error('Error fetching project details:', error);
//     }
//   };
  

//   useEffect(() => {
//     fetchProjectDetails();
//     setCurrentMonth(getCurrentMonth());
//   }, []);

//   const getCurrentMonth = () => {
//     const currentDate = new Date();
//     const currentMonthIndex = currentDate.getMonth();
//     const monthNames = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return monthNames[currentMonthIndex];
//   };

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handleTlChange = (e) => {
//     setSelectedTl(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!email.endsWith('@fosteringlinux.com') && !email.endsWith('@keenable.in') && !email.endsWith('@gmail.com')) {
//         alert('Please enter a valid email address from fosteringlinux.com, keenable.in, or gmail.com domains.');
//         return;
//       }

//       const projectName = partproject.name || 'the project';
//       const memberList = members.map((member, index) => `${index + 1}. ${member.firstname} ${member.lastname}`).join('\n');

//       await axios.post('http://localhost:3001/send-email', {
//         recipientEmail: email,
//         subject: 'Provide Remarks for Project Members',
//         text: `Dear Team Lead,\n\nYou have been assigned to review the project '${projectName}'.\n\nProject Members:\n${memberList}\n\nPlease provide your remarks for each member in the following format:\n1. Remarks for Member 1\n2. Remarks for Member 2\n...\n\nThank you.\n\nLink to project: http://localhost:5173/tl/${fidi}`
//       });
//       console.log('Email Sent');
//       setEmail('');

//       navigate('/assign-ticket');
//     } catch (error) {
//       console.error('Error sending email:', error);
//       alert('Failed to send email. Please try again later.');
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <ul className='project-name'>
//         <h3>Current Month: {currentMonth}</h3>
//         <span className='heading-project'> Project Name: &nbsp;{partproject.name}</span>
//       </ul>
//       <div>
//         <h3 className='member'>Members of the Project:</h3>
//         <ul className='members'>
//           {members.map((member, index) => (
//             <li key={member.id}>{index + 1}. {member.firstname} {member.lastname}</li>
//           ))}
//         </ul>
//         <form onSubmit={handleSubmit}>
//           <select className='tl-dropdown' value={selectedTl} onChange={handleTlChange} required>
//             <option value="">Select Team Lead</option>
//             {tlList.map(tl => (
//               <option key={tl.tl_id} value={tl.tl_id}>{tl.tl_name}</option>
//             ))}
//           </select>

//           <button className='assign' type="submit">Submit</button>
//         </form>
//       </div>
//       <br /><br />
//     </div>
//   );
// };

// export default ProjectDetailsPage;


// Frontend Changes

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './css/project.css';
import { useNavigate } from 'react-router-dom';

const ProjectDetailsPage = () => {
  const url = new URL(window.location.href);
  const idi = url.pathname;
  const fidi = idi.slice(10);
  const [partproject, setPartProject] = useState({});
  const [members, setMembers] = useState([]);
  const [tlList, setTlList] = useState([]);
  const [selectedTl, setSelectedTl] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [tlMembersEmails, setTlMembersEmails] = useState([]);
  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/project/${fidi}`);
      console.log("Project Details Response:", response.data);
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

    try {
      const response = await axios.get(`http://localhost:3001/tl/${e.target.value}/members`);
      console.log("TL Members Response:", response.data);
      if (response.data && response.data.members) {
        setTlMembersEmails(response.data.members.map(member => member.email));
      } else {
        setTlMembersEmails([]);
        console.error("TL members email data is undefined");
      }
    } catch (error) {
      console.error('Error fetching TL members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tlMembersEmails.length === 0) {
        alert('No team members found for the selected Team Lead.');
        return;
      }

      const projectName = partproject.name || 'the project';
      const memberList = members.map((member, index) => `${index + 1}. ${member.firstname} ${member.lastname}`).join('\n');

      // Send email to each member
      tlMembersEmails.forEach(async (memberEmail) => {
        await axios.post('http://localhost:3001/send-email', {
          recipientEmail: memberEmail,
          subject: 'Provide Remarks for Project Members',
          text: `Dear Team Member,\n\nYou have been assigned to review the project '${projectName}'.\n\nPlease provide your remarks for the project.\n\nThank you.\n\nLink to project: http://localhost:5173/tl/${fidi}`
        });
      });

      console.log('Email Sent');

      navigate('/assign-ticket');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
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
          <select className='tl-dropdown' value={selectedTl} onChange={handleTlChange} required>
            <option value="">Select Team Lead</option>
            {tlList.map(tl => (
              <option key={tl.tl_id} value={tl.tl_id}>{tl.tl_name}</option>
            ))}
          </select>
          <button className='assign' type="submit">Submit</button>
        </form>
      </div>
      <br /><br />
    </div>
  );
};

export default ProjectDetailsPage;
