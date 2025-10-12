import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Loader2, CheckCircle, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from '@/utils/toast';
import { ErrorHandler } from '@/utils/errorHandler';

interface ChangePasswordPageProps {
  onBack: () => void;
  onPasswordChanged: () => void;
  isDialog?: boolean;
}

export function ChangePasswordPage({ onBack, onPasswordChanged, isDialog = false }: ChangePasswordPageProps) {
  const [changeForm, setChangeForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // 动态检测密码一致性
  useEffect(() => {
    // 只有当两个密码都有值时才进行检测
    if (changeForm.newPassword && changeForm.confirmPassword) {
      if (changeForm.newPassword !== changeForm.confirmPassword) {
        setError('两次输入的新密码不一致');
      } else {
        // 如果密码一致，清除错误（但只清除密码不一致的错误）
        if (error === '两次输入的新密码不一致') {
          setError('');
        }
      }
    } else if (error === '两次输入的新密码不一致') {
      // 如果用户正在输入过程中，清除密码不一致的错误
      setError('');
    }
  }, [changeForm.newPassword, changeForm.confirmPassword, error]);

  // 处理表单输入变化
  const handleFormChange = (field: keyof typeof changeForm, value: string) => {
    setChangeForm(prev => ({ ...prev, [field]: value }));
    
    // 清除某些特定的错误信息
    if (field === 'oldPassword' && error === '请输入原密码') {
      setError('');
    } else if (field === 'newPassword') {
      if (error === '请输入新密码' || error === '新密码长度不能少于6位' || error === '新密码不能与原密码相同') {
        setError('');
      }
    } else if (field === 'confirmPassword' && error === '请确认新密码') {
      setError('');
    }
  };

  const validateForm = () => {
    if (!changeForm.oldPassword) {
      setError('请输入原密码');
      return false;
    }
    if (!changeForm.newPassword) {
      setError('请输入新密码');
      return false;
    }
    if (changeForm.newPassword.length < 6) {
      setError('新密码长度不能少于6位');
      return false;
    }
    if (!changeForm.confirmPassword) {
      setError('请确认新密码');
      return false;
    }
    if (changeForm.newPassword !== changeForm.confirmPassword) {
      setError('两次输入的新密码不一致');
      return false;
    }
    if (changeForm.oldPassword === changeForm.newPassword) {
      setError('新密码不能与原密码相同');
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 这里只需要发送新密码，前端已经验证过了
      const response = await authService.changePassword(changeForm.newPassword);
      
      if (response.code === "0000" && response.success) {
        // 修改成功，显示成功弹窗
        setShowSuccessDialog(true);
        setRedirectCountdown(5);
        
        // 开始倒计时
        const timer = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              // 倒计时结束，回调通知父组件跳转到登录页面
              onPasswordChanged();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.msg);
        toast.error('修改失败', response.msg);
      }
    } catch (error) {
      const apiError = ErrorHandler.handle(error);
      setError(apiError.message);
      toast.error('修改失败', apiError.message);
    } finally {
      setLoading(false);
    }
  };

  // 手动跳转
  const handleManualRedirect = () => {
    setShowSuccessDialog(false);
    onPasswordChanged();
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // 如果在弹窗模式下，使用简化的布局
  if (isDialog) {
    return (
      <div className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50" variant="destructive">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* 原密码 */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
              <Input
                id="old-password"
                type={showPasswords.old ? "text" : "password"}
                value={changeForm.oldPassword}
                onChange={(e) => handleFormChange('oldPassword', e.target.value)}
                placeholder="请输入原密码"
                className="pl-10 pr-10 h-12"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('old')}
                className="absolute right-3 top-4 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* 新密码 */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={changeForm.newPassword}
                onChange={(e) => handleFormChange('newPassword', e.target.value)}
                placeholder="请输入新密码（至少6位）"
                className="pl-10 pr-10 h-12"
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-4 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* 确认新密码 */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={changeForm.confirmPassword}
                onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                placeholder="请再次输入新密码"
                className="pl-10 pr-10 h-12"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-4 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-12" 
              onClick={onBack}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" className="flex-1 h-12" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认修改
            </Button>
          </div>
        </form>

        {/* 修改成功弹窗 */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                密码修改成功
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">
                  您的密码已修改成功！为了确保账户安全，请使用新密码重新登录。
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleManualRedirect}>
                重新登录({redirectCountdown}s)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">修改密码</h1>
        <p className="text-muted-foreground">为了您的账户安全，请定期更换密码</p>
      </div>

      <div className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">密码设置</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50" variant="destructive">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* 原密码 */}
              <div className="space-y-2">
                <label htmlFor="old-password" className="text-sm font-medium">
                  原密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="old-password"
                    type={showPasswords.old ? "text" : "password"}
                    value={changeForm.oldPassword}
                    onChange={(e) => handleFormChange('oldPassword', e.target.value)}
                    placeholder="请输入原密码"
                    className="pl-10 pr-10 h-12"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-3 top-4 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* 新密码 */}
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium">
                  新密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    value={changeForm.newPassword}
                    onChange={(e) => handleFormChange('newPassword', e.target.value)}
                    placeholder="请输入新密码（至少6位）"
                    className="pl-10 pr-10 h-12"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-4 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 确认新密码 */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  确认新密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={changeForm.confirmPassword}
                    onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                    placeholder="请再次输入新密码"
                    className="pl-10 pr-10 h-12"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-4 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-12" 
                  onClick={onBack}
                  disabled={loading}
                >
                  取消
                </Button>
                <Button type="submit" className="flex-1 h-12" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  确认修改
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 修改成功弹窗 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              密码修改成功
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">
                您的密码已修改成功！为了确保账户安全，请使用新密码重新登录。
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleManualRedirect}>
              重新登录({redirectCountdown}s)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
