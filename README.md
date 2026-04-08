📊 Traffic Analytics Dashboard

Dashboard berbasis web untuk upload file Excel (.xlsx, .xls, .csv) dan secara otomatis menampilkan visualisasi data dalam bentuk:

📅 Chart per Tanggal
⏰ Chart per Jam
🥧 Pie Chart Summary
📋 Table interaktif dengan pagination
🚀 Fitur Utama
Upload file Excel langsung di browser
Auto parsing data (tanpa backend)
Deteksi kolom fleksibel (Time, Origin)
Visualisasi menggunakan Chart.js
Table dengan pagination
Format angka otomatis (1,000 / 10,000)
UI modern & responsive
Tanpa install (pure HTML + JS)
📂 Format Data Excel

Pastikan file memiliki minimal kolom berikut:

Time	Origin
11/03/2026 17:03	Pedestrian
11/03/2026 17:15	Vehicle
Keterangan:
Time → tanggal & jam
Origin → kategori:
Pedestrian
Vehicle
selain itu → dianggap Unknown
🛠️ Teknologi
HTML5
CSS3
JavaScript (Vanilla)
Chart.js
SheetJS (xlsx)
📦 Cara Menjalankan
Clone repository:
git clone https://github.com/username/repo-name.git
Buka file:
index.html
Upload file Excel kamu 🎉
📸 Preview

Dashboard menampilkan:

Bar chart per tanggal
Bar chart per jam
Pie chart distribusi
Table detail + pagination
⚡ Cara Kerja
User upload file Excel
File dibaca menggunakan SheetJS
Data diproses:
Group by tanggal
Group by jam
Hitung total kategori
Data ditampilkan ke chart & table
📌 Catatan
Tidak perlu backend / server
Semua proses berjalan di browser
Cocok untuk analisa cepat & dashboard internal
🧑‍💻 Author

Satya NR

⭐ Support

Kalau project ini membantu:

⭐ Star repo ini
