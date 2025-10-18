// SwipeableCard.tsx
import React, { useMemo, useRef } from "react";
import { Animated, PanResponder, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  // callbacks
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  onCancel?: () => void; // when it snaps back
  // tuning
  swipeThreshold?: number; // px
  outDistance?: number; // how far it flies out
  rotateDeg?: number; // max rotation at edges
};

export default function SwipeableCard({
  children,
  style,
  onSwipeRight,
  onSwipeLeft,
  onCancel,
  swipeThreshold = 120,
  outDistance = 500,
  rotateDeg = 12,
}: Props) {
  const pan = useRef(new Animated.ValueXY()).current;
  const tilt = useRef(new Animated.Value(1)).current; // sign to vary rotation slightly
  // rotation based on X
  const rotate = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [`-${rotateDeg}deg`, "0deg", `${rotateDeg}deg`],
    extrapolate: "clamp",
  });

  const panStyle = useMemo(
    () =>
      ({
        transform: [...pan.getTranslateTransform(), { rotate }],
      } as Animated.WithAnimatedValue<ViewStyle>),
    [pan, rotate]
  );

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true, // always respond to drags
      onPanResponderGrant: () => {
        // randomly flip tilt sign so cards rotate slightly different
        tilt.setValue(Math.random() > 0.5 ? 1 : -1);
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }, // tie gesture to animated values
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_evt, { dx, vy }) => {
        console.log("SwipeableCard: Release detected - dx:", dx, "vy:", vy, "threshold:", swipeThreshold);
        
        if (dx > swipeThreshold) {
          console.log("SwipeableCard: Right swipe detected! dx:", dx, "> threshold:", swipeThreshold);
          // fling right
          Animated.spring(pan, {
            toValue: { x: outDistance, y: vy * 100 },
            useNativeDriver: true,
          }).start(() => {
            console.log("SwipeableCard: Right swipe animation completed, calling onSwipeRight");
            onSwipeRight?.();
            pan.setValue({ x: 0, y: 0 }); // reset if you keep reusing the same view
          });
          return;
        }
        if (dx < -swipeThreshold) {
          console.log("SwipeableCard: Left swipe detected! dx:", dx, "< -threshold:", -swipeThreshold);
          // fling left
          Animated.spring(pan, {
            toValue: { x: -outDistance, y: vy * 100 },
            useNativeDriver: true,
          }).start(() => {
            console.log("SwipeableCard: Left swipe animation completed, calling onSwipeLeft");
            onSwipeLeft?.();
            pan.setValue({ x: 0, y: 0 });
          });
          return;
        }
        
        console.log("SwipeableCard: Swipe distance insufficient, snapping back. dx:", dx, "threshold:", swipeThreshold);
        // snap back
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 6,
          useNativeDriver: true,
        }).start(() => onCancel?.());
      },
    })
  ).current;

  return (
    <Animated.View style={[style, panStyle]} {...responder.panHandlers}>
      {children}
    </Animated.View>
  );
}
