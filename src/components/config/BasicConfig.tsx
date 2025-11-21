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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">名称</Label>
            <p className="text-base">{config.companyName || '-'}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">联系人</Label>
            <p className="text-base">{config.contactName || '-'}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">联系电话</Label>
            <p className="text-base">{config.contactPhone || '-'}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">联系邮箱</Label>
            <p className="text-base">{config.contactEmail || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
