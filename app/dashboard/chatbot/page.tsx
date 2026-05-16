'use client'

import { useState } from 'react'
import { mockChatbotModels, mockSamplePrompts, mockConversations, mockTokenInfo } from '@/lib/mock-data'
import ModelSelector from '@/components/chatbot/model-selector'
import SamplePrompts from '@/components/chatbot/sample-prompts'
import ChatHistory from '@/components/chatbot/chat-history'
import ChatArea from '@/components/chatbot/chat-area'
import TokenManagement from '@/components/chatbot/token-management'
import DataSources from '@/components/chatbot/data-sources'

type MobileTab = 'history' | 'chat' | 'tokens' | 'data'

export default function ChatbotPage() {
  const [selectedModel, setSelectedModel] = useState(mockChatbotModels[0].id)
  const [currentConversationId, setCurrentConversationId] = useState(mockConversations[0].id)
  const [conversations, setConversations] = useState(mockConversations)
  const [mobileTab, setMobileTab] = useState<MobileTab>('chat')
  const [activeTab, setActiveTab] = useState<'data' | 'model' | 'style' | 'history'>('data')

  const currentConversation = conversations.find(c => c.id === currentConversationId)

  const handleDeleteConversation = (id: string) => {
    const newConversations = conversations.filter(c => c.id !== id)
    setConversations(newConversations)
    if (currentConversationId === id && newConversations.length > 0) {
      setCurrentConversationId(newConversations[0].id)
    }
  }

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`
    const newConversation = {
      id: newId,
      title: 'New Conversation',
      model: selectedModel,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      messages: [],
      totalTokens: 0,
    }
    setConversations([newConversation, ...conversations])
    setCurrentConversationId(newId)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Mobile Tabs */}
      <div className="lg:hidden border-b border-border bg-card sticky top-0 z-10">
        <div className="flex gap-0">
          <button
            onClick={() => setMobileTab('history')}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
              mobileTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            Lịch sử
          </button>
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
              mobileTab === 'chat'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setMobileTab('data')}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
              mobileTab === 'data'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            Dữ liệu
          </button>
          <button
            onClick={() => setMobileTab('tokens')}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
              mobileTab === 'tokens'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            Token
          </button>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden lg:block border-b border-border bg-card sticky top-0 z-10">
        <div className="flex gap-0 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'data'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            📊 Dữ liệu
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'model'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            ⚡ Mẫu
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'style'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            💬 Phong cách
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            📋 Lịch sử
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden p-4 lg:p-6">
        {/* Data Sources Tab - Desktop */}
        {activeTab === 'data' && (
          <div className="hidden lg:flex lg:flex-col lg:w-96 lg:overflow-auto">
            <DataSources availableSources={mockSamplePrompts} />
          </div>
        )}

        {/* Model Tab - Desktop */}
        {activeTab === 'model' && (
          <div className="hidden lg:flex lg:flex-col lg:w-96 lg:overflow-auto gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Chọn Mẫu</h2>
              <ModelSelector
                models={mockChatbotModels}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Gợi ý</h2>
              <SamplePrompts prompts={mockSamplePrompts} />
            </div>
          </div>
        )}

        {/* Chat History - Desktop */}
        <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:overflow-auto ${activeTab === 'history' ? 'lg:flex' : 'lg:hidden'}`}>
          {activeTab === 'history' && (
            <ChatHistory
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={setCurrentConversationId}
              onDeleteConversation={handleDeleteConversation}
              onNewConversation={handleNewConversation}
            />
          )}
        </div>

        {/* Chat Area - Desktop */}
        <div className={`hidden lg:flex lg:flex-col lg:flex-1 min-w-0 ${activeTab !== 'history' && activeTab !== 'data' && activeTab !== 'model' ? 'lg:flex' : 'lg:hidden'}`}>
          {currentConversation && (
            <ChatArea conversation={currentConversation} />
          )}
        </div>

        {/* Token Management - Desktop (always visible on right) */}
        {activeTab !== 'history' && (
          <div className="hidden lg:flex lg:flex-col lg:w-80 lg:overflow-auto">
            <TokenManagement tokenInfo={mockTokenInfo} />
          </div>
        )}

        {/* Mobile Chat History Tab */}
        {mobileTab === 'history' && (
          <div className="lg:hidden flex-1 overflow-auto">
            <ChatHistory
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={(id) => {
                setCurrentConversationId(id)
                setMobileTab('chat')
              }}
              onDeleteConversation={handleDeleteConversation}
              onNewConversation={() => {
                handleNewConversation()
                setMobileTab('chat')
              }}
            />
          </div>
        )}

        {/* Mobile Chat Tab */}
        {mobileTab === 'chat' && currentConversation && (
          <div className="lg:hidden flex-1 flex flex-col min-w-0 overflow-auto gap-4">
            <div>
              <ModelSelector
                models={mockChatbotModels}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>
            <div>
              <SamplePrompts prompts={mockSamplePrompts} />
            </div>
            <ChatArea conversation={currentConversation} />
          </div>
        )}

        {/* Mobile Data Sources Tab */}
        {mobileTab === 'data' && (
          <div className="lg:hidden flex-1 overflow-auto">
            <DataSources availableSources={mockSamplePrompts} />
          </div>
        )}

        {/* Mobile Tokens Tab */}
        {mobileTab === 'tokens' && (
          <div className="lg:hidden flex-1 overflow-auto">
            <TokenManagement tokenInfo={mockTokenInfo} />
          </div>
        )}
      </div>
    </div>
  )
}
