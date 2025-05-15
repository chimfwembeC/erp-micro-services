import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

import AppLayout from '@/Layouts/AppLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  id: number;
  name: string;
  profile_photo_url?: string;
}

interface Message {
  id: number;
  user_id: number;
  client_id?: number;
  lead_id?: number;
  message: string;
  is_from_user: boolean;
  is_read: boolean;
  created_at: string;
  user?: User;
}

interface Client {
  id: number;
  name: string;
  email: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
}

interface Props {
  entityType: 'client' | 'lead';
  entity: Client | Lead;
  messages: Message[];
}

export default function Show({ entityType, entity, messages: initialMessages }: Props) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when component mounts
    markMessagesAsRead();

    // Set up Echo to listen for new messages
    const channel = window.Echo.private(`${entityType}.${entity.id}`)
      .listen('.new.message', (data: Message) => {
        setMessages(prevMessages => [...prevMessages, data]);
        markMessagesAsRead();
      });

    // Focus the input field
    inputRef.current?.focus();

    // Clean up the listener when component unmounts
    return () => {
      channel.stopListening('.new.message');
    };
  }, []);

  const markMessagesAsRead = async () => {
    try {
      await axios.post(route(`${entityType}s.chat.read`, entity.id));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      const response = await axios.post(
        route(`${entityType}s.chat.send`, entity.id),
        { message: newMessage }
      );
      
      setMessages([...messages, response.data]);
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('chat.sendError'));
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const breadcrumbItems = entityType === 'client'
    ? [
        { label: t('common.dashboard'), href: route('dashboard') },
        { label: t('clients.clientManagement'), href: route('clients.index') },
        { label: entity.name, href: route('clients.show', entity.id) },
        { label: t('chat.liveChat') },
      ]
    : [
        { label: t('common.dashboard'), href: route('dashboard') },
        { label: t('leads.leadManagement'), href: route('leads.index') },
        { label: entity.name, href: route('leads.show', entity.id) },
        { label: t('chat.liveChat') },
      ];

  return (
    <AppLayout
      title={t('chat.liveChat')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('chat.liveChat')}
        </h2>
      )}
    >
      <Head title={t('chat.liveChat')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex justify-between items-center mt-4 px-4 sm:px-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="mb-4"
            >
              <Link href={route(`${entityType}s.show`, entity.id)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Link>
            </Button>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>
                {t('chat.chatWith')} {entity.name}
              </CardTitle>
              <CardDescription>
                {entityType === 'client'
                  ? t('chat.clientChatDescription')
                  : t('chat.leadChatDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[500px]">
                <ScrollArea className="flex-1 p-4 mb-4 border rounded-md">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <p>{t('chat.noMessagesYet')}</p>
                        <p className="mt-2">{t('chat.startConversation')}</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.is_from_user ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`flex max-w-[80%] ${
                              message.is_from_user ? 'flex-row-reverse' : 'flex-row'
                            }`}
                          >
                            <Avatar className={`h-8 w-8 ${message.is_from_user ? 'ml-2' : 'mr-2'}`}>
                              <AvatarImage
                                src={message.user?.profile_photo_url}
                                alt={message.user?.name || ''}
                              />
                              <AvatarFallback>
                                {message.user?.name ? getInitials(message.user.name) : '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  message.is_from_user
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                              </div>
                              <div
                                className={`text-xs text-muted-foreground mt-1 ${
                                  message.is_from_user ? 'text-right' : 'text-left'
                                }`}
                              >
                                {message.user?.name} • {format(parseISO(message.created_at), 'p')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('chat.typeMessage')}
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button type="submit" disabled={sending || !newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? t('chat.sending') : t('chat.send')}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
