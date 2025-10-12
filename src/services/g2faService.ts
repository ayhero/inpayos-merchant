import { api, ApiResponse } from './api';

// G2FA相关接口类型定义
export interface G2FAKeyResponse {
  g2fa_key: string;
  qr_code: string;
}

// G2FA服务类
export class G2FAService {
  // 获取G2FA密钥和二维码
  static async getG2FAKey(): Promise<ApiResponse<G2FAKeyResponse>> {
    try {
      const response = await api.post<G2FAKeyResponse>('/g2fa/new', {});
      return response;
    } catch (error) {
      console.error('获取G2FA密钥失败:', error);
      throw error;
    }
  }

  // 验证G2FA代码并绑定（支持邮箱验证码）
  static async verifyAndBind(g2faCode: string, emailCode?: string): Promise<ApiResponse<any>> {
    try {
      const requestData: any = { code: g2faCode };
      if (emailCode) {
        requestData.verify_code = emailCode; // 使用后端期望的参数名 verify_code
      }
      const response = await api.post('/g2fa/bind', requestData);
      return response;
    } catch (error) {
      console.error('G2FA绑定失败:', error);
      throw error;
    }
  }
}

export default G2FAService;
