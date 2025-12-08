import { api, ApiResponse } from './api';

// API密钥信息
export interface Secret {
  id: number;
  user_id: string;
  app_id: string;
  app_name: string;
  secret_key: string;
  status: string;
  expires_at: number;
  created_at: number;
  updated_at: number;
}

// 用户信息接口类型定义
export interface UserInfo {
  user_id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  status: number;
  has_g2fa: boolean;
  white_list_ip?: string;  // IP白名单，逗号分隔的字符串
  notify_url?: string;     // 回调URL
  secrets?: Secret[];      // API密钥列表
}

// 用户服务类
export class UserService {
  // 获取用户信息
  static async getUserInfo(): Promise<ApiResponse<UserInfo>> {
    try {
      const response = await api.post<UserInfo>('/info', {});
      return response;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }
}

export default UserService;
