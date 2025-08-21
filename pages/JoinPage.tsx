import React from 'react';
import { useParams, Link } from 'react-router-dom';

const JoinPage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-10 rounded-xl shadow-2xl border border-white/10 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            You've been invited!
          </h2>
          <p className="mt-2 text-gray-400">
            You're one step away from connecting with your partner.
          </p>
          <div className="mt-6 bg-black/50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Invite Code</p>
            <p className="text-2xl font-mono text-pink tracking-widest">{inviteCode}</p>
          </div>
        </div>
        <div className="mt-6">
           <Link
                to="/signup"
                state={{ inviteCode: inviteCode }}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-green py-2 px-4 text-sm font-bold text-black hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 focus:ring-offset-black"
              >
                Sign Up to Connect
            </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;