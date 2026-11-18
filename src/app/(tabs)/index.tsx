import { useMemo, useState } from "react";

import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import DiaryCard from "../../components/DiaryCard";

import { toggleFavorite } from "../../features/diary/diarySlice";

import {
  selectTotalDiary,
  selectTotalFavorite,
} from "../../features/diary/diarySelectors";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { COLORS, SPACE, TYPO } from "../../styles/tokens";

export default function HomeScreen() {
  console.log("Home render");

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [moodFilter, setMoodFilter] = useState<string | null>(null);

  const entries = useAppSelector((state) => state.diary.entries);

  const totalDiary = useAppSelector(selectTotalDiary);

  const totalFavorite = useAppSelector(selectTotalFavorite);

  const filteredEntries = useMemo(
    () =>
      moodFilter === null
        ? entries
        : entries.filter((entry) => entry.mood === moodFilter),
    [entries, moodFilter],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buku Harian</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalDiary}</Text>
          <Text style={styles.statLabel}>Total Diary</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalFavorite}</Text>
          <Text style={styles.statLabel}>Total Favorite</Text>
        </View>
      </View>

      <Text style={styles.filterLabel}>Filter suasana</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {[null, ...new Set(entries.map((entry) => entry.mood))].map((mood) => (
          <Pressable
            key={mood ?? "all"}
            accessibilityRole="button"
            accessibilityState={{ selected: moodFilter === mood }}
            onPress={() => setMoodFilter(mood)}
            style={[
              styles.filterChip,
              moodFilter === mood && styles.filterChipSelected,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                moodFilter === mood && styles.filterTextSelected,
              ]}
            >
              {mood ?? "Semua"}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filteredEntries}
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
            <Text style={styles.emptyTitle}>
              {entries.length === 0
                ? "Diary kamu masih kosong"
                : "Belum ada diary dengan suasana ini"}
            </Text>
            <Text style={styles.emptyText}>
              {entries.length === 0
                ? "Tulis cerita pertamamu untuk mulai mengisi buku harian."
                : "Pilih suasana lain atau tambahkan diary baru."}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(tabs)/create")}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Tulis diary</Text>
            </Pressable>
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
    color: COLORS.text,
  },

  statsRow: {
    flexDirection: "row",
    gap: SPACE.m,
    marginVertical: SPACE.m,
  },

  statCard: {
    flex: 1,
    padding: SPACE.m,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
  },

  statLabel: {
    marginTop: 2,
    color: COLORS.muted,
    fontSize: 12,
  },

  filterLabel: {
    marginBottom: SPACE.s,
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },

  filterRow: {
    gap: SPACE.s,
    paddingBottom: SPACE.m,
  },

  filterChip: {
    paddingHorizontal: SPACE.m,
    paddingVertical: SPACE.s,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  filterChipSelected: {
    borderColor: COLORS.accent,
    backgroundColor: "#EFF6FF",
  },

  filterText: {
    color: COLORS.text,
    fontSize: 14,
  },

  filterTextSelected: {
    color: COLORS.accent,
    fontWeight: "700",
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

  emptyText: {
    color: COLORS.muted,
    lineHeight: 21,
    textAlign: "center",
  },

  createButton: {
    marginTop: SPACE.l,
    paddingHorizontal: SPACE.l,
    paddingVertical: SPACE.m,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },

  createButtonText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
});
