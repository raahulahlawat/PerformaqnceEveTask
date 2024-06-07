import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { keycloak } from '../App';
import './css/nav.css'
const navigate = useNavigate
const handleNavigation = () => {
  navigate('/');
};
const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);


export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isReadOnly = () => {
    const params = new URLSearchParams(location.search);
    return params.get('readOnly') === 'true';
  };
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box fontSize='1.5em' >Performance Tracker</Box>

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
                    <p>Keenable</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  {!isReadOnly() && (
                    <MenuItem>
                      <Button as={Link} href='/'>
                        Home
                      </Button>
                    </MenuItem>
                  )}
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
};


// import React from 'react';
// import './css/nav.css';
// import {
//   Box,
//   Flex,
//   Avatar,
//   Link,
//   Button,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   useDisclosure,
//   useColorModeValue,
//   Stack,
//   useColorMode,
//   Center,
// } from '@chakra-ui/react';
// import { MoonIcon, SunIcon } from '@chakra-ui/icons';
// import { useNavigate } from 'react-router-dom'; // Moved import here
// import { keycloak } from '../App';
// import './css/nav.css';

// const Navbar = ({ showHomeButton = true }) => {
//   const navigate = useNavigate(); // Moved inside the component body

//   const { colorMode, toggleColorMode } = useColorMode();
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const handleNavigation = () => {
//     navigate('/');
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
//                     <p>Keenable</p>
//                   </Center>
//                   <br />
//                   <MenuDivider />
//                   {showHomeButton && (
// <MenuItem>
//   <Button as={Link} href='/'>
//     Home
//   </Button>
// </MenuItem>
//                   )}
// <MenuItem>
//   <Button onClick={() => keycloak.logout()}>
//     Logout
//   </Button>
// </MenuItem>

//                 </MenuList>
//               </Menu>
//             </Stack>
//           </Flex>
//         </Flex>
//       </Box>
//     </>
//   );
// };

// export default Navbar;


// import React from 'react';
// import {
//   Box,
//   Flex,
//   Avatar,
//   Link,
//   Button,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   useDisclosure,
//   useColorModeValue,
//   Stack,
//   useColorMode,
//   Center,
// } from '@chakra-ui/react';
// import { MoonIcon, SunIcon } from '@chakra-ui/icons';
// import { useLocation } from 'react-router-dom'; // import useLocation hook

// const Navbar = () => {
//   const location = useLocation(); // useLocation hook to get current URL

//   const { colorMode, toggleColorMode } = useColorMode();
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   // Function to check if the current URL contains a read-only parameter
//   const isReadOnly = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('readOnly') === 'true';
//   };

//   return (
//     <>
//       {/* Always render the Navbar */}
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
//                     <p>Keenable</p>
//                   </Center>
//                   <br />
//                   <MenuDivider />
//                   {!isReadOnly() && (
//                     <MenuItem>
//                       <Button as={Link} href='/'>
//                         Home
//                       </Button>
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
// };

// export default Navbar;
