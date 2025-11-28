# To Do List
---

### Page 1 LandingPage: <br>
- Login Dokter, lupa password dokter <br>
- Register Perawat, lupa password perawat <br>
- Login Perawat

---

### Page 2 Dashboard dokter <br>
A. Dashboard awal
- Daftar kunjungan ketika dokter berhasil login ke dashboard dokter
- Isinya ada 3 kolom dimana ada total kunjungan, Kunjungan hari ini, kunjungan bulan ini (diambil dari fitur tambah pasien )  *#BELUMFIX#*
- Menmpilkan jadwal praktek yang isinya hari, jam awal, jam akhir, tempat praktik khusus dokter punya dia sendiri (ini waktu kapan dokternya avoaible).Tapi yang nambahin bisa dua duanya dokter dan perwatnya
- Kualifikasi tenaga medis isinya ada pendidikan, pengalaman, spesialisasi. Ini diambil dari profil si dokter jadi harus singkron datanya
- Analisis dan Prediksi *#PENDING#* <br>

B. profile
- Informasi profil harus bisa CRUD dan nanti terupdate di tempat lainnya dari (settings informasi akun)
- Status praktik dimana status aktif bisa didapat ketika dokter input nomor SIP nya dan jadwal praktik minggu ini didapat dari dasahboard awal jadi harus singkron dan lihat jadwal lengkap arahnya ke kalender

C. Daftar pasien 
- Dokter hanya bisa melihat daftar pasien yng data nya diamabil dari dashboard perawat namun ada search bar yng bisa mencari pasien by id
- Daftar antrian isinya didapt dari inputan perawat
- Rekam medis isiny data yang diinputkan oleh dokter tapi ada fitur detail dan perawat bisa lihat detail rekam medisnya
- Detail isinnya bisa crud dibeberapa fitur isi datanya awalnya dari dashbord perawat yang singkron ke dashboard dokter

C. Kalender (per7 hari)
- Fiitur kalender realtime yang ada inputan event dan event nya dan asalnya dari tambah data pasien yang didapat di dashboard perawat
- Fitur pengajuan cuti yang detailnya isinya deskripsi, dari - sampai (tanggal) dan bakal masuk ke kalender bearti harus singkron ke kalender perawat dan dokter
- Jadwal pertemuan diambil dari kalender intinya kaya summary saja dari kalender terkait pertemuannya

D. Keuangan #PENDING
- Komisi tenaga medis C

E. Pengaturan 
- Informasi akun semua harus bisa crud namun harus singkron ke profil. Dan ada fitur hapus akun yang terupdate ke database
- Ganti pasword harus bisa update ke databse nya yang nanti bisa digunakan untuk login dokternya
- Notifikasi. Beberapa pengaturan harus singkron ke notifikasinya lalu isi notifikasi berupa jadwal kontrol, update, pasien baru terdaftar yang harus singkron semuanya dari dashboard perawat dan dokter

---

### Page 2 Dashboard Perawat <br>
A. Dashboard Awal : 
- Daftar kunjungan ketika dokter berhasil login ke dashboard dokter
- Isinya ada 3 kolom dimana ada total kunjungan, Kunjungan hari ini, kunjungan bulan ini (diambil dari fitur tambah pasien )  #BELUMFIX
- Menmpilkan jadwal praktek yang isinya hari, jam awal, jam akhir, tempat praktik khusus dokter punya dia sendiri (ini waktu kapan dokternya avoaible).Tapi yang nambahin bisa dua duanya dokter dan perwatnya
- Kualifikasi tenaga medis isinya ada pendidikan, pengalaman, spesialisasi. Ini diambil dari profil si dokter jadi harus singkron datanya

B. profil
- Status akun yang isinya status akun yang aktif apabila pengguna berhasil login kelengkapan profil bila perawat ngisi informasi akun di pengaturan secara lengkap, status shift bakal berstatus on duty kalau dia ada shift, shift nya dapat dari kalender
- Informasi profil harus bisa CRUD dan nanti terupdate di tempat lainnya dari (settings informasi akun)
- Status praktik dimana status aktif bisa didapat ketika dokter input nomor SIP nya dan jadwal praktik minggu ini didapat dari dasahboard awal jadi harus singkron dan lihat jadwal lengkap arahnya ke kalender

C. Daftar Pasien (perawat nambah pasien di daftar antrian trus ketika status udah selesai perawat bakal ganti status nya jadi selesai lalu hilang dari daftar antrian masuk ke daftar pasien nantti ditambah rekam medisnya ama dokter di dashboard dokter bagian daftar pasien lalu perawat bisa lihat juga rekam medis yang ditulis dokter)
- Daftar pasien isinya cuman ngeliat aja datanya - data nya dapetnya dari daftar antrian. Ada fitur search bar
- Daftar antrian datanya ditambah dari tambah daftar antrian lalu ada id yang generate otomatis
- Rekam medis hanya bisa review rekam medis yang sudah ditulis dokter

D. kalender
- Fiitur kalender realtime yang ada inputan event dan event nya dan asalnya dari tambah data pasien yang didapat di dashboard perawat
- Fitur pengajuan cuti yang detailnya isinya deskripsi, dari - sampai (tanggal) dan bakal masuk ke kalender bearti harus singkron ke kalender perawat dan dokter
- Jadwal pertemuan diambil dari kalender intinya kaya summary saja dari kalender terkait pertemuannya

E. Pengturan 
- Informasi akun semua harus bisa crud namun harus singkron ke profil. Dan ada fitur hapus akun yang terupdate ke database
- Ganti pasword harus bisa update ke databse nya yang nanti bisa digunakan untuk login dokternya
- Notifikasi. Beberapa pengaturan harus singkron ke notifikasinya lalu isi notifikasi berupa jadwal kontrol, update, pasien baru terdaftar yang harus singkron semuanya dari dashboard perawat dan dokter

---
