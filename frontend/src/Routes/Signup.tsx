import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { GoogleLogin } from "@react-oauth/google";

import {AuthContext} from "../Auth/AuthContext";

export default function SignupPage() {
    const {setToken} = useContext(AuthContext);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //After the user has inputted the account details, call api to register the user
    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();

        try {
            const res = await fetch('https://api.vasylevskyi.net/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, surname }),
            });
            const data: any = await res.json();

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail);
            }

            if (!data.token) {
                setError("Falsy token received from server");
                return;
            }

            setToken(data.token);
            navigate("/dashboard");

        } catch (err: any) {
            setError(err.message ?? "Signup failed unexpectedly");
        }
    }

    async function handleGoogle(credentialResponse: any) {
        if (!credentialResponse.credential) {
            setError("No credential received from Google");
            return;
        }

        try {
            const res = await fetch("https://api.vasylevskyi.net/google_signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data: any = await res.json();

            if (!res.ok) {
                setError(data.detail ?? `Request failed (${res.status})`);
                return;
            }

            if (!data.token) {
                setError("Falsy token received from server");
                return;
            }

            setToken(data.token);
            navigate("/dashboard");

        } catch (err: any) {
            setError(err.message ?? "Google signup failed unexpectedly");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

                {error && <div className="mb-4 text-red-600">{error}</div>}

                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border rounded" placeholder="Your full name"/>
                </div>

                <div className="mb-4">
                    <label htmlFor="surname" className="block mb-1">Surname</label>
                    <input id="surname" name="surname" type="text" value={surname} onChange={e => setSurname(e.target.value)} required className="w-full px-3 py-2 border rounded" placeholder="Your full surname"/>
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" placeholder="you@example.com"/>
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" placeholder="••••••••"/>
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" placeholder="••••••••"/>
                </div>

                {(password && (password !== confirmPassword)) && <div className="mb-4 text-red-600">These passwords do not match!</div>}
                <button disabled={(password !== confirmPassword) || !password} type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400">Sign Up</button>

                <div className="mt-4 text-center text-gray-500">or</div>

                <div className="flex justify-center mt-4">
                    <GoogleLogin onSuccess={handleGoogle} onError={() => {setError("Google Signup Failed")}}/>
                </div>
            </form>
        </div>
    );
}
