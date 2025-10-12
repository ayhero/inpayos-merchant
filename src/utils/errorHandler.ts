// 错误类型定义
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// 错误处理类
export class ErrorHandler {
  // 统一错误处理
  static handle(error: any): ApiError {
    // 网络错误
    if (!error.response) {
      return {
        code: 0,
        message: '网络连接失败，请检查网络设置',
        details: error
      };
    }

    // HTTP状态码错误
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          code: 400,
          message: data?.message || '请求参数错误',
          details: data
        };
      case 401:
        return {
          code: 401,
          message: '未授权访问，请重新登录',
          details: data
        };
      case 403:
        return {
          code: 403,
          message: '权限不足',
          details: data
        };
      case 404:
        return {
          code: 404,
          message: '请求的资源不存在',
          details: data
        };
      case 429:
        return {
          code: 429,
          message: '请求过于频繁，请稍后再试',
          details: data
        };
      case 500:
        return {
          code: 500,
          message: '服务器内部错误',
          details: data
        };
      case 502:
        return {
          code: 502,
          message: '网关错误',
          details: data
        };
      case 503:
        return {
          code: 503,
          message: '服务不可用',
          details: data
        };
      default:
        return {
          code: status,
          message: data?.message || '未知错误',
          details: data
        };
    }
  }

  // 是否为网络错误
  static isNetworkError(error: any): boolean {
    return !error.response;
  }

  // 是否为认证错误
  static isAuthError(error: any): boolean {
    return error.response?.status === 401;
  }

  // 是否为权限错误
  static isPermissionError(error: any): boolean {
    return error.response?.status === 403;
  }

  // 格式化错误消息
  static formatMessage(error: ApiError): string {
    if (error.code === 0) {
      return error.message;
    }
    return `[${error.code}] ${error.message}`;
  }
}

// 重试机制
export class RetryHandler {
  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // 最后一次尝试失败
        if (i === maxRetries) {
          throw lastError;
        }

        // 如果是认证错误或权限错误，不重试
        if (ErrorHandler.isAuthError(error) || ErrorHandler.isPermissionError(error)) {
          throw lastError;
        }

        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }

    throw lastError;
  }
}

// 日志工具
export class Logger {
  private static isDevelopment = import.meta.env.DEV;
  private static enableDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true';

  static debug(message: string, ...args: any[]): void {
    if (this.isDevelopment && this.enableDebug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  static error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, ...args);
    
    // 在生产环境可以集成错误监控服务
    if (!this.isDevelopment) {
      // TODO: 集成Sentry或其他错误监控服务
      // Sentry.captureException(new Error(message));
    }
  }
}
