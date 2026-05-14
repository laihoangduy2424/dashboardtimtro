'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/status-badge'
import { mockChatbotConfigs, mockChatbotDataSources, mockChatbotPatterns, mockChatbotInteractions, ChatbotConfig, ChatbotDataSource, ChatbotResponsePattern, ChatbotInteraction } from '@/lib/mock-data'
import { Plus, Trash2, Edit, MessageCircle, Settings, Database, MessageSquare, Zap, ToggleLeft, ToggleRight } from 'lucide-react'

export default function ChatbotManagementPage() {
  const [configs, setConfigs] = useState<ChatbotConfig[]>(mockChatbotConfigs)
  const [dataSources, setDataSources] = useState<ChatbotDataSource[]>(mockChatbotDataSources)
  const [patterns, setPatterns] = useState<ChatbotResponsePattern[]>(mockChatbotPatterns)
  const [interactions, setInteractions] = useState<ChatbotInteraction[]>(mockChatbotInteractions)
  const [selectedConfig, setSelectedConfig] = useState<ChatbotConfig | null>(configs[0] || null)
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'public_listing' | 'resident_app'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'resolved' | 'pending' | 'escalated'>('all')

  // State for adding new items
  const [newDataSourceName, setNewDataSourceName] = useState('')
  const [newDataSourceType, setNewDataSourceType] = useState<'listing_info' | 'faq' | 'rules' | 'resident_info' | 'system_notification' | 'custom'>('custom')
  const [newDataSourceContent, setNewDataSourceContent] = useState('')
  const [newPatternTrigger, setNewPatternTrigger] = useState('')
  const [newPatternResponse, setNewPatternResponse] = useState('')
  const [selectedResponseStyle, setSelectedResponseStyle] = useState<'friendly' | 'professional' | 'concise'>('friendly')
  const [selectedResponseLength, setSelectedResponseLength] = useState<'short' | 'medium' | 'long'>('medium')

  if (!selectedConfig) return null

  const configDataSources = dataSources.filter(ds => ds.configId === selectedConfig.id)
  const configPatterns = patterns.filter(p => p.configId === selectedConfig.id)
  const configInteractions = interactions.filter(i => i.configId === selectedConfig.id)

  const filteredInteractions = configInteractions.filter(i => {
    let match = true
    if (filterStatus !== 'all') match = match && i.status === filterStatus
    return match
  })

  const handleAddDataSource = () => {
    if (newDataSourceName.trim() && newDataSourceContent.trim()) {
      const newSource: ChatbotDataSource = {
        id: `DS${dataSources.length + 1}`,
        configId: selectedConfig.id,
        name: newDataSourceName,
        type: newDataSourceType,
        enabled: true,
        priority: configDataSources.length + 1,
        content: newDataSourceContent,
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
      }
      setDataSources([...dataSources, newSource])
      setNewDataSourceName('')
      setNewDataSourceContent('')
    }
  }

  const handleToggleDataSource = (id: string) => {
    setDataSources(dataSources.map(ds => ds.id === id ? { ...ds, enabled: !ds.enabled } : ds))
  }

  const handleDeleteDataSource = (id: string) => {
    setDataSources(dataSources.filter(ds => ds.id !== id))
  }

  const handleAddPattern = () => {
    if (newPatternTrigger.trim() && newPatternResponse.trim()) {
      const newPattern: ChatbotResponsePattern = {
        id: `RP${patterns.length + 1}`,
        configId: selectedConfig.id,
        trigger: newPatternTrigger,
        response: newPatternResponse,
        priority: configPatterns.length + 1,
        enabled: true,
      }
      setPatterns([...patterns, newPattern])
      setNewPatternTrigger('')
      setNewPatternResponse('')
    }
  }

  const handleTogglePattern = (id: string) => {
    setPatterns(patterns.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  const handleDeletePattern = (id: string) => {
    setPatterns(patterns.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý Chatbot</h1>
        <p className="mt-1 text-muted-foreground">Cấu hình và quản lý chatbot trên các nền tảng</p>
      </div>

      {/* Config Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings size={20} />
            Cấu hình Chatbot
          </CardTitle>
          <CardDescription>Chọn nền tảng để cấu hình</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {configs.map(config => (
              <button
                key={config.id}
                onClick={() => setSelectedConfig(config)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedConfig?.id === config.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{config.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                    <div className="mt-2">
                      <StatusBadge
                        status={config.status}
                        variant={config.status === 'active' ? 'success' : 'warning'}
                      />
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    {config.platform === 'public_listing' ? 'Web Tin Đăng' : 'App Cư Dân'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Sections */}
      <Tabs defaultValue="data-sources" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-sources" className="flex items-center gap-2">
            <Database size={16} />
            <span className="hidden sm:inline">Dữ liệu</span>
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Zap size={16} />
            <span className="hidden sm:inline">Mẫu</span>
          </TabsTrigger>
          <TabsTrigger value="response-style" className="flex items-center gap-2">
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Phong cách</span>
          </TabsTrigger>
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span className="hidden sm:inline">Lịch sử</span>
          </TabsTrigger>
        </TabsList>

        {/* Data Sources Tab */}
        <TabsContent value="data-sources" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quản lý Nguồn Dữ liệu</CardTitle>
              <CardDescription>Chọn và ưu tiên các nguồn dữ liệu cho chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Data Sources */}
              <div className="space-y-3">
                {configDataSources.map(source => (
                  <div key={source.id} className="p-4 rounded-lg border border-border bg-muted/30 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleDataSource(source.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {source.enabled ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} />}
                        </button>
                        <div>
                          <h4 className="font-semibold text-foreground">{source.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{source.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                              {source.type}
                            </span>
                            <span className="text-xs text-muted-foreground">Ưu tiên: {source.priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDataSource(source.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Data Source */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2">
                    <Plus size={16} />
                    Thêm Nguồn Dữ liệu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thêm Nguồn Dữ liệu Mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ds-name">Tên Nguồn</Label>
                      <Input
                        id="ds-name"
                        value={newDataSourceName}
                        onChange={(e) => setNewDataSourceName(e.target.value)}
                        placeholder="VD: Thông tin tiện ích"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ds-type">Loại Nguồn</Label>
                      <Select value={newDataSourceType} onValueChange={(value: any) => setNewDataSourceType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="listing_info">Thông tin bài đăng</SelectItem>
                          <SelectItem value="faq">FAQ</SelectItem>
                          <SelectItem value="rules">Nội quy</SelectItem>
                          <SelectItem value="resident_info">Thông tin cư dân</SelectItem>
                          <SelectItem value="system_notification">Thông báo hệ thống</SelectItem>
                          <SelectItem value="custom">Tùy chỉnh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ds-content">Nội dung</Label>
                      <Textarea
                        id="ds-content"
                        value={newDataSourceContent}
                        onChange={(e) => setNewDataSourceContent(e.target.value)}
                        placeholder="Mô tả nội dung nguồn dữ liệu..."
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleAddDataSource} className="w-full">
                      Thêm Nguồn
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quản lý Câu Trả Lời Mẫu</CardTitle>
              <CardDescription>Tạo các câu trả lời cố định cho những câu hỏi phổ biến</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Patterns */}
              <div className="space-y-3">
                {configPatterns.map(pattern => (
                  <div key={pattern.id} className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => handleTogglePattern(pattern.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {pattern.enabled ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} />}
                          </button>
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 font-mono text-sm">
                            {pattern.trigger}
                          </span>
                          <span className="text-xs text-muted-foreground">Ưu tiên: {pattern.priority}</span>
                        </div>
                        <p className="text-sm text-foreground mt-2">{pattern.response}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePattern(pattern.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Pattern */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2">
                    <Plus size={16} />
                    Thêm Câu Trả Lời Mẫu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thêm Câu Trả Lời Mẫu</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pattern-trigger">Từ khóa Kích Hoạt (cách nhau bằng |)</Label>
                      <Input
                        id="pattern-trigger"
                        value={newPatternTrigger}
                        onChange={(e) => setNewPatternTrigger(e.target.value)}
                        placeholder="VD: giá|chi phí|bao nhiêu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pattern-response">Câu Trả Lời</Label>
                      <Textarea
                        id="pattern-response"
                        value={newPatternResponse}
                        onChange={(e) => setNewPatternResponse(e.target.value)}
                        placeholder="Nhập câu trả lời cho các từ khóa trên..."
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleAddPattern} className="w-full">
                      Thêm Mẫu
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Style Tab */}
        <TabsContent value="response-style" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Thiết Lập Phong Cách Trả Lời</CardTitle>
              <CardDescription>Tùy chỉnh cách chatbot giao tiếp với người dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Response Style */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Phong Cách Giao Tiếp</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'friendly', label: 'Thân Thiện', description: 'Thoải mái, vui vẻ' },
                      { value: 'professional', label: 'Chuyên Nghiệp', description: 'Chính thức, chuẩn mực' },
                      { value: 'concise', label: 'Ngắn Gọn', description: 'Tập trung, hiệu quả' },
                    ].map(style => (
                      <button
                        key={style.value}
                        onClick={() => setSelectedResponseStyle(style.value as any)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedResponseStyle === style.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-semibold text-foreground">{style.label}</p>
                        <p className="text-sm text-muted-foreground">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response Length */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Độ Dài Phản Hồi</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'short', label: 'Ngắn', description: '1-2 câu' },
                      { value: 'medium', label: 'Vừa', description: '2-3 câu' },
                      { value: 'long', label: 'Dài', description: '3+ câu' },
                    ].map(length => (
                      <button
                        key={length.value}
                        onClick={() => setSelectedResponseLength(length.value as any)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedResponseLength === length.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-semibold text-foreground">{length.label}</p>
                        <p className="text-sm text-muted-foreground">{length.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Example Responses */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-foreground mb-3">Ví dụ Phản Hồi</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-background rounded border border-border">
                    <p className="text-sm font-medium text-muted-foreground">Người dùng:</p>
                    <p className="text-foreground">Phòng này bao nhiêu tiền một tháng?</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm font-medium text-blue-600">Chatbot ({selectedResponseStyle}):</p>
                    <p className="text-foreground">
                      {selectedResponseStyle === 'friendly'
                        ? '😊 Giá của phòng này là 3 triệu VND mỗi tháng, bao gồm tiền điện, nước và internet nhé!'
                        : selectedResponseStyle === 'professional'
                          ? 'Giá thuê phòng là 3,000,000 VND/tháng, bao gồm tiền điện, nước và dịch vụ internet.'
                          : 'Giá: 3 triệu VND/tháng (gồm điện, nước, internet)'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interaction History Tab */}
        <TabsContent value="interactions" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Lịch Sử Hội Thoại</CardTitle>
              <CardDescription>Theo dõi các cuộc trò chuyện giữa người dùng và chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="resolved">Đã xử lý</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="escalated">Chuyển tiếp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interactions List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredInteractions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không có cuộc hội thoại nào
                  </div>
                ) : (
                  filteredInteractions.map(interaction => (
                    <div key={interaction.id} className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">User: {interaction.userId}</span>
                          <StatusBadge
                            status={interaction.status}
                            variant={
                              interaction.status === 'resolved'
                                ? 'success'
                                : interaction.status === 'escalated'
                                  ? 'error'
                                  : 'warning'
                            }
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(interaction.timestamp).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      <div className="bg-background p-3 rounded border border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Câu hỏi:</p>
                        <p className="text-sm text-foreground">{interaction.userMessage}</p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-xs font-medium text-blue-600 mb-1">Trả lời:</p>
                        <p className="text-sm text-foreground">{interaction.botResponse}</p>
                      </div>

                      {interaction.userSatisfied !== undefined && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Người dùng hài lòng:</span>
                          <span className={interaction.userSatisfied ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {interaction.userSatisfied ? '✓ Có' : '✗ Không'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
