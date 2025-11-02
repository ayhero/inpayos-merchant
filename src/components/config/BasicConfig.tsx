import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Globe } from 'lucide-react';
import { MerchantConfigState } from './merchantConstants';

interface BasicConfigProps {
  config: MerchantConfigState;
  onConfigUpdate: (key: keyof MerchantConfigState, value: any) => void;
}

export function BasicConfig({ config, onConfigUpdate }: BasicConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          商户基本信息
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl">
          <div className="space-y-1">
            <Label htmlFor="companyName">名称</Label>
            <Input
              id="companyName"
              value={config.companyName}
              disabled
              readOnly
              className="w-80 bg-gray-50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactName">联系人</Label>
            <Input
              id="contactName"
              value={config.contactName}
              disabled
              readOnly
              className="w-80 bg-gray-50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactPhone">联系电话</Label>
            <Input
              id="contactPhone"
              value={config.contactPhone}
              disabled
              readOnly
              className="w-80 bg-gray-50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactEmail">联系邮箱</Label>
            <Input
              id="contactEmail"
              type="email"
              value={config.contactEmail}
              disabled
              readOnly
              className="w-80 bg-gray-50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
