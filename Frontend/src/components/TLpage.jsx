// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Navbar from './Navbar';

// // const TLPage = () => {
// //   const [selectedProject, setSelectedProject] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [isDirectEmail, setIsDirectEmail] = useState(false);

// //   useEffect(() => {
// //     const projectId = window.location.pathname.split('/').pop();
// //     fetchProjectDetails(projectId);
// //   }, []);

// //   const fetchProjectDetails = async (projectId) => {
// //     try {
// //       const response = await axios.get(`http://localhost:3001/api/tl/project/${projectId}`);
// //       setSelectedProject(response.data);
// //     } catch (error) {
// //       console.error('Error fetching project details:', error);
// //       setError('Failed to fetch project details. Please try again later.');
// //     }
// //   };

// //   const handleSendEmail = async () => {
// //     // Logic to send email
// //     setIsDirectEmail(true); // Set flag to indicate direct email
// //   };

// //   if (error) {
// //     return <div>Error: {error}</div>;
// //   }

// //   return (
// //     <div>
// //       <Navbar />
// //       {selectedProject && (
// //         <div>
// //           <h2>Performance Tracker</h2>
// //           <p>Select Date: {selectedProject.date}</p>
// //           <h3>Members of the Project:</h3>
// //           <ul>
// //             {selectedProject.members.map((member) => (
// //               <li key={member.id}>
// //                 {member.firstname} {member.lastname}
// //               </li>
// //             ))}
// //           </ul>
// //           {!isDirectEmail && (
// //             <div>
// //               {/* <p>Select Team Lead:</p>
// //               <select>
// //                 Render TL options here
// //               </select> */}
// //             </div>
// //           )}
// //           <button onClick={handleSendEmail}>Send Email</button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TLPage;


// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Navbar from './Navbar';

// // const TLPage = () => {
// //   const [project, setProject] = useState(null);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const uniqueId = window.location.pathname.split('/').pop();
// //     fetchProjectDetails(uniqueId);
// //   }, []);

// //   const fetchProjectDetails = async (uniqueId) => {
// //     try {
// //       const response = await axios.get(`http://localhost:3001/api/tl/project/${uniqueId}`);
// //       setProject(response.data);
// //     } catch (error) {
// //       console.error('Error fetching project details:', error);
// //       setError('Failed to fetch project details. Please try again later.');
// //     }
// //   };

// //   if (error) {
// //     return <div>Error: {error}</div>;
// //   }

// //   return (
// //     <div>
// //       <Navbar />
// //       {project && (
// //         <div>
// //           <h2>Performance Tracker</h2>
// //           <h3>Project: {project.project}</h3>
// //           <h3>Members of the Project:</h3>
// //           <ul>
// //             {project.members.map((member) => (
// //               <li key={member.id}>
// //                 {member.firstname} {member.lastname}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TLPage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TLPage = () => {
//   const [projectDetails, setProjectDetails] = useState(null);
//   const uniqueId = 'YOUR_UNIQUE_ID'; // Replace 'YOUR_UNIQUE_ID' with the actual unique ID

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       try {
//         console.log('Unique ID:', uniqueId); // Log the unique ID
//         const response = await axios.get(`/api/tl/project/${uniqueId}`);
//         console.log('Response:', response.data); // Log the response data
//         setProjectDetails(response.data);
//       } catch (error) {
//         console.error('Error fetching project details:', error);
//       }
//     };

//     fetchProjectDetails();
//   }, [uniqueId]);

//   return (
//     <div>
//       {projectDetails ? (
//         <div>
//           <h2>Project Details</h2>
//           <p>Project Name: {projectDetails.project}</p>
//           <h3>Members:</h3>
//           <ul>
//             {projectDetails.members && projectDetails.members.map(member => (
//               <li key={member.id}>{member.firstname} {member.lastname}</li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Loading project details...</p>
//       )}
//     </div>
//   );
// };

// export default TLPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TLPage = () => {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get('/api/tl/project');
        setProjectDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, []);

  return (
    <div>
      <h1>TL Page</h1>
      {loading && <p>Loading project details...</p>}
      {projectDetails && (
        <div>
          <h2>Project Name: {projectDetails.project}</h2>
          <h3>Members:</h3>
          <ul>
            {projectDetails.members.map(member => (
              <li key={member.id}>
                {member.firstname} {member.lastname}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TLPage;
