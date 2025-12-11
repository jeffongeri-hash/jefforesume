import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  LogOut, 
  PieChart, 
  TrendingUp,
  Shield,
  AlertTriangle
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  average_cost: number;
  current_price: number | null;
  sector: string | null;
  asset_type: string | null;
}

interface Trade {
  id: string;
  symbol: string;
  name: string;
  trade_type: string;
  shares: number;
  price: number;
  total_value: number;
  trade_date: string;
  notes: string | null;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [holdingDialogOpen, setHoldingDialogOpen] = useState(false);
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Holding form state
  const [holdingForm, setHoldingForm] = useState({
    symbol: '',
    name: '',
    shares: '',
    average_cost: '',
    current_price: '',
    sector: '',
    asset_type: 'Stock'
  });

  // Trade form state
  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    name: '',
    trade_type: 'BUY',
    shares: '',
    price: '',
    trade_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      } else {
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      } else {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    setIsAdmin(!!data);
    setLoading(false);
    
    if (data) {
      fetchData();
    }
  };

  const fetchData = async () => {
    const [holdingsRes, tradesRes] = await Promise.all([
      supabase.from('holdings').select('*').order('symbol'),
      supabase.from('trades').select('*').order('trade_date', { ascending: false })
    ]);

    if (holdingsRes.data) setHoldings(holdingsRes.data);
    if (tradesRes.data) setTrades(tradesRes.data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const resetHoldingForm = () => {
    setHoldingForm({
      symbol: '',
      name: '',
      shares: '',
      average_cost: '',
      current_price: '',
      sector: '',
      asset_type: 'Stock'
    });
    setEditingHolding(null);
  };

  const resetTradeForm = () => {
    setTradeForm({
      symbol: '',
      name: '',
      trade_type: 'BUY',
      shares: '',
      price: '',
      trade_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingTrade(null);
  };

  const openEditHolding = (holding: Holding) => {
    setEditingHolding(holding);
    setHoldingForm({
      symbol: holding.symbol,
      name: holding.name,
      shares: holding.shares.toString(),
      average_cost: holding.average_cost.toString(),
      current_price: holding.current_price?.toString() || '',
      sector: holding.sector || '',
      asset_type: holding.asset_type || 'Stock'
    });
    setHoldingDialogOpen(true);
  };

  const openEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setTradeForm({
      symbol: trade.symbol,
      name: trade.name,
      trade_type: trade.trade_type,
      shares: trade.shares.toString(),
      price: trade.price.toString(),
      trade_date: trade.trade_date,
      notes: trade.notes || ''
    });
    setTradeDialogOpen(true);
  };

  const saveHolding = async () => {
    const holdingData = {
      symbol: holdingForm.symbol.toUpperCase(),
      name: holdingForm.name,
      shares: parseFloat(holdingForm.shares),
      average_cost: parseFloat(holdingForm.average_cost),
      current_price: holdingForm.current_price ? parseFloat(holdingForm.current_price) : null,
      sector: holdingForm.sector || null,
      asset_type: holdingForm.asset_type
    };

    if (editingHolding) {
      const { error } = await supabase
        .from('holdings')
        .update(holdingData)
        .eq('id', editingHolding.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Holding updated successfully' });
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from('holdings')
        .insert([holdingData]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Holding added successfully' });
        fetchData();
      }
    }

    setHoldingDialogOpen(false);
    resetHoldingForm();
  };

  const saveTrade = async () => {
    const tradeData = {
      symbol: tradeForm.symbol.toUpperCase(),
      name: tradeForm.name,
      trade_type: tradeForm.trade_type,
      shares: parseFloat(tradeForm.shares),
      price: parseFloat(tradeForm.price),
      trade_date: tradeForm.trade_date,
      notes: tradeForm.notes || null
    };

    if (editingTrade) {
      const { error } = await supabase
        .from('trades')
        .update(tradeData)
        .eq('id', editingTrade.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Trade updated successfully' });
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from('trades')
        .insert([tradeData]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Trade added successfully' });
        fetchData();
      }
    }

    setTradeDialogOpen(false);
    resetTradeForm();
  };

  const deleteHolding = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holding?')) return;

    const { error } = await supabase.from('holdings').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Holding removed successfully' });
      fetchData();
    }
  };

  const deleteTrade = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return;

    const { error } = await supabase.from('trades').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Trade removed successfully' });
      fetchData();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="container-blog py-16">
          <Card className="max-w-md mx-auto border-2 border-destructive/20">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                Your account ({user?.email}) is not authorized to access the admin panel.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Go Home
                </Button>
                <Button variant="destructive" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-12">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-secondary" />
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Logged in as <span className="font-medium">{user?.email}</span>
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="holdings" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="holdings" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Holdings
            </TabsTrigger>
            <TabsTrigger value="trades" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trades
            </TabsTrigger>
          </TabsList>

          {/* Holdings Tab */}
          <TabsContent value="holdings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Holdings</CardTitle>
                <Dialog open={holdingDialogOpen} onOpenChange={(open) => {
                  setHoldingDialogOpen(open);
                  if (!open) resetHoldingForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Holding
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingHolding ? 'Edit Holding' : 'Add New Holding'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="symbol">Symbol</Label>
                          <Input
                            id="symbol"
                            placeholder="AAPL"
                            value={holdingForm.symbol}
                            onChange={(e) => setHoldingForm({ ...holdingForm, symbol: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Apple Inc."
                            value={holdingForm.name}
                            onChange={(e) => setHoldingForm({ ...holdingForm, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shares">Shares</Label>
                          <Input
                            id="shares"
                            type="number"
                            step="0.0001"
                            placeholder="100"
                            value={holdingForm.shares}
                            onChange={(e) => setHoldingForm({ ...holdingForm, shares: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="average_cost">Average Cost</Label>
                          <Input
                            id="average_cost"
                            type="number"
                            step="0.01"
                            placeholder="150.00"
                            value={holdingForm.average_cost}
                            onChange={(e) => setHoldingForm({ ...holdingForm, average_cost: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current_price">Current Price</Label>
                          <Input
                            id="current_price"
                            type="number"
                            step="0.01"
                            placeholder="175.00"
                            value={holdingForm.current_price}
                            onChange={(e) => setHoldingForm({ ...holdingForm, current_price: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sector">Sector</Label>
                          <Input
                            id="sector"
                            placeholder="Technology"
                            value={holdingForm.sector}
                            onChange={(e) => setHoldingForm({ ...holdingForm, sector: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="asset_type">Asset Type</Label>
                        <Select
                          value={holdingForm.asset_type}
                          onValueChange={(value) => setHoldingForm({ ...holdingForm, asset_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Stock">Stock</SelectItem>
                            <SelectItem value="ETF">ETF</SelectItem>
                            <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                            <SelectItem value="Crypto">Crypto</SelectItem>
                            <SelectItem value="Bond">Bond</SelectItem>
                            <SelectItem value="REIT">REIT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setHoldingDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveHolding}>
                        {editingHolding ? 'Update' : 'Add'} Holding
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {holdings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No holdings yet. Add your first holding above.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Shares</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Cost</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Current</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map((holding) => (
                          <tr key={holding.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 font-bold text-foreground">{holding.symbol}</td>
                            <td className="py-3 px-4 text-muted-foreground">{holding.name}</td>
                            <td className="py-3 px-4 text-right text-foreground">{holding.shares}</td>
                            <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(holding.average_cost)}</td>
                            <td className="py-3 px-4 text-right text-foreground">
                              {holding.current_price ? formatCurrency(holding.current_price) : '—'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditHolding(holding)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteHolding(holding.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent value="trades">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Trades</CardTitle>
                <Dialog open={tradeDialogOpen} onOpenChange={(open) => {
                  setTradeDialogOpen(open);
                  if (!open) resetTradeForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Trade
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTrade ? 'Edit Trade' : 'Add New Trade'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="trade-symbol">Symbol</Label>
                          <Input
                            id="trade-symbol"
                            placeholder="AAPL"
                            value={tradeForm.symbol}
                            onChange={(e) => setTradeForm({ ...tradeForm, symbol: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trade-name">Name</Label>
                          <Input
                            id="trade-name"
                            placeholder="Apple Inc."
                            value={tradeForm.name}
                            onChange={(e) => setTradeForm({ ...tradeForm, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="trade-type">Trade Type</Label>
                          <Select
                            value={tradeForm.trade_type}
                            onValueChange={(value) => setTradeForm({ ...tradeForm, trade_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BUY">BUY</SelectItem>
                              <SelectItem value="SELL">SELL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trade-date">Trade Date</Label>
                          <Input
                            id="trade-date"
                            type="date"
                            value={tradeForm.trade_date}
                            onChange={(e) => setTradeForm({ ...tradeForm, trade_date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="trade-shares">Shares</Label>
                          <Input
                            id="trade-shares"
                            type="number"
                            step="0.0001"
                            placeholder="100"
                            value={tradeForm.shares}
                            onChange={(e) => setTradeForm({ ...tradeForm, shares: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trade-price">Price per Share</Label>
                          <Input
                            id="trade-price"
                            type="number"
                            step="0.01"
                            placeholder="150.00"
                            value={tradeForm.price}
                            onChange={(e) => setTradeForm({ ...tradeForm, price: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trade-notes">Notes (Optional)</Label>
                        <Input
                          id="trade-notes"
                          placeholder="Any notes about this trade..."
                          value={tradeForm.notes}
                          onChange={(e) => setTradeForm({ ...tradeForm, notes: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTradeDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveTrade}>
                        {editingTrade ? 'Update' : 'Add'} Trade
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {trades.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No trades yet. Add your first trade above.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Shares</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trades.map((trade) => (
                          <tr key={trade.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(trade.trade_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={trade.trade_type === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                                {trade.trade_type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-bold text-foreground">{trade.symbol}</td>
                            <td className="py-3 px-4 text-right text-foreground">{trade.shares}</td>
                            <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(trade.price)}</td>
                            <td className="py-3 px-4 text-right font-medium text-foreground">{formatCurrency(trade.total_value)}</td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditTrade(trade)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteTrade(trade.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
