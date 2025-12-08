import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Key, Eye, EyeOff, Save, Copy, CheckCircle2 } from 'lucide-react';
import { MerchantConfigState } from './merchantConstants';
import { toast } from '../../utils/toast';

interface ApiConfigProps {
  config: MerchantConfigState;
  onConfigUpdate: (key: keyof MerchantConfigState, value: any) => void;
  showApiKey: boolean;
  onToggleApiKey: () => void;
  onSaveWebhook?: () => void;
  loading?: boolean;
}

export function ApiConfig({ config, onConfigUpdate, onSaveWebhook, loading = false }: ApiConfigProps) {
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
  const [copiedKey, setCopiedKey] = useState<number | null>(null);

  const toggleKeyVisibility = (id: number) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (secretKey: string, id: number) => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopiedKey(id);
      toast.success("复制成功", "API密钥已复制到剪贴板");
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      toast.error("复制失败", "请手动复制");
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  return (
    <>
      {/* 密钥 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            密钥
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.secrets && config.secrets.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 min-w-[180px]">App ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 min-w-[300px]">密钥</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-24">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-28">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {config.secrets.map((secret) => (
                    <tr key={secret.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{secret.app_id}</td>
                      <td className="px-4 py-3">
                        <div className="relative max-w-xs">
                          <Input
                            type={visibleKeys.has(secret.id) ? "text" : "password"}
                            value={secret.secret_key}
                            disabled
                            readOnly
                            className="w-full bg-gray-50 pr-20 font-mono text-xs h-8"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={secret.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {secret.status === 'active' ? '启用' : '禁用'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 hover:bg-gray-100"
                            onClick={() => toggleKeyVisibility(secret.id)}
                          >
                            {visibleKeys.has(secret.id) ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 hover:bg-gray-100"
                            onClick={() => copyToClipboard(secret.secret_key, secret.id)}
                          >
                            {copiedKey === secret.id ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              暂无API密钥
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="webhookUrl"
                value={config.webhookUrl}
                onChange={(e) => onConfigUpdate('webhookUrl', e.target.value)}
                placeholder="https://your-domain.com/webhook"
                className="max-w-2xl h-10"
              />
              <Button 
                className="shrink-0 h-10"
                disabled={loading}
                onClick={onSaveWebhook}
              >
                保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
