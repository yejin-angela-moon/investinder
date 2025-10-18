import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LineChartStyled } from "./LineChart";
import { Summary } from "./Summary";
import { FinancialSummary } from "./FinancialSummary";
import { getCompanyData } from "./CompanyData";

export function CompanyCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/* ---------------- Header ---------------- */
CompanyCard.Header = function Header({
  logoURI,
  companyName,
  intro,
}: {
  logoURI?: string;
  companyName: string;
  intro?: string;
}) {
  return (
    <View style={styles.header}>
      {logoURI ? (
        <Image source={{ uri: logoURI }} style={styles.logo} />
      ) : (
        <View style={styles.logo} />
      )}
      <View style={styles.headerTextWrap}>
        <Text style={styles.company}>{companyName}</Text>
        {intro ? (
          <Text style={styles.intro} numberOfLines={3} ellipsizeMode="tail">
            {intro}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

/* ---------------- Body ---------------- */
CompanyCard.Body = function Body({ companyID }: { companyID?: string }) {
  const companyData = getCompanyData(companyID || "company_001");
  
  return (
    <View style={styles.body}>
      <FinancialSummary 
        data={companyData.financial} 
        showDetailed={false} 
        companyName={companyData.name}
      />
      <Summary companyID={companyID} />
    </View>
  );
};

/* ---------------- Footer ---------------- */
CompanyCard.Footer = function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.swipeHint}>Swipe right to add to watchlist</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "80%",
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    gap: 12,

    // subtle shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  /* ----- Header ----- */
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  headerTextWrap: { flex: 1, gap: 4 },
  company: { fontSize: 16, fontWeight: "700", color: "#222" },
  intro: { fontSize: 13, color: "#555", lineHeight: 18 },

  /* ----- Body ----- */
  body: {
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    padding: 12,
  },

  /* ----- Footer ----- */
  footer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  swipeHint: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
});
