import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ArrowUpRight } from 'lucide-react';
import { MerchantConfigState, PAYMENT_METHOD_INFO } from './merchantConstants';

interface PayoutConfigProps {
  config: MerchantConfigState;
  onNestedUpdate: (section: keyof MerchantConfigState, key: string, value: any) => void;
  onApplyPaymentMethod: (section: 'collection' | 'payout', method: string) => void;
}

export function PayoutConfig({ config, onNestedUpdate, onApplyPaymentMethod }: PayoutConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5" />
          代付配置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-4">
            {/* UPI */}
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">UPI</Badge>
                  <span className="text-sm text-green-700 dark:text-green-300">已开通</span>
                  <Switch
                    checked={config.payoutMethods.upi.enabled}
                    onCheckedChange={(enabled) => 
                      onNestedUpdate('payoutMethods', 'upi', { ...config.payoutMethods.upi, enabled })
                    }
                    disabled={config.payoutMethods.upi.status !== 'active'}
                  />
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">{PAYMENT_METHOD_INFO.payout.upi.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">费率</Label>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">{config.payoutMethods.upi.feeRate}%</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">最小金额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹100</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">最大金额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹500,000</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">日限额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹5,000,000</p>
                </div>
              </div>
            </div>
            
            {/* 银行转账 */}
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">银行转账</Badge>
                  <span className="text-sm text-green-700 dark:text-green-300">已开通</span>
                  <Switch
                    checked={config.payoutMethods.bankTransfer.enabled}
                    onCheckedChange={(enabled) => 
                      onNestedUpdate('payoutMethods', 'bankTransfer', { ...config.payoutMethods.bankTransfer, enabled })
                    }
                    disabled={config.payoutMethods.bankTransfer.status !== 'active'}
                  />
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">{PAYMENT_METHOD_INFO.payout.bankTransfer.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">费率</Label>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">{config.payoutMethods.bankTransfer.feeRate}%</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">最小金额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹100</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">最大金额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹500,000</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">日限额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹5,000,000</p>
                </div>
              </div>
            </div>
            
            {/* USDT */}
            <div className="p-4 bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">USDT</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">未开通</span>
                  <Switch
                    checked={config.payoutMethods.usdt.enabled}
                    onCheckedChange={(enabled) => 
                      onNestedUpdate('payoutMethods', 'usdt', { ...config.payoutMethods.usdt, enabled })
                    }
                    disabled={config.payoutMethods.usdt.status !== 'active'}
                  />
                </div>
                {config.payoutMethods.usdt.status === 'inactive' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyPaymentMethod('payout', 'usdt')}
                  >
                    申请开通
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{PAYMENT_METHOD_INFO.payout.usdt.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">费率</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{config.payoutMethods.usdt.feeRate}%</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">最小金额</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-500">10 USDT</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">最大金额</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-500">30,000 USDT</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">日限额</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-500">50,000 USDT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
