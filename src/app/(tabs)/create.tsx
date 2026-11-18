import { useState } from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { useAppDispatch } from "../../redux/hooks";

import { addDiary } from "../../features/diary/diarySlice";

import { COLORS, RADIUS, SPACE } from "../../styles/tokens";

const MOODS = [
  "\u{1F60A}",
  "\u{1F3AF}",
  "\u{1F60C}",
  "\u{1F634}",
];

export default function CreateScreen() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");

  const [body, setBody] = useState("");

  const [mood, setMood] = useState(MOODS[0]);

  const [error, setError] = useState("");

  const saveDiary = () => {
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

    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    dispatch(
      addDiary({
        title: cleanTitle,
        date: today,
        preview: cleanBody.slice(0, 100),
        body: cleanBody,
        mood,
      }),
    );

    setTitle("");
    setBody("");
    setMood(MOODS[0]);
    setError("");

    router.replace("/");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Tambah Diary</Text>

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
        onPress={saveDiary}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Simpan diary</Text>
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

  heading: {
    marginBottom: SPACE.s,
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
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
