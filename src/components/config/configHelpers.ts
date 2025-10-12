import { MerchantConfigState } from './merchantConstants';

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return '已开通';
    case 'pending':
      return '待开通';
    case 'inactive':
      return '未开通';
    default:
      return '未知';
  }
};

export const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'active':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'inactive':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const updateConfig = (
  config: MerchantConfigState,
  key: keyof MerchantConfigState,
  value: any
): MerchantConfigState => {
  return { ...config, [key]: value };
};

export const updateNestedConfig = (
  config: MerchantConfigState,
  section: keyof MerchantConfigState,
  key: string,
  value: any
): MerchantConfigState => {
  const currentSection = config[section];
  if (typeof currentSection === 'object' && currentSection !== null) {
    return {
      ...config,
      [section]: {
        ...currentSection,
        [key]: value
      }
    };
  }
  return config;
};

export const saveConfiguration = (config: MerchantConfigState) => {
  // 模拟保存配置到服务器
  console.log('保存配置:', config);
  return Promise.resolve({ success: true });
};