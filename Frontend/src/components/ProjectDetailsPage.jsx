// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import axios from 'axios';
// import './css/project.css';

// const ProjectDetailsPage = () => {
//   const url = new URL(window.location.href);
//   const idi = url.pathname;
//   const fidi = idi.slice(10);
//   const [partproject, setpartProject] = useState([]);
//   const [members, setMembers] = useState([]);

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

//   return (
//     <div>
//       <Navbar />
//       <ul className='project-name'>
//       <h1>Project Name:</h1> {partproject.map((part) => (
//           <li key={part.id}>{part.name}</li>
//         ))}
//       </ul>
//       <div>
//         <h3 className='member'>Members of the Project</h3>
//         <ul className='members' >
//           {members.map((member, index) => (
//             <li key={member.id}>{index + 1}. {member.firstname} {member.lastname}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetailsPage;



import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './css/project.css';

const ProjectDetailsPage = () => {
  const url = new URL(window.location.href);
  const idi = url.pathname;
  const fidi = idi.slice(10);
  const [partproject, setpartProject] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');

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
    setCurrentMonth(getCurrentMonth()); // Set current month when component mounts
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
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
