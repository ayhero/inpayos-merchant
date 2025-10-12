import { ApiResponse, api } from './api';

// 交易类型枚举 - 与后端 protocol 保持一致
export enum TransactionType {
  PAYIN = 'payin',
  PAYOUT = 'payout', 
  REFUND = 'refund'
}

// 交易状态枚举
export enum TransactionStatus {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2,
  CANCELLED = 3
}

// 渠道状态枚举
export enum ChannelStatus {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2
}

// 结算状态枚举
export enum SettleStatus {
  PENDING = 0,
  SETTLED = 1,
  FAILED = 2
}

// 后端返回的分页数据结构
interface BackendPageResult<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
  count: number;
}

// 后端返回的交易信息（字段名已经是驼峰格式）
interface BackendTransactionInfo {
  trxID: string;
  reqID: string;
  oriTrxID?: string;
  oriReqID?: string;
  status: number;
  channelStatus?: string;
  resCode?: string;
  resMsg?: string;
  reason?: string;
  ccy: string;
  amount: string;
  usdAmount: string;
  link?: string;
  createdAt: number; // 时间戳
  updatedAt: number; // 时间戳
  completedAt?: number; // 时间戳
  expiredAt?: number; // 时间戳
  trxType: string;
  trxMethod?: string;
  trxMode?: string;
  trxApp?: string;
  channelCode?: string;
  channelAccount?: string;
  channelGroup?: string;
  channelTrxID?: string;
  feeCcy?: string;
  feeAmount?: string;
  feeUsdAmount?: string;
  channelFeeCcy?: string;
  channelFeeAmount?: string;
  flowNo?: string;
  country?: string;
  remark?: string;
  settleStatus?: number;
  settleID?: string;
  settledAt?: number; // 时间戳
  refundedCount?: number;
  refundedAmount?: string;
  refundedUsdAmount?: string;
  lastRefundedAt?: number; // 时间戳
  detail?: any;
}

// 统一交易信息接口 - 与后端 protocol.TransactionInfo 保持一致
export interface TransactionInfo {
  trxID: string;
  reqID: string;
  oriTrxID?: string;
  oriReqID?: string;
  status: TransactionStatus;
  channelStatus?: ChannelStatus;
  resCode?: string;
  resMsg?: string;
  reason?: string;
  ccy: string;
  amount: string;
  usdAmount: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  expiredAt?: string;
  trxType: TransactionType;
  trxMethod?: string;
  trxMode?: string;
  trxApp?: string;
  channelCode?: string;
  channelAccount?: string;
  channelGroup?: string;
  channelTrxID?: string;
  feeCcy?: string;
  feeAmount?: string;
  feeUsdAmount?: string;
  channelFeeCcy?: string;
  channelFeeAmount?: string;
  flowNo?: string;
  country?: string;
  remark?: string;
  settleStatus?: SettleStatus;
  settleID?: string;
  settledAt?: string;
  refundedCount?: number;
  refundedAmount?: string;
  refundedUsdAmount?: string;
  lastRefundedAt?: string;
  detail?: string;
}

// 查询参数接口
export interface TransactionQueryParams {
  trxType: TransactionType;
  page: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
  status?: TransactionStatus;
  trxMethod?: string;
  ccy?: string;
  trxID?: string;
  reqID?: string;
  uid?: string;
  channelCode?: string;
}

// 分页响应接口
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 今日统计数据接口
export interface TodayStats {
  totalAmount: string;
  totalCount: number;
  successCount: number;
  successRate: number;
  pendingCount: number;
}

// 时间戳转换为 ISO 字符串的辅助函数
const timestampToISOString = (timestamp?: number): string | undefined => {
  return timestamp ? new Date(timestamp * 1000).toISOString() : undefined;
};

