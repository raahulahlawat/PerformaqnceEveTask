import React from 'react';
import Navbar from './Navbar';
import './css/assign.css';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';

const MarksSubmittedPage = ({ readOnlyMode }) => {
  return (
    <div>
      <Navbar showHomeButton={!readOnlyMode} /> {/* Pass true to show the home button if not in read-only mode */}
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
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default MarksSubmittedPage;
