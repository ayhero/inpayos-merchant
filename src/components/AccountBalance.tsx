import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { RefreshCw } from 'lucide-react';
import { accountService, AccountData, AccountListParams } from '../services/accountService';
import { StatusBadge } from './StatusBadge';
import { AccountDetail } from './AccountDetail';



export function AccountBalance() {
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取账户列表
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 简化参数，获取全部数据
      const params: AccountListParams = {
        user_type: 'merchant',
        page: 1,
        size: 100 // 获取足够多的数据
      };

      const response = await accountService.getAccountList(params);
      if (response.success) {
        setAccounts(response.data.records);
      } else {
        setAccounts([]);
        setError(response.msg || '获取数据失败');
      }
    } catch (error: any) {
      console.error('获取账户列表失败:', error);
      setAccounts([]);
      setError(error.message || '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleRefresh = () => {
    fetchAccounts();
  };

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} type="account" />;
  };

  const formatDateTime = (timestamp?: number) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('zh-CN');
  };

  const formatAmount = (amount?: string) => {
    if (!amount) return '0.00';
    return parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleViewDetail = (account: AccountData) => {
    setSelectedAccount(account);
  };



  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">账户余额</h1>
        <Button onClick={handleRefresh} className="gap-2" variant="outline">
          <RefreshCw className="h-4 w-4" />
          刷新
        </Button>
      </div>

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <p className="text-red-500">错误: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* 账户列表 */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-12">加载中...</div>
          ) : !accounts || accounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">暂无数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>账户ID</TableHead>
                  <TableHead>币种</TableHead>
                  <TableHead>总余额</TableHead>
                  <TableHead>可用余额</TableHead>
                  <TableHead>冻结余额</TableHead>
                  <TableHead>保证金</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead>最后活跃时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.account_id}>
                    <TableCell className="font-mono text-xs">{account.account_id}</TableCell>
                    <TableCell>{account.ccy}</TableCell>
                    <TableCell className="font-mono">{formatAmount(account.balance?.balance)}</TableCell>
                    <TableCell className="font-mono text-green-600">{formatAmount(account.balance?.available_balance)}</TableCell>
                    <TableCell className="font-mono text-red-600">{formatAmount(account.balance?.frozen_balance)}</TableCell>
                    <TableCell className="font-mono">{formatAmount(account.balance?.margin_balance)}</TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(account.updated_at)}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(account.last_active_at)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(account)}>
                        查看
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 账户详情对话框 */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="max-w-[45vw] w-[45vw] min-w-[600px]" style={{width: '45vw', maxWidth: '45vw'}}>
          <DialogHeader>
            <DialogTitle>账户详情</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <AccountDetail 
              account={selectedAccount}
              formatDateTime={formatDateTime}
              formatAmount={formatAmount}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
