import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { GoogleLogin } from "@react-oauth/google";

import {AuthContext} from "../Auth/AuthContext";

export default function LoginPage() {
    const {setToken} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //After the user has inputted the account details, call api to check the credentials
    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const res = await fetch('https://api.vasylevskyi.net/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) setError("Incorrect email or password")
        else {
            const { token } = await res.json();

            if (!token) {
                setError("Falsey token received upstream");
            }

            setToken(token || '');
            navigate('/dashboard');
        }
    }

    async function handleGoogle(credentialResponse: any) {
        try {
            const response = await fetch("https://api.vasylevskyi.net/google_login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            if (!response.ok) {
                throw new Error();
            }

            const { token } = await response.json();

            setToken(token || '');
            navigate('/dashboard');

        } catch (err) {
            setError("Google Login failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

                {error && <div className="mb-4 text-red-600">{error}</div>}

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
                <GoogleLogin onSuccess={handleGoogle} onError={() => setError("Google Login Failed")} />
            </form>
        </div>
    );
}
