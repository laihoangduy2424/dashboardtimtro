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
import { mockChatbotDataSources, mockChatbotPatterns, mockChatbotInteractions, ChatbotDataSource, ChatbotResponsePattern, ChatbotInteraction } from '@/lib/mock-data'
import { Plus, Trash2, Edit, MessageCircle, Settings, Database } from 'lucide-react'

export default function ChatbotManagementPage() {
  const [dataSources, setDataSources] = useState<ChatbotDataSource[]>(mockChatbotDataSources)
  const [patterns, setPatterns] = useState<ChatbotResponsePattern[]>(mockChatbotPatterns)
  const [interactions, setInteractions] = useState<ChatbotInteraction[]>(mockChatbotInteractions)
  const [responseStyle, setResponseStyle] = useState<'formal' | 'casual' | 'helpful'>('helpful')
  const [selectedDataSource, setSelectedDataSource] = useState<ChatbotDataSource | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<ChatbotResponsePattern | null>(null)
  const [newDataSourceName, setNewDataSourceName] = useState('')
  const [newDataSourceType, setNewDataSourceType] = useState<'listing_info' | 'faq' | 'rules' | 'custom'>('custom')
  const [newDataSourceContent, setNewDataSourceContent] = useState('')
  const [newPatternTrigger, setNewPatternTrigger] = useState('')
  const [newPatternResponse, setNewPatternResponse] = useState('')

  const handleAddDataSource = () => {
    if (newDataSourceName.trim() && newDataSourceContent.trim()) {
      const newSource: ChatbotDataSource = {
        id: `DS${dataSources.length + 1}`,
        name: newDataSourceName,
        type: newDataSourceType,
        content: newDataSourceContent,
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
      }
      setDataSources([...dataSources, newSource])
      setNewDataSourceName('')
      setNewDataSourceContent('')
    }
  }

  const handleDeleteDataSource = (id: string) => {
    setDataSources(dataSources.filter(ds => ds.id !== id))
  }

  const handleAddPattern = () => {
    if (newPatternTrigger.trim() && newPatternResponse.trim()) {
      const newPattern: ChatbotResponsePattern = {
        id: `RP${patterns.length + 1}`,
        trigger: newPatternTrigger,
        response: newPatternResponse,
        priority: patterns.length + 1,
      }
      setPatterns([...patterns, newPattern])
      setNewPatternTrigger('')
      setNewPatternResponse('')
    }
  }

  const handleDeletePattern = (id: string) => {
    setPatterns(patterns.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý Chatbot</h1>
        <p className="mt-2 text-muted-foreground">Cấu hình chatbot trợ lý AI cho trang tin đăng</p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="data-sources" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-sources" className="flex items-center gap-2">
            <Database size={16} />
            <span className="hidden sm:inline">Nguồn dữ liệu</span>
          </TabsTrigger>
          <TabsTrigger value="response-patterns" className="flex items-center gap-2">
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Mẫu phản hồi</span>
          </TabsTrigger>
          <TabsTrigger value="response-style" className="flex items-center gap-2">
            <Settings size={16} />
            <span className="hidden sm:inline">Phong cách</span>
          </TabsTrigger>
          <TabsTrigger value="interaction-history" className="flex items-center gap-2">
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Lịch sử</span>
          </TabsTrigger>
        </TabsList>

        {/* Data Sources Tab */}
        <TabsContent value="data-sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nguồn dữ liệu cho Chatbot</CardTitle>
              <CardDescription>Thêm các nguồn thông tin để chatbot sử dụng trả lời câu hỏi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Data Sources */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Các nguồn dữ liệu hiện có</Label>
                <div className="space-y-2">
                  {dataSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-start justify-between rounded-lg border border-border bg-card p-4 hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{source.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{source.content}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {source.type === 'listing_info' && 'Thông tin tin đăng'}
                            {source.type === 'faq' && 'Câu hỏi thường gặp'}
                            {source.type === 'rules' && 'Quy tắc nhà'}
                            {source.type === 'custom' && 'Tùy chỉnh'}
                          </span>
                          <span className="text-xs text-muted-foreground">Cập nhật: {source.updatedDate}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDataSource(source)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDataSource(source.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Data Source */}
              <div className="space-y-3 border-t border-border pt-6">
                <Label className="text-base font-semibold">Thêm nguồn dữ liệu mới</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="datasource-name">Tên nguồn dữ liệu</Label>
                    <Input
                      id="datasource-name"
                      placeholder="vd: Tiện nghi phòng"
                      value={newDataSourceName}
                      onChange={(e) => setNewDataSourceName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="datasource-type">Loại nguồn dữ liệu</Label>
                    <Select value={newDataSourceType} onValueChange={(value: any) => setNewDataSourceType(value)}>
                      <SelectTrigger id="datasource-type" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="listing_info">Thông tin tin đăng</SelectItem>
                        <SelectItem value="faq">Câu hỏi thường gặp</SelectItem>
                        <SelectItem value="rules">Quy tắc nhà</SelectItem>
                        <SelectItem value="custom">Tùy chỉnh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="datasource-content">Nội dung</Label>
                    <Textarea
                      id="datasource-content"
                      placeholder="Nhập nội dung cho chatbot sử dụng..."
                      value={newDataSourceContent}
                      onChange={(e) => setNewDataSourceContent(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <Button onClick={handleAddDataSource} className="w-full">
                    <Plus size={16} className="mr-2" />
                    Thêm nguồn dữ liệu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Patterns Tab */}
        <TabsContent value="response-patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mẫu phản hồi cố định</CardTitle>
              <CardDescription>Cấu hình các mẫu phản hồi tự động cho các câu hỏi phổ biến</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Patterns */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Các mẫu phản hồi hiện có</Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {patterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      className="rounded-lg border border-border bg-card p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-mono text-sm font-semibold text-blue-600">Kích hoạt: {pattern.trigger}</p>
                          <p className="mt-2 text-sm text-foreground">{pattern.response}</p>
                          <p className="mt-2 text-xs text-muted-foreground">Ưu tiên: {pattern.priority}</p>
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
              </div>

              {/* Add New Pattern */}
              <div className="space-y-3 border-t border-border pt-6">
                <Label className="text-base font-semibold">Thêm mẫu phản hồi mới</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pattern-trigger">Từ khóa kích hoạt (cách nhau bằng |)</Label>
                    <Input
                      id="pattern-trigger"
                      placeholder="vd: giá|chi phí|bao nhiêu"
                      value={newPatternTrigger}
                      onChange={(e) => setNewPatternTrigger(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pattern-response">Phản hồi</Label>
                    <Textarea
                      id="pattern-response"
                      placeholder="Nhập phản hồi mà chatbot sẽ trả lời..."
                      value={newPatternResponse}
                      onChange={(e) => setNewPatternResponse(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <Button onClick={handleAddPattern} className="w-full">
                    <Plus size={16} className="mr-2" />
                    Thêm mẫu phản hồi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Style Tab */}
        <TabsContent value="response-style" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cùng chỉnh phong cách phản hồi</CardTitle>
              <CardDescription>Chọn phong cách giao tiếp mà chatbot sẽ sử dụng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {(['formal', 'casual', 'helpful'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setResponseStyle(style)}
                    className={`rounded-lg border-2 p-4 text-left transition-colors ${
                      responseStyle === style
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <h3 className="font-semibold text-foreground">
                      {style === 'formal' && 'Chính thức'}
                      {style === 'casual' && 'Thân mật'}
                      {style === 'helpful' && 'Hữu ích'}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {style === 'formal' && 'Sử dụng ngôn ngữ chuyên nghiệp và trang trọng'}
                      {style === 'casual' && 'Giao tiếp một cách thân thiện và thoải mái'}
                      {style === 'helpful' && 'Tập trung vào việc giải quyết vấn đề một cách hữu ích'}
                    </p>
                  </button>
                ))}
              </div>

              <div className="rounded-lg bg-muted p-4">
                <Label className="text-base font-semibold">Ví dụ phản hồi</Label>
                <div className="mt-3 rounded-lg bg-background p-3 font-mono text-sm text-foreground">
                  {responseStyle === 'formal' &&
                    'Kính gửi quý khách, chúng tôi xin thông báo rằng giá thuê phòng là 3,000,000 VND/tháng.'}
                  {responseStyle === 'casual' &&
                    'Nhi ha, giá phòng chúng mình là 3,000,000 VND mỗi tháng thôi, mọi thứ đều bao gồm!'}
                  {responseStyle === 'helpful' &&
                    'Phòng này có giá thuê 3,000,000 VND/tháng, bao gồm tiền điện nước. Có gì khác mình giúp bạn không?'}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interaction History Tab */}
        <TabsContent value="interaction-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử tương tác Chatbot</CardTitle>
              <CardDescription>Xem và phân tích các cuộc trò chuyện của khách hàng với chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {interactions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-muted-foreground">Chưa có lịch sử tương tác nào</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="text-xs font-semibold text-blue-600">KHÁCH HÀNG:</p>
                            <p className="text-sm text-foreground">{interaction.userMessage}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-green-600">CHATBOT:</p>
                            <p className="text-sm text-foreground">{interaction.botResponse}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{new Date(interaction.timestamp).toLocaleString('vi-VN')}</p>
                            {interaction.userSatisfied !== undefined && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">Hài lòng:</span>
                                <StatusBadge
                                  status={interaction.userSatisfied ? 'satisfied' : 'unsatisfied'}
                                  variant={interaction.userSatisfied ? 'success' : 'warning'}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
