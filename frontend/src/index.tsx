import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from "./Routes/Login";
import Dashboard from "./Routes/Dashboard";
import {RequireAuth} from "./Auth/RequireAuth";
import {AuthProvider} from "./Auth/AuthContext";
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/*These Routes are public. No need for auth*/}
                    <Route path="/login" element={<Login />} />

                    <Route element={<RequireAuth />}>
                        {/*These Routes will need the user info, so need the token*/}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </GoogleOAuthProvider>
);