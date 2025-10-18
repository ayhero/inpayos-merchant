# 状态常量系统使用指南

## 概述

这个文档描述了如何在前端项目中使用统一的状态常量系统，该系统与后端的状态常量保持同步。

## 文件结构

```
src/
├── constants/
│   └── status.ts          # 状态常量定义和工具函数
└── components/
    └── examples/
        └── StatusExamples.tsx  # 使用示例组件
```

## 状态常量

### 可用状态

系统包含以下26个状态常量，与后端 `protocol/const.go` 中的 `Status*` 常量一一对应：

```typescript
// 核心状态
STATUS.ON          // "on"          - 开启
STATUS.OFF         // "off"         - 关闭
STATUS.PENDING     // "pending"     - 待处理
STATUS.PROCESSING  // "processing"  - 处理中
STATUS.SUCCESS     // "success"     - 成功
STATUS.FAILED      // "failed"      - 失败
STATUS.CANCELLED   // "cancelled"   - 已取消
STATUS.EXPIRED     // "expired"     - 已过期

// 交易状态
STATUS.SUBMITTED   // "submitted"   - 已提交
STATUS.CONFIRMING  // "confirming"  - 确认中
STATUS.COMPLETED   // "completed"   - 已完成
STATUS.TIMEOUT     // "timeout"     - 超时
STATUS.REJECTED    // "rejected"    - 已拒绝

// 账户状态
STATUS.ACTIVE      // "active"      - 活跃
STATUS.INACTIVE    // "inactive"    - 非活跃
STATUS.SUSPENDED   // "suspended"   - 已暂停
STATUS.BLOCKED     // "blocked"     - 已屏蔽
STATUS.LOCKED      // "locked"      - 已锁定

// 其他状态
STATUS.APPROVED    // "approved"    - 已批准
STATUS.DENIED      // "denied"      - 已拒绝
STATUS.ENABLED     // "enabled"     - 已启用
STATUS.DISABLED    // "disabled"    - 已禁用
STATUS.VERIFIED    // "verified"    - 已验证
STATUS.UNVERIFIED  // "unverified"  - 未验证
STATUS.UNKNOWN     // "unknown"     - 未知
STATUS.ERROR       // "error"       - 错误
```

## 工具函数

### 显示名称
```typescript
import { getStatusDisplayName } from '../constants/status';

const displayName = getStatusDisplayName('pending'); // "待处理"
```

### 状态颜色
```typescript
import { getStatusColor } from '../constants/status';

const color = getStatusColor('success'); // "success"
// 可能的颜色值: "success", "error", "warning", "processing", "info"
```

### 状态判断
```typescript
import { isSuccessStatus, isFailureStatus, isProcessingStatus } from '../constants/status';

if (isSuccessStatus(transaction.status)) {
  // 显示成功相关的UI
}

if (isFailureStatus(transaction.status)) {
  // 显示失败相关的UI
}

if (isProcessingStatus(transaction.status)) {
  // 显示处理中的UI
}
```

### 状态分组
```typescript
import { getStatusGroup } from '../constants/status';

const group = getStatusGroup('processing'); // "PROCESSING"
// 可能的分组: "PROCESSING", "SUCCESS", "FAILED", "INACTIVE"
```

## 使用示例

### 1. 状态徽章组件

```typescript
import React from 'react';
import { getStatusDisplayName, getStatusColor } from '../constants/status';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const displayName = getStatusDisplayName(status);
  const color = getStatusColor(status);
  
  return (
    <span className={`badge badge-${color}`}>
      {displayName}
    </span>
  );
};
```

### 2. 状态过滤器

```typescript
import React from 'react';
import { STATUS, getStatusDisplayName } from '../constants/status';

const StatusFilter: React.FC<{ onFilter: (status: string) => void }> = ({ onFilter }) => {
  const commonStatuses = [
    STATUS.PENDING,
    STATUS.PROCESSING,
    STATUS.SUCCESS,
    STATUS.FAILED,
    STATUS.CANCELLED
  ];

  return (
    <select onChange={(e) => onFilter(e.target.value)}>
      <option value="">全部状态</option>
      {commonStatuses.map(status => (
        <option key={status} value={status}>
          {getStatusDisplayName(status)}
        </option>
      ))}
    </select>
  );
};
```

### 3. 条件渲染

```typescript
import React from 'react';
import { isProcessingStatus, isSuccessStatus, isFailureStatus } from '../constants/status';

const TransactionActions: React.FC<{ transaction: any }> = ({ transaction }) => {
  const { status } = transaction;

  return (
    <div>
      {isProcessingStatus(status) && (
        <button>取消交易</button>
      )}
      {isSuccessStatus(status) && (
        <button>查看收据</button>
      )}
      {isFailureStatus(status) && (
        <button>重试交易</button>
      )}
    </div>
  );
};
```

## 向后兼容性

如果你的项目中已经定义了 `TransactionStatus` 枚举，新的状态常量系统是向后兼容的：

```typescript
// 旧的枚举仍然可以使用
enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  // ...
}

// 新的常量系统提供相同的值
import { STATUS } from '../constants/status';

console.log(STATUS.PENDING === TransactionStatus.PENDING); // true
```

## 最佳实践

1. **使用常量而不是硬编码字符串**
   ```typescript
   // ✅ 好的做法
   if (status === STATUS.SUCCESS) { ... }
   
   // ❌ 避免
   if (status === 'success') { ... }
   ```

2. **使用工具函数进行状态判断**
   ```typescript
   // ✅ 好的做法
   if (isProcessingStatus(status)) { ... }
   
   // ❌ 避免
   if (status === 'pending' || status === 'processing' || status === 'submitted') { ... }
   ```

3. **使用显示名称函数获取用户友好的文本**
   ```typescript
   // ✅ 好的做法
   <span>{getStatusDisplayName(status)}</span>
   
   // ❌ 避免
   <span>{status}</span>
   ```

4. **保持前后端状态常量同步**
   - 后端状态常量定义在 `internal/protocol/const.go`
   - 前端状态常量定义在 `src/constants/status.ts`
   - 任何状态的添加或修改都应该同时更新两个文件

## 故障排除

### TypeScript 编译错误
如果遇到类型错误，确保：
1. 状态常量文件正确导入
2. 状态值与后端常量匹配
3. 类型注解正确使用

### 状态显示不正确
检查：
1. 状态值是否正确传递
2. 显示名称映射是否完整
3. 颜色映射是否正确配置

## 更新指南

当需要添加新状态时：

1. 在后端 `internal/protocol/const.go` 中添加新的 `Status*` 常量
2. 在前端 `src/constants/status.ts` 中添加对应的状态常量
3. 更新显示名称映射 `STATUS_DISPLAY_NAMES`
4. 更新颜色映射 `STATUS_COLORS`
5. 如果需要，更新状态分组逻辑
6. 运行测试确保兼容性

## 支持

如果在使用过程中遇到问题，请检查：
1. 状态常量是否正确导入
2. 后端API返回的状态值是否与前端常量匹配
3. 相关工具函数是否正确使用