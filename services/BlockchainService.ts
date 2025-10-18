// Blockchain Service for Startup Equity Tokenization
// This service handles all blockchain interactions

// Note: ethers import removed for React Native compatibility
// import { ethers } from 'ethers';

// Declare global window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface StartupToken {
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  pricePerToken: string;
  contractAddress: string;
  owner: string;
}

export interface Investment {
  id: string;
  startupId: string;
  investorAddress: string;
  tokenAmount: string;
  investmentAmount: string;
  timestamp: number;
}

export interface TradingOrder {
  id: string;
  tokenId: string;
  orderType: 'buy' | 'sell';
  tokenAmount: string;
  pricePerToken: string;
  totalValue: string;
  status: 'active' | 'filled' | 'cancelled';
  creator: string;
}

// Contract configuration
const CONTRACT_ADDRESSES = {
  STARTUP_REGISTRY: '0x1234567890abcdef1234567890abcdef12345678',
  EQUITY_TOKEN: '0x2345678901bcdef2345678901bcdef2345678901'
};

const NETWORK_CONFIG = {
  chainId: 31337, // Localhost
  chainName: 'Localhost',
  rpcUrl: 'http://localhost:8545'
};

// Mock ABI for demonstration
const STARTUP_REGISTRY_ABI = [
  'function getStartupCount() view returns (uint256)',
  'function getStartup(uint256) view returns (string, string, uint256, uint256, uint256, uint256, address, bool)',
  'function investInStartup(uint256, uint256) payable',
  'function registerStartup(string, string, string, string, uint256, uint256, uint256, uint256, uint256, uint256) returns (uint256)'
];

const EQUITY_TOKEN_ABI = [
  'function pricePerToken() view returns (uint256)',
  'function owner() view returns (address)',
  'function invest(uint256) payable'
];

class BlockchainService {
  private static instance: BlockchainService;
  private isConnected: boolean = false;
  private userAddress: string | null = null;

  // Mock data for demonstration
  private mockTokens: StartupToken[] = [
    {
      id: '1',
      name: 'TechFlow AI',
      symbol: 'TFAI',
      totalSupply: '1000000',
      pricePerToken: '50',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12'
    },
    {
      id: '2',
      name: 'GreenEnergy Solutions',
      symbol: 'GES',
      totalSupply: '2000000',
      pricePerToken: '75',
      contractAddress: '0x2345678901bcdef2345678901bcdef2345678901',
      owner: '0xbcdef1234567890abcdef1234567890abcdef123'
    },
    {
      id: '3',
      name: 'HealthTech Innovations',
      symbol: 'HTI',
      totalSupply: '1500000',
      pricePerToken: '100',
      contractAddress: '0x3456789012cdef3456789012cdef3456789012',
      owner: '0xcdef1234567890abcdef1234567890abcdef1234'
    }
  ];

  private mockInvestments: Investment[] = [
    {
      id: '1',
      startupId: '1',
      investorAddress: '0x1234567890abcdef1234567890abcdef12345678',
      tokenAmount: '100',
      investmentAmount: '5000',
      timestamp: Date.now() - 86400000 // 1 day ago
    }
  ];

