'use client'

import { StatCard } from '@/components/stat-card'
import { mockDashboardStats, mockChartData } from '@/lib/mock-data'
import { Building2, Users, Home, BarChart3 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function DashboardHome() {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground"></h1>
        <p className="mt-1 text-muted-foreground"></p>
      </div>

      {/* Key Statistics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng chủ nhà"
          value={mockDashboardStats.totalLandlords}
          description={`${mockDashboardStats.activeLandlords} đang hoạt động`}
          trend="up"
          trendValue={`+${mockDashboardStats.newLandlordsToday} hôm nay`}
          icon={<Building2 size={24} />}
        />
        <StatCard
          title="Tổng tin đăng công khai"
          value={mockDashboardStats.totalRooms}
          description={`${mockDashboardStats.displayingRooms} đang hiển thị`}
          trend="up"
          trendValue={`+${mockDashboardStats.newPublicListingsToday} hôm nay`}
          icon={<Home size={24} />}
        />
        <StatCard
          title="Người dùng hoạt động"
          value={mockDashboardStats.activePublicUsers}
          description={`${mockDashboardStats.totalPublicUsers} người dùng tổng cộng`}
          trend="up"
          trendValue="Đang truy cập hôm nay"
          icon={<Users size={24} />}
        />
        <StatCard
          title="Tổng số người thuê"
          value={mockDashboardStats.totalTenants}
          description="Trên tất cả tài sản"
          trend="stable"
          trendValue="Không thay đổi"
          icon={<BarChart3 size={24} />}
        />
      </div>

      {/* Daily Growth Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* New Landlords Per Day */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Đăng ký chủ nhà mới</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData.dailyLandlords}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
              <Bar dataKey="count" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* New Public Listings Per Day */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Tin đăng công khai mới</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData.dailyPublicListings}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
              <Bar dataKey="count" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Landlord Status Distribution */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Tình trạng tài khoản chủ nhà</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockChartData.landlordStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="var(--chart-1)"
                dataKey="value"
              >
                {mockChartData.landlordStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Public Listing Status Distribution */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Tình trạng tin đăng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockChartData.publicRoomStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="var(--chart-1)"
                dataKey="value"
              >
                {mockChartData.publicRoomStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Page Views */}
        <div className="rounded-lg border border-border bg-card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Lượt xem trang công khai hàng ngày</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData.dailyViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
              <Line
                type="monotone"
                dataKey="views"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={{ fill: 'var(--chart-3)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
