import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Key, Eye, EyeOff } from 'lucide-react';
import { MerchantConfigState } from './merchantConstants';

interface ApiConfigProps {
  config: MerchantConfigState;
  onConfigUpdate: (key: keyof MerchantConfigState, value: any) => void;
  showApiKey: boolean;
  onToggleApiKey: () => void;
}

export function ApiConfig({ config, onConfigUpdate, showApiKey, onToggleApiKey }: ApiConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API配置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            请妥善保管您的API密钥，不要在公开场合泄露。
          </AlertDescription>
        </Alert>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API密钥</Label>
            <div className="relative max-w-md">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={config.apiKey}
                onChange={(e) => onConfigUpdate('apiKey', e.target.value)}
                className="w-full"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={onToggleApiKey}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook回调地址</Label>
            <div className="max-w-md">
              <Input
                id="webhookUrl"
                value={config.webhookUrl}
                onChange={(e) => onConfigUpdate('webhookUrl', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
