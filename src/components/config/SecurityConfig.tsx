import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Key, Smartphone, RotateCcw, Save } from 'lucide-react';
import { MerchantConfigState } from './merchantConstants';

interface SecurityConfigProps {
  config: MerchantConfigState;
  onConfigUpdate: (key: keyof MerchantConfigState, value: any) => void;
  googleAuthEnabled?: boolean;
  loading?: boolean;
  isSendingCode?: boolean;
  onGetG2FAKey?: () => void;
  onStartRebind?: () => void;
  onSaveIpWhitelist?: () => void;
}

export const SecurityConfig: React.FC<SecurityConfigProps> = ({
  config,
  onConfigUpdate,
  googleAuthEnabled = false,
  loading = false,
  isSendingCode = false,
  onGetG2FAKey,
  onStartRebind,
  onSaveIpWhitelist
}) => {
  const handleIpWhitelistChange = (value: string) => {
    if (Array.isArray(config.ipWhitelist)) {
      onConfigUpdate('ipWhitelist', value.split(',').map(ip => ip.trim()).filter(ip => ip));
    } else {
      onConfigUpdate('ipWhitelist', value);
    }
  };

  const getIpWhitelistValue = () => {
    if (Array.isArray(config.ipWhitelist)) {
      return config.ipWhitelist.join(',');
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
        {/* IP白名单配置 - 单独一行 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="ipWhitelist">IP白名单</Label>
            <p className="text-sm text-gray-500">
              为空表示不限制IP访问
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="ipWhitelist"
              value={getIpWhitelistValue()}
              onChange={(e) => handleIpWhitelistChange(e.target.value)}
              placeholder="多个IP用逗号分隔，如：192.168.1.1,192.168.1.0/24"
              className="w-80 h-10"
            />
            <Button 
              className="gap-2 shrink-0 h-10"
              disabled={loading}
              onClick={onSaveIpWhitelist}
            >
              <Save className="h-4 w-4" />
              保存IP白名单
            </Button>
          </div>
        </div>
        
        {/* Google验证配置 - 与IP白名单高度对齐 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-base">Google Authenticator</Label>
            <p className="text-sm text-gray-500">
              启用两步验证以增强账户安全性
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            
            {!googleAuthEnabled ? (
              <Button 
                variant="outline" 
                className="gap-2 shrink-0"
                onClick={onGetG2FAKey}
                disabled={loading}
              >
                <Smartphone className="h-4 w-4" />
                {loading ? '获取中...' : '开通 Google Authenticator'}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="gap-2 shrink-0"
                onClick={onStartRebind}
                disabled={isSendingCode}
              >
                <RotateCcw className="h-4 w-4" />
                {isSendingCode ? '处理中...' : '重新绑定'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
