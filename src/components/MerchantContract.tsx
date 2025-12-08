import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { RefreshCw } from 'lucide-react';
import { contractService, Contract, ContractListParams } from '../services/contractService';
import { toast } from '../utils/toast';
import { ContractDetail } from './ContractDetail';
import { getStatusDisplayName, getStatusColor } from '../constants/status';
import { useAuthStore } from '../store/authStore';

export function MerchantContract() {
  const { currentUser } = useAuthStore();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    if (!currentUser?.user_id) return;
    
    setLoading(true);
    setError(null);
    try {
      const params: ContractListParams = {
        page: 1,
        size: 50,
        sid: currentUser.user_id,
        stype: 'merchant'
      };

      const response = await contractService.getContractList(params);
      if (response.success) {
        setContracts(response.data.list);
      } else {
        setContracts([]);
        setError(response.msg || '获取数据失败');
      }
    } catch (error: any) {
      console.error('获取商户合约列表失败:', error);
      setContracts([]);
      setError(error.message || '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.user_id]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleRefresh = () => {
    fetchContracts();
  };

  const getStatusBadge = (status: string) => {
    const displayName = getStatusDisplayName(status);
    const color = getStatusColor(status);
    
    const getVariantAndClass = (color: string) => {
      switch (color) {
        case 'success':
          return { variant: 'default' as const, className: 'bg-green-500' };
        case 'error':
          return { variant: 'destructive' as const, className: '' };
        case 'warning':
          return { variant: 'secondary' as const, className: 'bg-yellow-500' };
        case 'info':
          return { variant: 'secondary' as const, className: 'bg-blue-500' };
        default:
          return { variant: 'secondary' as const, className: 'bg-gray-500' };
      }
    };
    
    const { variant, className } = getVariantAndClass(color);
    return <Badge variant={variant} className={className}>{displayName}</Badge>;
  };

  const formatDateTime = (timestamp: number) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleViewDetail = async (contract: Contract) => {
    try {
      const response = await contractService.getContractDetail({ contract_id: contract.contract_id });
      if (response.success) {
        setSelectedContract(response.data);
      } else {
        toast.error('获取合约详情失败', response.msg);
      }
    } catch (error) {
      console.error('获取合约详情失败:', error);
      toast.error('获取合约详情失败', '网络错误，请稍后重试');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">我的合约</h1>
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

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-12">加载中...</div>
          ) : !contracts || contracts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">暂无数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>合约ID</TableHead>
                  <TableHead>生效时间</TableHead>
                  <TableHead>过期时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <span className="font-mono text-sm">{contract.contract_id}</span>
                    </TableCell>
                    <TableCell>{formatDateTime(contract.start_at)}</TableCell>
                    <TableCell>{contract.expired_at ? formatDateTime(contract.expired_at) : '永久'}</TableCell>
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(contract)}>
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="max-w-[60vw] w-[60vw] min-w-[700px]" style={{width: '60vw', maxWidth: '60vw'}}>
          <DialogHeader>
            <DialogTitle>合约详情</DialogTitle>
          </DialogHeader>
          {selectedContract && <ContractDetail contract={selectedContract} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}