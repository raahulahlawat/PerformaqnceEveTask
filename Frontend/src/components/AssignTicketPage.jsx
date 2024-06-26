import React from 'react';
import Navbar from './Navbar';
import './css/assign.css';
import { useParams } from 'react-router-dom';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';

const AssignTicketPage = () => {
  const { projectId, projectName } = useParams();
  return (
    <div>
      <Navbar />
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
            Review Form Sent!
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            Review Form Link has been successfully sent to the Team Lead of the {projectName} project.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AssignTicketPage;
