import React, {createContext, useEffect, useState, ReactNode, useCallback} from 'react';

export type UserType = {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
    exp: number;
};

export type AuthContextType = {
    token: string;
    user: UserType | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
};

const defaultContext: AuthContextType = {
    token: '',
    user: null,
    isLoading: true,
    isAuthenticated: false,
    setToken: () => {},
    logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenVar] = useState<string>(() => localStorage.getItem('token') || '');
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    //If called, the token variable is updated. If the new token is falsey, it is removed entirely
    const setToken = useCallback((newToken: string) => {
        setTokenVar(newToken);
        if (newToken) localStorage.setItem('token', newToken);
        else localStorage.removeItem('token');
    },[setTokenVar]);

    /*If called, the user info is removed, effectively logging them out*/
    const logout = useCallback(() => {
        setToken('');
        setUser(null);
        localStorage.removeItem('user');
    }, [setToken, setUser]);

    //The token or user in the localStorage or otherwise is changed, check the new credentials.
    useEffect(() => {
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        fetch('https://api.vasylevskyi.net/users/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                //If the token is erroneous, log the user out
                if (!res.ok) throw new Error('unauth');
                return res.json();
            })
            .then((u) => {
                setUser(u);
                localStorage.setItem('user', JSON.stringify(u));
            })
            .catch(() => {
                logout();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [token, logout]);

    //Fancy, but !!user returns false if user is not set, otherwise, returns true
    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isLoading,
                isAuthenticated: !!user,
                setToken,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
