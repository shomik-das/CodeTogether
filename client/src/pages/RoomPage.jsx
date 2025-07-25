import React, { useState } from 'react';
import CreateRoom from '../components/room/CreateRoom';
import JoinRoom from '../components/room/JoinRoom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Room = () => {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const [view, setView] = useState(mode === 'create' ? 'create' : 'join');

    return (
        <>
        <Navbar />
        <div className="h-[calc(100vh-3.5rem)] bg-[#1e1e1e] flex">
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-b overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b z-10"></div>
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0" 
                    style={{
                        backgroundImage: `url('/1.png')`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    
                >
                </div>
            </div>
            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <h2 className="text-5xl font-bold text-white mb-2">
                        {view === 'create' ? 'Create Room' : 'Join Room'}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {view === 'create' 
                            ? "Set up a new collaborative coding room" 
                            : "Join an existing coding session"}
                    </p>

                    {/* Main form content */}
                    {view === 'join' ? <JoinRoom roomId={roomId} /> : <CreateRoom />}

                    {/* Toggle view option */}
                    <div className="mt-6">
                        <span className="text-gray-400">
                            {view === 'create' 
                                ? "Already have an invite? " 
                                : "Don't have an invite? "}
                        </span>
                        <button
                            onClick={() => setView(view === 'create' ? 'join' : 'create')}
                            className="text-[#bbb8ff] hover:text-[#aaaaff] transition-colors font-semibold duration-200"
                        >
                            {view === 'create' ? 'Join Room' : 'Create Room'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
    );
};

export default Room; 