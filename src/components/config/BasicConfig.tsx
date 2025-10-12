import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">公司名称</Label>
            <Input
              id="companyName"
              value={config.companyName}
              onChange={(e) => onConfigUpdate('companyName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessLicense">营业执照号</Label>
            <Input
              id="businessLicense"
              value={config.businessLicense}
              onChange={(e) => onConfigUpdate('businessLicense', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">联系人</Label>
            <Input
              id="contactName"
              value={config.contactName}
              onChange={(e) => onConfigUpdate('contactName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">联系电话</Label>
            <Input
              id="contactPhone"
              value={config.contactPhone}
              onChange={(e) => onConfigUpdate('contactPhone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">联系邮箱</Label>
            <Input
              id="contactEmail"
              type="email"
              value={config.contactEmail}
              onChange={(e) => onConfigUpdate('contactEmail', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessAddress">营业地址</Label>
          <Textarea
            id="businessAddress"
            value={config.businessAddress}
            onChange={(e) => onConfigUpdate('businessAddress', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
