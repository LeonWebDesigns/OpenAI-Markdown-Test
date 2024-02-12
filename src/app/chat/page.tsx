'use client';
import React, { useState } from 'react';

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<
    { who: string; content: string; time: any }[]
  >([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput(''); // Clear the input after sending the message
    setConversation([
      ...conversation,
      {
        who: 'user',
        content: userMessage,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      const url = new URL('/api/open-ai', window.location.href);
      url.searchParams.append('prompt', userMessage);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      setConversation([
        ...conversation,
        {
          who: 'user',
          content: userMessage,
          time: new Date().toLocaleTimeString(),
        },
        {
          who: 'bot',
          content: data.message,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setConversation([
        ...conversation,
        {
          who: 'bot',
          content: 'Sorry, something went wrong.',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[100vh] border border-gray-200 rounded-lg dark:border-gray-800">
      <div className="flex-1 p-4 overflow-y-auto">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.who === 'user' ? 'justify-end' : ''
            } items-end gap-2`}
          >
            <div className="rounded-xl p-3 bg-gray-100 dark:bg-gray-800">
              {message.content}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {message.time}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <form
          onSubmit={handleSubmit}
          className="flex h-12 items-center p-4 space-x-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 border border-gray-300 text-black rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
