
'use client';

import { useState } from 'react';
import { aiService } from '../services/ai.service';

export default function TikaChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'tika'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const response = await aiService.chatWithTika(userMessage);
            setMessages((prev) => [...prev, { role: 'tika', text: response.reply }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: 'tika', text: 'Maaf, Tika sedang gangguan.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all"
                >
                    💬 Tanya Tika
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col h-96 border border-gray-200">
                    <div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-bold">Asisten Tika 🤖</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                            ✖
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user'
                                        ? 'bg-purple-100 ml-auto text-purple-900'
                                        : 'bg-white border border-gray-200 mr-auto text-gray-800'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="text-sm text-gray-500 italic">Tika sedang mengetik...</div>}
                    </div>

                    <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Tanya sesuatu..."
                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
