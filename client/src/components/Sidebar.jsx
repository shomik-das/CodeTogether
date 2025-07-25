import React, { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { IoMdChatbubbles  } from "react-icons/io";
import { MdDraw } from "react-icons/md";
import { FaPlay } from "react-icons/fa6";
import { MdRemoveRedEye } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const Sidebar = ({ onToggle }) => {
  const [activeTab, setActiveTab] = useState('clients');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onToggle(tab);
  };

  return (
    <div className="h-screen w-16 bg-[#1e1e1e] text-white flex flex-col items-center justify-center py-4 border-r border-gray-700 shadow-lg">
      <div className="flex flex-col space-y-8">
        <Tippy content="Connected Users" placement="right">
          <button
            onClick={() => handleTabChange('clients')}
            className={`p-3 rounded-lg transition-all ${
              activeTab === 'clients'
                ? 'bg-[#393E46] text-white'
                : 'text-gray-400'
            }`}
          >
            <FaUsers size={24} />
          </button>
        </Tippy>
        
        <Tippy content="Group Chat" placement="right">
          <button
            onClick={() => handleTabChange('chat')}
            className={`p-3 rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-[#393E46] text-white'
                : 'text-gray-400'
            }`}
          >
            <IoMdChatbubbles size={24} />
          </button>
        </Tippy>
        
        <Tippy content="Draw" placement="right">
          <button
            onClick={() => handleTabChange('draw')}
            className={`p-3 rounded-lg transition-all ${
              activeTab === 'draw'
                ? 'bg-[#393E46] text-white'
                : 'text-gray-400'
            }`}
          >
            <MdDraw size={24} />
          </button>
        </Tippy>
        
        <Tippy content="Run Code" placement="right">
          <button
            onClick={() => handleTabChange('run')}
            className={`p-3 rounded-lg transition-all ${
              activeTab === 'run'
                ? 'bg-[#393E46] text-white'
                : 'text-gray-400'
            }`}
          >
            <FaPlay size={24} />
          </button>
        </Tippy>
        
        <Tippy content="Preview" placement="right">
          <button
            onClick={() => handleTabChange('preview')}
            className={`p-3 rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-[#393E46] text-white'
                : 'text-gray-400'
            }`}
          >
            <MdRemoveRedEye size={24} />
          </button>
        </Tippy>
        <Tippy content="Video Call" placement="right">
          <button
            onClick={() => handleTabChange('video')}
            className={`p-3 rounded-lg transition-all ${
              activeTab === 'video'
                ? 'bg-[#393E46] text-white'
                : 'text-gray-400'
            }`}
          >
            <FaVideo size={24} />
          </button>
        </Tippy>
      </div>
    </div>
  );
};

export default Sidebar; 