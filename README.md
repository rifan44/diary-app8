# Diary App 08 — Redux Toolkit

Aplikasi diary sederhana untuk praktikum React Native dan Expo Router. Daftar diary dan status favorite dikelola oleh Redux Toolkit agar Home, Detail, Edit, dan Favorite membaca sumber data yang sama. Isi form tetap memakai state lokal.

## Menjalankan aplikasi

Pastikan Node.js dan npm tersedia, lalu jalankan:

```bash
npm ci
npx expo start
```

Buka aplikasi dengan Expo Go, emulator Android, iOS Simulator, atau tekan `w` untuk versi web.

Pemeriksaan kode:

```bash
npm run lint
npx tsc --noEmit
```

## Fitur

- Melihat diary contoh dan jumlah diary/favorite.
- Menambah diary dengan pilihan suasana hati.
- Memfilter Home berdasarkan suasana hati.
- Membuka detail, mengubah judul/isi/suasana, menghapus, dan mengubah status favorite.
- Melihat daftar favorite dan menghapus semua tanda favorite sekaligus.
- Menampilkan empty state ketika daftar kosong atau filter tidak menemukan diary.
- Memvalidasi judul minimal 3 karakter dan isi diary wajib diisi.

## Struktur project

```text
src/
  app/                       # Route Expo Router
    (tabs)/                   # Home, Tambah, Favorite
    detail/[id].tsx           # Detail dan hapus diary
    edit/[id].tsx             # Form edit diary
  components/DiaryCard.tsx
  features/diary/
    diarySlice.ts             # State dan reducer diary
    diarySelectors.ts         # Statistik turunan
  redux/
    hooks.ts                  # useAppSelector/useAppDispatch
    store.ts                  # Redux Store
  styles/tokens.ts
```

Route berada di `src/app`. Konfigurasi project seperti `app.json`, `package.json`, dan `tsconfig.json` tetap di root. Struktur `src/app` adalah pola yang didukung Expo Router; hanya ada satu folder route agar tidak membingungkan saat pengembangan.

## Praktikum Redux

### Eksperimen 2 — Action Payload

`toggleFavorite` menerima object sebagai payload:

```ts
dispatch(toggleFavorite({ id: item.id }));
```

Tipe reducer-nya adalah `PayloadAction<{ id: number }>`. Reducer membaca id melalui `action.payload.id`. Bentuk object mudah diperluas jika suatu saat action memerlukan data tambahan.

### Eksperimen 3 — Reset Store

Reducer `resetDiaries` mengembalikan state diary ke data awal. Untuk mengirim action dari komponen, gunakan:

```ts
dispatch(resetDiaries());
```

### Eksperimen 4 — Statistik

`selectTotalDiary` membaca panjang daftar dan `selectTotalFavorite` menghitung entry yang `liked`. Keduanya menghitung nilai dari state yang sudah ada; statistik tidak disimpan sebagai state terpisah sehingga nilainya selalu mengikuti daftar diary.

### Local state, global state, dan database persisten

- **Local state (`useState`)** menyimpan data sementara yang hanya dibutuhkan satu screen, seperti teks yang sedang diketik atau filter suasana di Home.
- **Global Redux state** menyimpan daftar diary dan status favorite yang perlu dibaca atau diubah oleh beberapa screen. Perubahan dilakukan melalui action dan reducer.
- **Persistent database** menyimpan data di luar memori aplikasi sehingga dapat dibaca kembali setelah aplikasi ditutup atau dimulai ulang. Praktikum ini belum memakai database maupun API; data Redux kembali ke initial state setelah reload.

## Jawaban pertanyaan diskusi

1. **Mengapa isi TextInput tidak harus disimpan di Redux?**
   Isi form biasanya hanya dipakai oleh screen tempat pengguna mengetik. `useState` sudah cukup untuk mengelola nilai dan validasi lokal. Nilai baru dikirim ke Redux setelah pengguna menyimpan diary.

2. **Apa perbedaan `dispatch(action)` dengan `setState()`?**
   `setState()` memperbarui state lokal sebuah komponen. `dispatch(action)` mengirim deskripsi kejadian ke Redux Store; reducer kemudian menentukan perubahan pada state global yang dapat dibaca banyak komponen.

3. **Apa fungsi reducer?**
   Reducer menentukan bagaimana state berubah berdasarkan action yang diterima. Pada Redux Toolkit, Immer memungkinkan reducer ditulis dengan sintaks yang tampak mengubah state, sambil tetap menghasilkan pembaruan immutable.

4. **Mengapa Redux Store disebut single source of truth?**
   Karena nilai global yang dibagikan disimpan pada satu Store. Screen yang berbeda membaca data yang sama dari sana, sehingga tidak perlu memelihara salinan diary yang dapat berbeda satu sama lain.

5. **Apa yang terjadi jika dua screen membaca state diary yang sama?**
   Keduanya membaca daftar dari Store yang sama. Setelah action mengubah daftar atau favorite, selector yang terdampak menerima nilai terbaru dan UI ikut diperbarui.

6. **Apa perbedaan action dan reducer?**
   Action menjelaskan kejadian dan dapat membawa payload, misalnya `toggleFavorite({ id })`. Reducer adalah aturan yang memproses action itu dan menentukan perubahan state.

7. **Mengapa Redux Toolkit diperkenalkan dibanding Redux klasik?**
   Redux Toolkit mengurangi kode berulang dan menyediakan pola modern melalui `configureStore()` serta `createSlice()`. Slice membentuk reducer dan action creator sekaligus, sementara konfigurasi Store menyediakan middleware standar dan dukungan Redux DevTools.

8. **Apakah Redux dapat menggantikan MySQL? Jelaskan.**
   Tidak. Redux menyimpan state di memori aplikasi untuk kebutuhan UI. MySQL adalah database persisten di sisi server yang dapat menyimpan dan mengelola data jangka panjang. Aplikasi dapat memakai Redux sebagai state client dan API/database sebagai penyimpanan persisten.

9. **Kapan Context API sudah cukup dan kapan Redux lebih sesuai?**
   Context API cocok untuk nilai bersama yang sederhana dan jarang berubah, seperti tema. Redux lebih sesuai ketika banyak screen memakai state yang sama dan perubahan memiliki beberapa aturan/action yang perlu dikelola serta ditelusuri secara konsisten.

10. **Apa keuntungan typed hooks pada project TypeScript?**
    `useAppSelector` memberi tipe `RootState` pada selector, sedangkan `useAppDispatch` memakai tipe `AppDispatch`. TypeScript dapat memberi autocomplete dan mendeteksi akses state atau action yang tidak sesuai lebih awal.

## Catatan

Store Redux pada praktikum ini hanya berada di memori. Menutup atau memuat ulang aplikasi mengembalikan diary ke initial state. Backend, REST API, dan database belum menjadi bagian praktikum ini.
