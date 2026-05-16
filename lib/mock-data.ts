// Mock data types and sample data for the admin dashboard
// Replace with real API calls when backend is ready

export interface Landlord {
  id: string
  companyName: string
  representativeName: string
  email: string
  phone: string
  avatar?: string
  // Account information
  status: 'active' | 'expired' | 'suspended' | 'not_activated'
  serviceTier: 'free' | 'basic' | 'pro' | 'enterprise'
  // Dates
  joinedDate: string
  expiryDate: string
  // Statistics
  propertiesCount: number
  roomsCount: number
  totalRevenue: number
  tenantsCount: number
}

export interface Room {
  id: string
  title: string
  address: string
  building: string
  area: number
  price: number
  bedrooms: number
  bathrooms: number
  landlordId: string
  landlordName: string
  // Status on public website
  publicStatus: 'displaying' | 'hidden' | 'pending_review' | 'rented'
  reviewStatus?: 'pending' | 'approved' | 'rejected'
  image?: string
  createdDate: string
  views?: number
  listingDate?: string
}

export interface Tenant {
  id: string
  name: string
  email?: string
  phone?: string
  landlordId: string
  landlordName: string
  roomId: string
  status: 'active' | 'moved_out'
  moveInDate: string
  moveOutDate?: string
}

export interface PublicUser {
  id: string
  name: string
  email?: string
  phone?: string
  userType: 'landlord' | 'tenant' | 'customer'
  status: 'active' | 'suspended'
  joinedDate: string
  views: number
  contactCount: number
  lastActive: string
}

export interface Report {
  id: string
  type: 'from_website_user' | 'from_tenant' | 'internal'
  reportedBy: string
  reportedItem: string // room ID or landlord ID
  reportedItemType: 'room' | 'landlord'
  reason: 'spam' | 'fraud' | 'inappropriate' | 'scam' | 'other'
  status: 'pending' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  description: string
  createdDate: string
  resolutionAction?: string // 'delete_listing' | 'hide_listing' | 'warn_landlord' | 'suspend_account' | 'none'
  adminNotes?: string
}

// Chatbot types
export interface ChatbotModel {
  id: string
  name: string
  description: string
  contextWindow: number
}

export interface SamplePrompt {
  id: string
  title: string
  description: string
  category: string
  tokenCount: number
}

// Messages/Conversations for dashboard messages page
export interface DashboardConversation {
  id: string
  conversationType: 'landlord_to_tenant' | 'user_to_chatbot' | 'tenant_to_tenant'
  sender: string
  recipient: string
  latestMessage: string
  lastUpdated: string
  status: 'active' | 'resolved' | 'pending_response'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  tokens?: number
}

export interface Conversation {
  id: string
  title: string
  model: string
  createdDate: string
  lastModified: string
  messages: ChatMessage[]
  totalTokens: number
}

export interface TokenInfo {
  totalUsed: number
  limit: number
  percentageUsed: number
  costPerMillion: number
}

// ==================== MOCK DATA ====================

// Mock Landlords (SaaS Customers)
export const mockLandlords: Landlord[] = [
  {
    id: 'LL001',
    companyName: 'Nguyễn A Property Management',
    representativeName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    status: 'active',
    serviceTier: 'pro',
    joinedDate: '2023-01-15',
    expiryDate: '2025-01-15',
    propertiesCount: 2,
    roomsCount: 8,
    totalRevenue: 24000000,
    tenantsCount: 8,
  },
  {
    id: 'LL002',
    companyName: 'Trần B Real Estate',
    representativeName: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0987654321',
    status: 'active',
    serviceTier: 'enterprise',
    joinedDate: '2022-06-20',
    expiryDate: '2025-06-20',
    propertiesCount: 3,
    roomsCount: 12,
    totalRevenue: 36000000,
    tenantsCount: 12,
  },
  {
    id: 'LL003',
    companyName: 'Phạm C Housing',
    representativeName: 'Phạm Văn C',
    email: 'phamvanc@example.com',
    phone: '0912345678',
    status: 'not_activated',
    serviceTier: 'free',
    joinedDate: '2024-02-10',
    expiryDate: '2024-05-10',
    propertiesCount: 0,
    roomsCount: 0,
    totalRevenue: 0,
    tenantsCount: 0,
  },
  {
    id: 'LL004',
    companyName: 'Hoàng D Properties',
    representativeName: 'Hoàng Thị D',
    email: 'hoangthid@example.com',
    phone: '0923456789',
    status: 'active',
    serviceTier: 'basic',
    joinedDate: '2023-08-12',
    expiryDate: '2024-08-12',
    propertiesCount: 1,
    roomsCount: 5,
    totalRevenue: 15000000,
    tenantsCount: 5,
  },
  {
    id: 'LL005',
    companyName: 'Lê E Housing Solutions',
    representativeName: 'Lê Văn E',
    email: 'levane@example.com',
    phone: '0934567890',
    status: 'suspended',
    serviceTier: 'basic',
    joinedDate: '2023-03-05',
    expiryDate: '2024-03-05',
    propertiesCount: 1,
    roomsCount: 3,
    totalRevenue: 9000000,
    tenantsCount: 3,
  },
]

