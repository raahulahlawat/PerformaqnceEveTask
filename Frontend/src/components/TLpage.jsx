// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Navbar from './Navbar';

// const TLPage = () => {
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [remarks, setRemarks] = useState({});

//   useEffect(() => {
//     const projectId = window.location.pathname.split('/').pop();
//     fetchProjectDetails(projectId);
//   }, []);

//   const fetchProjectDetails = async (projectId) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/tl/project/${projectId}`);
//       setSelectedProject(response.data);
//     } catch (error) {
//       console.error('Error fetching project details:', error);
//     }
//   };

//   const handleRemarksChange = (memberId, e) => {
//     setRemarks({
//       ...remarks,
//       [memberId]: e.target.value,
//     });
//   };

//   const handleRemarksSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const projectId = window.location.pathname.split('/').pop();
//       await axios.post(`http://localhost:3001/api/tl/project/${projectId}/remarks`, { remarks });
//       alert('Remarks submitted successfully');
//     } catch (error) {
//       console.error('Error submitting remarks:', error);
//       alert('Failed to submit remarks. Please try again later.');
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       {selectedProject && (
//         <div>
//           <h2>Project Name: {selectedProject.name}</h2>
//           <ul>
//             {selectedProject.members.map((member) => (
//               <li key={member.id}>
//                 {member.firstname} {member.lastname} -{' '}
//                 <input
//                   type="text"
//                   placeholder="Enter remarks"
//                   value={remarks[member.id] || ''}
//                   onChange={(e) => handleRemarksChange(member.id, e)}
//                 />
//               </li>
//             ))}
//           </ul>
//           <button onClick={handleRemarksSubmit}>Submit Remarks</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TLPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const TLPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [error, setError] = useState(null);

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
      setError('Failed to fetch project details. Please try again later.');
    }
  };

  const handleRemarksChange = (memberId, e) => {
    setRemarks({
      ...remarks,
      [memberId]: e.target.value,
    });
  };

  const handleRemarksSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectId = window.location.pathname.split('/').pop();
      await axios.post(`http://localhost:3001/api/tl/project/${projectId}/remarks`, { remarks });
      alert('Remarks submitted successfully');
    } catch (error) {
      console.error('Error submitting remarks:', error);
      alert('Failed to submit remarks. Please try again later.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      {selectedProject && (
        <div>
          <h2>Project Name: {selectedProject.name}</h2>
          <ul>
            {selectedProject.members.map((member) => (
              <li key={member.id}>
                {member.firstname} {member.lastname} -{' '}
                <input
                  type="text"
                  placeholder="Enter remarks"
                  value={remarks[member.id] || ''}
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
