import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="w-full max-w-4xl space-y-8">
                {children}
            </div>
        </div>
    );
};

export default Layout;