  private mockOrders: TradingOrder[] = [
    {
      id: '1',
      tokenId: '1',
      orderType: 'buy',
      tokenAmount: '50',
      pricePerToken: '45',
      totalValue: '2250',
      status: 'active',
      creator: '0x1234567890abcdef1234567890abcdef12345678'
    }
  ];

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  // Connect to wallet (MetaMask, WalletConnect, etc.)
  public async connectWallet(): Promise<boolean> {
    try {
      console.log('Connecting to wallet...');
      
      // Always use demo mode for easy testing
      console.log('Using demo mode for easy testing');
      this.isConnected = true;
      this.userAddress = '0x1234567890abcdef1234567890abcdef12345678';
      return true;

      // Real wallet connection code (commented out for demo)
      /*
      if (!window.ethereum) {
        throw new Error('No wallet found');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Check and switch to localhost network
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== BigInt(NETWORK_CONFIG.chainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
          });
        } catch (error) {
          // Add localhost network if it doesn't exist
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
              chainName: NETWORK_CONFIG.chainName,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
            }],
          });
        }
      }

      this.isConnected = true;
      this.userAddress = accounts[0];
      
      console.log('Wallet connected:', this.userAddress);
      return true;
      */
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }

  // Disconnect wallet
  public disconnectWallet(): void {
    this.isConnected = false;
    this.userAddress = null;
  }

  // Get user's wallet address
  public getWalletAddress(): string | null {
    return this.userAddress;
  }

  // Check if wallet is connected
  public isWalletConnected(): boolean {
    return this.isConnected;
  }

  // Get all available startup tokens
  public async getStartupTokens(): Promise<StartupToken[]> {
    try {
      // Always return mock data for React Native compatibility
      console.log('Using mock data for startup tokens');
      return this.mockTokens;
    } catch (error) {
      console.error('Error fetching startup tokens:', error);
      return this.mockTokens; // Fallback to mock data
    }
  }

  // Get token by ID
  public async getTokenById(id: string): Promise<StartupToken | null> {
    return this.mockTokens.find(token => token.id === id) || null;
  }

  // Invest in a startup (buy tokens)
  public async investInStartup(
    startupId: string, 
    tokenAmount: string, 
    investmentAmount: string
  ): Promise<boolean> {
    try {
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      console.log(`Investing ${investmentAmount} USDC for ${tokenAmount} tokens of startup ${startupId}`);
      
      // Check if we're in demo mode (no MetaMask)
      if (!window.ethereum) {
        console.log('Demo mode: Simulating investment transaction');
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Real blockchain implementation (commented out for React Native compatibility)
        console.log('Real blockchain implementation would be here');
        /*
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Check if we're on the correct network
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(NETWORK_CONFIG.chainId)) {
          // Switch to localhost network
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
            });
          } catch (error) {
            // Add localhost network if it doesn't exist
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
                chainName: NETWORK_CONFIG.chainName,
                rpcUrls: [NETWORK_CONFIG.rpcUrl],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
              }],
            });
          }
        }
        
        // Call startup investment contract
        const contract = new ethers.Contract(CONTRACT_ADDRESSES.STARTUP_REGISTRY, STARTUP_REGISTRY_ABI, signer);
        const investmentAmountWei = ethers.parseEther(investmentAmount);
        
        const tx = await contract.investInStartup(
          startupId,
          ethers.parseEther(tokenAmount),
          { value: investmentAmountWei }
        );
        
        console.log('Transaction hash:', tx.hash);
        await tx.wait();
        console.log('Investment transaction confirmed!');
        */
      }
      
      // Add to mock investments
      const newInvestment: Investment = {
        id: Date.now().toString(),
        startupId,
        investorAddress: this.userAddress!,
        tokenAmount,
        investmentAmount,
        timestamp: Date.now()
      };
      
      this.mockInvestments.push(newInvestment);
      
      console.log(`✅ Investment successful: ${investmentAmount} USDC for ${tokenAmount} tokens`);
      return true;
    } catch (error: any) {
      console.error('Investment failed:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      return false;
    }
  }

  // Get user's investments
  public async getUserInvestments(): Promise<Investment[]> {
    if (!this.isConnected) return [];
    
    return this.mockInvestments.filter(
      investment => investment.investorAddress === this.userAddress
    );
  }

  // Get user's token holdings
  public async getUserTokenHoldings(): Promise<{[tokenId: string]: string}> {
    if (!this.isConnected) return {};
    
    const holdings: {[tokenId: string]: string} = {};
    const userInvestments = this.mockInvestments.filter(
      investment => investment.investorAddress === this.userAddress
    );
    
    userInvestments.forEach(investment => {
      if (holdings[investment.startupId]) {
        holdings[investment.startupId] = (
          parseFloat(holdings[investment.startupId]) + 
          parseFloat(investment.tokenAmount)
        ).toString();
      } else {
        holdings[investment.startupId] = investment.tokenAmount;
      }
    });
    
    return holdings;
  }

  // Create a trading order
  public async createTradingOrder(
    tokenId: string,
    orderType: 'buy' | 'sell',
    tokenAmount: string,
    pricePerToken: string
  ): Promise<boolean> {
    try {
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      const totalValue = (parseFloat(tokenAmount) * parseFloat(pricePerToken)).toString();
      
      const newOrder: TradingOrder = {
        id: Date.now().toString(),
        tokenId,
        orderType,
        tokenAmount,
        pricePerToken,
        totalValue,
        status: 'active',
        creator: this.userAddress!
      };

      this.mockOrders.push(newOrder);
      
      console.log(`Created ${orderType} order for ${tokenAmount} tokens at ${pricePerToken} each`);
      return true;
    } catch (error) {
      console.error('Failed to create order:', error);
      return false;
    }
  }

  // Get trading orders
  public async getTradingOrders(): Promise<TradingOrder[]> {
    return this.mockOrders;
  }

  // Get user's trading orders
  public async getUserTradingOrders(): Promise<TradingOrder[]> {
    if (!this.isConnected) return [];
    
    return this.mockOrders.filter(
      order => order.creator === this.userAddress
    );
  }

  // Cancel a trading order
  public async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const order = this.mockOrders.find(o => o.id === orderId);
      if (!order) return false;
      
      if (order.creator !== this.userAddress) {
        throw new Error('Not authorized to cancel this order');
      }
      
      order.status = 'cancelled';
      return true;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  }

  // Get portfolio value
  public async getPortfolioValue(): Promise<{
    totalValue: string;
    totalReturn: string;
    returnPercentage: string;
  }> {
    if (!this.isConnected) {
      return { totalValue: '0', totalReturn: '0', returnPercentage: '0' };
    }

    // Calculate portfolio value based on investments
    const userInvestments = this.mockInvestments.filter(
      investment => investment.investorAddress === this.userAddress
    );

    let totalValue = 0;
    let totalReturn = 0;

    for (const investment of userInvestments) {
      const token = this.mockTokens.find(t => t.id === investment.startupId);
      if (token) {
        const currentValue = parseFloat(investment.tokenAmount) * parseFloat(token.pricePerToken);
        const originalValue = parseFloat(investment.investmentAmount);
        
        totalValue += currentValue;
        totalReturn += (currentValue - originalValue);
      }
    }

    const returnPercentage = totalValue > 0 ? (totalReturn / (totalValue - totalReturn)) * 100 : 0;

    return {
      totalValue: totalValue.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      returnPercentage: returnPercentage.toFixed(2)
    };
  }

  // Simulate dividend distribution
  public async distributeDividends(startupId: string, dividendAmount: string): Promise<boolean> {
    try {
      console.log(`Distributing ${dividendAmount} USDC dividends for startup ${startupId}`);
      
      // In a real app, this would:
      // 1. Calculate dividend per token based on total supply
      // 2. Distribute USDC to all token holders proportionally
      // 3. Update dividend records on blockchain
      
      return true;
    } catch (error) {
      console.error('Dividend distribution failed:', error);
      return false;
    }
  }
}

export default BlockchainService;
