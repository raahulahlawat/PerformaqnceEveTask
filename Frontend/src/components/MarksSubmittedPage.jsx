import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Button } from '@chakra-ui/react';
import { keycloak } from '../App';
import './css/remarks.css';

const MarksSubmittedPage = () => {
  const handleLogout = () => {
    keycloak.logout({
      redirectUri: 'http://rahul-ahlawat.io:5173'
    });
  };

  return (
    <div className='assigned'>
      <Alert
        status='success'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          Marks Submitted
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          Your remarks have been successfully submitted.
          <Button className='logout' onClick={handleLogout} mt={4}>
            Logout
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MarksSubmittedPage;
