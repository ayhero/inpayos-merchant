import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getStatusText, getStatusVariant } from './configHelpers';
import { PaymentMethodConfig } from './merchantConstants';
import { Lock, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PaymentMethodCardProps {
  name: string;
  description: string;
  config: PaymentMethodConfig;
  onToggle?: (enabled: boolean) => void;
  showApplyButton?: boolean;
  onApply?: () => void;
  readonly?: boolean;
}

export function PaymentMethodCard({
  name,
  description,
  config,
  onToggle,
  showApplyButton = false,
  onApply,
  readonly = false
}: PaymentMethodCardProps) {
  const isActive = config.status === 'active';
  const isPending = config.status === 'pending';
  const isInactive = config.status === 'inactive';

  // 根据状态设置不同的背景色和边框色
  const getCardStyle = () => {
    if (isActive) {
      return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30';
    } else if (isPending) {
      return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800/30';
    } else {
      return 'bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800/30';
    }
  };

  const getStatusIcon = () => {
    if (isActive) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (isPending) {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${getCardStyle()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {readonly && isActive ? (
              <Lock className="h-4 w-4 text-green-600" />
            ) : (
              <Switch
                checked={config.enabled && isActive}
                onCheckedChange={onToggle}
                disabled={readonly || isPending || !isActive}
              />
            )}
          </div>
          <div>
            <Label className={`${isActive ? 'text-green-900 dark:text-green-100' : 
                              isPending ? 'text-yellow-900 dark:text-yellow-100' : 
                              'text-gray-600 dark:text-gray-400'}`}>
              {name}
            </Label>
            <p className={`text-sm ${isActive ? 'text-green-700 dark:text-green-300' : 
                                  isPending ? 'text-yellow-700 dark:text-yellow-300' : 
                                  'text-gray-500 dark:text-gray-500'}`}>
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(config.status)}>
            {getStatusText(config.status)}
          </Badge>
          {isActive && (
            <span className="text-sm text-green-700 dark:text-green-300">
              费率: {config.feeRate}%
            </span>
          )}
          {showApplyButton && isInactive && (
            <Button variant="outline" size="sm" onClick={onApply} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              申请开通
            </Button>
          )}
          {isPending && (
            <Button variant="outline" size="sm" disabled className="gap-2">
              <Clock className="h-4 w-4" />
              审核中
            </Button>
          )}
        </div>
      </div>
      
      {readonly && isActive && (
        <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 rounded text-sm">
          <p className="text-green-800 dark:text-green-200">
            该支付方式已开通并正常运行，配置信息由平台管理。
          </p>
        </div>
      )}
    </div>
  );
}