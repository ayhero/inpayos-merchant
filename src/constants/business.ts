import { trxTypeMap, formatTrxType as utilFormatTrxType } from '../utils/trxTypeMapping';
import { trxMethodMap, formatTrxMethod as utilFormatTrxMethod } from '../utils/trxMethodMapping';
import { currencyMap, formatCurrency as utilFormatCurrency } from '../utils/currencyMapping';

// 交易类型映射 - 使用统一的mapping工具
export const TRX_TYPE_MAP = trxTypeMap;

// 交易类型选项（用于下拉框）
export const TRX_TYPE_OPTIONS = Object.entries(TRX_TYPE_MAP).map(([value, label]) => ({
  value,
  label,
}));

// 商户交易类型选项
export const MERCHANT_TRX_TYPE_OPTIONS = [
  { value: 'payin', label: TRX_TYPE_MAP['payin'] },
  { value: 'payout', label: TRX_TYPE_MAP['payout'] },
];

// 交易方法映射（支付方式） - 使用统一的mapping工具
export const TRX_METHOD_MAP = trxMethodMap;

// 支付方式选项
export const TRX_METHOD_OPTIONS = [
  { value: 'all', label: '全部' },
  ...Object.entries(TRX_METHOD_MAP).map(([value, label]) => ({
    value,
    label,
  }))
];

// 货币映射 - 使用统一的mapping工具
export const CCY_MAP = currencyMap;

// 货币选项（带货币符号）
export const CCY_OPTIONS = [
  { value: 'all', label: '全部' },
  ...Object.entries(CCY_MAP).map(([value, label]) => ({
    value,
    label: `${label} (${value})`,
  }))
];

// 状态映射
export const STATUS_MAP: { [key: string]: string } = {
  'active': '启用',
  'inactive': '禁用',
  'pending': '待处理',
  'success': '成功',
  'failed': '失败',
  'cancelled': '已取消',
  'processing': '处理中',
  'completed': '已完成',
};

// 状态选项（用于下拉框）
export const STATUS_OPTIONS = [
  { value: 'active', label: '启用' },
  { value: 'inactive', label: '禁用' },
];

// 交易状态选项
export const TRANSACTION_STATUS_OPTIONS = [
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'success', label: '成功' },
  { value: 'failed', label: '失败' },
  { value: 'cancelled', label: '已取消' },
];

// 获取交易类型显示名称
export const getTrxTypeLabel = utilFormatTrxType;

// 获取状态显示名称
export const getStatusLabel = (status?: string): string => {
  if (!status) return '-';
  return STATUS_MAP[status] || status;
};

// 获取交易方法显示名称
export const getTrxMethodLabel = utilFormatTrxMethod;

// 获取货币显示名称
export const getCcyLabel = (ccy?: string): string => {
  if (!ccy) return '-';
  return utilFormatCurrency(ccy);
};