// Mock Rooms (Public Listings on Search Website)
export const mockRooms: Room[] = [
  {
    id: 'RM001',
    title: 'Phòng đơn Studio',
    address: '123 Nguyễn Hue, Quận 1, HCMC',
    building: 'Tòa nhà A',
    price: 3000000,
    area: 25,
    bedrooms: 1,
    bathrooms: 1,
    landlordId: 'LL001',
    landlordName: 'Nguyễn Văn A',
    publicStatus: 'displaying',
    reviewStatus: 'approved',
    createdDate: '2024-01-20',
    listingDate: '2024-01-22',
    views: 145,
  },
  {
    id: 'RM002',
    title: 'Căn hộ 2 phòng ngủ',
    address: '456 Lê Lợi, Quận 2, HCMC',
    building: 'Chung cư B',
    price: 5500000,
    area: 45,
    bedrooms: 2,
    bathrooms: 1,
    landlordId: 'LL001',
    landlordName: 'Nguyễn Văn A',
    publicStatus: 'rented',
    reviewStatus: 'approved',
    createdDate: '2023-11-15',
    listingDate: '2023-11-18',
    views: 312,
  },
  {
    id: 'RM003',
    title: 'Phòng tiêu chuẩn',
    address: '789 Phạm Ngũ Lão, Quận 1, HCMC',
    building: 'Tòa nhà C',
    price: 2800000,
    area: 20,
    bedrooms: 1,
    bathrooms: 1,
    landlordId: 'LL002',
    landlordName: 'Trần Thị B',
    publicStatus: 'displaying',
    reviewStatus: 'approved',
    createdDate: '2024-02-01',
    listingDate: '2024-02-02',
    views: 89,
  },
  {
    id: 'RM004',
    title: 'Penthouse View',
    address: '321 Nguyễn Huệ Boulevard, Quận 1, HCMC',
    building: 'Tòa nhà D',
    price: 8000000,
    area: 60,
    bedrooms: 3,
    bathrooms: 2,
    landlordId: 'LL002',
    landlordName: 'Trần Thị B',
    publicStatus: 'hidden',
    reviewStatus: 'approved',
    createdDate: '2023-12-10',
    listingDate: '2023-12-12',
    views: 0,
  },
  {
    id: 'RM005',
    title: 'Studio nhỏ gọn',
    address: '555 Cách Mạng Tháng Tám, Quận 10, HCMC',
    building: 'Tòa nhà E',
    price: 2500000,
    area: 18,
    bedrooms: 1,
    bathrooms: 1,
    landlordId: 'LL004',
    landlordName: 'Hoàng Thị D',
    publicStatus: 'pending_review',
    reviewStatus: 'pending',
    createdDate: '2024-02-15',
    listingDate: '2024-02-15',
    views: 32,
  },
  {
    id: 'RM006',
    title: 'Phòng có ban công',
    address: '222 Nguyễn Trãi, Quận 5, HCMC',
    building: 'Tòa nhà F',
    price: 3200000,
    area: 28,
    bedrooms: 1,
    bathrooms: 1,
    landlordId: 'LL004',
    landlordName: 'Hoàng Thị D',
    publicStatus: 'pending_review',
    reviewStatus: 'pending',
    createdDate: '2024-02-16',
    listingDate: '2024-02-16',
    views: 12,
  },
]

