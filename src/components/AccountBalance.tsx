import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ArrowUpRight, ArrowDownLeft, Plus, ArrowRightLeft, Minus } from 'lucide-react';

const accountBalances = [
  {
    currency: 'INR',
    balance: 8956805.50,
    availableBalance: 8956805.50,
    frozenBalance: 0,
    symbol: '₹',
    isPrimary: true
  },
  {
    currency: 'USDT',
    balance: 12500.75,
    availableBalance: 12000.75,
    frozenBalance: 500.00,
    symbol: '₮',
    isPrimary: false
  },
  {
    currency: 'USD',
    balance: 5250.25,
    availableBalance: 5250.25,
    frozenBalance: 0,
    symbol: '$',
    isPrimary: false
  }
];

const balanceHistory = [
  {
    id: 'BAL001',
    type: 'credit',
    currency: 'INR',
    amount: 15000.00,
    balance: 8956805.50,
    description: '代收入账',
    transactionId: 'COL005',
    createTime: '2024-01-15 18:25:18'
  },
  {
    id: 'BAL002',
    type: 'debit',
    currency: 'INR',
    amount: 25000.00,
    balance: 8941805.50,
    description: '代付支出',
    transactionId: 'PAY001',
    createTime: '2024-01-15 17:30:00'
  },
  {
    id: 'BAL003',
    type: 'credit',
    currency: 'USDT',
    amount: 500.00,
    balance: 12500.75,
    description: '充值入账',
    transactionId: 'RCH005',
    createTime: '2024-01-15 16:45:12'
  },
  {
    id: 'BAL004',
    type: 'debit',
    currency: 'USDT',
    amount: 300.00,
    balance: 12000.75,
    description: '代付支出',
    transactionId: 'PAY003',
    createTime: '2024-01-15 15:20:30'
  },
  {
    id: 'BAL005',
    type: 'credit',
    currency: 'INR',
    amount: 50000.00,
    balance: 8966805.50,
    description: '充值入账',
    transactionId: 'RCH001',
    createTime: '2024-01-15 14:15:45'
  }
];

export function AccountBalance() {
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [rechargeMethod, setRechargeMethod] = useState('');
  
  // 筛选条件
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const handleWithdraw = () => {
    console.log('提现:', { amount: withdrawAmount, currency: selectedCurrency, method: withdrawMethod });
    setShowWithdrawDialog(false);
    setWithdrawAmount('');
    setWithdrawMethod('');
  };

  const handleRecharge = () => {
    console.log('充值:', { amount: rechargeAmount, currency: selectedCurrency, method: rechargeMethod });
    setShowRechargeDialog(false);
    setRechargeAmount('');
    setRechargeMethod('');
  };

  const handleExchange = () => {
    console.log('币种兑换');
    setShowExchangeDialog(false);
  };

  const getTypeIcon = (type: string) => {
    return type === 'credit' ? 
      <ArrowDownLeft className="h-4 w-4 text-green-600" /> : 
      <ArrowUpRight className="h-4 w-4 text-red-600" />;
  };

  const getTypeBadge = (type: string) => {
    return type === 'credit' ? 
      <Badge variant="default" className="bg-green-100 text-green-800">入账</Badge> : 
      <Badge variant="destructive">出账</Badge>;
  };

  // 筛选数据
  const filteredHistory = balanceHistory.filter((record) => {
    const matchesCurrency = currencyFilter === 'all' || record.currency === currencyFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesDate = !dateFilter || record.createTime.startsWith(dateFilter);
    return matchesCurrency && matchesType && matchesDate;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>账户余额</h1>
      </div>

      {/* 多币种账户卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountBalances.map((account) => (
          <Card key={account.currency} className={account.isPrimary ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{account.currency} 账户</span>
                {account.isPrimary && <Badge variant="outline">主账户</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-medium">可用余额</label>
                <p className="text-2xl font-bold text-green-600">
                  {account.symbol}{account.availableBalance.toLocaleString()} {account.currency}
                </p>
              </div>
              <div>
                <label className="font-medium">冻结余额</label>
                <p className="text-lg">
                  {account.symbol}{account.frozenBalance.toLocaleString()} {account.currency}
                </p>
              </div>
              <div>
                <label className="font-medium">总余额</label>
                <p className="text-lg font-medium">
                  {account.symbol}{account.balance.toLocaleString()} {account.currency}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 操作按钮组 - 无标题 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  充值
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>账户充值</DialogTitle>
                  <DialogDescription>向您的账户充值资金</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="rechargeCurrency">币种</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (印度卢比)</SelectItem>
                        <SelectItem value="USDT">USDT (泰达币)</SelectItem>
                        <SelectItem value="USD">USD (美元)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rechargeAmount">充值金额</Label>
                    <Input
                      id="rechargeAmount"
                      type="number"
                      placeholder="请输入充值金额"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>充值方式</Label>
                    <Select value={rechargeMethod} onValueChange={setRechargeMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择充值方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">银行转账</SelectItem>
                        <SelectItem value="upi">UPI支付</SelectItem>
                        <SelectItem value="crypto">加密货币</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleRecharge}>确认充值</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Minus className="h-4 w-4" />
                  提现
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>账户提现</DialogTitle>
                  <DialogDescription>从您的账户提现资金</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawCurrency">币种</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (印度卢比)</SelectItem>
                        <SelectItem value="USDT">USDT (泰达币)</SelectItem>
                        <SelectItem value="USD">USD (美元)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="withdrawAmount">提现金额</Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      placeholder="请输入提现金额"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>提现方式</Label>
                    <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择提现方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">银行转账</SelectItem>
                        <SelectItem value="upi">UPI支付</SelectItem>
                        <SelectItem value="crypto">加密货币</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleWithdraw}>确认提现</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showExchangeDialog} onOpenChange={setShowExchangeDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  币种兑换
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>币种兑换</DialogTitle>
                  <DialogDescription>在不同币种间进行资金兑换</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-gray-600">币种兑换功能正在开发中...</p>
                </div>
                <DialogFooter>
                  <Button onClick={handleExchange}>确认兑换</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* 余额变动记录 - 无标题 */}
      <Card>
        <CardContent className="pt-6">
          {/* 筛选条件 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="所有币种" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有币种</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="所有类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类型</SelectItem>
                  <SelectItem value="credit">入账</SelectItem>
                  <SelectItem value="debit">出账</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                className="w-[180px]"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="选择日期"
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>类型</TableHead>
                <TableHead>币种</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>余额</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(record.type)}
                      {getTypeBadge(record.type)}
                    </div>
                  </TableCell>
                  <TableCell>{record.currency}</TableCell>
                  <TableCell className={record.type === 'credit' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {record.type === 'credit' ? '+' : '-'}{record.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{record.balance.toLocaleString()}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.createTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
