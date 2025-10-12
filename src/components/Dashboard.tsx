import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const transactionData = [
  { name: '周一', collection: 85000, payout: 45000, recharge: 12000 },
  { name: '周二', collection: 120000, payout: 68000, recharge: 18000 },
  { name: '周三', collection: 95000, payout: 52000, recharge: 15000 },
  { name: '周四', collection: 150000, payout: 89000, recharge: 22000 },
  { name: '周五', collection: 180000, payout: 125000, recharge: 28000 },
  { name: '周六', collection: 165000, payout: 98000, recharge: 25000 },
  { name: '周日', collection: 140000, payout: 75000, recharge: 20000 }
];

const settlementData = [
  { name: '第1周', amount: 1650.75 },
  { name: '第2周', amount: 1850.50 },
  { name: '第3周', amount: 2120.25 },
  { name: '第4周', amount: 1980.80 }
];

const paymentMethodData = [
  { name: 'UPI', value: 45, amount: 2850000, color: '#0088FE' },
  { name: '银行卡', value: 30, amount: 1900000, color: '#00C49F' },
  { name: 'USDT', value: 15, amount: 950000, color: '#FFBB28' },
  { name: '其他', value: 10, amount: 630000, color: '#FF8042' }
];

const currencyData = [
  { name: 'INR', value: 70, amount: 4455000, color: '#8884d8' },
  { name: 'USDT', value: 20, amount: 1270000, color: '#82ca9d' },
  { name: 'USD', value: 10, amount: 635000, color: '#ffc658' }
];

const recentTransactions = [
  { id: 'COL001', type: 'collection', uid: 'user_12345', amount: 15000, currency: 'INR', method: 'UPI', status: 'success', time: '2 分钟前' },
  { id: 'PAY002', type: 'payout', uid: 'user_67890', amount: 8500, currency: 'INR', method: '银行卡', status: 'pending', time: '5 分钟前' },
  { id: 'RCH003', type: 'recharge', uid: 'user_54321', amount: 500, currency: 'USDT', method: 'USDT', status: 'success', time: '10 分钟前' },
  { id: 'COL004', type: 'collection', uid: 'user_98765', amount: 25000, currency: 'INR', method: 'UPI', status: 'failed', time: '15 分钟前' },
  { id: 'PAY005', type: 'payout', uid: 'user_11111', amount: 12000, currency: 'INR', method: '银行卡', status: 'success', time: '20 分钟前' }
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>首页</h1>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日代收</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,85,450</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日代付</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹95,680</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-0.5%</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本周结算</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,120.25</div>
            <p className="text-xs text-muted-foreground">52笔交易</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">账户余额</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,95,680</div>
            <p className="text-xs text-muted-foreground">多币种总计</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 交易趋势图表 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>本周交易趋势</CardTitle>
            <CardDescription>代收、代付、充值交易金额变化（INR）</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="collection" fill="hsl(var(--chart-1))" name="代收" />
                <Bar dataKey="payout" fill="hsl(var(--chart-2))" name="代付" />
                <Bar dataKey="recharge" fill="hsl(var(--chart-3))" name="充值" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 结算趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>结算趋势</CardTitle>
            <CardDescription>最近4周的结算金额</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={settlementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                本周预计结算: <span className="font-medium">₹2,120.25</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 支付方式分布 */}
        <Card>
          <CardHeader>
            <CardTitle>支付方式分布</CardTitle>
            <CardDescription>按支付方式统计交易占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {paymentMethodData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span>₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近交易 */}
        <Card>
          <CardHeader>
            <CardTitle>最近交易</CardTitle>
            <CardDescription>最新的交易记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        transaction.type === 'collection' ? 'default' :
                        transaction.type === 'payout' ? 'secondary' : 'outline'
                      }>
                        {transaction.type === 'collection' ? '代收' :
                         transaction.type === 'payout' ? '代付' : '充值'}
                      </Badge>
                      <span className="font-medium">{transaction.uid}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {transaction.id} · {transaction.method}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {transaction.currency === 'INR' ? '₹' : transaction.currency === 'USDT' ? '' : '$'}
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </span>
                    <Badge 
                      variant={
                        transaction.status === 'success' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {transaction.status === 'success' ? '成功' :
                       transaction.status === 'pending' ? '处理中' : '失败'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 支付方式开通状态 */}
        <Card>
          <CardHeader>
            <CardTitle>支付方式状态</CardTitle>
            <CardDescription>当前支付方式开通情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium">UPI 代收</p>
                    <p className="text-sm text-muted-foreground">已开通</p>
                  </div>
                </div>
                <Badge variant="default">正常</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium">银行卡代收</p>
                    <p className="text-sm text-muted-foreground">已开通</p>
                  </div>
                </div>
                <Badge variant="default">正常</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div>
                    <p className="font-medium">USDT 代收</p>
                    <p className="text-sm text-muted-foreground">申请中</p>
                  </div>
                </div>
                <Badge variant="secondary">待审核</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium">UPI 代付</p>
                    <p className="text-sm text-muted-foreground">已开通</p>
                  </div>
                </div>
                <Badge variant="default">正常</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium">银行转账代付</p>
                    <p className="text-sm text-muted-foreground">已开通</p>
                  </div>
                </div>
                <Badge variant="default">正常</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}