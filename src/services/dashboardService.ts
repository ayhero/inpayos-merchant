import { api } from './api';

// Dashboard数据类型定义
export interface DashboardTodayStats {
  today_collection: string;
  today_collection_rate: string;
  today_payout: string;
  today_payout_rate: string;
  success_rate: string;
  success_rate_change: string;
}

export interface DashboardTransactionTrend {
  date: string;
  collection: number;
  payout: number;
}

export interface DashboardOverview {
  today_stats: DashboardTodayStats;
  transaction_trend: DashboardTransactionTrend[];
}

// API响应类型
export interface ApiResponse<T> {
  code: string;
  msg: string;
  data: T;
}

// Dashboard服务类
export class DashboardService {
  
  /**
   * 获取今日统计数据
   */
  static async getTodayStats(currency?: string): Promise<DashboardTodayStats> {
    try {
      const response = await api.post<DashboardTodayStats>('/dashboard/today-stats', {
        currency
      });
      
      if (response.code === '0000') {
        return response.data;
      } else {
        throw new Error(response.msg || '获取今日统计失败');
      }
    } catch (error: any) {
      console.error('获取今日统计失败:', error);
      throw new Error(error.response?.data?.msg || error.message || '获取今日统计失败');
    }
  }

  /**
   * 获取交易趋势数据
   */
  static async getTransactionTrend(days: number = 7): Promise<DashboardTransactionTrend[]> {
    try {
      const response = await api.post<DashboardTransactionTrend[]>('/dashboard/transaction-trend', {
        days
      });
      
      if (response.code === '0000') {
        return response.data;
      } else {
        throw new Error(response.msg || '获取交易趋势失败');
      }
    } catch (error: any) {
      console.error('获取交易趋势失败:', error);
      throw new Error(error.response?.data?.msg || error.message || '获取交易趋势失败');
    }
  }

  /**
   * 获取Dashboard概览数据（一次性获取所有数据）
   */
  static async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await api.post<DashboardOverview>('/dashboard/overview');
      
      if (response.code === '0000') {
        return response.data;
      } else {
        throw new Error(response.msg || '获取Dashboard概览失败');
      }
    } catch (error: any) {
      console.error('获取Dashboard概览失败:', error);
      throw new Error(error.response?.data?.msg || error.message || '获取Dashboard概览失败');
    }
  }
}

// 默认导出
export default DashboardService;