// 后端数据转换为前端格式
const convertBackendToFrontend = (backend: BackendTransactionInfo): TransactionInfo => {
  return {
    trxID: backend.trxID,
    reqID: backend.reqID,
    oriTrxID: backend.oriTrxID,
    oriReqID: backend.oriReqID,
    status: backend.status as TransactionStatus,
    channelStatus: backend.channelStatus ? parseInt(backend.channelStatus) as ChannelStatus : undefined,
    resCode: backend.resCode,
    resMsg: backend.resMsg,
    reason: backend.reason,
    ccy: backend.ccy,
    amount: backend.amount,
    usdAmount: backend.usdAmount,
    link: backend.link,
    createdAt: timestampToISOString(backend.createdAt) || '',
    updatedAt: timestampToISOString(backend.updatedAt) || '',
    completedAt: timestampToISOString(backend.completedAt),
    expiredAt: timestampToISOString(backend.expiredAt),
    trxType: backend.trxType as TransactionType,
    trxMethod: backend.trxMethod,
    trxMode: backend.trxMode,
    trxApp: backend.trxApp,
    channelCode: backend.channelCode,
    channelAccount: backend.channelAccount,
    channelGroup: backend.channelGroup,
    channelTrxID: backend.channelTrxID,
    feeCcy: backend.feeCcy,
    feeAmount: backend.feeAmount,
    feeUsdAmount: backend.feeUsdAmount,
    channelFeeCcy: backend.channelFeeCcy,
    channelFeeAmount: backend.channelFeeAmount,
    flowNo: backend.flowNo,
    country: backend.country,
    remark: backend.remark,
    settleStatus: backend.settleStatus as SettleStatus,
    settleID: backend.settleID,
    settledAt: timestampToISOString(backend.settledAt),
    refundedCount: backend.refundedCount,
    refundedAmount: backend.refundedAmount,
    refundedUsdAmount: backend.refundedUsdAmount,
    lastRefundedAt: timestampToISOString(backend.lastRefundedAt),
    detail: backend.detail ? JSON.stringify(backend.detail) : undefined,
  };
};

