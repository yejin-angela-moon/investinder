import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from "react-native";
import { getCompanyData } from "../swipecard/CompanyData";

interface WatchlistScreenProps {
  watchlist: string[];
  onRemoveFromWatchlist: (companyID: string) => void;
  onOpenChat: (companyID: string) => void;
}

export function WatchlistScreen({ watchlist, onRemoveFromWatchlist, onOpenChat }: WatchlistScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 My Watchlist</Text>
        <Text style={styles.subtitle}>{watchlist.length} companies saved</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {watchlist.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No companies in watchlist</Text>
            <Text style={styles.emptySubtitle}>Swipe right on companies to add them here</Text>
          </View>
        ) : (
          watchlist.map((companyID) => {
            const companyData = getCompanyData(companyID);
            return (
              <View key={companyID} style={styles.companyCard}>
                <View style={styles.companyInfo}>
                  <Image source={{ uri: companyData.logoURI }} style={styles.logo} />
                  <View style={styles.companyDetails}>
                    <Text style={styles.companyName}>{companyData.name}</Text>
                    <Text style={styles.companyIntro} numberOfLines={2}>
                      {companyData.intro}
                    </Text>
                    <View style={styles.financialInfo}>
                      <Text style={styles.revenue}>
                        Revenue: £{(companyData.financial.revenue / 1000000).toFixed(1)}M
                      </Text>
                      <Text style={styles.growth}>
                        Growth: +{companyData.financial.yoyGrowth}%
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.actions}>
                  <Pressable 
                    style={styles.chatButton}
                    onPress={() => onOpenChat(companyID)}
                  >
                    <Text style={styles.chatButtonText}>💬 Chat</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.removeButton}
                    onPress={() => onRemoveFromWatchlist(companyID)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  
  content: {
    flex: 1,
    padding: 20,
  },
  
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  
  companyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  companyInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  
  companyDetails: {
    flex: 1,
  },
  
  companyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  
  companyIntro: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
    marginBottom: 8,
  },
  
  financialInfo: {
    flexDirection: "row",
    gap: 12,
  },
  
  revenue: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  
  growth: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "600",
  },
  
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  
  chatButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  
  chatButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  
  removeButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
  },
  
  removeButtonText: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },
});
