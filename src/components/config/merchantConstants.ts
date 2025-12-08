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
  // 基本信息 - 从API加载真实数据
  companyName: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  
  // API配置 - 从API加载真实数据
  apiKey: '',
  webhookUrl: '',
  
  // 代收配置
  collectionEnabled: true,
  collectionMethods: {
    upi: { enabled: false, status: 'inactive', feeRate: 0 },
    bankCard: { enabled: false, status: 'inactive', feeRate: 0 },
    usdt: { enabled: false, status: 'inactive', feeRate: 0 }
  },
  collectionLimits: {
    minAmount: 0,
    maxAmount: 0,
    dailyLimit: 0
  },
  
  // 代付配置
  payoutEnabled: false,
  payoutMethods: {
    upi: { enabled: false, status: 'inactive', feeRate: 0 },
    bankTransfer: { enabled: false, status: 'inactive', feeRate: 0 },
    usdt: { enabled: false, status: 'inactive', feeRate: 0 }
  },
  payoutLimits: {
    minAmount: 0,
    maxAmount: 0,
    dailyLimit: 0
  },
  
  // 安全配置
  ipWhitelist: [],
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