import React, { useState } from "react";
import { StyleSheet, View, Pressable, Text, Alert } from "react-native";
import { CompanyCardContainer } from "./components/swipecard/CompanyCardContainer";
import { WatchlistScreen } from "./components/watchlist/WatchlistScreen";
import { GroupChat } from "./components/chat/GroupChat";
import { PortfolioScreen } from "./components/portfolio/PortfolioScreen";
import { InvestmentScreen } from "./components/investment/InvestmentScreen";
import { TradingScreen } from "./components/trading/TradingScreen";
import { ProfileScreen } from "./components/profile/ProfileScreen";
import { TransactionHistoryScreen } from "./components/transaction/TransactionHistoryScreen";
import { StartupInvestmentDetailsScreen } from "./components/startup/StartupInvestmentDetailsScreen";
import { PortfolioAnalyticsScreen } from "./components/analytics/PortfolioAnalyticsScreen";
import { WatchlistProvider, useWatchlist } from "./hooks/useWatchlist";
import { BlockchainProvider } from "./hooks/useBlockchain";

const companies = [
  { id: "company_001" },
  { id: "company_002" },
  { id: "company_003" },
  { id: "company_004" },
  { id: "company_005" },
  { id: "company_006" },
  { id: "company_007" },
  { id: "company_008" },
  { id: "company_009" },
  { id: "company_010" },
];

type Screen = "swipe" | "watchlist" | "chat" | "portfolio" | "investment" | "trading" | "profile" | "transaction-history" | "startup-investments" | "portfolio-analytics";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("swipe");
  const [selectedCompanyID, setSelectedCompanyID] = useState<string>("");
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const handleAddToWatchlist = (companyID: string) => {
    console.log("App: Adding to watchlist:", companyID);
    addToWatchlist(companyID);
    console.log("App: Current watchlist:", watchlist);
    // Move to next company
    setCurrentCompanyIndex(prev => (prev + 1) % companies.length);
  };

  const handleSkipCompany = () => {
    console.log("App: Skipping company");
    // Move to next company
    setCurrentCompanyIndex(prev => (prev + 1) % companies.length);
  };

  const handleRemoveFromWatchlist = (companyID: string) => {
    removeFromWatchlist(companyID);
  };

  const handleOpenChat = (companyID: string) => {
    setSelectedCompanyID(companyID);
    setCurrentScreen("chat");
  };

  const handleCloseChat = () => {
    setCurrentScreen("watchlist");
  };

  const handleBackToSwipe = () => {
    setCurrentScreen("swipe");
  };

  const handleBackToWatchlist = () => {
    setCurrentScreen("watchlist");
  };

  const handleOpenPortfolio = () => {
    setCurrentScreen("portfolio");
  };

  const handleOpenInvestment = () => {
    setCurrentScreen("investment");
  };

  const handleBackToSwipeFromPortfolio = () => {
    setCurrentScreen("swipe");
  };

  const handleBackToSwipeFromInvestment = () => {
    setCurrentScreen("swipe");
  };

  const handleOpenTrading = () => {
    setCurrentScreen("trading");
  };


  const handleOpenProfile = () => {
    setCurrentScreen("profile");
  };

  const handleBackToSwipeFromTrading = () => {
    setCurrentScreen("swipe");
  };


  const handleBackToSwipeFromProfile = () => {
    setCurrentScreen("swipe");
  };

  const handleOpenTransactionHistory = () => {
    setCurrentScreen("transaction-history");
  };

  const handleOpenStartupInvestments = () => {
    setCurrentScreen("startup-investments");
  };

  const handleOpenPortfolioAnalytics = () => {
    setCurrentScreen("portfolio-analytics");
  };

  const handleBackToSwipeFromTransactionHistory = () => {
    setCurrentScreen("swipe");
  };

  const handleBackToSwipeFromStartupInvestments = () => {
    setCurrentScreen("swipe");
  };

  const handleBackToSwipeFromPortfolioAnalytics = () => {
    setCurrentScreen("swipe");
  };

  if (currentScreen === "watchlist") {
    return (
      <View style={styles.container}>
        <WatchlistScreen
          watchlist={watchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          onOpenChat={handleOpenChat}
        />
        <Pressable style={styles.backButton} onPress={handleBackToSwipe}>
          <Text style={styles.backButtonText}>← Back to Swipe</Text>
        </Pressable>
      </View>
    );
  }

  if (currentScreen === "chat") {
    return (
      <GroupChat
        companyID={selectedCompanyID}
        onClose={handleCloseChat}
      />
    );
  }

  if (currentScreen === "portfolio") {
    return (
      <PortfolioScreen 
        onBack={handleBackToSwipeFromPortfolio}
        onOpenTransactionHistory={handleOpenTransactionHistory}
        onOpenStartupInvestments={handleOpenStartupInvestments}
        onOpenPortfolioAnalytics={handleOpenPortfolioAnalytics}
      />
    );
  }

  if (currentScreen === "investment") {
    return (
      <InvestmentScreen onBack={handleBackToSwipeFromInvestment} />
    );
  }

  if (currentScreen === "trading") {
    return (
      <TradingScreen onBack={handleBackToSwipeFromTrading} />
    );
  }


  if (currentScreen === "profile") {
    return (
      <ProfileScreen onBack={handleBackToSwipeFromProfile} />
    );
  }

  if (currentScreen === "transaction-history") {
    return (
      <TransactionHistoryScreen onBack={handleBackToSwipeFromTransactionHistory} />
    );
  }

  if (currentScreen === "startup-investments") {
    return (
      <StartupInvestmentDetailsScreen onBack={handleBackToSwipeFromStartupInvestments} />
    );
  }

  if (currentScreen === "portfolio-analytics") {
    return (
      <PortfolioAnalyticsScreen onBack={handleBackToSwipeFromPortfolioAnalytics} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Investinder</Text>
        <View style={styles.headerButtons}>
          <Pressable 
            style={styles.headerButton}
            onPress={handleOpenPortfolio}
          >
            <Text style={styles.headerButtonText}>💼</Text>
          </Pressable>
          <Pressable 
            style={styles.headerButton}
            onPress={handleOpenInvestment}
          >
            <Text style={styles.headerButtonText}>💰</Text>
          </Pressable>
          <Pressable 
            style={styles.headerButton}
            onPress={handleOpenTrading}
          >
            <Text style={styles.headerButtonText}>📈</Text>
          </Pressable>
          <Pressable 
            style={styles.menuButton}
            onPress={handleOpenProfile}
          >
            <Text style={styles.menuButtonText}>⚙️</Text>
          </Pressable>
          <Pressable 
            style={styles.watchlistButton}
            onPress={() => setCurrentScreen("watchlist")}
          >
            <Text style={styles.watchlistButtonText}>📋 {watchlist.length}</Text>
          </Pressable>
        </View>
      </View>
      
      <CompanyCardContainer 
        companyID={companies[currentCompanyIndex]?.id || "company_001"}
        onAddToWatchlist={handleAddToWatchlist}
        onSkip={handleSkipCompany}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  
  headerButtons: {
    flexDirection: "row",
    gap: 6,
  },
  
  headerButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 32,
    alignItems: "center",
  },
  
  headerButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  
  watchlistButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 32,
    alignItems: "center",
  },
  
  watchlistButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  
  menuButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 32,
    alignItems: "center",
  },
  
  menuButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1,
  },
  
  backButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default function App() {
  return (
    <BlockchainProvider>
      <WatchlistProvider>
        <AppContent />
      </WatchlistProvider>
    </BlockchainProvider>
  );
}