// Mock Tenants (Residents in Landlord Properties)
export const mockTenants: Tenant[] = [
  {
    id: 'TN001',
    name: 'Trần Minh Khánh',
    email: 'minh.khanh@example.com',
    phone: '0911111111',
    landlordId: 'LL001',
    landlordName: 'Nguyễn Văn A',
    roomId: 'RM001',
    status: 'active',
    moveInDate: '2024-01-22',
  },
  {
    id: 'TN002',
    name: 'Vương Thị Linh',
    email: 'linh.vuong@example.com',
    phone: '0922222222',
    landlordId: 'LL001',
    landlordName: 'Nguyễn Văn A',
    roomId: 'RM002',
    status: 'active',
    moveInDate: '2023-11-18',
  },
  {
    id: 'TN003',
    name: 'Bùi Đức Hiệu',
    email: 'hieu.bui@example.com',
    phone: '0933333333',
    landlordId: 'LL002',
    landlordName: 'Trần Thị B',
    roomId: 'RM003',
    status: 'moved_out',
    moveInDate: '2023-09-15',
    moveOutDate: '2024-02-10',
  },
]

// Mock Public Website Users (Searchers)
export const mockPublicUsers: PublicUser[] = [
  {
    id: 'PU001',
    name: 'Ngô Thị Hoa',
    email: 'hoa.ngo@example.com',
    phone: '0944444444',
    userType: 'landlord',
    status: 'active',
    joinedDate: '2024-01-15',
    views: 23,
    contactCount: 5,
    lastActive: '2024-02-16',
  },
  {
    id: 'PU002',
    name: 'Đặng Văn Minh',
    email: 'minh.dang@example.com',
    phone: '0955555555',
    userType: 'tenant',
    status: 'active',
    joinedDate: '2023-11-08',
    views: 45,
    contactCount: 12,
    lastActive: '2024-02-15',
  },
  {
    id: 'PU003',
    name: 'Chu Thị Phương',
    email: 'phuong.chu@example.com',
    phone: '0966666666',
    userType: 'customer',
    status: 'suspended',
    joinedDate: '2024-01-01',
    views: 128,
    contactCount: 42,
    lastActive: '2024-02-10',
  },
]

// Mock Reports & Violations
export const mockReports: Report[] = [
  {
    id: 'RPT001',
    type: 'from_website_user',
    reportedBy: 'PU001 - Ngô Thị Hoa',
    reportedItem: 'LL001',
    reportedItemType: 'landlord',
    reason: 'fraud',
    status: 'pending',
    priority: 'high',
    description: 'Chủ nhà yêu cầu thanh toán trước khi cho xem phòng',
    createdDate: '2024-02-15',
  },
  {
    id: 'RPT002',
    type: 'from_website_user',
    reportedBy: 'PU002 - Đặng Văn Minh',
    reportedItem: 'RM005',
    reportedItemType: 'room',
    reason: 'spam',
    status: 'resolved',
    priority: 'low',
    description: 'Bài đăng không liên quan hoặc quảng cáo',
    createdDate: '2024-02-10',
    resolutionAction: 'delete_listing',
    adminNotes: 'Xóa bài đăng spam',
  },
  {
    id: 'RPT003',
    type: 'from_tenant',
    reportedBy: 'TN002 - Vương Thị Linh',
    reportedItem: 'LL001',
    reportedItemType: 'landlord',
    reason: 'inappropriate',
    status: 'pending',
    priority: 'medium',
    description: 'Chủ nhà có hành vi không phù hợp',
    createdDate: '2024-02-16',
  },
  {
    id: 'RPT004',
    type: 'internal',
    reportedBy: 'Admin System',
    reportedItem: 'PU003',
    reportedItemType: 'room',
    reason: 'scam',
    status: 'resolved',
    priority: 'high',
    description: 'Phát hiện hành vi lừa đảo',
    createdDate: '2024-02-08',
    resolutionAction: 'suspend_account',
    adminNotes: 'Tạm khóa tài khoản người dùng',
  },
]

