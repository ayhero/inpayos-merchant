import { Badge } from './ui/badge';
import { CurrencyDisplay } from '../utils/currencyMapping';
import { getAccountStatusBadgeConfig } from '../constants/status';
import { AccountData } from '../services/accountService';

// 账户详情组件的Props类型
interface AccountDetailProps {
  account: AccountData;
  formatDateTime: (timestamp?: number) => string;
  formatAmount: (amount?: string) => string;
}

export function AccountDetail({ account, formatDateTime, formatAmount }: AccountDetailProps) {
  if (!account) {
    return null;
  }

  // 获取状态Badge配置
  const statusConfig = getAccountStatusBadgeConfig(account.status);
  const statusBadge = (
    <Badge variant={statusConfig.variant} className={statusConfig.className}>
      {statusConfig.label}
    </Badge>
  );

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto">
      {/* 基本信息 */}
      <div className="space-y-4">
        {/* 第一行：币种、状态 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">币种</label>
            <p className="mt-1 text-sm">{CurrencyDisplay(account.ccy)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">状态</label>
            <p className="mt-1">{statusBadge}</p>
          </div>
          <div></div>
        </div>
        
        {/* 第二行：创建时间、更新时间 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">创建时间</label>
            <p className="mt-1 text-sm">{formatDateTime(account.created_at)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">更新时间</label>
            <p className="mt-1 text-sm">{formatDateTime(account.updated_at)}</p>
          </div>
          <div></div>
        </div>
      </div>
      
      {/* 实时余额 */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">实时余额</h3>
          {account.balance?.updated_at && (
            <span className="text-sm text-gray-500">
              更新于 {formatDateTime(account.balance.updated_at)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* 基础余额字段 */}
          <div>
            <label className="text-sm font-medium text-gray-500">总余额</label>
            <p className="mt-1 font-mono text-lg font-semibold">{formatAmount(account.balance?.balance)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">可用余额</label>
            <p className="mt-1 font-mono text-lg font-semibold text-green-600">{formatAmount(account.balance?.available_balance)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">冻结余额</label>
            <p className="mt-1 font-mono text-lg font-semibold text-red-600">{formatAmount(account.balance?.frozen_balance)}</p>
          </div>
          
          {/* 保证金字段 - 所有账户类型都显示 */}
          <div>
            <label className="text-sm font-medium text-gray-500">保证金</label>
            <p className="mt-1 font-mono text-lg font-semibold">{formatAmount(account.balance?.margin_balance)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">可用保证金</label>
            <p className="mt-1 font-mono text-lg font-semibold text-green-600">{formatAmount(account.balance?.available_margin_balance)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">冻结保证金</label>
            <p className="mt-1 font-mono text-lg font-semibold text-red-600">{formatAmount(account.balance?.frozen_margin_balance)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}