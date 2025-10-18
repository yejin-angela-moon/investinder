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

interface Investor {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  percentage: number;
  date: string;
  type: 'Individual' | 'VC' | 'Angel' | 'Institution';
}

interface StartupInvestment {
  id: string;
  name: string;
  logo: string;
  totalRaised: number;
  fundingGoal: number;
  equityOffered: number;
  valuation: number;
  investors: Investor[];
  fundingRound: string;
  status: 'Active' | 'Completed' | 'Closed';
}

const mockStartupInvestments: StartupInvestment[] = [
  {
    id: '1',
    name: 'TechFlow AI',
    logo: '🤖',
    totalRaised: 2500000,
    fundingGoal: 3000000,
    equityOffered: 15,
    valuation: 15000000,
    fundingRound: 'Series A',
    status: 'Active',
    investors: [
      {
        id: '1',
        name: 'John Smith',
        avatar: 'JS',
        amount: 500000,
        percentage: 20,
        date: '2025-01-15',
        type: 'Individual',
      },
      {
        id: '2',
        name: 'TechVentures Capital',
        avatar: 'TV',
        amount: 750000,
        percentage: 30,
        date: '2025-01-10',
        type: 'VC',
      },
      {
        id: '3',
        name: 'Sarah Johnson',
        avatar: 'SJ',
        amount: 300000,
        percentage: 12,
        date: '2025-01-08',
        type: 'Angel',
      },
      {
        id: '4',
        name: 'Innovation Fund',
        avatar: 'IF',
        amount: 600000,
        percentage: 24,
        date: '2025-01-05',
        type: 'Institution',
      },
      {
        id: '5',
        name: 'Mike Chen',
        avatar: 'MC',
        amount: 350000,
        percentage: 14,
        date: '2025-01-03',
        type: 'Individual',
      },
    ],
  },
  {
    id: '2',
    name: 'GreenTech Solutions',
    logo: '🌱',
    totalRaised: 1800000,
    fundingGoal: 2000000,
    equityOffered: 12,
    valuation: 12000000,
    fundingRound: 'Seed',
    status: 'Active',
    investors: [
      {
        id: '6',
        name: 'EcoVentures',
        avatar: 'EV',
        amount: 800000,
        percentage: 44.4,
        date: '2025-01-12',
        type: 'VC',
      },
      {
        id: '7',
        name: 'Lisa Wang',
        avatar: 'LW',
        amount: 400000,
        percentage: 22.2,
        date: '2025-01-09',
        type: 'Angel',
      },
      {
        id: '8',
        name: 'Sustainable Capital',
        avatar: 'SC',
        amount: 600000,
        percentage: 33.3,
        date: '2025-01-06',
        type: 'Institution',
      },
    ],
  },
];

