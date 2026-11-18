import type { RootState } from "../../redux/store";

export const selectTotalDiary = (state: RootState) =>
  state.diary.entries.length;

export const selectTotalFavorite = (state: RootState) =>
  state.diary.entries.reduce((total, entry) => total + Number(entry.liked), 0);
