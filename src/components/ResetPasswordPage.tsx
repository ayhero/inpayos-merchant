import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Loader2, CheckCircle, Mail, Shield } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from '@/utils/toast';
import { ErrorHandler } from '@/utils/errorHandler';

interface ResetPasswordPageProps {
  onSwitchToLogin: () => void;
}

export function ResetPasswordPage({ onSwitchToLogin }: ResetPasswordPageProps) {
  const [resetForm, setResetForm] = useState({
    email: '',
    verificationCode: ''
  });
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string>('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
  // 清理倒计时
  useEffect(() => {
    return () => {
      setCountdown(0);
    };
  }, []);

  // 发送邮箱验证码
  const handleSendVerificationCode = async () => {
    if (!resetForm.email) {
      toast.error('发送失败', '请先输入邮箱地址');
      return;
    }

    setVerificationLoading(true);
    setError('');

    try {
      const response = await authService.sendEmailVerificationCode(resetForm.email, 'reset');
      
      if (response.code === "0000" && response.success) {
        toast.success('发送成功', response.msg);
        // 开始60秒倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.msg);
        toast.error('发送失败', response.msg);
      }
    } catch (error) {
      const apiError = ErrorHandler.handle(error);
      setError(apiError.message);
      toast.error('发送失败', apiError.message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetLoading(true);

    try {
      const response = await authService.resetPassword(resetForm.email, resetForm.verificationCode);
      
      if (response.code === "0000" && response.success) {
        // 重置成功，显示成功弹窗
        setShowSuccessDialog(true);
        setRedirectCountdown(5);
        
        // 开始倒计时
        const timer = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              // 倒计时结束，自动跳转到登录页面
              onSwitchToLogin();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.msg);
        toast.error('重置失败', response.msg);
      }
    } catch (error) {
      const apiError = ErrorHandler.handle(error);
      setError(apiError.message);
      toast.error('重置失败', apiError.message);
    } finally {
      setResetLoading(false);
    }
  };

  // 手动跳转到登录页面
  const handleManualRedirect = () => {
    setShowSuccessDialog(false);
    onSwitchToLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">重置密码</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetForm.email}
                    onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                    placeholder="请输入注册时使用的邮箱"
                    className="pl-10 h-12"
                    required
                    disabled={resetLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Shield className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-verification-code"
                      type="text"
                      value={resetForm.verificationCode}
                      onChange={(e) => setResetForm({ 
                        ...resetForm, 
                        verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6)
                      })}
                      placeholder="请输入6位验证码"
                      className="pl-10 h-12"
                      maxLength={6}
                      required
                      disabled={resetLoading}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendVerificationCode}
                    disabled={verificationLoading || countdown > 0 || !resetForm.email}
                    className="whitespace-nowrap h-12"
                  >
                    {verificationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12" disabled={resetLoading}>
                {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                重置密码
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                想起密码了？{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={onSwitchToLogin}
                >
                  返回登录
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 重置成功弹窗 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              密码重置成功
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">
                新密码已发送到您的邮箱 <span className="font-semibold text-blue-800">{resetForm.email}</span>，请查收邮件并使用新密码登录。
                为了您的账户安全，请登录后及时修改密码。
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleManualRedirect}>
              返回登录({redirectCountdown}s)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
