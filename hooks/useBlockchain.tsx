import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import BlockchainService, { StartupToken, Investment, TradingOrder } from '../services/BlockchainService';

// Blockchain service integration

interface BlockchainContextType {
  // Connection state
  isConnected: boolean;
  walletAddress: string | null;
  
  // Data
  tokens: StartupToken[];
  investments: Investment[];
  orders: TradingOrder[];
  portfolioValue: {
    totalValue: number;
    totalReturn: number;
    returnPercentage: number;
  };
  
  // Actions
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  investInStartup: (startupId: string, tokenAmount: string, investmentAmount: string) => Promise<boolean>;
  createTradingOrder: (tokenId: string, orderType: 'buy' | 'sell', tokenAmount: string, pricePerToken: string) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = (): BlockchainContextType => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokens, setTokens] = useState<StartupToken[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [orders, setOrders] = useState<TradingOrder[]>([]);
  const [portfolioValue, setPortfolioValue] = useState({
    totalValue: 0,
    totalReturn: 0,
    returnPercentage: 0
  });

  const blockchainService = BlockchainService.getInstance();

  // Connect wallet
  const connectWallet = async (): Promise<boolean> => {
    try {
      const success = await blockchainService.connectWallet();
      if (success) {
        setIsConnected(true);
        setWalletAddress(blockchainService.getWalletAddress());
        await refreshData();
      }
      return success;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = (): void => {
    blockchainService.disconnectWallet();
    setIsConnected(false);
    setWalletAddress(null);
    setInvestments([]);
    setOrders([]);
    setPortfolioValue({ totalValue: 0, totalReturn: 0, returnPercentage: 0 });
  };

  // Invest in startup
  const investInStartup = async (
    startupId: string, 
    tokenAmount: string, 
    investmentAmount: string
  ): Promise<boolean> => {
    try {
      const success = await blockchainService.investInStartup(startupId, tokenAmount, investmentAmount);
      if (success) {
        await refreshData();
      }
      return success;
    } catch (error) {
      console.error('Investment failed:', error);
      return false;
    }
  };

  // Create trading order
  const createTradingOrder = async (
    tokenId: string,
    orderType: 'buy' | 'sell',
    tokenAmount: string,
    pricePerToken: string
  ): Promise<boolean> => {
    try {
      const success = await blockchainService.createTradingOrder(tokenId, orderType, tokenAmount, pricePerToken);
      if (success) {
        await refreshData();
      }
      return success;
    } catch (error) {
      console.error('Failed to create order:', error);
      return false;
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    try {
      const success = await blockchainService.cancelOrder(orderId);
      if (success) {
        await refreshData();
      }
      return success;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  };

  // Refresh all data
  const refreshData = async (): Promise<void> => {
    try {
      // Load tokens
      const tokensData = await blockchainService.getStartupTokens();
      setTokens(tokensData);

      if (isConnected) {
        // Load user-specific data
        const investmentsData = await blockchainService.getUserInvestments();
        const ordersData = await blockchainService.getUserTradingOrders();
        const portfolioData = await blockchainService.getPortfolioValue();

        setInvestments(investmentsData);
        setOrders(ordersData);
        setPortfolioValue({
          totalValue: parseFloat(portfolioData.totalValue),
          totalReturn: parseFloat(portfolioData.totalReturn),
          returnPercentage: parseFloat(portfolioData.returnPercentage)
        });
      }

      // Load all orders for trading
      const allOrders = await blockchainService.getTradingOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    // Auto-connect to demo wallet
    const autoConnect = async () => {
      try {
        await connectWallet();
        await refreshData();
      } catch (error) {
        console.error('Auto-connect failed:', error);
      }
    };
    
    autoConnect();
  }, []);

  // Update data when connection status changes
  useEffect(() => {
    if (isConnected) {
      refreshData();
    }
  }, [isConnected]);

  const value: BlockchainContextType = {
    isConnected,
    walletAddress,
    tokens,
    investments,
    orders,
    portfolioValue,
    connectWallet,
    disconnectWallet,
    investInStartup,
    createTradingOrder,
    cancelOrder,
    refreshData,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};
