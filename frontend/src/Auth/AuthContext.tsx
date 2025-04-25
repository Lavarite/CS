import React, { createContext, useState, ReactNode } from 'react';

type AuthContextType = {
    token: string;
    setToken: (token: string) => void;
};

const defaultContext: AuthContextType = {
    token: '',
    setToken: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string>(
        () => localStorage.getItem('token') || ''
    );

    React.useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}