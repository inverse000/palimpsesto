import client from '../client'
import type { ApiResponse, DashboardData } from '@palimpsesto/shared'

export const dashboardApi = {
  obtener: async () => {
    const res = await client.get<ApiResponse<DashboardData>>('/api/dashboard')
    return res.data.data
  },
}
