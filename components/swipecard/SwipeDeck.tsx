// components/swipecard/SwipeDeck.tsx
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SwipeableCard from "./SwipeableCard";

type Item = { id: string };
type Props = {
  data: Item[];
  renderCard: (item: Item) => React.ReactNode;
  onExhausted?: () => void;
};

export default function SwipeDeck({ data, renderCard, onExhausted }: Props) {
  const [index, setIndex] = useState(0);
  const current = data[index];

  const handleNext = () => {
    setIndex((i) => {
      const ni = i + 1;
      if (ni >= data.length) onExhausted?.();
      return ni;
    });
  };

  if (!current) return null;

  return (
    <View style={styles.wrap}>
      {/* Top card is swipeable */}
      <SwipeableCard
        style={styles.cardBase}
        onSwipeLeft={handleNext}
        onSwipeRight={handleNext}
        onCancel={() => {}}
      >
        {renderCard(current)}
      </SwipeableCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  cardBase: {
    width: 360,
  },
});
