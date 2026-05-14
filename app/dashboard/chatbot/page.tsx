'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/status-badge'
import { FilterButton } from '@/components/filter-button'
import { DataTable, Column } from '@/components/data-table'
import { mockChatbotConfigs, mockChatbotDataSources, mockChatbotPatterns, mockChatbotInteractions, ChatbotConfig, ChatbotDataSource, ChatbotResponsePattern, ChatbotInteraction } from '@/lib/mock-data'
import { Plus, Trash2, Edit, Power, PowerOff, Eye, ToggleLeft, ToggleRight } from 'lucide-react'

type TabType = 'configs' | 'data-sources' | 'patterns' | 'interactions'

export default function ChatbotManagementPage() {
  const [configs, setConfigs] = useState<ChatbotConfig[]>(mockChatbotConfigs)
  const [dataSources, setDataSources] = useState<ChatbotDataSource[]>(mockChatbotDataSources)
  const [patterns, setPatterns] = useState<ChatbotResponsePattern[]>(mockChatbotPatterns)
  const [interactions] = useState<ChatbotInteraction[]>(mockChatbotInteractions)
  
  const [activeTab, setActiveTab] = useState<TabType>('configs')
  const [selectedConfig, setSelectedConfig] = useState<ChatbotConfig | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  // Filter states
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'public_listing' | 'resident_app'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'maintenance'>('all')
  const [filterInteractionStatus, setFilterInteractionStatus] = useState<'all' | 'resolved' | 'pending' | 'escalated'>('all')

  // Form states for new data source
  const [newDataSourceName, setNewDataSourceName] = useState('')
  const [newDataSourceType, setNewDataSourceType] = useState<'listing_info' | 'faq' | 'rules' | 'resident_info' | 'system_notification' | 'custom'>('custom')
  const [newDataSourceContent, setNewDataSourceContent] = useState('')
  const [newDataSourceConfigId, setNewDataSourceConfigId] = useState('')

  // Form states for new pattern
  const [newPatternTrigger, setNewPatternTrigger] = useState('')
  const [newPatternResponse, setNewPatternResponse] = useState('')
  const [newPatternConfigId, setNewPatternConfigId] = useState('')

  // Filtered data
  const filteredConfigs = configs.filter(config => {
    if (filterPlatform !== 'all' && config.platform !== filterPlatform) return false
    if (filterStatus !== 'all' && config.status !== filterStatus) return false
    return true
  })

  const filteredInteractions = interactions.filter(i => {
    if (filterInteractionStatus !== 'all' && i.status !== filterInteractionStatus) return false
    return true
  })

  // Handlers
  const handleToggleConfigStatus = (id: string) => {
    setConfigs(configs.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
    ))
  }

  const handleDeleteConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id))
    setDataSources(dataSources.filter(ds => ds.configId !== id))
    setPatterns(patterns.filter(p => p.configId !== id))
  }

  const handleAddDataSource = () => {
    if (newDataSourceName.trim() && newDataSourceContent.trim() && newDataSourceConfigId) {
      const newSource: ChatbotDataSource = {
        id: `DS${Date.now()}`,
        configId: newDataSourceConfigId,
        name: newDataSourceName,
        type: newDataSourceType,
        enabled: true,
        priority: dataSources.filter(ds => ds.configId === newDataSourceConfigId).length + 1,
        content: newDataSourceContent,
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
      }
      setDataSources([...dataSources, newSource])
      setNewDataSourceName('')
      setNewDataSourceContent('')
      setNewDataSourceConfigId('')
    }
  }

  const handleToggleDataSource = (id: string) => {
    setDataSources(dataSources.map(ds => ds.id === id ? { ...ds, enabled: !ds.enabled } : ds))
  }

  const handleDeleteDataSource = (id: string) => {
    setDataSources(dataSources.filter(ds => ds.id !== id))
  }

  const handleAddPattern = () => {
    if (newPatternTrigger.trim() && newPatternResponse.trim() && newPatternConfigId) {
      const newPattern: ChatbotResponsePattern = {
        id: `RP${Date.now()}`,
        configId: newPatternConfigId,
        trigger: newPatternTrigger,
        response: newPatternResponse,
        priority: patterns.filter(p => p.configId === newPatternConfigId).length + 1,
        enabled: true,
      }
      setPatterns([...patterns, newPattern])
      setNewPatternTrigger('')
      setNewPatternResponse('')
      setNewPatternConfigId('')
    }
  }

  const handleTogglePattern = (id: string) => {
    setPatterns(patterns.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  const handleDeletePattern = (id: string) => {
    setPatterns(patterns.filter(p => p.id !== id))
  }

  // Table columns for configs
  const configColumns: Column<ChatbotConfig>[] = [
    { key: 'id', header: 'Mã', sortable: true },
    { key: 'name', header: 'Tên Chatbot', sortable: true },
    { 
      key: 'platform', 
      header: 'Nền tảng',
      render: (config) => (
        <span className="text-sm">
          {config.platform === 'public_listing' ? 'Web Tin Đăng' : 'App Cư Dân'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (config) => (
        <StatusBadge
          status={config.status}
          variant={config.status === 'active' ? 'success' : config.status === 'paused' ? 'warning' : 'default'}
        />
      )
    },
    { key: 'updatedDate', header: 'Cập nhật', sortable: true },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (config) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSelectedConfig(config); setIsDetailOpen(true) }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleConfigStatus(config.id)}
            className={config.status === 'active' ? 'text-orange-600' : 'text-green-600'}
          >
            {config.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteConfig(config.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ]

  // Table columns for data sources
  const dataSourceColumns: Column<ChatbotDataSource>[] = [
    { key: 'id', header: 'Mã', sortable: true },
    { key: 'name', header: 'Tên nguồn', sortable: true },
    {
      key: 'configId',
      header: 'Chatbot',
      render: (ds) => configs.find(c => c.id === ds.configId)?.name || ds.configId
    },
    {
      key: 'type',
      header: 'Loại',
      render: (ds) => (
        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
          {ds.type}
        </span>
      )
    },
    {
      key: 'enabled',
      header: 'Kích hoạt',
      render: (ds) => (
        <button onClick={() => handleToggleDataSource(ds.id)}>
          {ds.enabled ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
        </button>
      )
    },
    { key: 'priority', header: 'Ưu tiên', sortable: true },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (ds) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm"><Edit size={16} /></Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteDataSource(ds.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ]

  // Table columns for patterns
  const patternColumns: Column<ChatbotResponsePattern>[] = [
    { key: 'id', header: 'Mã', sortable: true },
    {
      key: 'trigger',
      header: 'Từ khóa',
      render: (p) => (
        <code className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
          {p.trigger}
        </code>
      )
    },
    {
      key: 'configId',
      header: 'Chatbot',
      render: (p) => configs.find(c => c.id === p.configId)?.name || p.configId
    },
    {
      key: 'response',
      header: 'Câu trả lời',
      render: (p) => (
        <span className="text-sm truncate max-w-xs block">{p.response}</span>
      )
    },
    {
      key: 'enabled',
      header: 'Kích hoạt',
      render: (p) => (
        <button onClick={() => handleTogglePattern(p.id)}>
          {p.enabled ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
        </button>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (p) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm"><Edit size={16} /></Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePattern(p.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ]

  // Table columns for interactions
  const interactionColumns: Column<ChatbotInteraction>[] = [
    { key: 'id', header: 'Mã', sortable: true },
    { key: 'userMessage', header: 'Câu hỏi', render: (i) => <span className="truncate max-w-xs block text-sm">{i.userMessage}</span> },
    { key: 'botResponse', header: 'Phản hồi', render: (i) => <span className="truncate max-w-xs block text-sm">{i.botResponse}</span> },
    {
      key: 'platform',
      header: 'Nền tảng',
      render: (i) => i.platform === 'public_listing' ? 'Web' : 'App'
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (i) => (
        <StatusBadge
          status={i.status}
          variant={i.status === 'resolved' ? 'success' : i.status === 'pending' ? 'warning' : 'destructive'}
        />
      )
    },
    {
      key: 'timestamp',
      header: 'Thời gian',
      sortable: true,
      render: (i) => new Date(i.timestamp).toLocaleString('vi-VN')
    },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý Chatbot</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        <FilterButton
          label="Cấu hình Chatbot"
          count={configs.length}
          isActive={activeTab === 'configs'}
          onClick={() => setActiveTab('configs')}
        />
        <FilterButton
          label="Nguồn dữ liệu"
          count={dataSources.length}
          isActive={activeTab === 'data-sources'}
          onClick={() => setActiveTab('data-sources')}
        />
        <FilterButton
          label="Mẫu trả lời"
          count={patterns.length}
          isActive={activeTab === 'patterns'}
          onClick={() => setActiveTab('patterns')}
        />
        <FilterButton
          label="Lịch sử hội thoại"
          count={interactions.length}
          isActive={activeTab === 'interactions'}
          onClick={() => setActiveTab('interactions')}
        />
      </div>

      {/* Configs Tab */}
      {activeTab === 'configs' && (
        <>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="Tất cả" count={configs.length} isActive={filterPlatform === 'all' && filterStatus === 'all'} onClick={() => { setFilterPlatform('all'); setFilterStatus('all') }} />
            <FilterButton label="Web Tin Đăng" count={configs.filter(c => c.platform === 'public_listing').length} isActive={filterPlatform === 'public_listing'} onClick={() => setFilterPlatform('public_listing')} />
            <FilterButton label="App Cư Dân" count={configs.filter(c => c.platform === 'resident_app').length} isActive={filterPlatform === 'resident_app'} onClick={() => setFilterPlatform('resident_app')} />
            <FilterButton label="Hoạt động" count={configs.filter(c => c.status === 'active').length} isActive={filterStatus === 'active'} onClick={() => setFilterStatus('active')} />
            <FilterButton label="Tạm dừng" count={configs.filter(c => c.status === 'paused').length} isActive={filterStatus === 'paused'} onClick={() => setFilterStatus('paused')} />
          </div>
          <div className="rounded-lg border border-border bg-card">
            <DataTable columns={configColumns} data={filteredConfigs} />
          </div>
        </>
      )}

      {/* Data Sources Tab */}
      {activeTab === 'data-sources' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterButton label="Tất cả" count={dataSources.length} isActive={true} onClick={() => {}} />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Thêm nguồn dữ liệu
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Nguồn Dữ liệu Mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Chọn Chatbot</Label>
                    <Select value={newDataSourceConfigId} onValueChange={setNewDataSourceConfigId}>
                      <SelectTrigger><SelectValue placeholder="Chọn chatbot" /></SelectTrigger>
                      <SelectContent>
                        {configs.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tên Nguồn</Label>
                    <Input value={newDataSourceName} onChange={(e) => setNewDataSourceName(e.target.value)} placeholder="VD: Thông tin tiện ích" />
                  </div>
                  <div>
                    <Label>Loại Nguồn</Label>
                    <Select value={newDataSourceType} onValueChange={(v: typeof newDataSourceType) => setNewDataSourceType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label>Nội dung</Label>
                    <Textarea value={newDataSourceContent} onChange={(e) => setNewDataSourceContent(e.target.value)} placeholder="Mô tả nội dung nguồn dữ liệu..." rows={4} />
                  </div>
                  <Button onClick={handleAddDataSource} className="w-full">Thêm Nguồn</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <DataTable columns={dataSourceColumns} data={dataSources} />
          </div>
        </>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterButton label="Tất cả" count={patterns.length} isActive={true} onClick={() => {}} />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Thêm mẫu trả lời
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Mẫu Trả Lời</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Chọn Chatbot</Label>
                    <Select value={newPatternConfigId} onValueChange={setNewPatternConfigId}>
                      <SelectTrigger><SelectValue placeholder="Chọn chatbot" /></SelectTrigger>
                      <SelectContent>
                        {configs.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Từ khóa kích hoạt (cách nhau bằng |)</Label>
                    <Input value={newPatternTrigger} onChange={(e) => setNewPatternTrigger(e.target.value)} placeholder="VD: giá|chi phí|bao nhiêu" />
                  </div>
                  <div>
                    <Label>Câu trả lời</Label>
                    <Textarea value={newPatternResponse} onChange={(e) => setNewPatternResponse(e.target.value)} placeholder="Nhập câu trả lời cho các từ khóa trên..." rows={4} />
                  </div>
                  <Button onClick={handleAddPattern} className="w-full">Thêm Mẫu</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <DataTable columns={patternColumns} data={patterns} />
          </div>
        </>
      )}

      {/* Interactions Tab */}
      {activeTab === 'interactions' && (
        <>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="Tất cả" count={interactions.length} isActive={filterInteractionStatus === 'all'} onClick={() => setFilterInteractionStatus('all')} />
            <FilterButton label="Đã xử lý" count={interactions.filter(i => i.status === 'resolved').length} isActive={filterInteractionStatus === 'resolved'} onClick={() => setFilterInteractionStatus('resolved')} />
            <FilterButton label="Chờ xử lý" count={interactions.filter(i => i.status === 'pending').length} isActive={filterInteractionStatus === 'pending'} onClick={() => setFilterInteractionStatus('pending')} />
            <FilterButton label="Cần leo thang" count={interactions.filter(i => i.status === 'escalated').length} isActive={filterInteractionStatus === 'escalated'} onClick={() => setFilterInteractionStatus('escalated')} />
          </div>
          <div className="rounded-lg border border-border bg-card">
            <DataTable columns={interactionColumns} data={filteredInteractions} />
          </div>
        </>
      )}

      {/* Config Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Chatbot</DialogTitle>
          </DialogHeader>
          {selectedConfig && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mã</Label>
                  <p className="font-medium">{selectedConfig.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tên</Label>
                  <p className="font-medium">{selectedConfig.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nền tảng</Label>
                  <p className="font-medium">{selectedConfig.platform === 'public_listing' ? 'Web Tin Đăng' : 'App Cư Dân'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <StatusBadge status={selectedConfig.status} variant={selectedConfig.status === 'active' ? 'success' : 'warning'} />
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Mô tả</Label>
                <p className="font-medium">{selectedConfig.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Lời chào mặc định</Label>
                <p className="font-medium italic">"{selectedConfig.defaultGreeting}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nguồn dữ liệu</Label>
                  <p className="font-medium">{dataSources.filter(ds => ds.configId === selectedConfig.id).length} nguồn</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mẫu trả lời</Label>
                  <p className="font-medium">{patterns.filter(p => p.configId === selectedConfig.id).length} mẫu</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
