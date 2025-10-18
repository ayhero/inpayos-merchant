// 状态常量和工具函数 - 与后端 protocol/const.go 保持一致

// 业务状态常量 - 与后端完全一致
export const STATUS = {
  // 基础状态
  ON: 'on',
  OFF: 'off',
  CREATED: 'created',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
  
  // 交易流程状态
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUBMITTED: 'submitted',
  CONFIRMING: 'confirming',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  COMPLETED: 'completed',
  
  // 审批状态
  APPROVED: 'approved',
  REJECTED: 'rejected',
  
  // 启用/禁用状态
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  
  // 在线状态
  ONLINE: 'online',
  OFFLINE: 'offline',
  BUSY: 'busy',
  LOCKED: 'locked'
} as const;

// 状态类型定义
export type StatusType = typeof STATUS[keyof typeof STATUS];

// 状态显示名称映射（中文）
export const STATUS_DISPLAY_NAMES: Record<StatusType, string> = {
  on: '开启',
  off: '关闭',
  created: '已创建',
  active: '激活',
  inactive: '未激活',
  suspended: '暂停',
  deleted: '已删除',
  pending: '待处理',
  processing: '处理中',
  submitted: '已提交',
  confirming: '确认中',
  success: '成功',
  failed: '失败',
  cancelled: '已取消',
  expired: '已过期',
  completed: '已完成',
  approved: '已批准',
  rejected: '已拒绝',
  enabled: '启用',
  disabled: '禁用',
  online: '在线',
  offline: '离线',
  busy: '忙碌',
  locked: '锁定'
};

// 状态颜色映射（用于Badge组件）
export const STATUS_COLORS: Record<StatusType, string> = {
  on: 'success',
  off: 'default',
  created: 'processing',
  active: 'success',
  inactive: 'default',
  suspended: 'warning',
  deleted: 'error',
  pending: 'processing',
  processing: 'processing',
  submitted: 'processing',
  confirming: 'processing',
  success: 'success',
  failed: 'error',
  cancelled: 'default',
  expired: 'warning',
  completed: 'success',
  approved: 'success',
  rejected: 'error',
  enabled: 'success',
  disabled: 'default',
  online: 'success',
  offline: 'default',
  busy: 'warning',
  locked: 'error'
};

// 获取状态显示名称
export const getStatusDisplayName = (status: string): string => {
  return STATUS_DISPLAY_NAMES[status as StatusType] || status;
};

// 获取状态颜色
export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as StatusType] || 'default';
};

// 检查状态是否为成功状态
export const isSuccessStatus = (status: string): boolean => {
  const successStatuses = [STATUS.SUCCESS, STATUS.COMPLETED, STATUS.APPROVED, STATUS.ACTIVE, STATUS.ENABLED, STATUS.ON];
  return successStatuses.includes(status as any);
};

// 检查状态是否为失败状态
export const isFailureStatus = (status: string): boolean => {
  const failureStatuses = [STATUS.FAILED, STATUS.REJECTED, STATUS.CANCELLED, STATUS.EXPIRED, STATUS.DELETED];
  return failureStatuses.includes(status as any);
};

// 检查状态是否为处理中状态
export const isProcessingStatus = (status: string): boolean => {
  const processingStatuses = [STATUS.PENDING, STATUS.PROCESSING, STATUS.SUBMITTED, STATUS.CONFIRMING, STATUS.CREATED];
  return processingStatuses.includes(status as any);
};

// 交易状态分组
export const TRANSACTION_STATUS_GROUPS = {
  PROCESSING: [STATUS.PENDING, STATUS.PROCESSING, STATUS.SUBMITTED, STATUS.CONFIRMING, STATUS.CREATED],
  SUCCESS: [STATUS.SUCCESS, STATUS.COMPLETED, STATUS.APPROVED],
  FAILED: [STATUS.FAILED, STATUS.REJECTED, STATUS.CANCELLED, STATUS.EXPIRED],
  INACTIVE: [STATUS.INACTIVE, STATUS.SUSPENDED, STATUS.DELETED, STATUS.DISABLED, STATUS.OFF]
};

// 获取状态分组
export const getStatusGroup = (status: string): keyof typeof TRANSACTION_STATUS_GROUPS | 'UNKNOWN' => {
  for (const [group, statuses] of Object.entries(TRANSACTION_STATUS_GROUPS)) {
    if ((statuses as string[]).includes(status)) {
      return group as keyof typeof TRANSACTION_STATUS_GROUPS;
    }
  }
  return 'UNKNOWN';
};