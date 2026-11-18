import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DiaryEntry = {
  id: number;
  title: string;
  date: string;
  preview: string;
  body: string;
  mood: string;
  liked: boolean;
};

type DiaryState = {
  entries: DiaryEntry[];
  filter: "all" | "favorite";
};

const initialState: DiaryState = {
  entries: [
    {
      id: 1,
      title: "Pagi yang Tenang",
      date: "2026-11-15",
      preview: "Jalan pagi sebelum memulai aktivitas.",
      body: "Pagi ini terasa tenang. Saya berjalan selama 20 menit sebelum memulai aktivitas.",
      mood: "\u{1F60A}",
      liked: false,
    },
    {
      id: 2,
      title: "Produktif di Kampus",
      date: "2026-11-14",
      preview: "Menyelesaikan modul dan berdiskusi dengan tim.",
      body: "Hari ini cukup produktif karena beberapa target perkuliahan selesai.",
      mood: "\u{1F3AF}",
      liked: true,
    },
    {
      id: 3,
      title: "Senja dan Buku",
      date: "2026-11-13",
      preview: "Membaca buku sambil menikmati sore.",
      body: "Sore ini saya menikmati waktu membaca buku dengan suasana santai.",
      mood: "\u{1F60C}",
      liked: false,
    },
  ],
  filter: "all",
};

const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    addDiary: (
      state,
      action: PayloadAction<Omit<DiaryEntry, "id" | "liked">>,
    ) => {
      state.entries.unshift({
        id: Date.now(),
        ...action.payload,
        liked: false,
      });
    },

    toggleFavorite: (state, action: PayloadAction<{ id: number }>) => {
      const entry = state.entries.find((item) => item.id === action.payload.id);

      if (entry) {
        entry.liked = !entry.liked;
      }
    },

    deleteDiary: (state, action: PayloadAction<number>) => {
      state.entries = state.entries.filter(
        (item) => item.id !== action.payload,
      );
    },

    editDiary: (
      state,
      action: PayloadAction<{
        id: number;
        title: string;
        body: string;
        mood: string;
      }>,
    ) => {
      const entry = state.entries.find((item) => item.id === action.payload.id);

      if (entry) {
        entry.title = action.payload.title;
        entry.body = action.payload.body;
        entry.preview = action.payload.body.slice(0, 100);
        entry.mood = action.payload.mood;
      }
    },

    resetDiaries: () => initialState,

    clearAllFavorites: (state) => {
      state.entries.forEach((entry) => {
        entry.liked = false;
      });
    },

    setFilter: (state, action: PayloadAction<"all" | "favorite">) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addDiary,
  toggleFavorite,
  deleteDiary,
  editDiary,
  resetDiaries,
  clearAllFavorites,
  setFilter,
} = diarySlice.actions;

export default diarySlice.reducer;
