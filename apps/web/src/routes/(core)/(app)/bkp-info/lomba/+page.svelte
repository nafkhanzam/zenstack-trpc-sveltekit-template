<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Lomba";
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
      icon: "heroicons:trophy",
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
        <div class="rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 p-3">
          <Icon icon="heroicons:trophy" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Partisipasi dalam kompetisi baik tingkat nasional maupun internasional
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
            BKP Lomba mengakui partisipasi mahasiswa dalam berbagai kompetisi ilmiah, teknologi, dan
            inovasi baik tingkat lokal, nasional, maupun internasional. Program ini mendorong
            mahasiswa untuk mengasah kemampuan problem-solving, teamwork, dan presentasi melalui
            kompetisi.
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
            <li>Mahasiswa aktif dengan status akademik baik</li>
            <li>Lomba harus relevan dengan bidang Teknik Informatika</li>
            <li>Lomba diselenggarakan oleh institusi/organisasi resmi dan kredibel</li>
            <li>Memiliki bukti pendaftaran dan partisipasi lomba</li>
            <li>Mendapat persetujuan dari dosen pembimbing (jika ada)</li>
            <li>Untuk lomba tim, semua anggota harus terdaftar</li>
          </ul>
        </div>
      </div>

      <!-- Competition Categories -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:squares-2x2" class="h-6 w-6" />
            Kategori Lomba yang Diakui
          </h2>
          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Programming Contest</p>
              <p class="text-sm text-base-content/70">ACM ICPC, Gemastik, INC, dll</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Hackathon</p>
              <p class="text-sm text-base-content/70">Startup hackathon, corporate challenges</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">CTF/Security</p>
              <p class="text-sm text-base-content/70">Capture The Flag competitions</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Data Science</p>
              <p class="text-sm text-base-content/70">Kaggle, data analytics competitions</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">UI/UX Design</p>
              <p class="text-sm text-base-content/70">Design challenges, UX competitions</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Innovation/Business Plan</p>
              <p class="text-sm text-base-content/70">PKM, business plan competitions</p>
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
            <li>Bukti pendaftaran lomba (email konfirmasi, ID peserta, dll)</li>
            <li>Proposal/submission yang dikirimkan (jika ada)</li>
            <li>Sertifikat partisipasi atau penghargaan</li>
            <li>Dokumentasi kegiatan (foto, video, screenshot)</li>
            <li>Karya/project yang dilombakan (repository, prototype, dll)</li>
            <li>Laporan singkat tentang lomba dan pembelajaran yang didapat</li>
            <li>Surat keterangan dari dosen pembimbing (jika ada)</li>
          </ul>
        </div>
      </div>

      <!-- SKS Conversion -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:calculator" class="h-6 w-6" />
            Konversi SKS
          </h2>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Tingkat Lomba</th>
                  <th>Finalis</th>
                  <th>Juara 3</th>
                  <th>Juara 2</th>
                  <th>Juara 1</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Internasional</td>
                  <td>3 SKS</td>
                  <td>4 SKS</td>
                  <td>5 SKS</td>
                  <td>6 SKS</td>
                </tr>
                <tr>
                  <td>Nasional</td>
                  <td>2 SKS</td>
                  <td>3 SKS</td>
                  <td>4 SKS</td>
                  <td>5 SKS</td>
                </tr>
                <tr>
                  <td>Regional/Lokal</td>
                  <td>1 SKS</td>
                  <td>2 SKS</td>
                  <td>3 SKS</td>
                  <td>4 SKS</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mt-3 text-sm italic text-base-content/60">
            *SKS dapat diakumulasi dari beberapa lomba, maksimal 6 SKS per semester
          </p>
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
            <li>Pengajuan BKP Lomba harus dilakukan maksimal 1 semester setelah lomba selesai</li>
            <li>Untuk lomba tim, SKS dapat dibagi atau dihitung per individu (sesuai kebijakan)</li>
            <li>Sertifikat dan dokumentasi harus asli dan dapat diverifikasi</li>
            <li>Lomba online yang kredibel juga dapat diakui (Kaggle, HackerRank, dll)</li>
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
            <li>Mengikuti dan menyelesaikan lomba</li>
            <li>Mengumpulkan semua bukti partisipasi dan dokumentasi</li>
            <li>Membuat laporan singkat tentang lomba</li>
            <li>Konsultasi dengan koordinator BKP untuk validasi lomba</li>
            <li>Submit pengajuan BKP melalui MyIf Monev</li>
            <li>Upload semua dokumen pendukung</li>
            <li>Menunggu verifikasi dari koordinator</li>
            <li>SKS akan dikonversi sesuai pencapaian</li>
          </ol>
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
