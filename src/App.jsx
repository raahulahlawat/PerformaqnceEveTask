import React from "react";
import Keycloak from 'keycloak-js';
import Protected from './components/Protected';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
const keycloak = new Keycloak({
    realm: 'performance',
    url: 'http://localhost:8080',
    clientId: 'performclient'
});

keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
    if (authenticated) {
        console.log('User is authenticated');
    } else {
        console.log('User is not authenticated');
    }
});

const App = () => { 
 return  <div>
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Navbar/>}/>
  <Route path="/public" element={<Protected/>}/>
  </Routes>
  </BrowserRouter>
  
 
 </div>
}
export default App