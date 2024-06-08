import React from "react";
import Keycloak from 'keycloak-js';
import Protected from './components/Protected';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import AssignTicketPage from './components/AssignTicketPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import MarksSubmittedPage from './components/MarksSubmittedPage';

export const keycloak = new Keycloak({
    realm: 'performance',
    url: 'http://rahul-ahlawat.io:8080',
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
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects/:id" element={<ProjectDetailsPage isTLView={false} />} />
                    <Route path="/project/:projectId" element={<ProjectDetailsPage isTLView={false} />} />
                    <Route path="/tl/:projectId" element={<ProjectDetailsPage isTLView={true} />} />
                    <Route path="/assign-ticket" element={<AssignTicketPage />} />
                    <Route path="/marks-submitted" element={<MarksSubmittedPage/>} />
                    <Route path="/public" element={<Protected />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
