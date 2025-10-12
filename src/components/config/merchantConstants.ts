export interface PaymentMethodConfig {
  enabled: boolean;
  status: 'active' | 'pending' | 'inactive';
  feeRate: number;
}

export interface PaymentLimits {
  minAmount: number;
  maxAmount: number;
  dailyLimit: number;
}

export interface MerchantConfigState {
  // 基本信息
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  // API配置
  apiKey: string;
  webhookUrl: string;
  
  // 代收配置
  collectionEnabled: boolean;
  collectionMethods: {
    upi: PaymentMethodConfig;
    bankCard: PaymentMethodConfig;
    usdt: PaymentMethodConfig;
  };
  collectionLimits: PaymentLimits;
  
  // 代付配置
  payoutEnabled: boolean;
  payoutMethods: {
    upi: PaymentMethodConfig;
    bankTransfer: PaymentMethodConfig;
    usdt: PaymentMethodConfig;
  };
  payoutLimits: PaymentLimits;
  
  // 安全配置
  ipWhitelist: string[];
  enableTwoFactor: boolean;
  sessionTimeout: string;
}

export const DEFAULT_CONFIG: MerchantConfigState = {
  // 基本信息
  companyName: '示例商户有限公司',
  contactName: '张经理',
  contactPhone: '+91-9876543210',
  contactEmail: 'contact@example.com',
  
  // API配置
  apiKey: 'sk_live_india_123456789abcdef',
  webhookUrl: 'https://merchant.example.com/webhook',
  
  // 代收配置
  collectionEnabled: true,
  collectionMethods: {
    upi: { enabled: true, status: 'active', feeRate: 0.5 },
    bankCard: { enabled: true, status: 'active', feeRate: 1.0 },
    usdt: { enabled: false, status: 'pending', feeRate: 0.3 }
  },
  collectionLimits: {
    minAmount: 100,
    maxAmount: 1000000,
    dailyLimit: 10000000
  },
  
  // 代付配置
  payoutEnabled: true,
  payoutMethods: {
    upi: { enabled: true, status: 'active', feeRate: 0.2 },
    bankTransfer: { enabled: true, status: 'active', feeRate: 0.1 },
    usdt: { enabled: false, status: 'inactive', feeRate: 0.1 }
  },
  payoutLimits: {
    minAmount: 100,
    maxAmount: 500000,
    dailyLimit: 5000000
  },
  
  // 安全配置
  ipWhitelist: ['103.224.182.242', '203.192.225.116'],
  enableTwoFactor: false,
  sessionTimeout: '30'
};

export const PAYMENT_METHOD_INFO = {
  payin: {
    upi: {
      name: 'UPI (统一支付接口)',
      description: '印度主流支付方式'
    },
    bankCard: {
      name: '银行卡支付',
      description: '借记卡/信用卡支付'
    },
    usdt: {
      name: 'USDT支付',
      description: '加密货币支付'
    }
  },
  payout: {
    upi: {
      name: 'UPI代付',
      description: '实时到账'
    },
    bankTransfer: {
      name: '银行转账',
      description: 'NEFT/RTGS/IMPS'
    },
    usdt: {
      name: 'USDT代付',
      description: '加密货币代付'
    }
  }
};