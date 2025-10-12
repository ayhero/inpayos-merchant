import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Key, Smartphone, RotateCcw } from 'lucide-react';
import { MerchantConfigState } from './merchantConstants';

interface SecurityConfigProps {
  config: MerchantConfigState;
  onConfigUpdate: (key: keyof MerchantConfigState, value: any) => void;
  googleAuthEnabled?: boolean;
  loading?: boolean;
  isSendingCode?: boolean;
  onGetG2FAKey?: () => void;
  onStartRebind?: () => void;
}

export const SecurityConfig: React.FC<SecurityConfigProps> = ({
  config,
  onConfigUpdate,
  googleAuthEnabled = false,
  loading = false,
  isSendingCode = false,
  onGetG2FAKey,
  onStartRebind
}) => {
  const handleIpWhitelistChange = (value: string) => {
    if (Array.isArray(config.ipWhitelist)) {
      onConfigUpdate('ipWhitelist', value.split('\n').filter(ip => ip.trim()));
    } else {
      onConfigUpdate('ipWhitelist', value);
    }
  };

  const getIpWhitelistValue = () => {
    if (Array.isArray(config.ipWhitelist)) {
      return config.ipWhitelist.join('\n');
    }
    return config.ipWhitelist || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          安全配置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ipWhitelist">IP白名单</Label>
            <Textarea
              id="ipWhitelist"
              value={getIpWhitelistValue()}
              onChange={(e) => handleIpWhitelistChange(e.target.value)}
              placeholder="每行一个IP地址或IP段，如：192.168.1.1 或 192.168.1.0/24"
              rows={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              为空表示不限制IP访问
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Google Authenticator</Label>
                <p className="text-sm text-gray-500">
                  启用两步验证以增强账户安全性
                </p>
              </div>
              <div className="flex items-center gap-2">
                {googleAuthEnabled ? (
                  <Badge variant="default" className="gap-1">
                    <Smartphone className="h-3 w-3" />
                    已启用
                  </Badge>
                ) : (
                  <Badge variant="outline">未启用</Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {!googleAuthEnabled ? (
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={onGetG2FAKey}
                  disabled={loading}
                >
                  <Smartphone className="h-4 w-4" />
                  {loading ? '获取中...' : '开通 Google Authenticator'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={onStartRebind}
                    disabled={isSendingCode}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {isSendingCode ? '处理中...' : '重新绑定'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
