// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import Navbar from './Navbar';
// // import axios from 'axios';
// // import { keycloak } from '../App';

// // const RemarksPage = () => {
// //   const { projectId } = useParams();
// //   const [loading, setLoading] = useState(true);
// //   const [projectName, setProjectName] = useState('');
// //   const [remarks, setRemarks] = useState([]);
// //   const [userInfo, setUserInfo] = useState(null);

// //   useEffect(() => {
// //     const fetchRemarks = async () => {
// //       try {
// //         // Fetch project details
// //         const projectResponse = await axios.get(`http://localhost:3001/project/${projectId}`);
// //         console.log('Project Response:', projectResponse.data);
// //         setProjectName(projectResponse.data.name);

// //         // Fetch remarks for current month
// //         const currentDate = new Date();
// //         const month = currentDate.toLocaleString('default', { month: 'long' });
// //         const year = currentDate.getFullYear();
// //         const remarksResponse = await axios.get(`http://localhost:3001/project/${projectId}/remarks?month=${month}&year=${year}`);
// //         console.log('Remarks Response:', remarksResponse.data);
// //         setRemarks(remarksResponse.data);

// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching remarks:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchRemarks();

// //     if (keycloak.authenticated) {
// //       keycloak.loadUserInfo()
// //         .then(userInfo => {
// //           console.log("User Info:", userInfo);
// //           setUserInfo(userInfo);
// //         })
// //         .catch(error => {
// //           console.error("Error fetching user info:", error);
// //         });
// //     }
// //   }, [projectId]);

// //   if (loading) {
// //     return <div>Loading...</div>; // Add loading indicator if needed
// //   }

// //   return (
// //     <div>
// //       <div>
// //         <Navbar />
// //       </div>
// //       <h1>Remarks for Project: {projectName}</h1>
// //       {userInfo && (
// //         <div>
// //           <p>User Info:</p>
// //           <p>Name: {userInfo.name}</p>
// //           <p>Email: {userInfo.email}</p>
// //         </div>
// //       )}
// //       <table>
// //         <thead>
// //           <tr>
// //             <th>Member Name</th>
// //             <th>Remark 1</th>
// //             <th>Remark 2</th>
// //             <th>Remark 3</th>
// //             <th>Remark 4</th>
// //             <th>Remark 5</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {remarks.map((remark, index) => (
// //             <tr key={index}>
// //               <td>{remark.member_name}</td>
// //               <td>{remark.remark_1}</td>
// //               <td>{remark.remark_2}</td>
// //               <td>{remark.remark_3}</td>
// //               <td>{remark.remark_4}</td>
// //               <td>{remark.remark_5}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default RemarksPage;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Navbar from './Navbar';
// import axios from 'axios';
// import { keycloak } from '../App';
// import './css/remarks.css'; // Make sure to create this CSS file for styling

// const RemarksPage = () => {
//   const { projectId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [projectName, setProjectName] = useState('');
//   const [remarks, setRemarks] = useState([]);
//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
//     const fetchRemarks = async () => {
//       try {
//         // Fetch project details
//         const projectResponse = await axios.get(`http://localhost:3001/project/${projectId}`);
//         console.log('Project Response:', projectResponse.data);
//         setProjectName(projectResponse.data.name);

//         // Fetch remarks for the current month
//         const currentDate = new Date();
//         const month = currentDate.toLocaleString('default', { month: 'long' });
//         const year = currentDate.getFullYear();
//         const remarksResponse = await axios.get(`http://localhost:3001/project/${projectId}/remarks?month=${month}&year=${year}`);
//         console.log('Remarks Response:', remarksResponse.data);
//         setRemarks(remarksResponse.data);

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching remarks:', error);
//         setLoading(false);
//       }
//     };

//     fetchRemarks();

//     if (keycloak.authenticated) {
//       keycloak.loadUserInfo()
//         .then(userInfo => {
//           console.log("User Info:", userInfo);
//           setUserInfo(userInfo);
//         })
//         .catch(error => {
//           console.error("Error fetching user info:", error);
//         });
//     }
//   }, [projectId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="remarks-container">
//         <h1 className='p_name'>Remarks for Project: {projectName}</h1>
//         <table className="remarks-table">
//           <thead>
//             <tr>
//               <th>Member Name</th>
//               <th>Remark 1</th>
//               <th>Remark 2</th>
//               <th>Remark 3</th>
//               <th>Remark 4</th>
//               <th>Remark 5</th>
//             </tr>
//           </thead>
//           <tbody>
//             {remarks.map((remark, index) => (
//               <tr key={index}>
//                 <td>{remark.member_name}</td>
//                 <td>{remark.remark_1}</td>
//                 <td>{remark.remark_2}</td>
//                 <td>{remark.remark_3}</td>
//                 <td>{remark.remark_4}</td>
//                 <td>{remark.remark_5}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RemarksPage;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { keycloak } from '../App';
import './css/remarks.css';

const RemarksPage = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [remarks, setRemarks] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        // Fetch project details
        const projectResponse = await axios.get(`http://localhost:3001/project/${projectId}`);
        console.log('Project Response:', projectResponse.data);
        setProjectName(projectResponse.data.name);

        // Fetch remarks for the current month
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        setCurrentMonth(`${month} ${year}`);
        const remarksResponse = await axios.get(`http://localhost:3001/project/${projectId}/remarks?month=${month}&year=${year}`);
        console.log('Remarks Response:', remarksResponse.data);
        setRemarks(remarksResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching remarks:', error);
        setLoading(false);
      }
    };

    fetchRemarks();

    if (keycloak.authenticated) {
      keycloak.loadUserInfo()
        .then(userInfo => {
          console.log("User Info:", userInfo);
          setUserInfo(userInfo);
        })
        .catch(error => {
          console.error("Error fetching user info:", error);
        });
    }
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="remarks-container">
        <h1 className='p_name'>Remarks for Project: {projectName}</h1>
        <h2 className='p_name'>Current Month: {currentMonth}</h2>
        <table className="remarks-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Remark 1</th>
              <th>Remark 2</th>
              <th>Remark 3</th>
              <th>Remark 4</th>
              <th>Remark 5</th>
            </tr>
          </thead>
          <tbody>
            {remarks.map((remark, index) => (
              <tr key={index}>
                <td>{remark.member_name}</td>
                <td>{remark.remark_1}</td>
                <td>{remark.remark_2}</td>
                <td>{remark.remark_3}</td>
                <td>{remark.remark_4}</td>
                <td>{remark.remark_5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RemarksPage;
