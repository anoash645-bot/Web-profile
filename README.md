# Website Profil Richo Longdong

JavaScript full stack tanpa library tambahan (tanpa `npm install`).

- **Frontend:** HTML dan CSS dari template JavaScript, JavaScript browser untuk form dan tombol cetak CV
- **Backend:** Node.js (`server.js`, `src/handler.js`), API `POST /api/contact`
- **Data:** semua isi halaman ada di `src/data/profile.json` (termasuk isi CV di bagian `cv`)
- **SEO:** judul dan deskripsi, canonical, Open Graph, JSON-LD (Person), `robots.txt`, `sitemap.xml`

## Halaman
- `/` profil, `/cv` curriculum vitae (tombol **Cetak / Simpan PDF** menghasilkan satu lembar A4)

## Menjalankan di komputer
```bash
node server.js        # buka http://localhost:3000
node --test           # jalankan tes otomatis
```

## Cara kerja di Vercel
Saat deploy, Vercel menjalankan `npm run build` (`scripts/build.js`) yang membuat `index.html`, `cv.html`, `404.html`, `robots.txt`, dan `sitemap.xml` di folder `public`. Form kontak berjalan sebagai fungsi `api/contact.js`. Pengaturannya ada di `vercel.json`.

## Variabel lingkungan (Vercel: Settings, Environment Variables)
| Nama | Fungsi |
|---|---|
| `SITE_URL` | Alamat situs, misalnya `https://richo-portfolio.vercel.app`. Kalau kosong, dipakai alamat produksi Vercel |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Pesan dari form dikirim ke Telegram (diisi keduanya) |
| `MESSAGES_FILE`, `PORT` | Hanya untuk dijalankan di komputer sendiri |

Di Vercel, penyimpanan file bersifat sementara, jadi isi variabel Telegram supaya pesan dari form benar-benar sampai.

## Langkah publikasi
1. Hapus isi repository GitHub lama, lalu unggah **seluruh isi** folder ini (bukan hanya sebagian file).
2. Di Vercel, **Add New Project**, pilih repository, lalu **Deploy**. Pengaturan build dibaca dari `vercel.json`.
3. Isi `SITE_URL` dan variabel Telegram, lalu **Redeploy**.
4. Buka `alamat-situs/cv` dan `alamat-situs/sitemap.xml` untuk memeriksa.
5. Daftarkan situs di Google Search Console, lalu kirim `alamat-situs/sitemap.xml`.
