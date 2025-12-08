import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { RefreshCw } from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { G2FAService, G2FAKeyResponse } from '../services/g2faService';
import { UserService } from '../services/userService';
import { VerifyCodeService } from '../services/verifyCodeService';
import { toast } from '../utils/toast';
import { api } from '../services/api';

import { DEFAULT_CONFIG, MerchantConfigState } from './config/merchantConstants';
import { updateConfig } from './config/configHelpers';
// import { BasicConfig } from './config/BasicConfig';  // 商户基本信息模块已注释
import { ApiConfig } from './config/ApiConfig';
import { SecurityConfig } from './config/SecurityConfig';

export function MerchantConfig() {
  const [config, setConfig] = useState<MerchantConfigState>(DEFAULT_CONFIG);
  const [showGoogleAuthDialog, setShowGoogleAuthDialog] = useState(false);
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // G2FA 相关状态
  const [g2faData, setG2faData] = useState<G2FAKeyResponse | null>(null);
  const [g2faCode, setG2faCode] = useState('');
  const [isBindingG2FA, setIsBindingG2FA] = useState(false);
  
  // 重新绑定G2FA相关状态
  const [userEmail, setUserEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isRebinding, setIsRebinding] = useState(false);

  // 保存 Webhook URL
  const handleSaveWebhook = async () => {
    try {
      setLoading(true);
      const response = await api.post('/save', {
        notify_url: config.webhookUrl
      });
      
      if (response.code === '0000') {
        toast.success("保存成功", "Webhook URL已更新");
      } else {
        toast.error("保存失败", response.msg || "保存Webhook URL失败");
      }
    } catch (error) {
      console.error('保存Webhook URL失败:', error);
      toast.error("保存失败", "网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 保存 IP 白名单
  const handleSaveIpWhitelist = async () => {
    try {
      setLoading(true);
      
      // 将 IP 白名单数组转换为逗号分隔的字符串
      const ipWhitelistStr = Array.isArray(config.ipWhitelist) 
        ? config.ipWhitelist.join(',') 
        : config.ipWhitelist;
      
      const response = await api.post('/save', {
        white_list_ip: ipWhitelistStr
      });
      
      if (response.code === '0000') {
        toast.success("保存成功", "IP白名单已更新");
      } else {
        toast.error("保存失败", response.msg || "保存IP白名单失败");
      }
    } catch (error) {
      console.error('保存IP白名单失败:', error);
      toast.error("保存失败", "网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = (key: keyof MerchantConfigState, value: any) => {
    setConfig(prev => updateConfig(prev, key, value));
  };

  // 加载用户信息和 G2FA 状态
  const loadUserInfo = async () => {
    try {
      const response = await UserService.getUserInfo();
      if (response.code === '0000') {
        setGoogleAuthEnabled(response.data.has_g2fa);
        setUserEmail(response.data.email);
        
        // 设置商户信息
        setConfig(prev => ({
          ...prev,
          companyName: response.data.name || prev.companyName,
          contactEmail: response.data.email || prev.contactEmail,
          contactPhone: response.data.phone || prev.contactPhone,
          // 将后端返回的逗号分隔字符串转换为数组
          ipWhitelist: response.data.white_list_ip 
            ? response.data.white_list_ip.split(',').map(ip => ip.trim()).filter(ip => ip)
            : [],
          // 设置webhook URL
          webhookUrl: response.data.notify_url || prev.webhookUrl,
          // 设置API密钥列表
          secrets: response.data.secrets || [],
        }));
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  // 在弹窗内重新获取密钥
  const handleRefreshG2FAKey = async () => {
    setG2faData(null);
    setG2faCode('');
    setLoading(true);
    
    try {
      const response = await G2FAService.getG2FAKey();
      if (response.code === '0000') {
        setG2faData(response.data);
      } else {
        toast.error("获取失败", response.msg || "获取 G2FA 密钥失败");
      }
    } catch (error) {
      console.error('获取 G2FA 密钥失败:', error);
      toast.error("获取失败", "网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 获取 G2FA 密钥和二维码 - 优化流程：先显示弹窗再异步获取密钥
  const handleGetG2FAKey = async () => {
    // 先显示弹窗，提供更快的用户体验
    setG2faData(null); // 清空旧数据
    setG2faCode('');
    setShowGoogleAuthDialog(true);
    setLoading(true);
    
    try {
      const response = await G2FAService.getG2FAKey();
      if (response.code === '0000') {
        setG2faData(response.data);
      } else {
        toast.error("获取失败", response.msg || "获取 G2FA 密钥失败");
      }
    } catch (error) {
      console.error('获取 G2FA 密钥失败:', error);
      toast.error("获取失败", "网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 验证并绑定 G2FA
  const handleBindG2FA = async () => {
    if (!g2faCode || g2faCode.length !== 6) {
      toast.error("验证码无效", "请输入6位G2FA验证码");
      return;
    }

    // 重新绑定时必须提供邮箱验证码
    if (isRebinding && (!emailCode || emailCode.length !== 6)) {
      toast.error("验证码无效", "重新绑定需要输入6位邮箱验证码");
      return;
    }

    if (!g2faData) {
      toast.error("密钥已过期", "请重新获取 G2FA 密钥");
      return;
    }

    setIsBindingG2FA(true);
    try {
      // 重新绑定时传入短信验证码，新绑定时不传
      const response = await G2FAService.verifyAndBind(g2faCode, isRebinding ? emailCode : undefined);
      if (response.code === '0000') {
        setShowGoogleAuthDialog(false);
        setG2faCode('');
        setEmailCode('');
        setG2faData(null);
        setIsRebinding(false);
        toast.success("绑定成功", "Google Authenticator 已成功绑定");
        // 重新加载用户信息以更新 G2FA 状态
        await loadUserInfo();
      } else if (response.code === '1115') {
        // G2FA 密钥过期或不存在 - 保持弹窗打开，只清空密钥数据
        toast.error("密钥已过期", "请重新获取 G2FA 密钥");
        setG2faData(null);
        setG2faCode('');
        // 不关闭弹窗，让用户可以重新获取密钥
      } else {
        toast.error("绑定失败", response.msg || "验证码错误，请重试");
      }
    } catch (error) {
      console.error('G2FA 绑定失败:', error);
      toast.error("绑定失败", "网络错误，请稍后重试");
    } finally {
      setIsBindingG2FA(false);
    }
  };

  // 重新绑定 G2FA - 优化流程：先显示弹窗再异步获取密钥
  const handleStartRebind = async () => {
    // 先设置状态并显示对话框，提供更快的用户体验
    setIsRebinding(true);
    setG2faData(null); // 清空旧数据
    setG2faCode('');
    setEmailCode('');
    setShowGoogleAuthDialog(true);
    setLoading(true);
    
    try {
      // 异步获取新的G2FA密钥
      const keyResponse = await G2FAService.getG2FAKey();
      
      if (keyResponse.code !== '0000') {
        toast.error("获取失败", keyResponse.msg || "获取G2FA密钥失败");
        // 获取失败时不关闭弹窗，让用户可以重试
        return;
      }

      // 成功后设置密钥数据
      setG2faData(keyResponse.data);

    } catch (error) {
      console.error('获取G2FA密钥失败:', error);
      toast.error("操作失败", "网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 发送短信验证码（在对话框中调用）
  const handleSendVerifyCode = async () => {
    if (!userEmail) {
      toast.error("邮箱错误", "无法获取用户邮箱");
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await VerifyCodeService.sendVerifyCode('reset_g2fa', userEmail);
      if (response.code === '0000') {
        toast.success("发送成功", "验证码已发送到您的邮箱");
      } else {
        toast.error("发送失败", response.msg || "发送验证码失败");
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      toast.error("发送失败", "网络错误，请稍后重试");
    } finally {
      setIsSendingCode(false);
    }
  };

  // 取消 G2FA 对话框
  const handleCancelG2FA = () => {
    setShowGoogleAuthDialog(false);
    setG2faCode('');
    setEmailCode('');
    setG2faData(null);
    setIsRebinding(false);
  };

  // 组件挂载时加载用户信息
  useEffect(() => {
    loadUserInfo();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>设置</h1>
      </div>

      {/* 基本信息 - 已注释，不展示 */}
      {/* <BasicConfig 
        config={config}
        onConfigUpdate={handleConfigUpdate}
      /> */}

      {/* API配置 */}
      <ApiConfig 
        config={config}
        onConfigUpdate={handleConfigUpdate}
        onSaveWebhook={handleSaveWebhook}
        loading={loading}
      />

      {/* 安全配置 */}
      <SecurityConfig 
        config={config}
        onConfigUpdate={handleConfigUpdate}
        googleAuthEnabled={googleAuthEnabled}
        loading={loading}
        isSendingCode={isSendingCode}
        onGetG2FAKey={handleGetG2FAKey}
        onStartRebind={handleStartRebind}
        onSaveIpWhitelist={handleSaveIpWhitelist}
      />

      {/* G2FA 配置对话框 */}
      <Dialog 
        open={showGoogleAuthDialog} 
        onOpenChange={() => {
          // 禁用点击空白处和 ESC 键关闭弹窗，只允许通过按钮关闭
          // 这确保用户不会意外关闭重要的安全配置流程
          return;
        }}
      >
        <DialogContent 
          className="max-w-md [&>button]:hidden" 
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{isRebinding ? '重新绑定 Google Authenticator' : '开通 Google Authenticator'}</DialogTitle>
            <DialogDescription>
              请按照以下步骤设置 Google Authenticator
              {loading && !g2faData && (
                <span className="block mt-1 text-blue-600">正在为您生成专属密钥，请稍候...</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm">1. 在手机上安装 Google Authenticator 应用</p>
              <p className="text-sm">2. 扫描下方二维码</p>
              <div className="flex items-center justify-center p-4 bg-muted rounded-lg relative group">
                {g2faData ? (
                  <div className="relative">
                    <QRCodeDisplay qrCodeUri={g2faData.qr_code} />
                    {/* 悬停时显示的刷新按钮 */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRefreshG2FAKey}
                        disabled={loading}
                        className="gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        刷新
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                    {loading ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <p className="text-xs text-gray-500 text-center">获取密钥中...</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 text-center">
                        密钥已过期<br/>请重新获取
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {!g2faData && !loading && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    密钥已过期或不存在，请点击"重新获取密钥"按钮获取新的密钥
                  </p>
                </div>
              )}
              
              {isRebinding && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    验证码将发送到您的邮箱 {userEmail}
                  </p>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="输入邮箱验证码" 
                      maxLength={6} 
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="default"
                      onClick={handleSendVerifyCode}
                      disabled={isSendingCode}
                    >
                      {isSendingCode ? '发送中...' : '发送验证码'}
                    </Button>
                  </div>
                </div>
              )}
              
              <p className="text-sm">3. 输入 Google Authenticator 生成的6位验证码</p>
              <Input 
                placeholder="输入G2FA验证码" 
                maxLength={6} 
                value={g2faCode}
                onChange={(e) => setG2faCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelG2FA}>
              取消
            </Button>
            <Button 
              onClick={() => handleBindG2FA()}
              disabled={
                isBindingG2FA || 
                !g2faCode || 
                g2faCode.length !== 6 || 
                !g2faData || 
                (isRebinding && (!emailCode || emailCode.length !== 6))
              }
            >
              {isBindingG2FA ? '绑定中...' : (isRebinding ? '确认重新绑定' : '确认开通')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
