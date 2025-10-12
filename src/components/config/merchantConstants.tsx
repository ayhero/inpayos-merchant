export interface MerchantConfigState {
  companyName: string;
  businessLicense: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  businessAddress: string;
  apiUrl: string;
  apiKey: string;
  webhookUrl: string;
  enableEmailNotification: boolean;
  emailRecipients: string;
  enableSmsNotification: boolean;
  smsRecipients: string;
  ipWhitelist: string[];
  collectionMethods: {
    upi: {
      enabled: boolean;
      status: string;
      feeRate: number;
    };
    bankCard: {
      enabled: boolean;
      status: string;
      feeRate: number;
    };
    usdt: {
      enabled: boolean;
      status: string;
      feeRate: number;
    };
  };
  payoutMethods: {
    upi: {
      enabled: boolean;
      status: string;
      feeRate: number;
    };
    bankTransfer: {
      enabled: boolean;
      status: string;
      feeRate: number;
    };
    usdt: {
      enabled: boolean;
      status: string;
      feeRate: number;
    };
  };
}

export const DEFAULT_CONFIG: MerchantConfigState = {
  companyName: 'InPay测试商户',
  businessLicense: '91330000000000000X',
  contactName: '张三',
  contactPhone: '+86 138 0000 0000',
  contactEmail: 'merchant@inpay.com',
  businessAddress: '浙江省杭州市西湖区文三路123号',
  apiUrl: 'https://api.inpay.com/v1',
  apiKey: 'sk_test_••••••••••••••••••••••••••••••••',
  webhookUrl: 'https://merchant.inpay.com/webhook',
  enableEmailNotification: true,
  emailRecipients: 'merchant@inpay.com',
  enableSmsNotification: false,
  smsRecipients: '',
  ipWhitelist: [],
  collectionMethods: {
    upi: {
      enabled: true,
      status: 'active',
      feeRate: 2.5
    },
    bankCard: {
      enabled: true,
      status: 'active',
      feeRate: 3.0
    },
    usdt: {
      enabled: false,
      status: 'inactive',
      feeRate: 1.5
    }
  },
  payoutMethods: {
    upi: {
      enabled: true,
      status: 'active',
      feeRate: 2.0
    },
    bankTransfer: {
      enabled: true,
      status: 'active',
      feeRate: 2.5
    },
    usdt: {
      enabled: false,
      status: 'inactive',
      feeRate: 1.0
    }
  }
};

export const PAYMENT_METHOD_INFO = {
  collection: {
    upi: {
      description: '支持所有主要的UPI应用，包括GPay、PhonePe、Paytm等，24/7实时到账'
    },
    bankCard: {
      description: '支持Visa、MasterCard、RuPay等主要银行卡，安全便捷'
    },
    usdt: {
      description: '支持USDT稳定币支付，适合跨境交易和大额支付'
    }
  },
  payout: {
    upi: {
      description: '通过UPI快速转账到用户账户，实时到账'
    },
    bankTransfer: {
      description: '直接转账到银行账户，支持NEFT/RTGS/IMPS'
    },
    usdt: {
      description: '使用USDT进行代付，适合国际转账'
    }
  }
};
