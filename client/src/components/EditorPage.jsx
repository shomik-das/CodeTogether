import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Client from './Client';
import Editor from './Editor';
import Chat from './Chat';
import { initSocket } from '../Socket';

const ACTIONS = {
    JOIN: "join",
    JOINED: "joined",
    DISCONNECTED: "disconnected",
    SYNC_CODE: "sync-code",
};

const EditorPage = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract username from location state
    const username = location.state?.username;
    
    const [clients, setClients] = useState([]);
    const [sidebarContent, setSidebarContent] = useState('clients');
    const socketRef = useRef(null);
    const codeRef = useRef("");

    useEffect(() => {
            try {
                socketRef.current = initSocket();

                socketRef.current.on('connect_error', handleError);
                socketRef.current.on('connect_failed', handleError);

                function handleError(err) {
                    console.error('Socket connection error:', err);
                    toast.error('Socket connection failed.');
                    navigate('/');
                }

                socketRef.current.emit(ACTIONS.JOIN, { roomId, username });

                socketRef.current.on(ACTIONS.JOINED, ({ clients, socketId }) => {
                    setClients(clients);
                    if (socketId !== socketRef.current.id) {
                        socketRef.current.emit(ACTIONS.SYNC_CODE, {
                            code: codeRef.current,
                            socketId,
                        });
                    }
                });

                socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => prev.filter(client => client.socketId !== socketId));
                });

            } catch (err) {
                console.error('Socket initialization error:', err);
                toast.error('Could not connect to the server.');
                navigate('/');
            }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [roomId, username, navigate]);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied.');
        } catch {
            toast.error('Could not copy Room ID.');
        }
    };

    if (!username) return <Navigate to="/" />;

    return (
        <div className="flex h-screen">
            <Sidebar onToggle={setSidebarContent} />
            {sidebarContent === 'chat' ? (
                <Chat socketRef={socketRef} roomId={roomId} username={username} />
            ) : (
                <Client clients={clients} currentUsername={username} onCopyRoomId={copyRoomId} onLeaveRoom={() => navigate('/')} />
            )}
            <div className="flex-1">
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
            </div>
        </div>
    );
};

export default EditorPage;
