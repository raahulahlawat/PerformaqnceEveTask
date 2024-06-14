// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import { ChakraProvider } from '@chakra-ui/react'
// <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />


// ReactDOM.createRoot(document.getElementById('root')).render(

//   <ChakraProvider>
//     <App />
//   </ChakraProvider>
  
// )


import React from 'react';
import { createRoot } from 'react-dom';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
