"use client"
import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, Button, Input, ScrollArea } from '@repo/ui/index';


const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(1);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: 1, name: 'Sarah Wilson', avatar: '/api/placeholder/40/40', lastMessage: 'Hey! How are you doing?', time: '2m ago', unread: 2, online: true },
    { id: 2, name: 'John Davis', avatar: '/api/placeholder/40/40', lastMessage: 'Thanks for your help!', time: '1h ago', unread: 0, online: true },
    { id: 3, name: 'Emma Thompson', avatar: '/api/placeholder/40/40', lastMessage: 'See you tomorrow 👋', time: '3h ago', unread: 1, online: false },
    { id: 4, name: 'Michael Brown', avatar: '/api/placeholder/40/40', lastMessage: 'That sounds great!', time: '5h ago', unread: 0, online: false },
    { id: 5, name: 'Lisa Anderson', avatar: '/api/placeholder/40/40', lastMessage: 'Let me check and get back', time: '1d ago', unread: 0, online: true },
  ];

  const messages = {
    1: [
      { id: 1, text: 'Hey! How are you doing?', sender: 'them', time: '10:30 AM' },
      { id: 2, text: "I'm doing great! Thanks for asking. How about you?", sender: 'me', time: '10:32 AM' },
      { id: 3, text: 'Pretty good! Working on some exciting projects', sender: 'them', time: '10:33 AM' },
      { id: 4, text: 'That sounds amazing! Would love to hear more about it', sender: 'me', time: '10:35 AM' },
    ],
    2: [
      { id: 1, text: 'Thanks for your help!', sender: 'them', time: '9:15 AM' },
      { id: 2, text: 'No problem! Happy to help anytime', sender: 'me', time: '9:20 AM' },
    ],
    3: [
      { id: 1, text: 'See you tomorrow 👋', sender: 'them', time: '8:00 AM' },
      { id: 2, text: 'Yes, see you! Have a great evening', sender: 'me', time: '8:05 AM' },
    ],
    4: [
      { id: 1, text: 'That sounds great!', sender: 'them', time: 'Yesterday' },
    ],
    5: [
      { id: 1, text: 'Let me check and get back', sender: 'them', time: '2 days ago' },
    ],
  };

  const currentUser = users.find(u => u.id === selectedUser);
const currentMessages = messages[selectedUser as keyof typeof messages] || [];
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-100px)]">
      {/* Left Sidebar - User List */}
      <div className="w-60 border-r border-gray-200 flex flex-col">
        {/* Search Header */}
        <div className="p-2 border-b border-gray-200">
          <h2 className="text-xl text-gray-700 font-semibold mb-2">Messages</h2>
          <div className="relative text-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User List */}
        <ScrollArea className="flex-1">
          <div className=" max-h-[calc(100vh-220px)]">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`flex items-center gap-2 py-3 px-2 cursor-pointer transition-colors border-b border-gray-100 ${
                  selectedUser === user.id
                    ? 'bg-[#F4ECF6]'
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-0 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium truncate text-[13px] text-gray-700">{user.name}</p>
                    <span className="text-[10px] text-gray-500 ml-2">{user.time}</span>
                  </div>
                  <p className="text-xs  text-gray-700 truncate">{user.lastMessage}</p>
                </div>
                {user.unread > 0 && (
                  <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-medium">
                    {user.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={currentUser?.avatar} />
                <AvatarFallback>{currentUser?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {currentUser?.online && (
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-0 border-background" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{currentUser?.name}</h3>
              <p className="text-xs text-muted-foreground">
                {currentUser?.online ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button> */}
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3 max-h-[calc(100vh-220px)]">
          <div className="space-y-4">
            {currentMessages.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-3 py-2 rounded-lg bg-gray-100 ${
                    msg.sender === 'me'
                      ? 'bg-primary text-white'
                      : 'bg-muted'
                  }`}
                >
                  <p className='text-xs'>{msg.text}</p>
                  <p className={`text-[10px] mt-1 opacity-50 ${
                    msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-2 border-gray-200">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Smile className="w-5 h-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;