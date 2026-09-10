import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  Send,
  Radio,
  ShieldCheck,
  X,
  User,
  Clock,
} from 'lucide-react';

export const PortCommsModal: React.FC = () => {
  const { isPortCommsOpen, setIsPortCommsOpen, chatMessages, sendChatMessage, isSatelliteOnline } =
    useCommand();
  const { currentUser } = useAuth();
  const [msgInput, setMsgInput] = useState('');

  if (!isPortCommsOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    sendChatMessage(msgInput);
    setMsgInput('');
  };

  return (
    <div
      id="modal-port-comms"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative flex flex-col h-[560px] text-slate-100">
        {/* Close Button */}
        <button
          onClick={() => setIsPortCommsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 shrink-0">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Port Authority & Harbor Master Uplink</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                {isSatelliteOnline ? 'SATCOM HIGH-FREQ' : 'OFFLINE BUFFER'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Encrypted ship-to-shore messaging • Shore-power cold-chain reservation queue
            </p>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {(chatMessages || []).map((msg) => {
            const isMe = msg.sender.includes(currentUser?.name || 'Officer') || msg.role === 'captain';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                  <span className="font-semibold text-slate-300">{msg.sender}</span>
                  <span>•</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.message || (msg as any).text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="pt-3 border-t border-slate-800 flex items-center gap-2 shrink-0">
          <input
            id="input-port-comms-message"
            type="text"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            placeholder="Transmit encrypted telex to Harbor Control..."
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition font-bold cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
