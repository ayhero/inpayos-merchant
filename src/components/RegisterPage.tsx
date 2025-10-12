import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { authService, RegisterRequest } from '@/services/authService';
import { toast } from '@/utils/toast';
import { ErrorHandler } from '@/utils/errorHandler';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const [registerForm, setRegisterForm] = useState<RegisterRequest>({
    username: '',
    password: '',
    email: '',
    companyName: '',
    contactPhone: '',
    emailVerificationCode: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string>('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [showPassword, setShowPassword] = useState(false);
  
  // 清理倒计时
  useEffect(() => {
    return () => {
      // 组件卸载时清理倒计时
      setCountdown(0);
    };
  }, []);

  // 发送邮箱验证码
  const handleSendVerificationCode = async () => {
    if (!registerForm.email) {
      toast.error('发送失败', '请先输入邮箱地址');
      return;
    }

    setVerificationLoading(true);
    setError('');

    try {
      const response = await authService.sendEmailVerificationCode(registerForm.email, 'register');
      
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRegisterLoading(true);

    try {
      const response = await authService.register(registerForm);
      
      if (response.code === "0000" && response.success) {
        // 注册成功，显示成功弹窗
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
        toast.error('注册失败', response.msg);
      }
    } catch (error) {
      const apiError = ErrorHandler.handle(error);
      setError(apiError.message);
      toast.error('注册失败', apiError.message);
    } finally {
      setRegisterLoading(false);
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
            <CardTitle className="text-2xl">商户注册</CardTitle>
            <CardDescription>注册新的商户账号</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="register-username"
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  placeholder="请输入用户名"
                  className="h-12"
                  required
                  disabled={registerLoading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="请输入邮箱地址"
                  className="h-12"
                  required
                  disabled={registerLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="register-verification-code"
                    type="text"
                    value={registerForm.emailVerificationCode}
                    onChange={(e) => setRegisterForm({ ...registerForm, emailVerificationCode: e.target.value })}
                    placeholder="请输入邮箱验证码"
                    className="h-12"
                    maxLength={6}
                    required
                    disabled={registerLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendVerificationCode}
                    disabled={verificationLoading || countdown > 0 || !registerForm.email}
                    className="whitespace-nowrap h-12"
                  >
                    {verificationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  id="register-company"
                  type="text"
                  value={registerForm.companyName}
                  onChange={(e) => setRegisterForm({ ...registerForm, companyName: e.target.value })}
                  placeholder="请输入公司名称"
                  className="h-12"
                  required
                  disabled={registerLoading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="register-phone"
                  type="tel"
                  value={registerForm.contactPhone}
                  onChange={(e) => setRegisterForm({ ...registerForm, contactPhone: e.target.value })}
                  placeholder="请输入联系电话"
                  className="h-12"
                  required
                  disabled={registerLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="请输入密码"
                    className="pr-10 h-12"
                    required
                    disabled={registerLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-4 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={registerLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12" disabled={registerLoading}>
                {registerLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                注册
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                已有账号？{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={onSwitchToLogin}
                >
                  立即登录
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 注册成功弹窗 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              注册成功
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600">
                欢迎新注册商户！您的账号 <span className="font-semibold text-green-800">{registerForm.email}</span> 已创建成功。
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
