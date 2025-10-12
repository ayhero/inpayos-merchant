import { api, ApiResponse } from './api';

// 验证码类型
export type VerifyCodeType = 'register' | 'login' | 'reset_g2fa';

// 发送验证码请求
export interface SendVerifyCodeRequest {
  type: VerifyCodeType;
  email: string;
}

// 验证码服务类
export class VerifyCodeService {
  // 发送验证码
  static async sendVerifyCode(type: VerifyCodeType, email: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/merchant/verifycode/send', { type, email });
      return response;
    } catch (error) {
      console.error('发送验证码失败:', error);
      throw error;
    }
  }
}

export default VerifyCodeService;
