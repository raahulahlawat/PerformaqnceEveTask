import React from "react";
import Keycloak from 'keycloak-js';
import Protected from './components/Protected';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import AssignTicketPage from './components/AssignTicketPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import MarksSubmittedPage from './components/MarksSubmittedPage';
import RemarksPage from './components/RemarksPage';

export const keycloak = new Keycloak({
    realm: 'performance',
    url: 'http://rahul-ahlawat.io:8080',
    clientId: 'performclient',
    clientSecret: 'noAIgO3I9X70qdXZ3a6E5xns1QHoglZ6'
});

keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
    if (authenticated) {
        console.log('User is authenticated');
        keycloak.loadUserInfo().then(userInfo => {
            console.log('User Info:', userInfo);

            // Example: Display user's name
            const userName = userInfo.name;
            console.log('User Name:', userName);

            // Example: Check if email is verified
            const isEmailVerified = userInfo.email_verified;
            console.log('Email Verified:', isEmailVerified);

            // Example: Conditional logic based on user info
            if (userInfo.email_verified) {
                console.log('User email is verified.');
                // Proceed with authenticated actions
            } else {
                console.log('User email is not verified.');
                // Handle scenario where email is not verified
            }

            // Further application logic based on userInfo...
        }).catch(error => {
            console.error('Error loading user info:', error);
        });
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
                    <Route path="/remarks/:projectId" element={<RemarksPage/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
