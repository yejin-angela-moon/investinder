import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { FinancialModal } from "./FinancialModal";

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

interface FinancialSummaryProps {
  data: FinancialData;
  showDetailed?: boolean;
  companyName?: string;
}

export function FinancialSummary({ data, showDetailed = false, companyName = "Company" }: FinancialSummaryProps) {
  const [isDetailed, setIsDetailed] = useState(showDetailed);
  const [modalVisible, setModalVisible] = useState(false);
  const progressPercentage = (data.raisedSoFar / data.fundingGoal) * 100;
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `£${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `£${(amount / 1000).toFixed(0)}k`;
    }
    return `£${amount.toFixed(0)}`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "#10B981"; // green
    if (growth < 0) return "#EF4444"; // red
    return "#6B7280"; // gray
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? "#10B981" : "#EF4444";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💰 Financial Overview</Text>
        <View style={styles.headerRight}>
          <Text style={styles.round}>{data.fundingRound}</Text>
          <Pressable 
            style={styles.toggleButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.toggleText}>
              More
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Key Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Revenue</Text>
          <Text style={styles.metricValue}>{formatCurrency(data.revenue)}</Text>
          <Text style={[styles.growthText, { color: getGrowthColor(data.yoyGrowth) }]}>
            {data.yoyGrowth > 0 ? '+' : ''}{data.yoyGrowth}% YoY
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Profit</Text>
          <Text style={[styles.metricValue, { color: getProfitColor(data.profit) }]}>
            {formatCurrency(data.profit)}
          </Text>
          <Text style={styles.marginText}>{data.grossMargin}% margin</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Valuation</Text>
          <Text style={styles.metricValue}>{formatCurrency(data.valuation)}</Text>
          <Text style={styles.preMoneyText}>pre-money</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Equity</Text>
          <Text style={styles.metricValue}>{data.equityOffered}%</Text>
          <Text style={styles.equityText}>for {formatCurrency(data.fundingGoal)}</Text>
        </View>
      </View>

      {/* Funding Progress */}
      <View style={styles.fundingSection}>
        <View style={styles.fundingHeader}>
          <Text style={styles.fundingLabel}>Funding Progress</Text>
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
          <View style={styles.investorsContainer}>
            <Text style={styles.investorsText}>{data.investors} investors ❤️</Text>
          </View>
        </View>
      </View>

      {/* Detailed Metrics (if enabled) */}
      {isDetailed && (
        <View style={styles.detailedSection}>
          <Text style={styles.detailedTitle}>📈 Performance Metrics</Text>
          
          <View style={styles.detailedGrid}>
            <View style={styles.detailedItem}>
              <Text style={styles.detailedLabel}>Burn Rate</Text>
              <Text style={styles.detailedValue}>{formatCurrency(data.burnRate)}/month</Text>
            </View>
            
            <View style={styles.detailedItem}>
              <Text style={styles.detailedLabel}>Runway</Text>
              <Text style={styles.detailedValue}>{data.runway} months</Text>
            </View>
          </View>
        </View>
      )}

      {/* Modal */}
      <FinancialModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={data}
        companyName={companyName}
      />
    </View>
  );
}

// Sample data generator for demo
export function generateSampleFinancialData(companyId: string): FinancialData {
  const baseRevenue = 500000 + (parseInt(companyId.slice(-3)) * 100000);
  const yoyGrowth = 20 + (parseInt(companyId.slice(-2)) * 5);
  
  return {
    revenue: baseRevenue,
    profit: baseRevenue * 0.15,
    valuation: baseRevenue * 8,
    fundingGoal: baseRevenue * 0.8,
    raisedSoFar: baseRevenue * 0.6,
    equityOffered: 7.5,
    investors: 25 + (parseInt(companyId.slice(-1)) * 10),
    yoyGrowth: yoyGrowth,
    grossMargin: 45 + (parseInt(companyId.slice(-1)) * 5),
    burnRate: baseRevenue * 0.05,
    runway: 12 + (parseInt(companyId.slice(-1)) * 3),
    fundingRound: "Seed"
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  
  round: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  toggleButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  
  toggleText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  
  metricItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  
  metricLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  
  growthText: {
    fontSize: 11,
    fontWeight: "600",
  },
  
  marginText: {
    fontSize: 11,
    color: "#6b7280",
  },
  
  preMoneyText: {
    fontSize: 11,
    color: "#6b7280",
  },
  
  equityText: {
    fontSize: 11,
    color: "#6b7280",
  },
  
  fundingSection: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  
  fundingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  
  fundingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  
  fundingAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  
  fundingStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  
  investorsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  investorsText: {
    fontSize: 12,
    color: "#6b7280",
  },
  
  detailedSection: {
    marginTop: 16,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  
  detailedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  
  detailedGrid: {
    flexDirection: "row",
    gap: 12,
  },
  
  detailedItem: {
    flex: 1,
    alignItems: "center",
  },
  
  detailedLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
  },
  
  detailedValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
});