const StartupInvestmentDetailsScreen: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const [selectedStartup, setSelectedStartup] = useState<StartupInvestment | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInvestorTypeColor = (type: string) => {
    switch (type) {
      case 'Individual':
        return '#3B82F6';
      case 'VC':
        return '#10B981';
      case 'Angel':
        return '#8B5CF6';
      case 'Institution':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10B981';
      case 'Completed':
        return '#3B82F6';
      case 'Closed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (selectedStartup) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedStartup(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{selectedStartup.name}</Text>
            <Text style={styles.headerSubtitle}>Investment Details</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Startup Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.startupHeader}>
              <Text style={styles.startupLogo}>{selectedStartup.logo}</Text>
              <View style={styles.startupInfo}>
                <Text style={styles.startupName}>{selectedStartup.name}</Text>
                <Text style={styles.fundingRound}>{selectedStartup.fundingRound}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedStartup.status) }]}>
                  <Text style={styles.statusText}>{selectedStartup.status}</Text>
                </View>
              </View>
            </View>

            {/* Funding Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Funding Progress</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round((selectedStartup.totalRaised / selectedStartup.fundingGoal) * 100)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(selectedStartup.totalRaised / selectedStartup.fundingGoal) * 100}%` }
                  ]} 
                />
              </View>
              <View style={styles.progressDetails}>
                <Text style={styles.progressAmount}>
                  {formatCurrency(selectedStartup.totalRaised)} raised
                </Text>
                <Text style={styles.progressGoal}>
                  of {formatCurrency(selectedStartup.fundingGoal)} goal
                </Text>
              </View>
            </View>

            {/* Key Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Valuation</Text>
                <Text style={styles.metricValue}>{formatCurrency(selectedStartup.valuation)}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Equity Offered</Text>
                <Text style={styles.metricValue}>{selectedStartup.equityOffered}%</Text>
              </View>
            </View>
          </View>

          {/* Investors List */}
          <View style={styles.investorsSection}>
            <Text style={styles.sectionTitle}>Investors ({selectedStartup.investors.length})</Text>
            {selectedStartup.investors.map((investor) => (
              <View key={investor.id} style={styles.investorCard}>
                <View style={styles.investorLeft}>
                  <View style={styles.investorAvatar}>
                    <Text style={styles.investorAvatarText}>{investor.avatar}</Text>
                  </View>
                  <View style={styles.investorInfo}>
                    <Text style={styles.investorName}>{investor.name}</Text>
                    <View style={styles.investorTypeContainer}>
                      <View style={[styles.investorTypeBadge, { backgroundColor: getInvestorTypeColor(investor.type) }]}>
                        <Text style={styles.investorTypeText}>{investor.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.investorDate}>{investor.date}</Text>
                  </View>
                </View>
                <View style={styles.investorRight}>
                  <Text style={styles.investorAmount}>{formatCurrency(investor.amount)}</Text>
                  <Text style={styles.investorPercentage}>{investor.percentage}%</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Startup Investments</Text>
          <Text style={styles.headerSubtitle}>View investment details by startup</Text>
        </View>
      </View>

      {/* Startup List */}
      <ScrollView style={styles.content}>
        {mockStartupInvestments.map((startup) => (
          <TouchableOpacity
            key={startup.id}
            style={styles.startupCard}
            onPress={() => setSelectedStartup(startup)}
          >
            <View style={styles.startupHeader}>
              <Text style={styles.startupLogo}>{startup.logo}</Text>
              <View style={styles.startupInfo}>
                <Text style={styles.startupName}>{startup.name}</Text>
                <Text style={styles.fundingRound}>{startup.fundingRound}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(startup.status) }]}>
                  <Text style={styles.statusText}>{startup.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Funding Progress</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round((startup.totalRaised / startup.fundingGoal) * 100)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(startup.totalRaised / startup.fundingGoal) * 100}%` }
                  ]} 
                />
              </View>
              <View style={styles.progressDetails}>
                <Text style={styles.progressAmount}>
                  {formatCurrency(startup.totalRaised)} raised
                </Text>
                <Text style={styles.progressGoal}>
                  of {formatCurrency(startup.fundingGoal)} goal
                </Text>
              </View>
            </View>

            <View style={styles.investorsSummary}>
              <Text style={styles.investorsCount}>
                {startup.investors.length} investors
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </View>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  overviewCard: {
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
  startupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  startupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  startupLogo: {
    fontSize: 32,
    marginRight: 12,
  },
  startupInfo: {
    flex: 1,
  },
  startupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  fundingRound: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressGoal: {
    fontSize: 14,
    color: '#6B7280',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  investorsSection: {
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
  investorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  investorLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  investorAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  investorInfo: {
    flex: 1,
  },
  investorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  investorTypeContainer: {
    marginBottom: 4,
  },
  investorTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  investorTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  investorDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  investorRight: {
    alignItems: 'flex-end',
  },
  investorAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  investorPercentage: {
    fontSize: 14,
    color: '#6B7280',
  },
  investorsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  investorsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default StartupInvestmentDetailsScreen;
