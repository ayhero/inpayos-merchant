import { Badge } from './ui/badge';
import { getStatusDisplayName, getStatusColor } from '../constants/status';
import { Contract } from '../services/contractService';

interface ContractDetailProps {
  contract: Contract;
}

export function ContractDetail({ contract }: ContractDetailProps) {
  // 渲染状态开关 - 简化版
  const renderStatusSwitch = (status: string) => {
    const isActive = status === 'active';
    return (
      <div className="flex items-center gap-2">
        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isActive ? 'bg-green-500' : 'bg-gray-300'
        }`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </div>
        <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
          {isActive ? '激活' : '禁用'}
        </span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const displayName = getStatusDisplayName(status);
    const color = getStatusColor(status);
    
    const getVariantAndClass = (color: string) => {
      switch (color) {
        case 'success':
          return { variant: 'default' as const, className: 'bg-green-500' };
        case 'error':
          return { variant: 'destructive' as const, className: '' };
        case 'warning':
          return { variant: 'secondary' as const, className: 'bg-yellow-500' };
        case 'info':
          return { variant: 'secondary' as const, className: 'bg-blue-500' };
        default:
          return { variant: 'secondary' as const, className: 'bg-gray-500' };
      }
    };
    
    const { variant, className } = getVariantAndClass(color);
    return <Badge variant={variant} className={className}>{displayName}</Badge>;
  };

  const formatDateTime = (timestamp: number) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto">
      {/* 基本信息 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">合约ID</label>
          <p className="mt-1 font-mono text-sm">{contract.contract_id}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">状态</label>
          <p className="mt-1">{getStatusBadge(contract.status)}</p>
        </div>
        <div></div>
        <div>
          <label className="text-sm font-medium text-gray-500">生效时间</label>
          <p className="mt-1 text-sm">{formatDateTime(contract.start_at)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">过期时间</label>
          <p className="mt-1 text-sm">{contract.expired_at ? formatDateTime(contract.expired_at) : '永久有效'}</p>
        </div>
        <div></div>
        <div>
          <label className="text-sm font-medium text-gray-500">创建时间</label>
          <p className="mt-1 text-sm">{formatDateTime(contract.created_at)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">更新时间</label>
          <p className="mt-1 text-sm">{formatDateTime(contract.updated_at)}</p>
        </div>
        <div></div>
      </div>
      
      {/* 代收配置 */}
      {contract.payin && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">代收配置</h3>
            {renderStatusSwitch(contract.payin.status)}
          </div>
          
          {/* 交易配置列表 */}
          {contract.payin.configs && contract.payin.configs.length > 0 && (
            <div className="mb-4">
              <div className="space-y-2">
                {contract.payin.configs.map((config: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded text-sm space-y-1">
                    {config.pkg && <div><span className="text-gray-600">业务包:</span> <span className="font-medium">{config.pkg}</span></div>}
                    {config.trx_method && <div><span className="text-gray-600">支付方式:</span> <span className="font-medium">{config.trx_method}</span></div>}
                    {config.trx_ccy && <div><span className="text-gray-600">币种:</span> <span className="font-medium">{config.trx_ccy}</span></div>}
                    {config.country && <div><span className="text-gray-600">国家:</span> <span className="font-medium">{config.country}</span></div>}
                    {!!(config.min_amount || config.max_amount) && (
                      <div>
                        <span className="text-gray-600">金额范围:</span>{' '}
                        <span className="font-medium">
                          {config.min_amount ? `${config.min_amount}` : '不限'} ~ {config.max_amount ? `${config.max_amount}` : '不限'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 结算配置列表 */}
          {contract.payin.settle && contract.payin.settle.length > 0 && (
            <div>
              {contract.payin.settle.map((settle: any, settleIndex: number) => (
                <div key={settleIndex} className="mb-4 border border-blue-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-600">结算类型:</span>
                      <span className="font-medium">{settle.type}</span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {settle.pkg && <div><span className="text-gray-600">业务包:</span> <span className="font-medium">{settle.pkg}</span></div>}
                      {settle.trx_method && <div><span className="text-gray-600">支付方式:</span> <span className="font-medium">{settle.trx_method}</span></div>}
                      {settle.trx_ccy && <div><span className="text-gray-600">币种:</span> <span className="font-medium">{settle.trx_ccy}</span></div>}
                      {settle.country && <div><span className="text-gray-600">国家:</span> <span className="font-medium">{settle.country}</span></div>}
                    </div>
                    {!!(settle.min_amount || settle.max_amount) && (
                      <div className="mt-1">
                        <span className="text-gray-600">金额范围:</span>{' '}
                        <span className="font-medium">
                          {settle.min_amount ? `${settle.min_amount}` : '不限'} ~ {settle.max_amount ? `${settle.max_amount}` : '不限'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 代付配置 */}
      {contract.payout && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">代付配置</h3>
            {renderStatusSwitch(contract.payout.status)}
          </div>
          
          {/* 交易配置列表 */}
          {contract.payout.configs && contract.payout.configs.length > 0 && (
            <div className="mb-4">
              <div className="space-y-2">
                {contract.payout.configs.map((config: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded text-sm space-y-1">
                    {config.pkg && <div><span className="text-gray-600">业务包:</span> <span className="font-medium">{config.pkg}</span></div>}
                    {config.trx_method && <div><span className="text-gray-600">支付方式:</span> <span className="font-medium">{config.trx_method}</span></div>}
                    {config.trx_ccy && <div><span className="text-gray-600">币种:</span> <span className="font-medium">{config.trx_ccy}</span></div>}
                    {config.country && <div><span className="text-gray-600">国家:</span> <span className="font-medium">{config.country}</span></div>}
                    {!!(config.min_amount || config.max_amount) && (
                      <div>
                        <span className="text-gray-600">金额范围:</span>{' '}
                        <span className="font-medium">
                          {config.min_amount ? `${config.min_amount}` : '不限'} ~ {config.max_amount ? `${config.max_amount}` : '不限'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 结算配置列表 */}
          {contract.payout.settle && contract.payout.settle.length > 0 && (
            <div>
              {contract.payout.settle.map((settle: any, settleIndex: number) => (
                <div key={settleIndex} className="mb-4 border border-blue-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-600">结算类型:</span>
                      <span className="font-medium">{settle.type}</span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {settle.pkg && <div><span className="text-gray-600">业务包:</span> <span className="font-medium">{settle.pkg}</span></div>}
                      {settle.trx_method && <div><span className="text-gray-600">支付方式:</span> <span className="font-medium">{settle.trx_method}</span></div>}
                      {settle.trx_ccy && <div><span className="text-gray-600">币种:</span> <span className="font-medium">{settle.trx_ccy}</span></div>}
                      {settle.country && <div><span className="text-gray-600">国家:</span> <span className="font-medium">{settle.country}</span></div>}
                    </div>
                    {!!(settle.min_amount || settle.max_amount) && (
                      <div className="mt-1">
                        <span className="text-gray-600">金额范围:</span>{' '}
                        <span className="font-medium">
                          {settle.min_amount ? `${settle.min_amount}` : '不限'} ~ {settle.max_amount ? `${settle.max_amount}` : '不限'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}