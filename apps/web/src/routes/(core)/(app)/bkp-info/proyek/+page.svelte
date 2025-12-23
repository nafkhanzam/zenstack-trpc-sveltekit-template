<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Proyek";
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
      icon: "heroicons:briefcase",
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
        <div class="rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 p-3">
          <Icon icon="heroicons:briefcase" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Pengerjaan proyek penelitian atau pengembangan dengan dosen atau unit di ITS
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
            BKP Proyek memfasilitasi mahasiswa untuk terlibat dalam proyek penelitian atau
            pengembangan sistem/aplikasi di bawah bimbingan dosen atau unit kerja di ITS. Program
            ini memberikan pengalaman riset dan pengembangan produk nyata yang dapat berkontribusi
            pada kemajuan ilmu pengetahuan atau solusi praktis.
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
            <li>IPK minimal 2.75</li>
            <li>Memiliki dosen pembimbing yang bersedia membimbing proyek</li>
            <li>Proyek harus relevan dengan bidang Teknik Informatika</li>
            <li>Ruang lingkup proyek jelas dan terukur</li>
            <li>Timeline pengerjaan realistis (minimal 3 bulan)</li>
          </ul>
        </div>
      </div>

      <!-- Project Types -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:squares-2x2" class="h-6 w-6" />
            Jenis Proyek yang Dapat Diajukan
          </h2>
          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Penelitian Dosen</p>
              <p class="text-sm text-base-content/70">Asisten penelitian dalam riset dosen</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Pengembangan Sistem</p>
              <p class="text-sm text-base-content/70">Membangun aplikasi/sistem untuk unit ITS</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Riset Mandiri Terbimbing</p>
              <p class="text-sm text-base-content/70">Riset dengan topik disetujui pembimbing</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Proyek Laboratorium</p>
              <p class="text-sm text-base-content/70">Pengembangan tools/sistem untuk lab</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">PKM (Program Kreativitas Mahasiswa)</p>
              <p class="text-sm text-base-content/70">PKM-RE, PKM-KC, PKM-AI</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Proyek Kolaborasi</p>
              <p class="text-sm text-base-content/70">Kerjasama antar lab/departemen</p>
            </div>
          </div>
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
            <li>Proposal proyek yang detail dan terstruktur</li>
            <li>Surat persetujuan dari dosen pembimbing</li>
            <li>Timeline/jadwal pengerjaan proyek</li>
            <li>Transkrip nilai terbaru</li>
            <li>Surat pengantar dari departemen (jika diperlukan)</li>
            <li>Dokumen pendukung lain (TOR, MoU, dll) jika ada</li>
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
              <p class="text-base-content/70">3 bulan (dapat diperpanjang)</p>
            </div>
            <div>
              <p class="font-semibold">Konversi SKS</p>
              <p class="text-base-content/70">3-6 SKS (berdasarkan scope dan durasi)</p>
            </div>
          </div>
          <p class="mt-3 text-sm text-base-content/60">
            Konversi SKS akan ditentukan oleh dosen pembimbing dan koordinator BKP berdasarkan
            kompleksitas dan kontribusi mahasiswa.
          </p>
        </div>
      </div>

      <!-- Deliverables -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:clipboard-document-list" class="h-6 w-6" />
            Output yang Diharapkan
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Laporan progress berkala (mingguan/bulanan)</li>
            <li>Dokumentasi lengkap (teknis dan non-teknis)</li>
            <li>Source code/repository (untuk proyek pengembangan)</li>
            <li>Paper/artikel ilmiah (untuk proyek penelitian)</li>
            <li>Prototype/demo aplikasi yang berfungsi</li>
            <li>Laporan akhir dan presentasi hasil</li>
            <li>Dokumentasi deployment (jika applicable)</li>
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
            <li>Mencari dosen pembimbing dan topik proyek</li>
            <li>Diskusi ruang lingkup, timeline, dan deliverables</li>
            <li>Membuat proposal proyek yang detail</li>
            <li>Mendapat persetujuan dari dosen pembimbing</li>
            <li>Submit pengajuan BKP melalui MyIf Monev</li>
            <li>Upload proposal dan surat persetujuan</li>
            <li>Menunggu approval dari koordinator BKP</li>
            <li>Mulai mengerjakan proyek dengan bimbingan rutin</li>
            <li>Submit laporan progress berkala</li>
            <li>Presentasi dan submit deliverables akhir</li>
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
            <li>Pilih topik yang sesuai dengan minat dan kemampuan Anda</li>
            <li>Komunikasi intensif dengan dosen pembimbing</li>
            <li>Buat timeline yang realistis dengan buffer time</li>
            <li>Dokumentasikan setiap progress dengan baik</li>
            <li>Manfaatkan resources lab dan fasilitas ITS</li>
            <li>Jangan ragu bertanya dan meminta feedback</li>
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
