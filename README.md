<h1 align="center">📊 Traffic Analytics Dashboard</h1>

<p align="center">
Dashboard berbasis web untuk Mrmbaca csv hasil export Camlytics dan otomatis menampilkan visualisasi data.
</p>

<hr>

<h2>🚀 Fitur Utama</h2>
<ul>
  <li>📂 Upload file Excel (.xlsx, .xls, .csv)</li>
  <li>📅 Chart per Tanggal</li>
  <li>⏰ Chart per Jam</li>
  <li>🥧 Pie Chart Summary</li>
  <li>📋 Table interaktif dengan pagination</li>
  <li>⚡ Tanpa backend (pure HTML + JS)</li>
</ul>

<hr>

<h2>📂 Format Data</h2>

<table>
  <thead>
    <tr>
      <th>Time</th>
      <th>Origin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>11/03/2026 17:03</td>
      <td>Pedestrian</td>
    </tr>
    <tr>
      <td>11/03/2026 17:15</td>
      <td>Vehicle</td>
    </tr>
  </tbody>
</table>

<p><b>Keterangan:</b></p>
<ul>
  <li><b>Time</b> → tanggal & jam</li>
  <li><b>Origin</b> → kategori:
    <ul>
      <li>Pedestrian</li>
      <li>Vehicle</li>
      <li>Lainnya → dianggap Unknown</li>
    </ul>
  </li>
</ul>

<hr>


<h2>📦 Akses Webnya</h2>

<a href="https://satyanr.github.io/Camlytics-Export-Reader/">
Click disini
</a>


<hr>

<h2>📸 Preview</h2>

<p>
Dashboard menampilkan:
</p>

<ul>
  <li>Bar chart per tanggal</li>
  <li>Bar chart per jam</li>
  <li>Pie chart distribusi</li>
  <li>Table detail + pagination</li>
</ul>

<hr>

<h2>⚡ Cara Kerja</h2>
<ol>
  <li>User upload file Excel</li>
  <li>File dibaca menggunakan SheetJS</li>
  <li>Data diproses (group by tanggal & jam)</li>
  <li>Ditampilkan ke chart & table</li>
</ol>

<hr>

<h2>🧑‍💻 Author</h2>
<p><b>Satya NR</b></p>

<hr>

<h2>⭐ Support</h2>
<p>
Jika project ini membantu:
</p>
<ul>
  <li>⭐ Star repo ini</li>
</ul>
