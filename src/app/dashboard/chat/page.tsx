'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PaperAirplaneIcon, 
  PlusIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/src/components/layouts/DashboardLayout';
import { chatService } from '@/src/lib/api/chatService';
import { brandService } from '@/src/lib/api/brandService';
import { isAuthenticated } from '@/src/lib/utils/auth';

interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

interface Chat {
  _id: string;
  title: string;
  brand: {
    _id: string;
    name: string;
  };
  createdAt: string;
  messages: Message[];
}

interface Brand {
  _id: string;
  name: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [newChatTitle, setNewChatTitle] = useState('');
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const brandsResponse = await brandService.getBrands();
        setBrands(brandsResponse);
        
        if (brandsResponse.length > 0) {
          setSelectedBrand(brandsResponse[0]._id);
          const chatsResponse = await chatService.getChatsByBrand(brandsResponse[0]._id);
          setChats(chatsResponse);
          
          if (chatsResponse.length > 0) {
            const chatDetail = await chatService.getChatById(chatsResponse[0]._id);
            setSelectedChat(chatDetail);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setSelectedChat(null);
    
    try {
      setIsLoading(true);
      const chatsResponse = await chatService.getChatsByBrand(brandId);
      setChats(chatsResponse);
      
      if (chatsResponse.length > 0) {
        const chatDetail = await chatService.getChatById(chatsResponse[0]._id);
        setSelectedChat(chatDetail);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = async (chatId: string) => {
    try {
      setIsLoading(true);
      const chatDetail = await chatService.getChatById(chatId);
      setSelectedChat(chatDetail);
    } catch (error) {
      console.error('Error fetching chat details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async () => {
    if (!selectedBrand) return;
    
    try {
      setIsCreatingChat(true);
      const title = newChatTitle.trim() || `Chat mới ${new Date().toLocaleString('vi-VN')}`;
      const newChat = await chatService.createChat({
        brandId: selectedBrand,
        title,
      });
      
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
      setNewChatTitle('');
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
    
    try {
      setIsSending(true);
      const newMessage = message.trim();
      setMessage('');
      
      // Optimistically update UI
      const optimisticMessage = {
        _id: `temp-${Date.now()}`,
        content: newMessage,
        role: 'user' as const,
        createdAt: new Date().toISOString(),
      };
      
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, optimisticMessage],
      });
      
      // Send message to API
      const response = await chatService.sendMessage(selectedChat._id, {
        content: newMessage,
      });
      
      // Update with actual response
      setSelectedChat(response);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Chat AI</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trao đổi với AI để tạo nội dung cho thương hiệu của bạn
        </p>
      </div>

      <div className="mt-6 h-[calc(100vh-200px)] flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder="Tiêu đề chat mới"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={handleCreateChat}
                disabled={isCreatingChat || !selectedBrand}
                className="ml-2 inline-flex items-center p-1 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading && !selectedChat ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : chats.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {chats.map((chat) => (
                  <li key={chat._id}>
                    <button
                      onClick={() => handleChatSelect(chat._id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none ${
                        selectedChat?._id === chat._id ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{chat.title}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(chat.createdAt)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Chưa có cuộc trò chuyện nào</p>
                {selectedBrand && (
                  <button
                    onClick={handleCreateChat}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Tạo cuộc trò chuyện
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">{selectedChat.title}</h2>
                <p className="text-sm text-gray-500">{selectedChat.brand.name}</p>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedChat.messages.length > 0 ? (
                  <div className="space-y-4">
                    {selectedChat.messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-3/4 rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-indigo-100 text-indigo-900'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                          <div className="mt-1 text-xs text-gray-500 text-right">
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">Bắt đầu cuộc trò chuyện với AI</p>
                  </div>
                )}
              </div>
              
              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || !message.trim()}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    {isSending ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Nhấn Enter để gửi, Shift+Enter để xuống dòng
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Không có cuộc trò chuyện nào được chọn</h3>
              <p className="mt-1 text-gray-500">Chọn một cuộc trò chuyện hoặc tạo mới để bắt đầu</p>
              {selectedBrand && (
                <button
                  onClick={handleCreateChat}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Tạo cuộc trò chuyện mới
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
