// import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // Import Link from React Router
// import Navbar from './Navbar';
// import './css/home.css'
// import {
//   Button, ButtonGroup, Menu,
//   MenuButton,
//   MenuList,
//   MenuItem
// } from '@chakra-ui/react'
// import {ChevronDownIcon} from '@chakra-ui/icons'
// const Home = () => {

//   return (
//     <div>
//       <Navbar />

//       <div>
      
//       <div className='project-drop'>
//       <h1>Welcome to the Performance Evaluation Tracker Website</h1>
//       <br />
//       <Menu>
//           <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
//             Projects
//           </MenuButton>
//           <MenuList>
//             <MenuItem>Project 1</MenuItem>
//             <MenuItem>Project 2</MenuItem>
//             <MenuItem>Project 3</MenuItem>
//             <MenuItem>Project 4</MenuItem>
//             <MenuItem>Project 5</MenuItem>
//           </MenuList>
//         </Menu>
//       </div>        
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import Navbar from './Navbar';
import './css/home.css'
import {
  Button, ButtonGroup, Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import {ChevronDownIcon} from '@chakra-ui/icons'
import axios from 'axios';

const Home = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      await axios.get('http://localhost:3001/api/data')
      .then((res)=>{
        setProjects(res.data)
      }) // Assuming your Express server is running on port 3001
     
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <div className='project-drop'>
          <h1>Welcome to the Performance Evaluation Tracker Website</h1>
          <br />
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Projects
            </MenuButton>
            <MenuList>
              {projects.map(project => (
                <MenuItem key={project.id}>{project.name}</MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>        
      </div>
    </div>
  );
};

export default Home;
