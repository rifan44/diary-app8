import { useMemo } from "react";

import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  clearAllFavorites,
  toggleFavorite,
} from "../../features/diary/diarySlice";

import DiaryCard from "../../components/DiaryCard";

import { COLORS, SPACE, TYPO } from "../../styles/tokens";

export default function FavoritesScreen() {
  console.log("Favorites render");

  const router = useRouter();

  const dispatch = useAppDispatch();

  const entries = useAppSelector((state) => state.diary.entries);

  const favoriteEntries = useMemo(
    () => entries.filter((entry) => entry.liked),
    [entries],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite</Text>

      <Text style={styles.counter}>
        {favoriteEntries.length} diary favorite
      </Text>

      {favoriteEntries.length > 0 && (
        <Pressable
          accessibilityRole="button"
          onPress={() => dispatch(clearAllFavorites())}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Hapus semua favorite</Text>
        </Pressable>
      )}

      <FlatList
        data={favoriteEntries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <DiaryCard
            title={item.title}
            date={item.date}
            preview={item.preview}
            mood={item.mood}
            liked={item.liked}
            onToggleFavorite={() =>
              dispatch(toggleFavorite({ id: item.id }))
            }
            onPress={() =>
              router.push({
                pathname: "/detail/[id]",
                params: {
                  id: String(item.id),
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Belum ada diary favorite</Text>
            <Text style={styles.empty}>
              Tekan ikon hati pada diary yang ingin kamu simpan di sini.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACE.l,
    backgroundColor: COLORS.background,
  },

  header: {
    fontSize: TYPO.h1,
    fontWeight: "700",
  },

  counter: {
    color: COLORS.muted,
    marginBottom: SPACE.m,
  },

  empty: {
    textAlign: "center",
    color: COLORS.muted,
    lineHeight: 21,
  },

  emptyState: {
    alignItems: "center",
    paddingHorizontal: SPACE.xl,
    paddingVertical: 40,
  },

  emptyTitle: {
    marginBottom: SPACE.s,
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  clearButton: {
    alignSelf: "flex-start",
    marginBottom: SPACE.m,
    paddingHorizontal: SPACE.m,
    paddingVertical: SPACE.s,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
  },

  clearButtonText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "700",
  },
});
