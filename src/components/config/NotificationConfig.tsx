import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Bell } from 'lucide-react';
import { MerchantConfigState } from './merchantConstants';

interface NotificationConfigProps {
  config: MerchantConfigState;
  onConfigUpdate: (key: keyof MerchantConfigState, value: any) => void;
}

export function NotificationConfig({ config, onConfigUpdate }: NotificationConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          通知设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.enableEmailNotification}
              onCheckedChange={(checked) => onConfigUpdate('enableEmailNotification', checked)}
            />
            <Label>邮件通知</Label>
          </div>
          {config.enableEmailNotification && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="emailRecipients">邮件接收地址</Label>
              <Input
                id="emailRecipients"
                value={config.emailRecipients}
                onChange={(e) => onConfigUpdate('emailRecipients', e.target.value)}
                placeholder="多个邮箱用逗号分隔"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.enableSmsNotification}
              onCheckedChange={(checked) => onConfigUpdate('enableSmsNotification', checked)}
            />
            <Label>短信通知</Label>
          </div>
          {config.enableSmsNotification && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="smsRecipients">短信接收号码</Label>
              <Input
                id="smsRecipients"
                value={config.smsRecipients}
                onChange={(e) => onConfigUpdate('smsRecipients', e.target.value)}
                placeholder="多个号码用逗号分隔"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
