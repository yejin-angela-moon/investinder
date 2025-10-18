import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBlockchain } from '../../hooks/useBlockchain';
import { TransactionSimulator } from '../blockchain/TransactionSimulator';

interface PortfolioScreenProps {
  onBack: () => void;
  onOpenTransactionHistory?: () => void;
  onOpenStartupInvestments?: () => void;
  onOpenPortfolioAnalytics?: () => void;
}

export function PortfolioScreen({ onBack, onOpenTransactionHistory, onOpenStartupInvestments, onOpenPortfolioAnalytics }: PortfolioScreenProps) {
  const { isConnected, walletAddress, investments, portfolioValue, tokens, connectWallet } = useBlockchain();
  const [showTransactionSimulator, setShowTransactionSimulator] = useState(false);
  const [simulatorType, setSimulatorType] = useState<'investment' | 'trading' | 'dividend'>('investment');

  const handleInvestMore = () => {
    setSimulatorType('investment');
    setShowTransactionSimulator(true);
  };

  const handleTradeTokens = () => {
    setSimulatorType('trading');
    setShowTransactionSimulator(true);
  };

  const handleClaimDividends = () => {
    setSimulatorType('dividend');
    setShowTransactionSimulator(true);
  };

  const getStartupName = (startupId: string) => {
    const startup = tokens.find(token => token.id === startupId);
    return startup ? startup.name : 'Unknown Startup';
  };

  const getStartupSymbol = (startupId: string) => {
    const startup = tokens.find(token => token.id === startupId);
    return startup ? startup.symbol : 'UNK';
  };

  const getCurrentValue = (investment: any) => {
    const startup = tokens.find(token => token.id === investment.startupId);
    if (!startup) return 0;
    return parseFloat(investment.tokenAmount) * parseFloat(startup.pricePerToken);
  };

  const getReturnPercentage = (investment: any) => {
    const currentValue = getCurrentValue(investment);
    const originalValue = parseFloat(investment.investmentAmount);
    return ((currentValue - originalValue) / originalValue) * 100;
  };

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Portfolio</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.walletSection}>
          <View style={styles.walletCard}>
            <Ionicons name="wallet-outline" size={48} color="#3B82F6" />
            <Text style={styles.walletTitle}>Connect Your Wallet</Text>
            <Text style={styles.walletDescription}>
              Connect MetaMask to view your portfolio
            </Text>
            <TouchableOpacity style={styles.connectButton} onPress={connectWallet}>
              <Text style={styles.connectButtonText}>Connect MetaMask</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Portfolio</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Portfolio Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Portfolio Value</Text>
            <Text style={styles.summaryValue}>${portfolioValue.totalValue.toFixed(2)}</Text>
            <View style={styles.returnInfo}>
              <Text style={[
                styles.returnText,
                portfolioValue.returnPercentage >= 0 ? styles.positiveReturn : styles.negativeReturn
              ]}>
                {portfolioValue.returnPercentage >= 0 ? '+' : ''}{portfolioValue.returnPercentage.toFixed(2)}%
              </Text>
              <Text style={styles.returnAmount}>
                ${portfolioValue.totalReturn.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Investments List */}
        <View style={styles.investmentsSection}>
          <Text style={styles.sectionTitle}>My Investments</Text>
          
          {investments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="trending-up-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Investments Yet</Text>
              <Text style={styles.emptyDescription}>
                Start investing in startups to build your portfolio
              </Text>
            </View>
          ) : (
            investments.map((investment) => {
              const currentValue = getCurrentValue(investment);
              const returnPercentage = getReturnPercentage(investment);
              
              return (
                <View key={investment.id} style={styles.investmentCard}>
                  <View style={styles.investmentHeader}>
                    <View style={styles.startupInfo}>
                      <Text style={styles.startupName}>
                        {getStartupName(investment.startupId)}
                      </Text>
                      <Text style={styles.startupSymbol}>
                        {getStartupSymbol(investment.startupId)}
                      </Text>
                    </View>
                    <View style={styles.investmentValue}>
                      <Text style={styles.currentValue}>
                        ${currentValue.toFixed(2)}
                      </Text>
                      <Text style={[
                        styles.returnPercentage,
                        returnPercentage >= 0 ? styles.positiveReturn : styles.negativeReturn
                      ]}>
                        {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.investmentDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Tokens Owned</Text>
                      <Text style={styles.detailValue}>{investment.tokenAmount}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Original Investment</Text>
                      <Text style={styles.detailValue}>${investment.investmentAmount}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Investment Date</Text>
                      <Text style={styles.detailValue}>
                        {new Date(investment.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Portfolio Analytics */}
        <View style={styles.analyticsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Portfolio Analytics</Text>
            {onOpenPortfolioAnalytics && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={onOpenPortfolioAnalytics}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Total Return</Text>
              <Text style={[styles.analyticsValue, portfolioValue.returnPercentage >= 0 ? styles.positiveValue : styles.negativeValue]}>
                {portfolioValue.returnPercentage >= 0 ? '+' : ''}{portfolioValue.returnPercentage.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Best Performer</Text>
              <Text style={styles.analyticsValue}>TechFlow AI</Text>
              <Text style={styles.analyticsSubValue}>+45.2%</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Risk Score</Text>
              <Text style={styles.analyticsValue}>Medium</Text>
              <Text style={styles.analyticsSubValue}>6.5/10</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Diversification</Text>
              <Text style={styles.analyticsValue}>Good</Text>
              <Text style={styles.analyticsSubValue}>8 sectors</Text>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {onOpenTransactionHistory && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={onOpenTransactionHistory}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.transactionList}>
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name="trending-up" size={16} color="#10B981" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>Investment in TechFlow AI</Text>
                <Text style={styles.transactionDate}>2 hours ago</Text>
              </View>
              <Text style={styles.transactionAmount}>+$100.00</Text>
            </View>
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name="swap-horizontal" size={16} color="#3B82F6" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>Token Trade</Text>
                <Text style={styles.transactionDate}>1 day ago</Text>
              </View>
              <Text style={styles.transactionAmount}>+$25.50</Text>
            </View>
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name="cash" size={16} color="#8B5CF6" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>Dividend Claim</Text>
                <Text style={styles.transactionDate}>3 days ago</Text>
              </View>
              <Text style={styles.transactionAmount}>+$12.30</Text>
            </View>
          </View>
        </View>

        {/* Startup Investment Details */}
        <View style={styles.investorsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Startup Investment Details</Text>
            {onOpenStartupInvestments && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={onOpenStartupInvestments}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.startupInvestmentsList}>
            <View style={styles.startupInvestmentItem}>
              <View style={styles.startupInfo}>
                <Text style={styles.startupName}>TechFlow AI</Text>
                <Text style={styles.startupStatus}>Series A • Active</Text>
              </View>
              <View style={styles.investmentProgress}>
                <Text style={styles.progressText}>$2.5M raised of $3M goal</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '83%' }]} />
                </View>
              </View>
              <View style={styles.investorCount}>
                <Text style={styles.investorCountText}>5 investors</Text>
              </View>
            </View>
            <View style={styles.startupInvestmentItem}>
              <View style={styles.startupInfo}>
                <Text style={styles.startupName}>GreenTech Solutions</Text>
                <Text style={styles.startupStatus}>Seed • Active</Text>
              </View>
              <View style={styles.investmentProgress}>
                <Text style={styles.progressText}>$1.8M raised of $2M goal</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '90%' }]} />
                </View>
              </View>
              <View style={styles.investorCount}>
                <Text style={styles.investorCountText}>3 investors</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Portfolio Composition */}
        <View style={styles.compositionSection}>
          <Text style={styles.sectionTitle}>Portfolio Composition</Text>
          <View style={styles.compositionChart}>
            <View style={styles.compositionItem}>
              <View style={[styles.compositionBar, { width: '35%', backgroundColor: '#3B82F6' }]} />
              <Text style={styles.compositionLabel}>TechFlow AI</Text>
              <Text style={styles.compositionValue}>35%</Text>
            </View>
            <View style={styles.compositionItem}>
              <View style={[styles.compositionBar, { width: '25%', backgroundColor: '#10B981' }]} />
              <Text style={styles.compositionLabel}>GreenTech Solutions</Text>
              <Text style={styles.compositionValue}>25%</Text>
            </View>
            <View style={styles.compositionItem}>
              <View style={[styles.compositionBar, { width: '20%', backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.compositionLabel}>FinTech Innovations</Text>
              <Text style={styles.compositionValue}>20%</Text>
            </View>
            <View style={styles.compositionItem}>
              <View style={[styles.compositionBar, { width: '20%', backgroundColor: '#F59E0B' }]} />
              <Text style={styles.compositionLabel}>Others</Text>
              <Text style={styles.compositionValue}>20%</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleInvestMore}
            >
              <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
              <Text style={styles.actionButtonText}>Invest More</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTradeTokens}
            >
              <Ionicons name="swap-horizontal-outline" size={20} color="#10B981" />
              <Text style={styles.actionButtonText}>Trade Tokens</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleClaimDividends}
            >
              <Ionicons name="cash-outline" size={20} color="#8B5CF6" />
              <Text style={styles.actionButtonText}>Claim Dividends</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Transaction Simulator */}
      <TransactionSimulator
        visible={showTransactionSimulator}
        onClose={() => setShowTransactionSimulator(false)}
        transactionType={simulatorType}
        amount={simulatorType === 'investment' ? '100' : simulatorType === 'trading' ? '50' : '25'}
        tokenSymbol={simulatorType === 'investment' ? 'TECH' : simulatorType === 'trading' ? 'TOKEN' : 'USDC'}
        companyName={simulatorType === 'investment' ? 'TechFlow AI' : simulatorType === 'trading' ? 'Token Exchange' : 'Dividend Pool'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3B82F6',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  walletSection: {
    padding: 24,
  },
  walletCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  walletDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  summarySection: {
    padding: 24,
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  returnInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  returnText: {
    fontSize: 18,
    fontWeight: '600',
  },
  returnAmount: {
    fontSize: 16,
    color: '#6B7280',
  },
  positiveReturn: {
    color: '#10B981',
  },
  negativeReturn: {
    color: '#EF4444',
  },
  investmentsSection: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  investmentCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  startupInfo: {
    flex: 1,
  },
  startupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  startupSymbol: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  investmentValue: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  returnPercentage: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  investmentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  actionsSection: {
    padding: 24,
    paddingTop: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 60,
  },
  actionButtonText: {
    fontSize: 10,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  
  // Analytics Section
  analyticsSection: {
    padding: 24,
    paddingTop: 0,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analyticsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  analyticsSubValue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  positiveValue: {
    color: '#10B981',
  },
  negativeValue: {
    color: '#EF4444',
  },
  
  // Transaction History Section
  historySection: {
    padding: 24,
    paddingTop: 0,
  },
  transactionList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  
  // Top Investors Section
  investorsSection: {
    padding: 24,
    paddingTop: 0,
  },
  investorsList: {
    gap: 12,
  },
  investorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  investorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  investorInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  investorInfo: {
    flex: 1,
  },
  investorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  investorStats: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  investorRank: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  
  // Startup Investment Details Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  startupInvestmentsList: {
    gap: 12,
  },
  startupInvestmentItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  startupInfo: {
    marginBottom: 12,
  },
  startupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  startupStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  investmentProgress: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  investorCount: {
    alignItems: 'flex-end',
  },
  investorCountText: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Portfolio Composition Section
  compositionSection: {
    padding: 24,
    paddingTop: 0,
  },
  compositionChart: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  compositionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  compositionBar: {
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    minWidth: 60,
  },
  compositionLabel: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  compositionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
