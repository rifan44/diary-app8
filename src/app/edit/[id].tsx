import { useState } from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { editDiary } from "../../features/diary/diarySlice";

import { COLORS, RADIUS, SPACE } from "../../styles/tokens";

const MOODS = [
  "\u{1F60A}",
  "\u{1F3AF}",
  "\u{1F60C}",
  "\u{1F634}",
];

export default function EditDiaryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entryId = Number(id);

  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === entryId),
  );

  const [title, setTitle] = useState(entry?.title ?? "");
  const [body, setBody] = useState(entry?.body ?? "");
  const [mood, setMood] = useState(entry?.mood ?? MOODS[0]);
  const [error, setError] = useState("");

  if (!entry) {
    return (
      <View style={styles.missingEntry}>
        <Text style={styles.heading}>Diary tidak ditemukan.</Text>
        <Text style={styles.helper}>
          Diary mungkin sudah dihapus dari daftar.
        </Text>
      </View>
    );
  }

  const saveChanges = () => {
    const cleanTitle = title.trim();
    const cleanBody = body.trim();

    if (cleanTitle.length < 3) {
      setError("Judul diary minimal 3 karakter.");
      return;
    }

    if (!cleanBody) {
      setError("Isi diary wajib diisi.");
      return;
    }

    dispatch(
      editDiary({
        id: entry.id,
        title: cleanTitle,
        body: cleanBody,
        mood,
      }),
    );

    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Edit Diary</Text>

      <Text style={styles.label}>Judul</Text>
      <TextInput
        value={title}
        onChangeText={(value) => {
          setTitle(value);
          setError("");
        }}
        placeholder="Judul diary (minimal 3 karakter)"
        maxLength={80}
        returnKeyType="next"
        style={styles.input}
        accessibilityLabel="Judul diary"
      />

      <Text style={styles.label}>Cerita hari ini</Text>
      <TextInput
        value={body}
        onChangeText={(value) => {
          setBody(value);
          setError("");
        }}
        placeholder="Ceritakan harimu..."
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.bodyInput]}
        accessibilityLabel="Isi diary"
      />

      <Text style={styles.label}>Suasana hati</Text>
      <View style={styles.moodRow}>
        {MOODS.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityLabel={`Pilih suasana ${item}`}
            accessibilityState={{ selected: mood === item }}
            onPress={() => setMood(item)}
            style={[styles.moodButton, mood === item && styles.selectedMood]}
          >
            <Text style={styles.mood}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        onPress={saveChanges}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Simpan perubahan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACE.l,
    gap: SPACE.m,
    backgroundColor: COLORS.background,
  },

  missingEntry: {
    flex: 1,
    justifyContent: "center",
    padding: SPACE.l,
    backgroundColor: COLORS.background,
  },

  heading: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
  },

  helper: {
    color: COLORS.muted,
    lineHeight: 21,
  },

  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: 12,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },

  bodyInput: {
    minHeight: 160,
  },

  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACE.s,
  },

  moodButton: {
    minWidth: 54,
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },

  selectedMood: {
    borderColor: COLORS.accent,
    borderWidth: 2,
  },

  mood: {
    fontSize: 28,
  },

  error: {
    color: COLORS.danger,
    fontSize: 13,
  },

  button: {
    marginTop: SPACE.s,
    padding: 14,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.accent,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.surface,
    fontWeight: "700",
  },
});
