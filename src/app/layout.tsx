import React from 'react';
import './globals.css';
import Navbar from '../components/ui/Navbar';

export const metadata = {
    title: 'Jeevan Lakshya - Plan 733',
    description: 'Insurance plan details and experience for Jeevan Lakshya Plan 733',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                {/* Typography for Gujarati + Inter */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            </head>
            <body className="min-h-[100svh] h-auto overflow-x-hidden bg-white font-sans antialiased">
                <Navbar />
                {children}
            </body>
        </html>
    );
};

export default Layout;