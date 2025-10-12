import { MerchantConfigState } from './merchantConstants';

export const updateConfig = (
  prev: MerchantConfigState, 
  key: keyof MerchantConfigState, 
  value: any
): MerchantConfigState => {
  return {
    ...prev,
    [key]: value
  };
};

export const updateNestedConfig = (
  prev: MerchantConfigState,
  section: keyof MerchantConfigState,
  key: string,
  value: any
): MerchantConfigState => {
  const currentSection = prev[section];
  if (typeof currentSection === 'object' && currentSection !== null) {
    return {
      ...prev,
      [section]: {
        ...currentSection,
        [key]: value
      }
    };
  }
  return prev;
};

export const saveConfiguration = async (config: MerchantConfigState): Promise<void> => {
  // 这里应该调用实际的API保存配置
  console.log('保存配置:', config);
  
  // 模拟API调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% 成功率
        resolve();
      } else {
        reject(new Error('保存失败'));
      }
    }, 1000);
  });
};