// Mock Dashboard Statistics
export const mockDashboardStats = {
  // Totals
  totalLandlords: mockLandlords.length,
  totalRooms: mockRooms.length,
  totalTenants: mockTenants.filter(t => t.status === 'active').length,
  totalPublicUsers: mockPublicUsers.length,
  totalReports: mockReports.length,
  
  // Active counts
  activeLandlords: mockLandlords.filter(l => l.status === 'active').length,
  displayingRooms: mockRooms.filter(r => r.publicStatus === 'displaying').length,
  activePublicUsers: mockPublicUsers.filter(u => u.status === 'active').length,
  
  // Daily stats
  newLandlordsToday: 1,
  newRoomsToday: 2,
  newPublicListingsToday: 1,
  newTenantsToday: 0,
  totalViewsToday: mockRooms.reduce((sum, r) => sum + (r.views || 0), 0),
  pendingReviews: mockRooms.filter(r => r.reviewStatus === 'pending').length,
}

// Mock chart data for dashboard
export const mockChartData = {
  // Daily landlord registrations (last 7 days)
  dailyLandlords: [
    { day: 'Mon', count: 2 },
    { day: 'Tue', count: 3 },
    { day: 'Wed', count: 1 },
    { day: 'Thu', count: 2 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 1 },
    { day: 'Sun', count: 0 },
  ],
  // Daily room registrations (last 7 days)
  dailyRooms: [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 5 },
    { day: 'Wed', count: 3 },
    { day: 'Thu', count: 6 },
    { day: 'Fri', count: 7 },
    { day: 'Sat', count: 5 },
    { day: 'Sun', count: 2 },
  ],
  // Daily public listings (last 7 days)
  dailyPublicListings: [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 4 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 4 },
    { day: 'Fri', count: 5 },
    { day: 'Sat', count: 3 },
    { day: 'Sun', count: 1 },
  ],
  // Daily tenant registrations (last 7 days)
  dailyTenants: [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 4 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 5 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 2 },
    { day: 'Sun', count: 1 },
  ],
  // Room status distribution
  publicRoomStatus: [
    { name: 'Displaying', value: mockRooms.filter(r => r.publicStatus === 'displaying').length },
    { name: 'Hidden', value: mockRooms.filter(r => r.publicStatus === 'hidden').length },
    { name: 'Pending Review', value: mockRooms.filter(r => r.publicStatus === 'pending_review').length },
    { name: 'Rented', value: mockRooms.filter(r => r.publicStatus === 'rented').length },
  ],
  // Landlord status distribution
  landlordStatus: [
    { name: 'Active', value: mockLandlords.filter(l => l.status === 'active').length },
    { name: 'Expired', value: mockLandlords.filter(l => l.status === 'expired').length },
    { name: 'Suspended', value: mockLandlords.filter(l => l.status === 'suspended').length },
    { name: 'Not Activated', value: mockLandlords.filter(l => l.status === 'not_activated').length },
  ],
  // Daily page views (basic)
  dailyViews: [
    { day: 'Mon', views: 245 },
    { day: 'Tue', views: 312 },
    { day: 'Wed', views: 289 },
    { day: 'Thu', views: 401 },
    { day: 'Fri', views: 385 },
    { day: 'Sat', views: 356 },
    { day: 'Sun', views: 198 },
  ],
}

// ==================== CHATBOT MOCK DATA ====================

export const mockChatbotModels: ChatbotModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    contextWindow: 8192,
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient, good balance',
    contextWindow: 4096,
  },
  {
    id: 'claude-3',
    name: 'Claude 3 Opus',
    description: 'Strong reasoning and analysis',
    contextWindow: 200000,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Multimodal capabilities',
    contextWindow: 32000,
  },
]