// 统一交易服务
export const unifiedTransactionService = {
  // 获取交易列表
  getTransactions: async (params: TransactionQueryParams): Promise<ApiResponse<PaginatedResponse<TransactionInfo>>> => {
    try {
      // 构建查询参数 - 后端 API 期望下划线格式的参数
      const queryParams: Record<string, any> = {
        trx_type: params.trxType,
        page: params.page,
        size: params.pageSize,
      };

      // 添加可选筛选条件
      if (params.status !== undefined) {
        queryParams.status = params.status;
      }
      if (params.trxMethod) {
        queryParams.trx_method = params.trxMethod;
      }
      if (params.ccy) {
        queryParams.ccy = params.ccy;
      }
      if (params.trxID) {
        queryParams.trx_id = params.trxID;
      }
      if (params.reqID) {
        queryParams.req_id = params.reqID;
      }
      if (params.startDate) {
        queryParams.start_time = Math.floor(new Date(params.startDate).getTime() / 1000);
      }
      if (params.endDate) {
        queryParams.end_time = Math.floor(new Date(params.endDate).getTime() / 1000);
      }

      // 调用后端 API - 通过代理转发
      const response = await api.get<BackendPageResult<BackendTransactionInfo>>('/merchant/transactions/list', {
        params: queryParams,
      });

      if (response.code === '0000') {
        // 转换数据格式
        const convertedItems = response.data.records.map(convertBackendToFrontend);
        
        return {
          code: '200',
          msg: response.msg || '获取成功',
          success: true,
          data: {
            items: convertedItems,
            total: response.data.total,
            page: response.data.current,
            pageSize: response.data.size,
            totalPages: response.data.count,
          },
        };
      } else {
        return {
          code: response.code,
          msg: response.msg || '获取失败',
          success: false,
          data: {
            items: [],
            total: 0,
            page: params.page,
            pageSize: params.pageSize,
            totalPages: 0,
          },
        };
      }
    } catch (error: any) {
      console.error('获取交易列表失败:', error);
      return {
        code: '500',
        msg: error.message || '网络错误',
        success: false,
        data: {
          items: [],
          total: 0,
          page: params.page,
          pageSize: params.pageSize,
          totalPages: 0,
        },
      };
    }
  },

  // 获取交易详情
  getTransactionDetail: async (trxID: string): Promise<ApiResponse<TransactionInfo>> => {
    try {
      const response = await api.get<BackendTransactionInfo>('/merchant/transactions/detail', {
        params: { trx_id: trxID },
      });

      if (response.code === '0000') {
        return {
          code: '200',
          msg: response.msg || '获取成功',
          success: true,
          data: convertBackendToFrontend(response.data),
        };
      } else {
        return {
          code: response.code,
          msg: response.msg || '获取失败',
          success: false,
          data: {} as TransactionInfo,
        };
      }
    } catch (error: any) {
      console.error('获取交易详情失败:', error);
      return {
        code: '500',
        msg: error.message || '网络错误',
        success: false,
        data: {} as TransactionInfo,
      };
    }
  },

  // 获取今日统计 - 暂时保留模拟数据，后续可根据需要实现专门的统计接口
  getTodayStats: async (trxType: TransactionType): Promise<ApiResponse<TodayStats>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: Record<TransactionType, TodayStats> = {
          [TransactionType.PAYIN]: {
            totalAmount: '1854500',
            totalCount: 156,
            successCount: 148,
            successRate: 94.8,
            pendingCount: 1
          },
          [TransactionType.PAYOUT]: {
            totalAmount: '956800',
            totalCount: 89,
            successCount: 84,
            successRate: 94.4,
            pendingCount: 2
          },
          [TransactionType.REFUND]: {
            totalAmount: '125600',
            totalCount: 23,
            successCount: 22,
            successRate: 95.7,
            pendingCount: 1
          }
        };

        resolve({
          code: '200',
          msg: '获取成功',
          success: true,
          data: stats[trxType]
        });
      }, 300);
    });
  },

  // 重试通知 - 如果后端有对应接口，可以修改为真实调用
  retryNotification: async (trxID: string): Promise<ApiResponse<null>> => {
    try {
      // 这里假设后端有重试通知的接口，需要根据实际情况调整
      // const response = await api.post('/transactions/retry-notification', { trx_id: trxID });
      
      // 暂时使用模拟响应
      console.log('Retrying notification for transaction:', trxID);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: '200',
            msg: '重试通知成功',
            success: true,
            data: null
          });
        }, 1000);
      });
    } catch (error: any) {
      console.error('重试通知失败:', error);
      return {
        code: '500',
        msg: error.message || '网络错误',
        success: false,
        data: null,
      };
    }
  },

  // 创建退款 - 如果后端有对应接口，可以修改为真实调用
  createRefund: async (params: {
    oriTrxID: string;
    amount: string;
    reason?: string;
  }): Promise<ApiResponse<TransactionInfo>> => {
    try {
      // 这里假设后端有创建退款的接口，需要根据实际情况调整
      // const response = await api.post('/transactions/refund', {
      //   ori_trx_id: params.oriTrxID,
      //   amount: params.amount,
      //   reason: params.reason,
      // });
      
      // 暂时使用模拟响应
      return new Promise((resolve) => {
        setTimeout(() => {
          const refund: TransactionInfo = {
            trxID: `REFUND${Date.now()}`,
            reqID: `REQ${Date.now()}`,
            oriTrxID: params.oriTrxID,
            status: TransactionStatus.PENDING,
            channelStatus: ChannelStatus.PENDING,
            resCode: '9999',
            resMsg: 'Pending',
            reason: params.reason,
            ccy: 'INR',
            amount: params.amount,
            usdAmount: (parseFloat(params.amount) * 0.012).toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            trxType: TransactionType.REFUND,
            trxMethod: 'UPI',
            country: 'IN'
          };

          resolve({
            code: '200',
            msg: '退款申请已提交',
            success: true,
            data: refund
          });
        }, 1000);
      });
    } catch (error: any) {
      console.error('创建退款失败:', error);
      return {
        code: '500',
        msg: error.message || '网络错误',
        success: false,
        data: {} as TransactionInfo,
      };
    }
  }
};
