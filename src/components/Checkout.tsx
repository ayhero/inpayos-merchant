import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Building2,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { cn } from '../utils/utils';
import { api } from '../services/api';

// 类型定义
interface CheckoutData {
  checkout_id?: string;
  id?: string;
  amount?: string;
  ccy?: string;
  country?: string;
  status?: string;
  expired_at?: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface Transaction {
  id?: string;
  trx_id?: string;
}

// 获取支付方式图标
const getPaymentMethodIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case 'upi':
      return <Smartphone className="h-5 w-5" />;
    case 'bank_transfer':
      return <Building2 className="h-5 w-5" />;
    case 'credit_card':
      return <CreditCard className="h-5 w-5" />;
    default:
      return <CreditCard className="h-5 w-5" />;
  }
};

// 获取支付方式名称
const getPaymentMethodName = (method: string) => {
  const names: { [key: string]: string } = {
    'upi': 'UPI支付',
    'bank_transfer': '银行转账',
    'credit_card': '信用卡支付'
  };
  return names[method.toLowerCase()] || method;
};

export const Checkout: React.FC = () => {
  // 状态管理
  const [currentStep, setCurrentStep] = useState(0); // 从0开始，0为创建checkout表单
  const [checkoutId, setCheckoutId] = useState('');
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [paymentAccountInfo, setPaymentAccountInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // 创建checkout表单数据
  const [createForm, setCreateForm] = useState({
    req_id: '',
    ccy: 'INR',
    amount: '',
    product_id: '',
    return_url: '',
    notify_url: ''
  });
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // 通用API调用函数
  const makeApiCall = async (endpoint: string, data: any, useToken = false) => {
    try {
      console.log(`发起API调用: ${endpoint}`, data);
      
      let response;
      if (useToken && authToken) {
        // 使用token的请求
        response = await api.post(endpoint, data, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
      } else {
        // 不使用token的请求（如info接口）
        response = await api.post(endpoint, data);
      }
      
      console.log('响应数据:', response);
      
      if (response.code === '0000') {
        return response;
      } else {
        const errorMessage = response.msg || `API错误: ${response.code}`;
        console.error('API调用失败:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('API调用出错:', error);
      setError(`API调用失败: ${error.message}`);
      return null;
    }
  };

  // 创建checkout会话
  const createCheckout = async () => {
    // 表单验证
    if (!createForm.amount.trim()) {
      setError('请输入支付金额');
      return;
    }
    if (!createForm.product_id.trim()) {
      setError('请输入商品ID');
      return;
    }
    if (!createForm.return_url.trim()) {
      setError('请输入成功回调URL');
      return;
    }
    if (!createForm.notify_url.trim()) {
      setError('请输入通知回调URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 如果req_id为空，自动生成
      const reqId = createForm.req_id.trim() || generateUUID();

      const createData = {
        req_id: reqId,
        ccy: createForm.ccy,
        amount: createForm.amount,
        product_id: createForm.product_id,
        return_url: createForm.return_url,
        notify_url: createForm.notify_url
      };

      console.log('创建checkout数据:', createData);

      // 调用创建接口
      const result = await makeApiCall('/api/checkout/create', createData, false);

      if (!result) {
        throw new Error('创建checkout会话失败');
      }

      const data = result.data || result;
      console.log('创建成功，返回数据:', data);

      // 设置checkout_id并进入下一步
      if (data.checkout_id) {
        setCheckoutId(data.checkout_id);
        setCheckoutData(data);
        
        // 如果有token，保存起来
        if (data.token) {
          setAuthToken(data.token);
        }
        
        setCurrentStep(1); // 跳到输入信息步骤
      } else {
        throw new Error('未获取到checkout_id');
      }
    } catch (error: any) {
      console.error('创建checkout失败:', error);
      setError(`创建checkout失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };



  // 加载收银台信息
  const loadCheckout = async () => {
    if (!checkoutId.trim()) {
      setError('请输入收银台ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // info接口无需授权，会返回token
      const checkoutInfo = await makeApiCall('/api/checkout/info', { checkout_id: checkoutId }, false);
      
      if (!checkoutInfo) {
        throw new Error('获取收银台信息失败');
      }

      const data = checkoutInfo.data || checkoutInfo;
      setCheckoutData(data);
      
      // 从响应中获取授权token
      if (data.token) {
        setAuthToken(data.token);
      } else if ((checkoutInfo as any).token) {
        setAuthToken((checkoutInfo as any).token);
      }

      // 启动倒计时
      if (data.expired_at) {
        startCountdown(data.expired_at);
      }

      // 获取支付方式（需要使用token）
      await loadPaymentMethods();
      
      setCurrentStep(2);
    } catch (error: any) {
      console.error('加载收银台失败:', error);
      setError(`加载收银台失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 加载支付方式
  const loadPaymentMethods = async () => {
    try {
      // 使用从info接口获得的token调用services接口
      const servicesInfo = await makeApiCall('/api/checkout/services', { 
        checkout_id: checkoutData?.checkout_id || checkoutData?.id || checkoutId
      }, true);

      if (!servicesInfo) {
        throw new Error('获取支付方式失败');
      }

      const services = servicesInfo.data || servicesInfo;
      console.log('Services数据:', services);
      
      // 解析支付方式数据 - 根据新的数据结构
      const methods: PaymentMethod[] = [];
      
      // 获取可用国家列表，如果checkoutData有country则优先使用，否则使用第一个国家
      let targetCountry = checkoutData?.country;
      if (!targetCountry && services.countries && services.countries.length > 0) {
        targetCountry = services.countries[0]; // 默认使用第一个国家
      }
      
      console.log('目标国家:', targetCountry);
      
      if (services.configs && targetCountry && services.configs[targetCountry]) {
        const countryConfig = services.configs[targetCountry];
        console.log('国家配置:', countryConfig);
        
        if (countryConfig.trx_methods && countryConfig.trx_methods.length > 0) {
          countryConfig.trx_methods.forEach((method: string) => {
            // 检查该支付方式是否有具体配置
            const methodConfig = countryConfig.configs?.[method];
            console.log(`支付方式 ${method} 配置:`, methodConfig);
            
            methods.push({
              id: method,
              name: getPaymentMethodName(method),
              description: `使用${getPaymentMethodName(method)}完成支付`,
              type: method.toLowerCase()
            });
          });
        }
      }

      console.log('解析出的支付方式:', methods);

      // 如果没有获取到支付方式，使用默认的
      if (methods.length === 0) {
        console.log('使用默认支付方式');
        methods.push(
          { id: 'upi', name: 'UPI支付', description: '使用UPI应用扫码或转账', type: 'upi' },
          { id: 'bank_transfer', name: '银行转账', description: '银行账户间直接转账', type: 'bank' }
        );
      }

      setPaymentMethods(methods);
    } catch (error) {
      console.error('加载支付方式失败:', error);
      // 设置默认支付方式
      setPaymentMethods([
        { id: 'upi', name: 'UPI支付', description: '使用UPI应用扫码或转账', type: 'upi' },
        { id: 'bank_transfer', name: '银行转账', description: '银行账户间直接转账', type: 'bank' }
      ]);
    }
  };

  // 提交支付方式选择
  const submitPaymentMethod = async () => {
    if (!selectedPaymentMethod) {
      setError('请选择支付方式');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        checkout_id: checkoutData?.checkout_id || checkoutData?.id || checkoutId,
        trx_method: selectedPaymentMethod,
        country: checkoutData?.country || 'IN' // 默认使用印度，如果没有country信息
      };

      // 使用token调用submit接口
      const result = await makeApiCall('/api/checkout/submit', submitData, true);

      if (result) {
        const responseData = result.data || result;
        console.log('Submit接口返回数据:', responseData);
        
        // 从响应中提取transaction信息
        if (responseData.transaction) {
          setCurrentTransaction(responseData.transaction);
          console.log('交易信息:', responseData.transaction);
        }
        
        // 保存整个响应作为支付账户信息（包含收款账号等）
        setPaymentAccountInfo(responseData);
        
        setCurrentStep(3);
      } else {
        throw new Error('提交失败');
      }
    } catch (error: any) {
      console.error('提交支付方式失败:', error);
      setError(`提交支付方式失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 确认支付
  const confirmPayment = async () => {
    console.log('当前交易信息:', currentTransaction);
    console.log('当前支付账户信息:', paymentAccountInfo);

    setLoading(true);
    setError('');

    try {
      const confirmData = {
        checkout_id: checkoutData?.checkout_id || checkoutData?.id || checkoutId,
        trx_id: currentTransaction?.trx_id || currentTransaction?.id || generateTrxId(),
        proof_id: `PROOF_${Date.now()}`, // 自动生成proof_id
        trx_app: getAppName(selectedPaymentMethod),
        proof_urls: [] // 不再需要上传图片
      };
      
      console.log('确认支付数据:', confirmData);

      // 使用token调用confirm接口
      const result = await makeApiCall('/api/checkout/confirm', confirmData, true);

      if (result) {
        setCurrentStep(4);
        // 停止倒计时
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
        
        // 成功后可以跳转到支付结果页（这里暂时显示成功页面）
        // 如果需要跳转到其他页面，可以在这里添加路由跳转逻辑
        // window.location.href = '/payment-result';
      } else {
        throw new Error('确认失败');
      }
    } catch (error: any) {
      console.error('确认支付失败:', error);
      setError(`确认支付失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 辅助函数
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateTrxId = () => {
    return `TRX_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  };

  const getAppName = (method: string) => {
    const apps: { [key: string]: string } = {
      'upi': 'Paytm',
      'bank_transfer': 'SBI Online',
      'credit_card': 'Visa'
    };
    return apps[method] || 'Unknown';
  };

  const startCountdown = (expiredAt: number) => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      const now = Date.now();
      const timeLeft = expiredAt - now;

      if (timeLeft <= 0) {
        clearInterval(countdownRef.current!);
        setCountdown(0);
        setError('订单已过期，请重新发起支付');
        return;
      }

      setCountdown(Math.floor(timeLeft / 1000));
    }, 1000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };



  // 清理定时器
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* 页头 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">支付收银台</h1>
          <p className="text-muted-foreground mt-2">安全、便捷的在线支付解决方案</p>
        </div>

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              使用说明
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 min-w-fit">1</Badge>
                <div><strong>收银台ID：</strong>每笔支付都会生成唯一的收银台ID，请确保输入正确</div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 min-w-fit">2</Badge>
                <div><strong>API流程：</strong>info接口（无需授权，获取token） → services接口（需token） → submit接口（需token，获取收款信息） → confirm接口（需token）</div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 min-w-fit">3</Badge>
                <div><strong>支付流程：</strong>选择支付方式 → 获取真实收款账号 → 完成转账 → 上传支付凭证 → 跳转结果页</div>
              </div>
              {/* 调试信息 */}
              {(checkoutData || authToken) && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium mb-2">调试信息:</p>
                  {authToken && (
                    <p className="text-xs text-blue-600">• Token: {authToken.substring(0, 20)}...</p>
                  )}
                  {checkoutData && (
                    <p className="text-xs text-blue-600">• 国家: {checkoutData.country || '未设置'}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center space-x-4">
          {[
            { step: 0, title: '创建订单' },
            { step: 1, title: '输入信息' },
            { step: 2, title: '选择支付方式' },
            { step: 3, title: '支付详情' },
            { step: 4, title: '完成支付' }
          ].map(({ step, title }) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                currentStep >= step 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              <span className="ml-2 text-sm font-medium">{title}</span>
              {step < 4 && <div className="w-8 h-px bg-border ml-4" />}
            </div>
          ))}
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 步骤0: 创建订单 */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>创建支付订单</CardTitle>
              <CardDescription>请填写订单信息以创建新的支付会话</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="req_id">请求ID (可选)</Label>
                  <Input
                    id="req_id"
                    value={createForm.req_id}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, req_id: e.target.value }))}
                    placeholder="留空将自动生成UUID"
                  />
                  <p className="text-xs text-muted-foreground">
                    唯一的请求标识符，留空将自动生成UUID
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ccy">币种</Label>
                  <select
                    id="ccy"
                    value={createForm.ccy}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, ccy: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="INR">INR - 印度卢比</option>
                    <option value="USD">USD - 美元</option>
                    <option value="EUR">EUR - 欧元</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">支付金额 *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.amount}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="100.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_id">商品ID *</Label>
                  <Input
                    id="product_id"
                    value={createForm.product_id}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, product_id: e.target.value }))}
                    placeholder="prod_001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="return_url">成功回调URL *</Label>
                <Input
                  id="return_url"
                  type="url"
                  value={createForm.return_url}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, return_url: e.target.value }))}
                  placeholder="https://your-domain.com/checkout/success"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  支付成功后用户将被重定向到此URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notify_url">通知回调URL *</Label>
                <Input
                  id="notify_url"
                  type="url"
                  value={createForm.notify_url}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, notify_url: e.target.value }))}
                  placeholder="https://your-domain.com/webhook/checkout"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  支付状态变更时系统将向此URL发送通知
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">预览数据</h4>
                <pre className="text-xs text-blue-600 whitespace-pre-wrap">
{JSON.stringify({
  req_id: createForm.req_id || "(将自动生成UUID)",
  ccy: createForm.ccy,
  amount: createForm.amount || "0.00",
  product_id: createForm.product_id || "",
  return_url: createForm.return_url || "",
  notify_url: createForm.notify_url || ""
}, null, 2)}
                </pre>
              </div>

              <Button 
                onClick={createCheckout}
                disabled={loading || !createForm.amount.trim() || !createForm.product_id.trim() || !createForm.return_url.trim() || !createForm.notify_url.trim()}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                创建支付订单
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 步骤1: 输入信息 */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>输入收银台信息</CardTitle>
              <CardDescription>请输入收银台ID以开始支付流程</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkoutId">收银台ID</Label>
                <Input
                  id="checkoutId"
                  value={checkoutId}
                  onChange={(e) => setCheckoutId(e.target.value)}
                  placeholder="请输入收银台ID"
                />
              </div>
              <Button 
                onClick={loadCheckout} 
                disabled={loading || !checkoutId.trim()}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                开始支付
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 步骤2: 选择支付方式 */}
        {currentStep === 2 && checkoutData && (
          <Card>
            <CardHeader>
              <CardTitle>选择支付方式</CardTitle>
              <CardDescription>请选择您偏好的支付方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 订单信息 */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-3">订单信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>订单金额:</span>
                    <span>{checkoutData.amount} {checkoutData.ccy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>币种:</span>
                    <span>{checkoutData.ccy}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>应付总额:</span>
                    <span>{checkoutData.amount} {checkoutData.ccy}</span>
                  </div>
                </div>
              </div>

              {/* 倒计时 */}
              {countdown !== null && countdown > 0 && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    订单将在 {formatCountdown(countdown)} 后过期
                  </AlertDescription>
                </Alert>
              )}

              {/* 支付方式列表 */}
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-colors",
                      selectedPaymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        {getPaymentMethodIcon(method.id)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {checkoutData?.country || 'IN'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {checkoutData?.ccy || 'INR'}
                          </Badge>
                        </div>
                      </div>
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2",
                        selectedPaymentMethod === method.id
                          ? "border-primary bg-primary"
                          : "border-border"
                      )} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  返回
                </Button>
                <Button 
                  onClick={submitPaymentMethod}
                  disabled={loading || !selectedPaymentMethod}
                  className="flex-1"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  确认支付方式
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 步骤3: 支付详情 */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>完成支付</CardTitle>
              <CardDescription>请选择支付应用完成转账</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* UPI 深度链接显示 */}
              {selectedPaymentMethod === 'upi' && paymentAccountInfo?.transaction?.links && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2 flex-wrap">
                    {paymentAccountInfo.transaction.links.paytm && (
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => window.open(paymentAccountInfo.transaction.links.paytm, '_blank')}
                      >
                        Paytm
                      </Button>
                    )}
                    {paymentAccountInfo.transaction.links.phonepe && (
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => window.open(paymentAccountInfo.transaction.links.phonepe, '_blank')}
                      >
                        PhonePe
                      </Button>
                    )}
                    {paymentAccountInfo.transaction.links.googlepay && (
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => window.open(paymentAccountInfo.transaction.links.googlepay, '_blank')}
                      >
                        Google Pay
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* 收款信息 - 隐藏 */}
              {false && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  收款账户信息
                </h3>
                <div className="space-y-3">
                  {selectedPaymentMethod === 'upi' ? (
                    <>
                      <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                        <span className="font-medium">UPI ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {paymentAccountInfo?.transaction?.upi || 
                             paymentAccountInfo?.transaction?.account_no || 
                             'merchant@paytm'}
                          </span>
                          <Button size="sm" variant="ghost" onClick={() => 
                            copyToClipboard(
                              paymentAccountInfo?.transaction?.upi || 
                              paymentAccountInfo?.transaction?.account_no || 
                              'merchant@paytm'
                            )
                          }>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                        <span className="font-medium">收款人:</span>
                        <span>
                          {paymentAccountInfo?.transaction?.holder_name || 
                           paymentAccountInfo?.transaction?.account_name || 
                           'Merchant'}
                        </span>
                      </div>
                      {paymentAccountInfo?.transaction?.holder_phone && (
                        <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                          <span className="font-medium">联系电话:</span>
                          <span>{paymentAccountInfo.transaction.holder_phone}</span>
                        </div>
                      )}
                    </>
                  ) : selectedPaymentMethod === 'bank_transfer' ? (
                    <>
                      <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                        <span className="font-medium">银行名称:</span>
                        <span>
                          {paymentAccountInfo?.transaction?.bank_name || 
                           'State Bank of India'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                        <span className="font-medium">账户号码:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {paymentAccountInfo?.transaction?.account_no || 
                             '1234567890123456'}
                          </span>
                          <Button size="sm" variant="ghost" onClick={() => 
                            copyToClipboard(
                              paymentAccountInfo?.transaction?.account_no || 
                              '1234567890123456'
                            )
                          }>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                        <span className="font-medium">账户名称:</span>
                        <span>
                          {paymentAccountInfo?.transaction?.holder_name || 
                           paymentAccountInfo?.transaction?.account_name || 
                           'Merchant Account'}
                        </span>
                      </div>
                      {paymentAccountInfo?.transaction?.bank_code && (
                        <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                          <span className="font-medium">银行代码:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">
                              {paymentAccountInfo.transaction.bank_code}
                            </span>
                            <Button size="sm" variant="ghost" onClick={() => 
                              copyToClipboard(paymentAccountInfo.transaction.bank_code)
                            }>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* 其他支付方式的显示 */}
                      <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                        <span className="font-medium">收款账号:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {paymentAccountInfo?.transaction?.account_no || 'N/A'}
                          </span>
                          {paymentAccountInfo?.transaction?.account_no && (
                            <Button size="sm" variant="ghost" onClick={() => 
                              copyToClipboard(paymentAccountInfo.transaction.account_no)
                            }>
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                        <span className="font-medium">收款人:</span>
                        <span>
                          {paymentAccountInfo?.transaction?.account_name || 
                           paymentAccountInfo?.transaction?.holder_name || 
                           'Merchant'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                    <span className="font-medium">转账金额:</span>
                    <span className="font-semibold">
                      {paymentAccountInfo?.transaction?.amount || checkoutData?.amount} {paymentAccountInfo?.transaction?.ccy || checkoutData?.ccy}
                    </span>
                  </div>
                </div>
              </div>
              )}

              {/* 支付说明 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">支付确认</h4>
                <p className="text-sm text-green-700">
                  {selectedPaymentMethod === 'upi' 
                    ? '请点击上方支付应用按钮，或手动向上述 UPI ID 转账。转账完成后点击下方"确认支付完成"按钮。'
                    : '请确认您已经完成向上述收款账户的转账操作。点击下方"确认支付完成"按钮来完成此次支付流程。'
                  }
                </p>
                <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-600">
                  <p className="font-medium">注意事项：</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li>请确保转账金额与订单金额完全一致</li>
                    <li>转账完成后请及时确认，避免订单过期</li>
                    <li>如遇到问题，请联系客服协助处理</li>
                  </ul>
                </div>
              </div>

              {/* 调试信息 */}
              {paymentAccountInfo && (
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="cursor-pointer font-medium text-sm text-gray-600">
                    调试信息 (点击展开)
                  </summary>
                  <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(paymentAccountInfo, null, 2)}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  返回
                </Button>
                <Button 
                  onClick={confirmPayment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  确认支付完成
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 步骤4: 支付完成 */}
        {currentStep === 4 && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">支付提交成功！</h3>
                  <p className="text-muted-foreground mt-2">
                    您的支付凭证已提交，我们将在1-5分钟内验证您的支付
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>交易ID:</span>
                      <span className="font-mono">
                        {currentTransaction?.trx_id || currentTransaction?.id || 'TRX_' + Date.now()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>支付金额:</span>
                      <span>{checkoutData?.amount} {checkoutData?.ccy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>提交时间:</span>
                      <span>{new Date().toLocaleString('zh-CN')}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => {
                  // 重置所有状态
                  setCurrentStep(0);
                  setCheckoutId('');
                  setCheckoutData(null);
                  setAuthToken('');
                  setPaymentMethods([]);
                  setSelectedPaymentMethod('');
                  setCurrentTransaction(null);
                  setPaymentAccountInfo(null);
                  setError('');
                  setCountdown(null);
                  
                  // 重置创建表单
                  setCreateForm({
                    req_id: '',
                    ccy: 'INR',
                    amount: '',
                    product_id: '',
                    return_url: '',
                    notify_url: ''
                  });
                  
                  // 清理倒计时器
                  if (countdownRef.current) {
                    clearInterval(countdownRef.current);
                  }
                }}>
                  开始新的支付
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};