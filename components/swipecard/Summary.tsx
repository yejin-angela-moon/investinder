import { Text, View } from "react-native";

export function Summary() {
  return (
    <View style={[{ alignItems: "center", flexDirection: "row" }]}>
      <Text>AI Summary</Text>
      <Text>Title</Text>
    </View>
  );
}

const styles = {
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
};
