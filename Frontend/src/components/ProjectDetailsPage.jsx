// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import axios from 'axios';
// import './css/project.css';
// import { useNavigate } from 'react-router-dom';

// const ProjectDetailsPage = () => {
//   const url = new URL(window.location.href);
//   const idi = url.pathname;
//   const fidi = idi.slice(10);
//   const [partproject, setpartProject] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [currentMonth, setCurrentMonth] = useState('');
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate();

//   const fetchProjectDetails = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3001/project/${fidi}`);
//       setpartProject(response.data);
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

//   const generateUniqueToken = () => {
//     return 'unique_token';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const uniqueToken = generateUniqueToken();
//       const uniqueLink = `http://localhost:5173/tl/${uniqueToken}`;
      

//       if (!email.endsWith('@fosteringlinux.com') && !email.endsWith('@keenable.in') && !email.endsWith('@gmail.com')) {
//         alert('Please enter a valid email address from fosteringlinux.com or keenable.in domains.');
//         return;
//       }

//       await axios.post('http://localhost:3001/send-email', {
//         recipientEmail: email,
//         subject: 'Provide Remarks for Project Members',
//         text: `Please provide remarks for the project members by clicking on the following link: ${uniqueLink}`
//       });
//       console.log('Email Sent');
//       setEmail('');

  //     navigate('/assign-ticket');
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     alert('Failed to send email. Please try again later.');
  //   }
  // };

//   return (
//     <div>
//       <Navbar />
//       <ul className='project-name'>
//         <h3>Current Month: {currentMonth}</h3>
//         <span className='heading-project'> Project Name : &nbsp;{partproject.map((part) => (
//           <li key={part.id}>{part.name}</li>
//         ))} </span>
//       </ul>
//       <div>
//         <h3 className='member'>Members of the Project :</h3>
//         <ul className='members' >
//           {members.map((member, index) => (
//             <li key={member.id}>{index + 1}. {member.firstname} {member.lastname}</li>
//           ))}
//         </ul>
//         <form onSubmit={handleSubmit}>
//           <input className='email' type="email" placeholder="Enter email address" value={email} onChange={handleEmailChange} required />
//           <button className='assign' type="submit">Submit</button>
//         </form>
//       </div>
//       <br /> <br />
//     </div>
//   );
// };

// export default ProjectDetailsPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './css/project.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import crypto from 'crypto';

const ProjectDetailsPage = () => {
  const { projectId } = useParams(); 

  const url = new URL(window.location.href);
  const idi = url.pathname;
  const fidi = projectId || idi.slice(10);
  const [partproject, setpartProject] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/project/${fidi}`);
      setpartProject(response.data);
      const membersResponse = await axios.get(`http://localhost:3001/project/${fidi}/members`);
      setMembers(membersResponse.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    setCurrentMonth(getCurrentMonth());
  }, [projectId]);

  const getCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[currentMonthIndex];
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const generateUniqueToken = () => {
    return 'unique_token';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const generateUniqueToken = () => {

        return crypto.randomBytes(20).toString('hex');
      
      };
      const uniqueLink = `${window.location.origin}/project/${fidi}`;

      const allowedDomains = ['fosteringlinux.com', 'keenable.in', 'gmail.com'];
      
      if (!allowedDomains.includes(email.split('@')[1])) {

        alert('Please enter a valid email address from one of the allowed domains.');
        return;
      }
  
      await axios.post('http://localhost:3001/send-email', {
        recipientEmail: email,
        subject: 'Provide Remarks for Project Members',
        text: `Please provide remarks for the project members by clicking on the following link: ${uniqueLink}`,
        fidi,
      });
      console.log('Email Sent');
      setEmail('');
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
        <span className='heading-project'> Project Name : &nbsp;{partproject.map((part) => (
          <li key={part.id}>{part.name}</li>
        ))} </span>
      </ul>
      <div>
        <h3 className='member'>Members of the Project :</h3>
        <ul className='members' >
          {members.map((member, index) => (
            <li key={member.id}>{index + 1}. {member.firstname} {member.lastname}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input className='email' type="email" placeholder="Enter email address" value={email} onChange={handleEmailChange} required />
          <button className='assign' type="submit">Submit</button>
        </form>
      </div>
      <br /> <br />
    </div>
  );
};

export default ProjectDetailsPage;


