'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<
    { who: string; content: string; time: any }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve chats from local storage
    (async () => {
      const storedChats = localStorage.getItem('chats') as string | null;

      const parseJSON = async (json: string) => {
        try {
          const res = await JSON.parse(json);
          return res;
        } catch (error) {
          console.error('Error parsing JSON:', error);
          return null;
        }
      };

      const chatsJSON = storedChats ? await parseJSON(storedChats) : null;
      if (chatsJSON.length > 0) {
        setConversation(chatsJSON);
      } else {
        setConversation([
          {
            who: 'bot',
            content: 'Hello, how can I help you? 👋',
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    })();
  }, []);

  // This useEffect hook will run whenever the conversation state changes
  useEffect(() => {
    if (conversation.length > 0) {
      localStorage.setItem('chats', JSON.stringify(conversation));
    }
  }, [conversation]); // Dependency array with conversation ensures this runs on conversation state updates

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = input;
    setInput(''); // Clear the input after sending the message

    // Update the conversation with the user's message immediately
    setConversation((prevConversation) => [
      ...prevConversation,
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

      // Update the conversation with the bot's response
      setConversation((prevConversation) => [
        ...prevConversation,
        {
          who: 'bot',
          content: data.message,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Update the conversation with an error message in case of failure
      setConversation((prevConversation) => [
        ...prevConversation,
        {
          who: 'bot',
          content: 'Sorry, something went wrong.',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100vh] border border-gray-200 rounded-lg dark:border-gray-800">
      <div className="flex items-center min-h-12">
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold ml-4">Created by Violet Leon</h1>
      </div>
      <hr className="bg-black w-[97%] self-center" />
      <div className="flex-1 p-4 overflow-y-auto">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex  my-4 ${
              message.who === 'user' ? 'justify-end' : ''
            } items-end gap-2`}
          >
            <div
              className={`rounded-xl p-3 ${
                message.who === 'user'
                  ? ' bg-gray-100 dark:bg-gray-800'
                  : 'bg-blue-50 dark:bg-gray-500'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {message.time}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="loader"></div>
          </div>
        )}
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
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
