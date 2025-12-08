import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
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
    <>
      {/* IP白名单 */}
      <Card>
        <CardHeader>
          <CardTitle>IP白名单</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              允许访问API的IP地址，多个IP用逗号分隔，留空表示不限制。
            </p>
            <div className="flex items-center gap-2">
              <Textarea
                id="ipWhitelist"
                value={getIpWhitelistValue()}
                onChange={(e) => handleIpWhitelistChange(e.target.value)}
                placeholder="192.168.1.1,192.168.1.0/24"
                className="max-w-2xl h-20 resize-none"
              />
              <Button 
                className="shrink-0 h-10"
                disabled={loading}
                onClick={onSaveIpWhitelist}
              >
                保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Authenticator */}
      <Card>
        <CardHeader>
          <CardTitle>Google Authenticator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              用于二次验证的Google Authenticator密钥，请妥善保管。
            </p>
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
    </>
  );
};
