import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Transaction {
  id: string;
  type: 'Investment' | 'Trade' | 'Dividend';
  tokenName: string;
  amount: number;
  price: number;
  quantity: number;
  date: string;
  hash: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Investment',
    tokenName: 'TechCorp Token',
    amount: 5000.00,
    price: 50.00,
    quantity: 100,
    date: '10/18/2025 9:05:58 PM',
    hash: '0x1234...5678',
    status: 'completed',
  },
  {
    id: '2',
    type: 'Trade',
    tokenName: 'HealthTech Token',
    amount: 2250.00,
    price: 45.00,
    quantity: 50,
    date: '10/18/2025 8:05:58 PM',
    hash: '0x9876...5432',
    status: 'completed',
  },
  {
    id: '3',
    type: 'Dividend',
    tokenName: 'TechCorp Token',
    amount: 250.00,
    price: 0,
    quantity: 0,
    date: '10/17/2025 3:30:15 PM',
    hash: '0xabcd...efgh',
    status: 'completed',
  },
  {
    id: '4',
    type: 'Investment',
    tokenName: 'GreenTech Token',
    amount: 3000.00,
    price: 30.00,
    quantity: 100,
    date: '10/16/2025 2:15:30 PM',
    hash: '0x5678...9abc',
    status: 'completed',
  },
  {
    id: '5',
    type: 'Trade',
    tokenName: 'FinTech Token',
    amount: 1500.00,
    price: 25.00,
    quantity: 60,
    date: '10/15/2025 11:45:22 AM',
    hash: '0xdef0...1234',
    status: 'pending',
  },
];

const TransactionHistoryScreen: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Investment' | 'Trade' | 'Dividend'>('All');

  const filteredTransactions = mockTransactions.filter(transaction => 
    activeFilter === 'All' || transaction.type === activeFilter
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Investment':
        return 'trending-up';
      case 'Trade':
        return 'swap-horizontal';
      case 'Dividend':
        return 'cash';
      default:
        return 'document';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <Text style={styles.headerSubtitle}>View all your trading activities</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['All', 'Investment', 'Trade', 'Dividend'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter && styles.activeFilterTabText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <ScrollView style={styles.transactionList} showsVerticalScrollIndicator={false}>
        {filteredTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <View style={styles.transactionIconContainer}>
                <Ionicons
                  name={getTransactionIcon(transaction.type) as any}
                  size={20}
                  color="#3B82F6"
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.tokenName}>{transaction.tokenName}</Text>
                <Text style={styles.transactionType}>{transaction.type}</Text>
                <View style={styles.transactionInfo}>
                  <Text style={styles.infoLabel}>Amount:</Text>
                  <Text style={styles.infoValue}>{formatAmount(transaction.amount)}</Text>
                </View>
                {transaction.price > 0 && (
                  <View style={styles.transactionInfo}>
                    <Text style={styles.infoLabel}>Price:</Text>
                    <Text style={styles.infoValue}>{formatAmount(transaction.price)}</Text>
                  </View>
                )}
                {transaction.quantity > 0 && (
                  <View style={styles.transactionInfo}>
                    <Text style={styles.infoLabel}>Quantity:</Text>
                    <Text style={styles.infoValue}>{transaction.quantity} tokens</Text>
                  </View>
                )}
                <View style={styles.transactionInfo}>
                  <Text style={styles.infoLabel}>Date:</Text>
                  <Text style={styles.infoValue}>{transaction.date}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.infoLabel}>Hash:</Text>
                  <Text style={styles.hashValue}>{transaction.hash}</Text>
                </View>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text style={styles.transactionAmount}>
                {formatAmount(transaction.amount)}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
                <Text style={styles.statusText}>{transaction.status}</Text>
              </View>
              {transaction.quantity > 0 && (
                <Text style={styles.quantityText}>{transaction.quantity} tokens</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  transactionList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  transactionInfo: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 60,
  },
  infoValue: {
    fontSize: 12,
    color: '#1F2937',
    flex: 1,
  },
  hashValue: {
    fontSize: 12,
    color: '#3B82F6',
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quantityText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default TransactionHistoryScreen;
