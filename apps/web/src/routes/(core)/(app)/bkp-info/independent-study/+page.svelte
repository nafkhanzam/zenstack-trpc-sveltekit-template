<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Studi Independen";
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: "BKP",
      href: "/bkp-info",
      icon: "heroicons:information-circle",
    },
    {
      label: pageTitle,
      icon: "heroicons:book-open",
    },
  ];

  function handleBack() {
    goto("/bkp-info");
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <Breadcrumbs items={breadcrumbItems} />

    <div class="mb-8">
      <div class="mb-4 flex items-center gap-3">
        <div class="rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 p-3">
          <Icon icon="heroicons:book-open" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Program studi independen dengan fokus pada pembelajaran berbasis proyek
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
            Studi Independen adalah program Kampus Merdeka yang memungkinkan mahasiswa belajar di
            luar kampus melalui platform pembelajaran online atau bootcamp intensif. Program ini
            fokus pada pengembangan keterampilan praktis melalui project-based learning dengan
            mentoring dari praktisi industri.
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
            <li>Mahasiswa aktif semester 5 atau lebih</li>
            <li>IPK minimal 2.75</li>
            <li>Terdaftar di platform Kampus Merdeka</li>
            <li>Lulus seleksi program studi independen yang dipilih</li>
            <li>Mendapat persetujuan dari dosen pembimbing akademik</li>
            <li>Memiliki komitmen waktu penuh selama program berlangsung</li>
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
            <li>Bukti registrasi di platform Kampus Merdeka</li>
            <li>Surat penerimaan dari penyelenggara program</li>
            <li>Silabus dan kurikulum program</li>
            <li>Rencana pembelajaran (learning plan)</li>
            <li>Surat persetujuan dosen pembimbing</li>
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
              <p class="font-semibold">Durasi</p>
              <p class="text-base-content/70">4-6 bulan (1 semester)</p>
            </div>
            <div>
              <p class="font-semibold">Konversi SKS</p>
              <p class="text-base-content/70">20 SKS</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Program Examples -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:academic-cap" class="h-6 w-6" />
            Contoh Program Studi Independen
          </h2>
          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Bangkit Academy</p>
              <p class="text-sm text-base-content/70">Google, GoTo, Traveloka</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Kampus Merdeka Tech</p>
              <p class="text-base-content/70 text-sm">Dicoding, Tokopedia, Bukalapak</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">RevoU</p>
              <p class="text-sm text-base-content/70">Full Stack Development, Data Analytics</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">DBS Foundation</p>
              <p class="text-sm text-base-content/70">Coding, AI/ML Programs</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Focus -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:rocket-launch" class="h-6 w-6" />
            Fokus Pembelajaran
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Project-based learning dengan kasus nyata industri</li>
            <li>Soft skills development (communication, teamwork, problem-solving)</li>
            <li>Technical skills sesuai track yang dipilih</li>
            <li>Mentoring intensif dari praktisi industri</li>
            <li>Portfolio building dan career preparation</li>
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
            <li>Registrasi di platform Kampus Merdeka</li>
            <li>Memilih program studi independen yang tersedia</li>
            <li>Mengikuti proses seleksi program</li>
            <li>Mendapatkan surat penerimaan program</li>
            <li>Konsultasi dengan dosen pembimbing akademik</li>
            <li>Menyiapkan learning plan dan mapping mata kuliah</li>
            <li>Mengurus surat pengantar dari departemen</li>
            <li>Submit pengajuan BKP melalui MyIf Monev</li>
            <li>Mengikuti program dengan penuh komitmen</li>
            <li>Submit laporan berkala dan progress proyek</li>
            <li>Presentasi final project dan submit sertifikat</li>
          </ol>
        </div>
      </div>

      <!-- Benefits -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:star" class="h-6 w-6" />
            Manfaat Program
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Pembelajaran dari expert industri terkemuka</li>
            <li>Sertifikat yang diakui industri</li>
            <li>Portfolio project yang solid</li>
            <li>Networking dengan peserta dari berbagai universitas</li>
            <li>Career support dan job preparation</li>
            <li>Gratis atau dengan beasiswa (tergantung program)</li>
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
