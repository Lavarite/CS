import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
    code: string
    title: string
    description: string
}

function ErrorPage({ code, title, description }: ErrorPageProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <h1 className="text-9xl font-extrabold text-gray-300">{code}</h1>
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">{title}</h2>
            <p className="mt-2 text-gray-500">{description}</p>
            <Link
                to="/"
                className="mt-6 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
                &#x1F519; Scoot back home
            </Link>
        </div>
    );
}

/** 404 Not Found page */
export function NotFoundPage() {
    return (
        <ErrorPage
            code="404"
            title="Well, this is awkward…"
            description="Looks like this page took a hike and never came back."
        />
    );
}

/** 403 Forbidden page */
export function ForbiddenPage() {
    return (
        <ErrorPage
            code="403"
            title="Stop right there!"
            description="You don’t have the secret handshake to view this."
        />
    );
}
