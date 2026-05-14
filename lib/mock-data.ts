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
  bedrooms: number
  bathrooms: number
  landlordId: string
  landlordName: string
  listingType: 'room_rental' | 'shared_room'
  // Status on public website
  publicStatus: 'displaying' | 'hidden' | 'pending_review'
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
  accountType: 'landlord' | 'resident'
  canPostListing: boolean
  postingPermission: 'room_rental' | 'shared_room' | 'both'
  status: 'active' | 'suspended'
  joinedDate: string
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

export interface ChatbotConfig {
  id: string
  name: string
  platform: 'public_listing' | 'resident_app'
  status: 'active' | 'paused' | 'maintenance'
  description: string
  defaultGreeting: string
  createdDate: string
  updatedDate: string
}

export interface ChatbotDataSource {
  id: string
  configId: string
  name: string
  type: 'listing_info' | 'faq' | 'rules' | 'resident_info' | 'system_notification' | 'custom'
  enabled: boolean
  priority: number
  content: string
  createdDate: string
  updatedDate: string
}

export interface ChatbotResponsePattern {
  id: string
  configId: string
  trigger: string
  response: string
  priority: number
  enabled: boolean
}

export interface ChatbotInteraction {
  id: string
  configId: string
  userId: string
  userMessage: string
  botResponse: string
  platform: 'public_listing' | 'resident_app'
  timestamp: string
  status: 'resolved' | 'pending' | 'escalated'
  userSatisfied?: boolean
}

