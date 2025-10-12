import { api, ApiResponse } from './api';

// 交易状态枚举
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// 交易类型枚举
export enum TransactionType {
  COLLECTION = 'collection',
  PAYOUT = 'payout',
  RECHARGE = 'recharge'
}

// 交易记录接口
export interface Transaction {
  id: string;
  type: TransactionType;
  uid: string;
  amount: number;
  currency: string;
  method: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
  fee?: number;
  merchantId: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
  status?: TransactionStatus;
  method?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 仪表板统计数据
export interface DashboardStats {
  todayCollection: number;
  todayPayout: number;
  successRate: number;
  weeklySettlement: number;
  accountBalance: number;
  weeklyTrend: {
    name: string;
    collection: number;
    payout: number;
    recharge: number;
  }[];
  paymentMethodStats: {
    name: string;
    value: number;
    amount: number;
    color: string;
  }[];
  recentTransactions: Transaction[];
}

// 交易服务
export const transactionService = {
  // 获取仪表板数据
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    // 模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: '200',
          success: true,
          msg: '获取成功',
          data: {
            todayCollection: 185450,
            todayPayout: 95680,
            successRate: 94.8,
            weeklySettlement: 2120.25,
            accountBalance: 895680,
            weeklyTrend: [
              { name: '周一', collection: 85000, payout: 45000, recharge: 12000 },
              { name: '周二', collection: 120000, payout: 68000, recharge: 18000 },
              { name: '周三', collection: 95000, payout: 52000, recharge: 15000 },
              { name: '周四', collection: 150000, payout: 89000, recharge: 22000 },
              { name: '周五', collection: 180000, payout: 125000, recharge: 28000 },
              { name: '周六', collection: 165000, payout: 98000, recharge: 25000 },
              { name: '周日', collection: 140000, payout: 75000, recharge: 20000 }
            ],
            paymentMethodStats: [
              { name: 'UPI', value: 45, amount: 2850000, color: '#0088FE' },
              { name: '银行卡', value: 30, amount: 1900000, color: '#00C49F' },
              { name: 'USDT', value: 15, amount: 950000, color: '#FFBB28' },
              { name: '其他', value: 10, amount: 630000, color: '#FF8042' }
            ],
            recentTransactions: [
              {
                id: 'COL001',
                type: TransactionType.COLLECTION,
                uid: 'user_12345',
                amount: 15000,
                currency: 'INR',
                method: 'UPI',
                status: TransactionStatus.SUCCESS,
                createdAt: '2025-01-27T10:30:00Z',
                updatedAt: '2025-01-27T10:30:00Z',
                merchantId: '12345'
              },
              {
                id: 'PAY002',
                type: TransactionType.PAYOUT,
                uid: 'user_67890',
                amount: 8500,
                currency: 'INR',
                method: '银行卡',
                status: TransactionStatus.PENDING,
                createdAt: '2025-01-27T10:25:00Z',
                updatedAt: '2025-01-27T10:25:00Z',
                merchantId: '12345'
              }
            ]
          }
        });
      }, 500);
    });
  },

  // 获取代收记录
  getCollectionRecords: async (params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Transaction>>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData: Transaction[] = [];
        for (let i = 1; i <= 20; i++) {
          mockData.push({
            id: `COL${i.toString().padStart(3, '0')}`,
            type: TransactionType.COLLECTION,
            uid: `user_${Math.random().toString(36).substr(2, 9)}`,
            amount: Math.floor(Math.random() * 50000) + 1000,
            currency: 'INR',
            method: ['UPI', '银行卡', 'USDT'][Math.floor(Math.random() * 3)],
            status: [TransactionStatus.SUCCESS, TransactionStatus.PENDING, TransactionStatus.FAILED][Math.floor(Math.random() * 3)],
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
            updatedAt: new Date().toISOString(),
            merchantId: '12345'
          });
        }

        resolve({
          code: '200',
          success: true,
          msg: '获取成功',
          data: {
            items: mockData.slice((params.page - 1) * params.pageSize, params.page * params.pageSize),
            total: mockData.length,
            page: params.page,
            pageSize: params.pageSize,
            totalPages: Math.ceil(mockData.length / params.pageSize)
          }
        });
      }, 800);
    });
  },

  // 获取代付记录
  getPayoutRecords: async (params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Transaction>>> => {
    // 类似代收记录的模拟实现
    return transactionService.getCollectionRecords(params);
  },

  // 获取充值记录
  getRechargeRecords: async (params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Transaction>>> => {
    // 类似代收记录的模拟实现
    return transactionService.getCollectionRecords(params);
  },

  // 获取结算记录
  getSettlementRecords: async (params: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: '200',
          success: true,
          msg: '获取成功',
          data: {
            items: [
              {
                id: 'SET001',
                amount: 2120.25,
                currency: 'INR',
                period: '2025-01-20 至 2025-01-26',
                status: 'completed',
                createdAt: '2025-01-27T00:00:00Z'
              }
            ],
            total: 1,
            page: params.page,
            pageSize: params.pageSize,
            totalPages: 1
          }
        });
      }, 600);
    });
  },

  // 创建交易
  createTransaction: async (transactionData: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    return api.post('/transactions', transactionData);
  },

  // 获取交易详情
  getTransactionDetail: async (id: string): Promise<ApiResponse<Transaction>> => {
    return api.get(`/transactions/${id}`);
  },

  // 取消交易
  cancelTransaction: async (id: string): Promise<ApiResponse<null>> => {
    return api.post(`/transactions/${id}/cancel`);
  }
};
