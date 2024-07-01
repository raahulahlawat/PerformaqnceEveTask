// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom'; // Import useLocation hook
// import {
//   Box,
//   Flex,
//   Avatar,
//   Button,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   useColorModeValue,
//   Stack,
//   useColorMode,
//   Center,
// } from '@chakra-ui/react';
// import { MoonIcon, SunIcon } from '@chakra-ui/icons';
// import { keycloak } from '../App';
// import './css/nav.css';

// export default function Nav() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const location = useLocation(); // Use useLocation hook to access location object
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     if (keycloak.authenticated) {
//       const userProfile = keycloak.tokenParsed?.name || 'User';
//       setUserName(userProfile);
//     }
//   }, [keycloak.authenticated]);

//   const isReadOnly = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('readOnly') === 'true';
//   };

//   const getUserNameFromLink = () => {
//     const params = new URLSearchParams(location.search);
//     const selectedMember = params.get('selectedMember') || '';
//     return selectedMember.split('@')[0];
//   };


//   return (
//     <>
//       <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
//         <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
//           <Box fontSize='1.5em'>Performance Tracker</Box>

//           <Flex alignItems={'center'}>
//             <Stack direction={'row'} spacing={7}>
//               <Button onClick={toggleColorMode}>
//                 {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
//               </Button>

//               <Menu>
//                 <MenuButton
//                   as={Button}
//                   rounded={'full'}
//                   variant={'link'}
//                   cursor={'pointer'}
//                   minW={0}>
//                   <Avatar
//                     size={'sm'}
//                     src={'./src/Assets/images.png'}
//                   />
//                 </MenuButton>
//                 <MenuList alignItems={'center'}>
//                   <br />
//                   <Center>
//                     <Avatar
//                       size={'2xl'}
//                       src={'./src/Assets/images.png'}
//                     />
//                   </Center>
//                   <br />
//                   <Center>
//                     <p>{isReadOnly() ? getUserNameFromLink() : userName}</p>
//                   </Center>

//                   <br />
//                   <MenuDivider />
//                   {!isReadOnly() && (
//                     <MenuItem>
//                       <Link to='/'>
//                         <Button>
//                           Home
//                         </Button>
//                       </Link>
//                     </MenuItem>
//                   )}
//                   <MenuItem>
//                     <Button onClick={() => keycloak.logout()}>
//                       Logout
//                     </Button>
//                   </MenuItem>
//                 </MenuList>
//               </Menu>
//             </Stack>
//           </Flex>
//         </Flex>
//       </Box>
//     </>
//   );
// }


import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { keycloak } from '../App';
import './css/nav.css';

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (keycloak.authenticated) {
      const userProfile = keycloak.tokenParsed?.name || 'User'; // Fallback to 'User' if name is not available
      setUserName(userProfile);
    }
  }, [keycloak.authenticated]);

  const isReadOnly = () => {
    const params = new URLSearchParams(location.search);
    return params.get('readOnly') === 'true';
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box fontSize='1.5em'>Performance Tracker</Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'./src/Assets/images.png'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'./src/Assets/images.png'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{userName}</p>
                  </Center>

                  <br />
                  <MenuDivider />
                  <MenuItem>
                    <Link to='/'>
                      <Button>
                        Home
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Button onClick={() => keycloak.logout()}>
                      Logout
                    </Button>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
