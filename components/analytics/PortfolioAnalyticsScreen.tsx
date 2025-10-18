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

interface Asset {
  id: string;
  name: string;
  ticker: string;
  value: number;
  returnPercentage: number;
  quantity: number;
  percentage: number;
  color: string;
}

interface PerformanceData {
  returnPercentage: number;
  assets: number;
  timeframe: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'TechCorp',
    ticker: 'TECH',
    value: 5000,
    returnPercentage: 5.2,
    quantity: 100,
    percentage: 45.5,
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'GreenTech',
    ticker: 'GREEN',
    value: 3000,
    returnPercentage: 12.8,
    quantity: 75,
    percentage: 27.3,
    color: '#10B981',
  },
  {
    id: '3',
    name: 'HealthTech',
    ticker: 'HEALTH',
    value: 2000,
    returnPercentage: -2.1,
    quantity: 50,
    percentage: 18.2,
    color: '#8B5CF6',
  },
  {
    id: '4',
    name: 'FinTech',
    ticker: 'FIN',
    value: 1000,
    returnPercentage: 8.5,
    quantity: 25,
    percentage: 9.1,
    color: '#F59E0B',
  },
];

const mockPerformanceData: { [key: string]: PerformanceData } = {
  '1D': { returnPercentage: 2.1, assets: 4, timeframe: '1 Day' },
  '7D': { returnPercentage: 5.8, assets: 4, timeframe: '7 Days' },
  '1M': { returnPercentage: 12.3, assets: 4, timeframe: '1 Month' },
  '3M': { returnPercentage: 18.7, assets: 4, timeframe: '3 Months' },
  '1Y': { returnPercentage: 35.2, assets: 4, timeframe: '1 Year' },
};

const PortfolioAnalyticsScreen: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '7D' | '1M' | '3M' | '1Y'>('7D');
  const [returnPercentage, setReturnPercentage] = useState<string>('');
  const [assets, setAssets] = useState<string>('');

  const currentPerformance = mockPerformanceData[selectedTimeframe];
  const totalPortfolioValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const getReturnColor = (percentage: number) => {
    return percentage >= 0 ? '#10B981' : '#EF4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portfolio Analytics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Performance Section */}
        <View style={styles.performanceSection}>
          <View style={styles.performanceInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Return %</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputValue}>
                  {formatPercentage(currentPerformance.returnPercentage)}
                </Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Assets</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputValue}>{currentPerformance.assets}</Text>
              </View>
            </View>
          </View>

          {/* Timeframe Selector */}
          <View style={styles.timeframeContainer}>
            {(['1D', '7D', '1M', '3M', '1Y'] as const).map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe && styles.activeTimeframeButton,
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    selectedTimeframe === timeframe && styles.activeTimeframeText,
                  ]}
                >
                  {timeframe}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Portfolio Composition */}
        <View style={styles.compositionSection}>
          <View style={styles.compositionHeader}>
            <View style={styles.portfolioInfo}>
              <Text style={styles.portfolioLabel}>Portfolio</Text>
              <Text style={styles.portfolioValue}>{formatCurrency(totalPortfolioValue)}</Text>
            </View>
            <View style={styles.pieChartPlaceholder}>
              <View style={styles.pieChart}>
                <Text style={styles.pieChartText}>📊</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Asset Details */}
        <View style={styles.assetDetailsSection}>
          <Text style={styles.sectionTitle}>Asset Details</Text>
          {mockAssets.map((asset) => (
            <View key={asset.id} style={styles.assetCard}>
              <View style={styles.assetLeft}>
                <View style={[styles.assetDot, { backgroundColor: asset.color }]} />
                <View style={styles.assetInfo}>
                  <Text style={styles.assetName}>{asset.name}</Text>
                  <Text style={styles.assetTicker}>{asset.ticker}</Text>
                </View>
              </View>
              <View style={styles.assetRight}>
                <Text style={styles.assetValue}>{formatCurrency(asset.value)}</Text>
                <Text style={[styles.assetReturn, { color: getReturnColor(asset.returnPercentage) }]}>
                  {formatPercentage(asset.returnPercentage)}
                </Text>
                <Text style={styles.assetQuantity}>{asset.quantity} tokens</Text>
                <Text style={styles.assetPercentage}>{asset.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Performance Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Value</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalPortfolioValue)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Return</Text>
              <Text style={[styles.summaryValue, { color: getReturnColor(currentPerformance.returnPercentage) }]}>
                {formatPercentage(currentPerformance.returnPercentage)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Best Performer</Text>
              <Text style={styles.summaryValue}>GreenTech</Text>
              <Text style={styles.summarySubValue}>+12.8%</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Diversification</Text>
              <Text style={styles.summaryValue}>Good</Text>
              <Text style={styles.summarySubValue}>4 assets</Text>
            </View>
          </View>
        </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  performanceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  performanceInputs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeframeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeTimeframeButton: {
    backgroundColor: '#3B82F6',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTimeframeText: {
    color: '#FFFFFF',
  },
  compositionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  compositionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioInfo: {
    flex: 1,
  },
  portfolioLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  portfolioValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  pieChartPlaceholder: {
    alignItems: 'center',
  },
  pieChart: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartText: {
    fontSize: 24,
  },
  assetDetailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  assetLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  assetTicker: {
    fontSize: 14,
    color: '#6B7280',
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  assetReturn: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  assetQuantity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  assetPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    minWidth: '45%',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summarySubValue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default PortfolioAnalyticsScreen;
