import React from "react";
import Keycloak from 'keycloak-js';
import Protected from './components/Protected';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import AssignTicketPage from './components/AssignTicketPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import TLpage from "./components/TLpage";
export const keycloak = new Keycloak({
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
    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
                <Route path="/assign-ticket" element={<AssignTicketPage />} />
                <Route path="/tl" element={<TLpage />} />
                <Route path="/public" element={<Protected />} />
            </Routes>
        </BrowserRouter>


    </div>
}
export default App;