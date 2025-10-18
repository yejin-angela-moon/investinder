import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Summary } from "./Summary";

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
CompanyCard.Body = function Body() {
  return (
    <View style={styles.body}>
      <Summary />
    </View>
  );
};

/* ---------------- Footer ---------------- */
CompanyCard.Footer = function Footer({
  message,
  likes,
  onLike,
}: {
  message?: string;
  likes: number;
  onLike: () => void;
}) {
  return (
    <View style={styles.footer}>
      <Pressable style={styles.likeBtn} onPress={onLike}>
        <Text style={styles.likeEmoji}>❤️</Text>
        <Text style={styles.likeCount}>{likes}</Text>
      </Pressable>

      <View style={styles.msg}>
        <Text style={styles.msgLabel} numberOfLines={1} ellipsizeMode="tail">
          {message || "Message to investor"}
        </Text>
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#ffe7e6",
  },
  likeEmoji: { fontSize: 16 },
  likeCount: { fontSize: 14, fontWeight: "600", color: "#333" },
  msg: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
  },
  msgLabel: { fontSize: 14, color: "#333" },
});
