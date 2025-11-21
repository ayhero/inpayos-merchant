import { Badge } from '../ui/badge';

interface PaymentMethodDisplayProps {
  method?: string;
  mode?: 'simple' | 'detailed';
  className?: string;
}

/**
 * 支付方式显示组件
 * 用于统一显示支付方式的名称和样式
 */
export function PaymentMethodDisplay({ 
  method, 
  mode = 'simple',
  className = '' 
}: PaymentMethodDisplayProps) {
  if (!method || method === '-') {
    return <span className={`text-gray-500 ${className}`}>-</span>;
  }

  // 支付方式映射表
  const methodMapping: { [key: string]: { name: string; badge?: string; color?: string } } = {
    'upi': { name: 'UPI支付', badge: 'UPI', color: 'bg-blue-100 text-blue-800' },
    'bank_transfer': { name: '银行转账', badge: '银行', color: 'bg-green-100 text-green-800' },
    'bank_card': { name: '银行卡', badge: '银行卡', color: 'bg-purple-100 text-purple-800' },
    'credit_card': { name: '信用卡', badge: '信用卡', color: 'bg-orange-100 text-orange-800' },
    'debit_card': { name: '借记卡', badge: '借记卡', color: 'bg-indigo-100 text-indigo-800' },
    'wallet': { name: '电子钱包', badge: '钱包', color: 'bg-yellow-100 text-yellow-800' },
    'netbanking': { name: '网银', badge: '网银', color: 'bg-teal-100 text-teal-800' },
    'usdt': { name: 'USDT', badge: 'USDT', color: 'bg-gray-100 text-gray-800' },
    'paytm': { name: 'Paytm', badge: 'Paytm', color: 'bg-blue-100 text-blue-800' },
    'phonepe': { name: 'PhonePe', badge: 'PhonePe', color: 'bg-purple-100 text-purple-800' },
    'googlepay': { name: 'Google Pay', badge: 'GPay', color: 'bg-green-100 text-green-800' }
  };

  const normalizedMethod = method.toLowerCase();
  const methodInfo = methodMapping[normalizedMethod] || { 
    name: method, 
    badge: method.toUpperCase(),
    color: 'bg-gray-100 text-gray-800'
  };

  if (mode === 'detailed') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge className={`text-xs ${methodInfo.color}`}>
          {methodInfo.badge}
        </Badge>
        <span className="text-sm">{methodInfo.name}</span>
      </div>
    );
  }

  return (
    <span className={`text-sm ${className}`}>
      {methodInfo.name}
    </span>
  );
}