export const mockSamplePrompts: SamplePrompt[] = [
  {
    id: 'sp-1',
    title: 'Thông tin bài đăng',
    description: 'Room details, amenities, location, and rental terms',
    category: 'listing_info',
    tokenCount: 1,
  },
  {
    id: 'sp-2',
    title: 'Câu hỏi thường gặp',
    description: 'Common questions about booking, payment, and policies',
    category: 'faq',
    tokenCount: 2,
  },
  {
    id: 'sp-3',
    title: 'Chính sách thuê phòng',
    description: 'Tenant responsibilities, quiet hours, and restrictions',
    category: 'rules',
    tokenCount: 3,
  },
  {
    id: 'sp-4',
    title: 'Hướng dẫn thanh toán',
    description: 'Payment methods, schedules, and procedures',
    category: 'payment',
    tokenCount: 2,
  },
  {
    id: 'sp-5',
    title: 'Dịch vụ hỗ trợ',
    description: 'Support channels and response times',
    category: 'support',
    tokenCount: 1,
  },
]

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Thảo luận về giá thuê',
    model: 'gpt-4',
    createdDate: '2024-02-14',
    lastModified: '2024-02-16',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Giá thuê phòng hiện tại có phải là thị trường không?',
        timestamp: '2024-02-14T10:30:00Z',
        tokens: 15,
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Dựa trên dữ liệu thị trường, giá thuê phòng của bạn đang ở m��c trung bình với các tiện ích được cung cấp. Tôi khuyên bạn nên xem xét các yếu tố như vị trí, kích thước và các tiện ích được cung cấp.',
        timestamp: '2024-02-14T10:31:00Z',
        tokens: 45,
      },
    ],
    totalTokens: 60,
  },
  {
    id: 'conv-2',
    title: 'Tối ưu hóa mô tả phòng',
    model: 'gpt-3.5',
    createdDate: '2024-02-10',
    lastModified: '2024-02-15',
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'Làm thế nào để viết mô tả phòng hấp dẫn hơn?',
        timestamp: '2024-02-10T14:20:00Z',
        tokens: 12,
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'Hãy tập trung vào những điểm bán chính: vị trí, ánh sáng tự nhiên, tiện ích gần đó, và độc đáo của không gian.',
        timestamp: '2024-02-10T14:21:00Z',
        tokens: 38,
      },
    ],
    totalTokens: 50,
  },
  {
    id: 'conv-3',
    title: 'Quản lý khách hàng mới',
    model: 'claude-3',
    createdDate: '2024-02-05',
    lastModified: '2024-02-12',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'Quy trình onboarding khách hàng mới nên là gì?',
        timestamp: '2024-02-05T09:00:00Z',
        tokens: 14,
      },
    ],
    totalTokens: 14,
  },
]

export const mockTokenInfo: TokenInfo = {
  totalUsed: 124,
  limit: 1000000,
  percentageUsed: 0.0124,
  costPerMillion: 15,
}

// ==================== DASHBOARD MESSAGES MOCK DATA ====================

export const mockDashboardConversations: DashboardConversation[] = [
  {
    id: 'CONV001',
    conversationType: 'landlord_to_tenant',
    sender: 'Nguyễn Văn A',
    recipient: 'Trần Mình Khánh',
    latestMessage: 'Ok, tôi sẽ kiểm tra và sửa chữa các hư hỏng...',
    lastUpdated: '16/2/2024 14:30',
    status: 'active',
  },
  {
    id: 'CONV002',
    conversationType: 'user_to_chatbot',
    sender: 'Ngô Thị Hoa',
    recipient: 'Chatbot',
    latestMessage: 'Cảm ơn thông tin, tôi sẽ liên hệ chủ nhà ngay',
    lastUpdated: '16/2/2024 13:15',
    status: 'resolved',
  },
  {
    id: 'CONV003',
    conversationType: 'landlord_to_tenant',
    sender: 'Trần Thị B',
    recipient: 'Vương Thị Linh',
    latestMessage: 'Chủ yêu cầu bạn thanh toán tiền điện trước...',
    lastUpdated: '16/2/2024 12:45',
    status: 'pending_response',
  },
  {
    id: 'CONV004',
    conversationType: 'tenant_to_tenant',
    sender: 'Lê Minh Tuấn',
    recipient: 'Phạm Tú Anh',
    latestMessage: 'Bạn có biết ai sửa điều hòa ở khu vực này không?',
    lastUpdated: '15/2/2024 16:20',
    status: 'active',
  },
  {
    id: 'CONV005',
    conversationType: 'landlord_to_tenant',
    sender: 'Hoàng Quốc Việt',
    recipient: 'Bùi Thị Hương',
    latestMessage: 'Cảm ơn bạn đã thông báo sự cố. Sẽ xử lý ngay',
    lastUpdated: '14/2/2024 11:00',
    status: 'resolved',
  },
]
