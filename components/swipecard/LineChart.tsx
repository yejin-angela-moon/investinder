import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type LineChartProps = {
  title: string;
};

export function LineChartStyled({ title }: LineChartProps) {
  const lineData = [
    { value: 0, dataPointText: "0" },
    { value: 20, dataPointText: "20" },
    { value: 18, dataPointText: "18" },
    { value: 40, dataPointText: "40" },
    { value: 36, dataPointText: "36" },
    { value: 60, dataPointText: "60" },
    { value: 54, dataPointText: "54" },
    { value: 85, dataPointText: "85" },
  ];
  return (
    <View style={styles.lineChartContainer}>
      <Text
        style={{
          color: "black",
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      <LineChart
        initialSpacing={0}
        data={lineData}
        spacing={30}
        textColor1="black"
        textShiftY={-8}
        textShiftX={-10}
        textFontSize={13}
        thickness={5}
        hideRules
        hideYAxisText
        yAxisColor="#000000ff"
        showVerticalLines
        verticalLinesColor="rgba(0, 0, 0, 0.5)"
        xAxisColor="#000000ff"
        color="#000000ff"
      />
    </View>
  );
}

const styles = {
  lineChartContainer: {
    backgroundColor: "#ffffffff",
    padding: 10,
    borderRadius: 8,
  },
};