export interface ChatbotResponseStyle {
  configId: string
  style: 'friendly' | 'professional' | 'concise'
  responseLength: 'short' | 'medium' | 'long'
  detailLevel: 'basic' | 'detailed' | 'comprehensive'
  language: 'vi' | 'en'
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
    area: 25,
    bedrooms: 1,
    bathrooms: 1,
    landlordId: 'LL001',
    landlordName: 'Nguyễn Văn A',
    listingType: 'room_rental',
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
    area: 45,
    bedrooms: 2,
    bathrooms: 1,
    landlordId: 'LL001',
    landlordName: 'Nguyễn Văn A',
    listingType: 'room_rental',
    publicStatus: 'hidden',
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
    area: 20,
    bedrooms: 1,
    bathrooms: 1,
    landlordId: 'LL002',
    landlordName: 'Trần Thị B',
    listingType: 'shared_room',
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
    area: 60,
    bedrooms: 3,
    bathrooms: 2,
    landlordId: 'LL002',
    landlordName: 'Trần Thị B',
    listingType: 'room_rental',
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
    area: 18,
    bedrooms: 1,
    bathrooms: 1,
    landlordId: 'LL004',
    landlordName: 'Hoàng Thị D',
    listingType: 'shared_room',
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
    area: 28,
    bedrooms: 1,
    bathrooms: 1,
    landlordId: 'LL004',
    landlordName: 'Hoàng Thị D',
    listingType: 'room_rental',
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

// Mock Public Website Users (Both Landlords & Residents who can post listings)
export const mockPublicUsers: PublicUser[] = [
  {
    id: 'PU001',
    name: 'Ngô Thị Hoa',
    email: 'hoa.ngo@example.com',
    phone: '0944444444',
    accountType: 'landlord',
    canPostListing: true,
    postingPermission: 'room_rental',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '2024-02-16',
  },
  {
    id: 'PU002',
    name: 'Đặng Văn Minh',
    email: 'minh.dang@example.com',
    phone: '0955555555',
    accountType: 'resident',
    canPostListing: true,
    postingPermission: 'shared_room',
    status: 'active',
    joinedDate: '2023-11-08',
    lastActive: '2024-02-15',
  },
  {
    id: 'PU003',
    name: 'Chu Thị Phương',
    email: 'phuong.chu@example.com',
    phone: '0966666666',
    accountType: 'landlord',
    canPostListing: true,
    postingPermission: 'both',
    status: 'suspended',
    joinedDate: '2024-01-01',
    lastActive: '2024-02-10',
  },
  {
    id: 'PU004',
    name: 'Lý Quốc Anh',
    email: 'anh.ly@example.com',
    phone: '0977777777',
    accountType: 'resident',
    canPostListing: true,
    postingPermission: 'shared_room',
    status: 'active',
    joinedDate: '2024-02-01',
    lastActive: '2024-02-16',
  },
  {
    id: 'PU005',
    name: 'Vũ Thị Nhân',
    email: 'nhan.vu@example.com',
    phone: '0988888888',
    accountType: 'landlord',
    canPostListing: true,
    postingPermission: 'room_rental',
    status: 'active',
    joinedDate: '2023-12-20',
    lastActive: '2024-02-14',
  },
  {
    id: 'PU006',
    name: 'Trần Minh Tuấn',
    email: 'tuan.tran@example.com',
    phone: '0999999999',
    accountType: 'resident',
    canPostListing: false,
    postingPermission: 'shared_room',
    status: 'active',
    joinedDate: '2024-01-25',
    lastActive: '2024-02-13',
  },
  {
    id: 'PU007',
    name: 'Hoàng Kim Dung',
    email: 'dung.hoang@example.com',
    phone: '0900000000',
    accountType: 'landlord',
    canPostListing: true,
    postingPermission: 'both',
    status: 'active',
    joinedDate: '2023-10-15',
    lastActive: '2024-02-16',
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

// Mock Chatbot Configurations
export const mockChatbotConfigs: ChatbotConfig[] = [
  {
    id: 'CB001',
    name: 'Trợ lý Tin Đăng',
    platform: 'public_listing',
    status: 'active',
    description: 'Hỗ trợ khách xem tin, giải đáp thông tin phòng trọ, hướng dẫn liên hệ',
    defaultGreeting: 'Xin chào! Tôi là trợ lý ảo. Hỏi tôi về các phòng trọ hoặc bất kỳ thông tin nào bạn cần.',
    createdDate: '2024-01-10',
    updatedDate: '2024-02-16',
  },
  {
    id: 'CB002',
    name: 'Trợ lý App Cư Dân',
    platform: 'resident_app',
    status: 'active',
    description: 'Hỗ trợ cư dân tra cứu thông tin, giúp sử dụng ứng dụng, giải đáp câu hỏi nội bộ',
    defaultGreeting: 'Chào bạn! Tôi ở đây để giúp bạn với mọi câu hỏi về ứng dụng và thông tin cư dân.',
    createdDate: '2024-01-15',
    updatedDate: '2024-02-10',
  },
]

// Mock Chatbot Data Sources
export const mockChatbotDataSources: ChatbotDataSource[] = [
  {
    id: 'DS001',
    configId: 'CB001',
    name: 'Thông tin bài đăng',
    type: 'listing_info',
    enabled: true,
    priority: 1,
    content: 'Room details, amenities, location, and rental terms',
    createdDate: '2024-01-10',
    updatedDate: '2024-02-15',
  },
  {
    id: 'DS002',
    configId: 'CB001',
    name: 'Câu hỏi thường gặp',
    type: 'faq',
    enabled: true,
    priority: 2,
    content: 'Common questions about booking, payment, and policies',
    createdDate: '2024-01-15',
    updatedDate: '2024-02-16',
  },
  {
    id: 'DS003',
    configId: 'CB001',
    name: 'Chính sách thuê phòng',
    type: 'rules',
    enabled: true,
    priority: 3,
    content: 'Tenant responsibilities, quiet hours, and restrictions',
    createdDate: '2024-01-20',
    updatedDate: '2024-02-14',
  },
  {
    id: 'DS004',
    configId: 'CB002',
    name: 'Thông tin cư dân',
    type: 'resident_info',
    enabled: true,
    priority: 1,
    content: 'Resident profiles, contact information, account details',
    createdDate: '2024-01-12',
    updatedDate: '2024-02-15',
  },
  {
    id: 'DS005',
    configId: 'CB002',
    name: 'Nội quy',
    type: 'rules',
    enabled: true,
    priority: 2,
    content: 'Building rules, common area usage, quiet hours',
    createdDate: '2024-01-18',
    updatedDate: '2024-02-13',
  },
]

// Mock Chatbot Response Patterns
export const mockChatbotPatterns: ChatbotResponsePattern[] = [
  {
    id: 'RP001',
    configId: 'CB001',
    trigger: 'price|cost|how much|bao nhiêu',
    response: 'The rental price for this room is 3,000,000 VND per month, including utilities.',
    priority: 1,
    enabled: true,
  },
  {
    id: 'RP002',
    configId: 'CB001',
    trigger: 'location|where|address|địa chỉ',
    response: 'This room is located in District 1, Ho Chi Minh City, with easy access to public transportation.',
    priority: 1,
    enabled: true,
  },
  {
    id: 'RP003',
    configId: 'CB001',
    trigger: 'amenities|facilities|wifi|air conditioning',
    response: 'The room includes WiFi, air conditioning, and modern furniture. Common areas have a shared kitchen.',
    priority: 1,
    enabled: true,
  },
  {
    id: 'RP004',
    configId: 'CB002',
    trigger: 'how to|hướng dẫn|cách sử dụng',
    response: 'You can find detailed tutorials in the Help section of the app. Would you like specific help with something?',
    priority: 1,
    enabled: true,
  },
]

// Mock Chatbot Interactions
export const mockChatbotInteractions: ChatbotInteraction[] = [
  {
    id: 'CI001',
    configId: 'CB001',
    userId: 'USER001',
    userMessage: 'What is the price of this room?',
    botResponse: 'The rental price for this room is 3,000,000 VND per month, including utilities.',
    platform: 'public_listing',
    timestamp: '2024-02-16T10:30:00',
    status: 'resolved',
    userSatisfied: true,
  },
  {
    id: 'CI002',
    configId: 'CB001',
    userId: 'USER002',
    userMessage: 'Where is this room located?',
    botResponse: 'This room is located in District 1, Ho Chi Minh City, with easy access to public transportation.',
    platform: 'public_listing',
    timestamp: '2024-02-16T10:35:00',
    status: 'resolved',
    userSatisfied: true,
  },
  {
    id: 'CI003',
    configId: 'CB001',
    userId: 'USER001',
    userMessage: 'Can I visit the room this weekend?',
    botResponse: 'Please contact the landlord directly to schedule a viewing. You can find their contact information in the listing details.',
    platform: 'public_listing',
    timestamp: '2024-02-16T10:40:00',
    status: 'pending',
  },
  {
    id: 'CI004',
    configId: 'CB002',
    userId: 'USER003',
    userMessage: 'How do I update my profile?',
    botResponse: 'Go to Settings > Profile to update your information. Click Edit to make changes and Save when done.',
    platform: 'resident_app',
    timestamp: '2024-02-16T11:00:00',
    status: 'resolved',
    userSatisfied: true,
  },
  {
    id: 'CI005',
    configId: 'CB002',
    userId: 'USER004',
    userMessage: 'What are the building rules?',
    botResponse: 'I don\'t have that information available. Please contact the management office for detailed building rules.',
    platform: 'resident_app',
    timestamp: '2024-02-16T11:15:00',
    status: 'escalated',
    userSatisfied: false,
  },
]
