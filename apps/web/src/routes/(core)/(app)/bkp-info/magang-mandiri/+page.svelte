<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Magang Mandiri";
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
      icon: "heroicons:user-circle",
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
        <div class="rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 p-3">
          <Icon icon="heroicons:user-circle" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Magang yang diselenggarakan secara mandiri oleh mahasiswa dengan perusahaan pilihan
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
            Magang Mandiri memberikan kebebasan kepada mahasiswa untuk mencari dan melaksanakan program
            magang di perusahaan atau institusi pilihan sendiri. Program ini cocok bagi mahasiswa yang
            memiliki inisiatif tinggi dan sudah memiliki target perusahaan/industri tertentu untuk
            pengembangan karir.
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
            <li>Mahasiswa aktif minimal semester 5</li>
            <li>IPK minimal 2.50</li>
            <li>Memiliki surat penerimaan dari perusahaan/institusi</li>
            <li>Perusahaan harus berbadan hukum resmi</li>
            <li>Ruang lingkup pekerjaan relevan dengan bidang studi</li>
            <li>Mendapat persetujuan dari dosen pembimbing</li>
            <li>Durasi minimal 400 jam kerja efektif</li>
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
          <ul class="list-disc space-y-2 pl-6">
            <li>Surat pengantar dari departemen</li>
            <li>Transkrip nilai terbaru</li>
            <li>CV dan portfolio</li>
            <li>Surat penerimaan dari perusahaan (bermaterai)</li>
            <li>Profil perusahaan dan bukti legalitas (SIUP/TDP/NIB)</li>
            <li>Job description yang jelas dari perusahaan</li>
            <li>Proposal kegiatan magang</li>
            <li>Surat pernyataan kesediaan dari pembimbing lapangan</li>
          </ul>
        </div>
      </div>

      <!-- Duration & Credits -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:clock" class="h-6 w-6" />
            Durasi & SKS
          </h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <p class="font-semibold">Durasi Minimal</p>
              <p class="text-base-content/70">3 bulan (400 jam kerja efektif)</p>
            </div>
            <div>
              <p class="font-semibold">Konversi SKS</p>
              <p class="text-base-content/70">3 SKS per 400 jam (max 20 SKS)</p>
            </div>
          </div>
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
              Pastikan perusahaan bersedia menerbitkan surat penerimaan resmi dan bermaterai
            </li>
            <li>
              Perusahaan harus dapat memberikan pembimbing lapangan yang kompeten
            </li>
            <li>
              Kegiatan magang harus relevan dengan kompetensi Teknik Informatika
            </li>
            <li>
              Mahasiswa bertanggung jawab penuh atas proses pencarian dan komunikasi dengan perusahaan
            </li>
            <li>
              Wajib melakukan bimbingan rutin dengan dosen pembimbing
            </li>
          </ul>
        </div>
      </div>

      <!-- Process -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:arrow-path" class="h-6 w-6" />
            Alur Pengajuan
          </h2>
          <ol class="list-decimal space-y-3 pl-6">
            <li>Mencari perusahaan secara mandiri</li>
            <li>Mengirim lamaran dan mengikuti proses rekrutmen</li>
            <li>Mendapatkan surat penerimaan resmi dari perusahaan</li>
            <li>Konsultasi dengan dosen pembimbing potensial</li>
            <li>Membuat proposal magang yang detail</li>
            <li>Mengurus surat pengantar dari departemen</li>
            <li>Mengumpulkan semua dokumen persyaratan</li>
            <li>Submit pengajuan BKP melalui MyIf Monev</li>
            <li>Menunggu verifikasi dan approval</li>
            <li>Melaksanakan magang dengan laporan berkala</li>
            <li>Submit laporan akhir dan sertifikat dari perusahaan</li>
          </ol>
        </div>
      </div>

      <!-- Tips -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:light-bulb" class="h-6 w-6" />
            Tips Sukses
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Mulai mencari perusahaan minimal 2-3 bulan sebelum rencana magang</li>
            <li>Persiapkan CV dan portfolio yang menarik</li>
            <li>Pastikan komunikasi yang baik dengan calon pembimbing lapangan</li>
            <li>Diskusikan ekspektasi dan job description secara detail</li>
            <li>Siapkan semua dokumen administratif dengan lengkap sejak awal</li>
          </ul>
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
