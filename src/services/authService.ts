import { api, ApiResponse } from './api';
import { User } from '@/store/authStore';

// 登录请求参数
export interface LoginRequest {
  email: string;
  password?: string; // 密码登录时必需
  twoFactorCode?: string; // G2FA登录时必需
  loginType: 'password' | 'g2fa'; // 登录方式
}

// 后端API登录响应格式
export interface BackendLoginResponse {
  token: string;
}

// 登录响应
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

// 注册请求参数
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  companyName: string;
  contactPhone: string;
  emailVerificationCode?: string; // 邮箱验证码
}

// 认证服务
export const authService = {
  // 登录
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      // 根据登录类型构建请求数据
      let requestData: any = {
        email: credentials.email
      };

      if (credentials.loginType === 'password') {
        if (!credentials.password) {
          return {
            code: "4000",
            msg: '密码不能为空',
            success: false,
            data: {
              user: {
                id: '',
                username: '',
                email: '',
                companyName: '',
                role: 'merchant',
                permissions: []
              },
              token: ''
            }
          };
        }
        requestData.password = credentials.password;
      } else if (credentials.loginType === 'g2fa') {
        if (!credentials.twoFactorCode) {
          return {
            code: "4000",
            msg: 'G2FA验证码不能为空',
            success: false,
            data: {
              user: {
                id: '',
                username: '',
                email: '',
                companyName: '',
                role: 'merchant',
                permissions: []
              },
              token: ''
            }
          };
        }
        requestData.code = credentials.twoFactorCode;
      }

      // 调用后端登录API
      const response = await api.post<BackendLoginResponse>('/auth', requestData);
      
      // 检查响应是否成功
      if (response.code === "0000") {
        // 构建用户信息（从邮箱提取用户名，实际项目中应该从用户信息接口获取）
        const user: User = {
          id: 'merchant_' + Date.now(), // 实际应该从API获取
          username: credentials.email.split('@')[0],
          email: credentials.email,
          companyName: '商户公司', // 实际应该从API获取
          role: 'merchant',
          permissions: ['dashboard', 'collection', 'payout', 'config'],
        };

        return {
          code: "0000",
          msg: '登录成功',
          success: true,
          data: {
            user,
            token: response.data.token,
            refreshToken: '', // 后端暂无提供
            expiresIn: 3600 // 默认1小时
          }
        };
      } else {
        return {
          code: response.code,
          msg: response.msg || '登录失败',
          success: false,
          data: {
            user: {
              id: '',
              username: '',
              email: '',
              companyName: '',
              role: 'merchant',
              permissions: []
            },
            token: ''
          }
        };
      }
    } catch (error: any) {
      // 处理网络错误或其他异常
      let errorMessage = '登录失败，请稍后重试';
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        code: "5000",
        msg: errorMessage,
        success: false,
        data: {
          user: {
            id: '',
            username: '',
            email: '',
            companyName: '',
            role: 'merchant',
            permissions: []
          },
          token: ''
        }
      };
    }
  },

  // 注册
  register: async (userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      // 调用后端注册接口
      const response = await api.post<null>('/register', {
        email: userData.email,
        password: userData.password,
        nickname: userData.username,
        verify_code: userData.emailVerificationCode,
        company_name: userData.companyName,
        phone: userData.contactPhone
      });
      
      if (response.code === "0000") {
        // 注册成功后，构建用户信息
        const user: User = {
          id: 'merchant_' + Date.now(),
          username: userData.username,
          email: userData.email,
          companyName: userData.companyName,
          role: 'merchant',
          permissions: ['dashboard', 'collection', 'payout', 'config']
        };

        return {
          code: "0000",
          msg: response.msg || '注册成功',
          success: true,
          data: {
            user,
            token: 'temp_token_' + Date.now(), // 注册成功后需要用户重新登录
            refreshToken: '',
            expiresIn: 3600
          }
        };
      } else {
        return {
          code: response.code,
          msg: response.msg || '注册失败',
          success: false,
          data: {
            user: {
              id: '',
              username: '',
              email: '',
              companyName: '',
              role: 'merchant',
              permissions: []
            },
            token: ''
          }
        };
      }
    } catch (error: any) {
      let errorMessage = '注册失败，请稍后重试';
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        code: "5000",
        msg: errorMessage,
        success: false,
        data: {
          user: {
            id: '',
            username: '',
            email: '',
            companyName: '',
            role: 'merchant',
            permissions: []
          },
          token: ''
        }
      };
    }
  },

    // 登出
  logout: () => {
    return api.post('/auth/logout');
  },

  // 刷新token
  refreshToken: (refreshToken: string) => {
    return api.post('/auth/refresh', { refreshToken });
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  // 修改密码
  changePassword: async (newPassword: string): Promise<ApiResponse<null>> => {
    try {
      const response = await api.post<null>('/password/change', {
        new_password: newPassword
      });
      
      return {
        code: response.code,
        msg: response.msg || '密码修改成功',
        success: response.code === "0000",
        data: null
      };
    } catch (error: any) {
      let errorMessage = '密码修改失败，请稍后重试';
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        code: "5000",
        msg: errorMessage,
        success: false,
        data: null
      };
    }
  },

    // 忘记密码
  forgotPassword: (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },

  // 发送邮箱验证码
  sendEmailVerificationCode: async (email: string, type: string = 'register'): Promise<ApiResponse<null>> => {
    try {
      const response = await api.post<null>('/verifycode/send', {
        email: email,
        type: type
      });
      
      return {
        code: response.code,
        msg: response.msg || '验证码已发送',
        success: response.code === "0000",
        data: null
      };
    } catch (error: any) {
      let errorMessage = '发送验证码失败，请稍后重试';
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        code: "5000",
        msg: errorMessage,
        success: false,
        data: null
      };
    }
  },

  // 重置密码
  resetPassword: async (email: string, verificationCode: string): Promise<ApiResponse<null>> => {
    try {
      const response = await api.post<null>('/password/reset', {
        email: email,
        verification_code: verificationCode
      });
      
      return {
        code: response.code,
        msg: response.msg || '密码重置成功',
        success: response.code === "0000",
        data: null
      };
    } catch (error: any) {
      let errorMessage = '密码重置失败，请稍后重试';
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        code: "5000",
        msg: errorMessage,
        success: false,
        data: null
      };
    }
  }
};
