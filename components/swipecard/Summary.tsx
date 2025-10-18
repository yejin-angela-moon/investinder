import { Text, View, StyleSheet } from "react-native";

interface SummaryProps {
  companyID?: string;
}

const AI_SUMMARIES = {
  "company_001": {
    title: "Strong AI Platform with Enterprise Focus",
    summary: "TechFlow AI demonstrates robust growth with 65% YoY revenue increase. The company has achieved product-market fit in the enterprise automation space with a solid 48% gross margin."
  },
  "company_002": {
    title: "Sustainable Energy Leader with International Potential", 
    summary: "GreenTech Solutions shows exceptional 85% YoY growth in the sustainable energy sector. Strong fundamentals with 52% gross margin and clear path to international expansion."
  },
  "company_003": {
    title: "Healthcare Innovation with Massive Market Opportunity",
    summary: "HealthConnect leads the telemedicine revolution with 120% YoY growth. The platform has achieved strong user retention and is well-positioned for AI diagnostic integration."
  },
  "company_004": {
    title: "EdTech Pioneer with Scalable Learning Platform",
    summary: "EduTech Pro is building the future of personalized education. Despite being in growth phase, the company shows strong potential with 45% YoY growth and expanding market reach."
  },
  "company_005": {
    title: "Clean Energy Revolution with Smart Grid Technology",
    summary: "GreenEnergy Solutions is transforming smart cities with 95% YoY growth. Their IoT-based energy optimization platform shows exceptional 60% gross margins and strong market adoption."
  },
  "company_006": {
    title: "Digital Health Leader with AI-Powered Diagnostics",
    summary: "HealthTech Innovations is revolutionizing healthcare with 150% YoY growth. Their AI-powered diagnostic platform demonstrates strong 65% gross margins and expanding market presence."
  },
  "company_007": {
    title: "Blockchain Finance Pioneer with DeFi Innovation",
    summary: "BlockChain Finance leads the DeFi revolution with 200% YoY growth. Their equity trading platform shows exceptional 70% gross margins and strong investor confidence."
  },
  "company_008": {
    title: "Tokenized Equity Platform with Regulatory Compliance",
    summary: "CryptoEquity is pioneering tokenized equity with 75% YoY growth. Their regulatory-compliant platform shows solid 45% gross margins and growing institutional adoption."
  },
  "company_009": {
    title: "Smart Agriculture with IoT Innovation",
    summary: "AgriTech Solutions is transforming farming with 80% YoY growth. Their IoT sensor network shows strong 50% gross margins and expanding agricultural market reach."
  },
  "company_010": {
    title: "Space Technology with Satellite Constellation Vision",
    summary: "SpaceTech Ventures is pioneering satellite IoT with 300% YoY growth. Despite early-stage challenges, their satellite constellation shows massive potential in global connectivity."
  }
};

export function Summary({ companyID = "company_001" }: SummaryProps) {
  const aiData = AI_SUMMARIES[companyID as keyof typeof AI_SUMMARIES] || AI_SUMMARIES["company_001"];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 AI Summary</Text>
      <Text style={styles.summaryTitle}>{aiData.title}</Text>
      <Text style={styles.summaryText}>{aiData.summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
});
