import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ArrowDownLeft } from 'lucide-react';
import { MerchantConfigState, PAYMENT_METHOD_INFO } from './merchantConstants';

interface CollectionConfigProps {
  config: MerchantConfigState;
  onNestedUpdate: (section: keyof MerchantConfigState, key: string, value: any) => void;
  onApplyPaymentMethod: (section: 'collection' | 'payout', method: string) => void;
}

export function CollectionConfig({ config, onNestedUpdate, onApplyPaymentMethod }: CollectionConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownLeft className="h-5 w-5" />
          代收配置
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
                    checked={config.collectionMethods.upi.enabled}
                    onCheckedChange={(enabled) => 
                      onNestedUpdate('collectionMethods', 'upi', { ...config.collectionMethods.upi, enabled })
                    }
                    disabled={config.collectionMethods.upi.status !== 'active'}
                  />
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">{PAYMENT_METHOD_INFO.collection.upi.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">费率</Label>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">{config.collectionMethods.upi.feeRate}%</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">最小金额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹100</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">最大金额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹1,000,000</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">日限额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹10,000,000</p>
                </div>
              </div>
            </div>
            
            {/* 银行卡 */}
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">银行卡</Badge>
                  <span className="text-sm text-green-700 dark:text-green-300">已开通</span>
                  <Switch
                    checked={config.collectionMethods.bankCard.enabled}
                    onCheckedChange={(enabled) => 
                      onNestedUpdate('collectionMethods', 'bankCard', { ...config.collectionMethods.bankCard, enabled })
                    }
                    disabled={config.collectionMethods.bankCard.status !== 'active'}
                  />
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">{PAYMENT_METHOD_INFO.collection.bankCard.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">费率</Label>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">{config.collectionMethods.bankCard.feeRate}%</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">最小金额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹100</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">最大金额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹1,000,000</p>
                </div>
                <div>
                  <Label className="text-sm text-green-800 dark:text-green-200">日限额</Label>
                  <p className="text-sm text-green-700 dark:text-green-300">₹10,000,000</p>
                </div>
              </div>
            </div>
            
            {/* USDT */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">USDT</Badge>
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">申请中</span>
                  <Switch
                    checked={config.collectionMethods.usdt.enabled}
                    onCheckedChange={(enabled) => 
                      onNestedUpdate('collectionMethods', 'usdt', { ...config.collectionMethods.usdt, enabled })
                    }
                    disabled={config.collectionMethods.usdt.status !== 'active'}
                  />
                </div>
                {config.collectionMethods.usdt.status === 'inactive' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyPaymentMethod('collection', 'usdt')}
                  >
                    申请开通
                  </Button>
                )}
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">{PAYMENT_METHOD_INFO.collection.usdt.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-yellow-800 dark:text-yellow-200">费率</Label>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">{config.collectionMethods.usdt.feeRate}%</p>
                </div>
                <div>
                  <Label className="text-sm text-yellow-800 dark:text-yellow-200">最小金额</Label>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">10 USDT</p>
                </div>
                <div>
                  <Label className="text-sm text-yellow-800 dark:text-yellow-200">最大金额</Label>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">50,000 USDT</p>
                </div>
                <div>
                  <Label className="text-sm text-yellow-800 dark:text-yellow-200">日限额</Label>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">100,000 USDT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
