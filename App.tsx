import { StyleSheet, View } from "react-native";
import { CompanyCardContainer } from "./components/swipecard/CompanyCardContainer";
import SwipeDeck from "./components/swipecard/SwipeDeck";

const companies = [
  { id: "company_001" },
  { id: "company_002" },
  { id: "company_003" },
  { id: "company_004" },
];

export default function App() {
  return (
    <View style={styles.container}>
      <SwipeDeck
        data={companies}
        renderCard={(item) => <CompanyCardContainer companyID={item.id} />}
        onExhausted={() => console.log("🎉 No more cards")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
