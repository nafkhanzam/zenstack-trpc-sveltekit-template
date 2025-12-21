<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Kerja Praktik";
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: "New BKP",
      href: "/new-bkp",
      icon: "heroicons:plus",
    },
    {
      label: pageTitle,
      icon: "heroicons:check-badge",
    },
  ];

  function handleBack() {
    goto("/new-bkp");
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <Breadcrumbs items={breadcrumbItems} />

    <div class="mb-8">
      <div class="mb-4 flex items-center gap-3">
        <div class="rounded-lg bg-gradient-to-br from-red-500 to-red-700 p-3">
          <Icon icon="heroicons:check-badge" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Program kerja praktik sebagai bagian dari kurikulum wajib
      </p>
    </div>

    <div class="grid gap-6">
      <!-- Overview -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:information-circle" class="h-6 w-6" />
            Overview
          </h2>
          <p>
            Kerja Praktik (KP) adalah mata kuliah wajib yang harus ditempuh oleh seluruh mahasiswa
            Departemen Teknik Informatika ITS. Program ini bertujuan memberikan pengalaman kerja praktis di
            industri atau institusi profesional untuk mengaplikasikan ilmu yang telah dipelajari dan
            mempersiapkan mahasiswa memasuki dunia kerja.
          </p>
        </div>
      </div>

      <!-- Requirements -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:clipboard-document-check" class="h-6 w-6" />
            Persyaratan
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Mahasiswa aktif minimal semester 6</li>
            <li>Telah menempuh minimal 100 SKS</li>
            <li>IPK minimal 2.00</li>
            <li>Telah lulus mata kuliah prasyarat KP (sesuai kurikulum)</li>
            <li>Mendapat persetujuan dari dosen wali</li>
            <li>Perusahaan/institusi harus berbadan hukum dan kredibel</li>
            <li>Ruang lingkup pekerjaan relevan dengan Teknik Informatika</li>
          </ul>
        </div>
      </div>

      <!-- Documents -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:document-text" class="h-6 w-6" />
            Dokumen yang Diperlukan
          </h2>
          <div class="space-y-4">
            <div>
              <p class="font-semibold mb-2">Tahap Pengajuan:</p>
              <ul class="list-disc space-y-1 pl-6">
                <li>Surat pengantar dari departemen</li>
                <li>Transkrip nilai terbaru</li>
                <li>CV dan surat lamaran ke perusahaan</li>
                <li>Proposal KP yang telah disetujui dosen pembimbing</li>
              </ul>
            </div>
            <div>
              <p class="font-semibold mb-2">Setelah Diterima Perusahaan:</p>
              <ul class="list-disc space-y-1 pl-6">
                <li>Surat penerimaan dari perusahaan (bermaterai)</li>
                <li>Profil perusahaan dan bukti legalitas</li>
                <li>Job description dari perusahaan</li>
                <li>Surat pernyataan kesediaan pembimbing lapangan</li>
              </ul>
            </div>
            <div>
              <p class="font-semibold mb-2">Dokumen Akhir:</p>
              <ul class="list-disc space-y-1 pl-6">
                <li>Laporan KP (sesuai template departemen)</li>
                <li>Logbook kegiatan harian</li>
                <li>Sertifikat/surat keterangan selesai KP</li>
                <li>Lembar penilaian dari pembimbing lapangan</li>
                <li>Dokumen pendukung (kode, dokumentasi, dll)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Duration & Credits -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:clock" class="h-6 w-6" />
            Durasi & SKS
          </h2>
          <div class="grid gap-4 md:grid-cols-3">
            <div>
              <p class="font-semibold">Durasi Minimal</p>
              <p class="text-base-content/70">1 bulan (160 jam)</p>
            </div>
            <div>
              <p class="font-semibold">Durasi Ideal</p>
              <p class="text-base-content/70">2-3 bulan</p>
            </div>
            <div>
              <p class="font-semibold">Bobot SKS</p>
              <p class="text-base-content/70">2 SKS (wajib)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Scope -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:briefcase" class="h-6 w-6" />
            Ruang Lingkup Pekerjaan yang Direkomendasikan
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Pengembangan aplikasi (web, mobile, desktop)</li>
            <li>Analisis dan perancangan sistem</li>
            <li>Database design dan management</li>
            <li>Quality assurance dan testing</li>
            <li>DevOps dan infrastructure</li>
            <li>Data analysis dan machine learning</li>
            <li>UI/UX design dan research</li>
            <li>Network administration dan security</li>
            <li>Technical support dan documentation</li>
          </ul>
        </div>
      </div>

      <!-- Important Notes -->
      <div class="card border-2 border-warning bg-warning/10 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">
            <Icon icon="heroicons:exclamation-triangle" class="h-6 w-6" />
            Catatan Penting
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>
              KP adalah mata kuliah WAJIB dan tidak dapat digantikan dengan kegiatan lain
            </li>
            <li>
              Mahasiswa wajib melakukan bimbingan rutin dengan dosen pembimbing KP
            </li>
            <li>
              Laporan KP harus mengikuti template dan format yang ditentukan departemen
            </li>
            <li>
              Wajib melakukan seminar KP setelah selesai (sesuai kebijakan departemen)
            </li>
            <li>
              Nilai KP ditentukan oleh gabungan penilaian pembimbing lapangan, dosen pembimbing, dan
              laporan
            </li>
            <li>
              KP yang dilakukan di luar kota/luar negeri tetap harus mendapat persetujuan departemen
            </li>
          </ul>
        </div>
      </div>

      <!-- Process -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:arrow-path" class="h-6 w-6" />
            Alur Pelaksanaan KP
          </h2>
          <ol class="list-decimal space-y-3 pl-6">
            <li>Mengambil mata kuliah KP di semester berjalan</li>
            <li>Konsultasi dengan dosen wali untuk kelayakan</li>
            <li>Mencari tempat KP (perusahaan/institusi)</li>
            <li>Membuat proposal KP dan konsultasi dengan calon dosen pembimbing</li>
            <li>Mengurus surat pengantar dari departemen</li>
            <li>Mengirim lamaran ke perusahaan</li>
            <li>Mengikuti proses seleksi perusahaan</li>
            <li>Mendapat surat penerimaan dari perusahaan</li>
            <li>Melengkapi administrasi KP di departemen</li>
            <li>Submit dokumen awal melalui MyIf Monev</li>
            <li>Mendapat approval dan penunjukan dosen pembimbing resmi</li>
            <li>Melaksanakan KP dengan mengisi logbook harian</li>
            <li>Bimbingan rutin dengan dosen pembimbing (min 4x)</li>
            <li>Menyelesaikan tugas/proyek di perusahaan</li>
            <li>Membuat laporan KP sesuai template</li>
            <li>Mendapat penilaian dari pembimbing lapangan</li>
            <li>Submit laporan akhir dan dokumen pendukung</li>
            <li>Mengikuti seminar KP (jika diwajibkan)</li>
            <li>Revisi laporan (jika ada)</li>
            <li>Submit laporan final untuk penilaian</li>
          </ol>
        </div>
      </div>

      <!-- Grading -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:academic-cap" class="h-6 w-6" />
            Komponen Penilaian
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Penilaian dari pembimbing lapangan (40%)</li>
            <li>Penilaian dosen pembimbing (30%)</li>
            <li>Kualitas laporan KP (20%)</li>
            <li>Seminar/presentasi KP (10%)</li>
          </ul>
          <p class="mt-3 text-sm italic text-base-content/60">
            *Persentase dapat berbeda sesuai kebijakan departemen yang berlaku
          </p>
        </div>
      </div>

      <!-- Tips -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:light-bulb" class="h-6 w-6" />
            Tips Sukses KP
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Mulai mencari tempat KP minimal 2 bulan sebelum rencana pelaksanaan</li>
            <li>Persiapkan CV dan portfolio yang menarik</li>
            <li>Pilih perusahaan yang sesuai dengan minat dan career goal</li>
            <li>Tunjukkan profesionalitas dan etika kerja yang baik</li>
            <li>Manfaatkan kesempatan untuk belajar sebanyak mungkin</li>
            <li>Dokumentasikan setiap pekerjaan untuk laporan</li>
            <li>Jangan menunda pembuatan laporan, catat progress secara berkala</li>
            <li>Aktif berkomunikasi dengan pembimbing lapangan dan dosen pembimbing</li>
            <li>Networking dengan profesional di tempat KP</li>
          </ul>
        </div>
      </div>

      <!-- Resources -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:link" class="h-6 w-6" />
            Sumber Daya
          </h2>
          <div class="space-y-2">
            <a
              href="https://if.its.ac.id/kuliah/kerja-praktik"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline btn-sm"
            >
              <Icon icon="heroicons:arrow-top-right-on-square" class="h-4 w-4" />
              Panduan KP Departemen Informatika
            </a>
            <a
              href="https://if.its.ac.id/download/template-laporan-kp"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline btn-sm"
            >
              <Icon icon="heroicons:arrow-top-right-on-square" class="h-4 w-4" />
              Template Laporan KP
            </a>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="flex justify-end">
        <button onclick={handleBack} class="btn btn-primary">
          <Icon icon="heroicons:arrow-left" class="h-5 w-5" />
          Kembali ke Pilihan BKP
        </button>
      </div>
    </div>
  </div>
</div>
