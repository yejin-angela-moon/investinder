import React from "react";
import { StyleSheet, Text, View, Modal, Pressable, ScrollView } from "react-native";

interface FinancialData {
  revenue: number;
  profit: number;
  valuation: number;
  fundingGoal: number;
  raisedSoFar: number;
  equityOffered: number;
  investors: number;
  yoyGrowth: number;
  grossMargin: number;
  burnRate: number;
  runway: number;
  fundingRound: string;
}

interface FinancialModalProps {
  visible: boolean;
  onClose: () => void;
  data: FinancialData;
  companyName: string;
}

export function FinancialModal({ visible, onClose, data, companyName }: FinancialModalProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `£${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `£${(amount / 1000).toFixed(0)}k`;
    }
    return `£${amount.toFixed(0)}`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "#10B981";
    if (growth < 0) return "#EF4444";
    return "#6B7280";
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? "#10B981" : "#EF4444";
  };

  const progressPercentage = (data.raisedSoFar / data.fundingGoal) * 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Detailed Financial Analysis</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Company Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏢 {companyName}</Text>
            <Text style={styles.roundBadge}>{data.fundingRound} Round</Text>
          </View>

          {/* Financial Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Financial Overview</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Annual Revenue</Text>
                <Text style={styles.metricValue}>{formatCurrency(data.revenue)}</Text>
                <Text style={[styles.growthText, { color: getGrowthColor(data.yoyGrowth) }]}>
                  {data.yoyGrowth > 0 ? '+' : ''}{data.yoyGrowth}% YoY Growth
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Operating Profit</Text>
                <Text style={[styles.metricValue, { color: getProfitColor(data.profit) }]}>
                  {formatCurrency(data.profit)}
                </Text>
                <Text style={styles.marginText}>Gross Margin: {data.grossMargin}%</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Company Valuation</Text>
                <Text style={styles.metricValue}>{formatCurrency(data.valuation)}</Text>
                <Text style={styles.preMoneyText}>Pre-money valuation</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Equity Offered</Text>
                <Text style={styles.metricValue}>{data.equityOffered}%</Text>
                <Text style={styles.equityText}>for {formatCurrency(data.fundingGoal)}</Text>
              </View>
            </View>
          </View>

          {/* Funding Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Funding Progress</Text>
            <View style={styles.fundingCard}>
              <View style={styles.fundingHeader}>
                <Text style={styles.fundingLabel}>Current Progress</Text>
                <Text style={styles.fundingAmount}>
                  {formatCurrency(data.raisedSoFar)} / {formatCurrency(data.fundingGoal)}
                </Text>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(progressPercentage, 100)}%` }
                  ]} 
                />
              </View>
              
              <View style={styles.fundingStats}>
                <Text style={styles.progressText}>{progressPercentage.toFixed(0)}% raised</Text>
                <Text style={styles.investorsText}>{data.investors} investors ❤️</Text>
              </View>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Performance Metrics</Text>
            <View style={styles.performanceGrid}>
              <View style={styles.performanceCard}>
                <Text style={styles.performanceLabel}>Monthly Burn Rate</Text>
                <Text style={styles.performanceValue}>{formatCurrency(data.burnRate)}</Text>
                <Text style={styles.performanceSubtext}>Cash consumption per month</Text>
              </View>
              
              <View style={styles.performanceCard}>
                <Text style={styles.performanceLabel}>Runway</Text>
                <Text style={styles.performanceValue}>{data.runway} months</Text>
                <Text style={styles.performanceSubtext}>Funding remaining</Text>
              </View>
              
              <View style={styles.performanceCard}>
                <Text style={styles.performanceLabel}>Gross Margin</Text>
                <Text style={styles.performanceValue}>{data.grossMargin}%</Text>
                <Text style={styles.performanceSubtext}>Profitability ratio</Text>
              </View>
              
              <View style={styles.performanceCard}>
                <Text style={styles.performanceLabel}>YoY Growth</Text>
                <Text style={[styles.performanceValue, { color: getGrowthColor(data.yoyGrowth) }]}>
                  {data.yoyGrowth > 0 ? '+' : ''}{data.yoyGrowth}%
                </Text>
                <Text style={styles.performanceSubtext}>Year-over-year</Text>
              </View>
            </View>
          </View>

          {/* Investment Highlights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Investment Highlights</Text>
            <View style={styles.highlightsList}>
              <View style={styles.highlightItem}>
                <Text style={styles.highlightIcon}>🚀</Text>
                <Text style={styles.highlightText}>
                  Strong {data.yoyGrowth}% YoY revenue growth
                </Text>
              </View>
              <View style={styles.highlightItem}>
                <Text style={styles.highlightIcon}>💰</Text>
                <Text style={styles.highlightText}>
                  {data.profit >= 0 ? 'Profitable' : 'Growth-focused'} with {data.grossMargin}% gross margin
                </Text>
              </View>
              <View style={styles.highlightItem}>
                <Text style={styles.highlightIcon}>⏰</Text>
                <Text style={styles.highlightText}>
                  {data.runway} months runway at current burn rate
                </Text>
              </View>
              <View style={styles.highlightItem}>
                <Text style={styles.highlightIcon}>👥</Text>
                <Text style={styles.highlightText}>
                  {data.investors} investors already committed
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  
  content: {
    flex: 1,
    padding: 20,
  },
  
  section: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  
  roundBadge: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  
  metricLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 6,
  },
  
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  
  growthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  
  marginText: {
    fontSize: 12,
    color: "#6b7280",
  },
  
  preMoneyText: {
    fontSize: 12,
    color: "#6b7280",
  },
  
  equityText: {
    fontSize: 12,
    color: "#6b7280",
  },
  
  fundingCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  
  fundingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  
  fundingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  
  fundingAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  
  progressBar: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 6,
  },
  
  fundingStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  
  investorsText: {
    fontSize: 14,
    color: "#6b7280",
  },
  
  performanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  
  performanceCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  
  performanceLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  
  performanceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  
  performanceSubtext: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
  },
  
  highlightsList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  
  highlightIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
});
