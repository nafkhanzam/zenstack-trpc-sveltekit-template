<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import { Alert } from "../_/ui";
  import { BKPType } from "$lib/zenstack/models";
    import Icon from "@iconify/svelte";

  interface BKPTypeInfo {
    type: BKPType;
    name: string;
    description: string;
    icon: string;
    color: string;
    slug: string;
  }

  // Page content
  const pageTitle = "BKP Information";
  const pageDescription = "Learn about different types of BKP (Bentuk Kegiatan Pembelajaran) available for students";
  const infoMessage = "Below is a comprehensive list of all BKP types available. Each type has specific requirements and documentation.";

  // Breadcrumb configuration
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: "BKP",
      icon: "heroicons:information-circle",
    },
  ];

  // BKP Type metadata - maps enum values to display information
  const bkpTypeInfo: Record<BKPType, Omit<BKPTypeInfo, "type">> = {
    [BKPType.MAGANG_BERDAMPAK]: {
      name: "Magang Berdampak",
      description:
        "Program magang yang berdampak langsung pada masyarakat dan industri melalui platform Kemendikbud",
      icon: "heroicons:briefcase",
      color: "from-blue-500 to-blue-700",
      slug: "magang-berdampak",
    },
    [BKPType.MAGANG_MAGENTA]: {
      name: "Magang Magenta",
      description: "Program magang melalui kerjasama Magenta dengan berbagai perusahaan teknologi",
      icon: "heroicons:shield-check",
      color: "from-purple-500 to-purple-700",
      slug: "magang-magenta",
    },
    [BKPType.MAGANG_KERJASAMA]: {
      name: "Magang Kerjasama",
      description: "Magang melalui kerjasama resmi antara ITS dengan perusahaan partner",
      icon: "heroicons:user-group",
      color: "from-indigo-500 to-indigo-700",
      slug: "magang-kerjasama",
    },
    [BKPType.MAGANG_MANDIRI]: {
      name: "Magang Mandiri",
      description:
        "Magang yang diselenggarakan secara mandiri oleh mahasiswa dengan perusahaan pilihan",
      icon: "heroicons:user-circle",
      color: "from-cyan-500 to-cyan-700",
      slug: "magang-mandiri",
    },
    [BKPType.INDEPENDENT_STUDY]: {
      name: "Studi Independen",
      description: "Program studi independen dengan fokus pada pembelajaran berbasis proyek",
      icon: "heroicons:book-open",
      color: "from-teal-500 to-teal-700",
      slug: "independent-study",
    },
    [BKPType.LOMBA]: {
      name: "Lomba",
      description: "Partisipasi dalam kompetisi baik tingkat nasional maupun internasional",
      icon: "heroicons:trophy",
      color: "from-yellow-500 to-yellow-700",
      slug: "lomba",
    },
    [BKPType.PROYEK]: {
      name: "Proyek",
      description: "Pengerjaan proyek penelitian atau pengembangan dengan dosen atau unit di ITS",
      icon: "heroicons:briefcase",
      color: "from-orange-500 to-orange-700",
      slug: "proyek",
    },
    [BKPType.WIRAUSAHA]: {
      name: "Wirausaha",
      description: "Kegiatan kewirausahaan atau startup yang dikembangkan mahasiswa",
      icon: "heroicons:banknotes",
      color: "from-green-500 to-green-700",
      slug: "wirausaha",
    },
    [BKPType.MAGANG_INTERNAL]: {
      name: "Magang Internal",
      description: "Magang di unit kerja atau laboratorium internal ITS",
      icon: "heroicons:building-office",
      color: "from-pink-500 to-pink-700",
      slug: "magang-internal",
    },
    [BKPType.KERJA_PRAKTIK]: {
      name: "Kerja Praktik",
      description: "Program kerja praktik sebagai bagian dari kurikulum wajib",
      icon: "heroicons:check-badge",
      color: "from-red-500 to-red-700",
      slug: "kerja-praktik",
    },
  };

  // Organize types by category
  const bkpTypesByCategory: Record<string, BKPType[]> = {
    "BKP Flagship": [
      BKPType.MAGANG_BERDAMPAK,
      BKPType.MAGANG_MAGENTA,
      BKPType.MAGANG_KERJASAMA,
      BKPType.MAGANG_MANDIRI,
      BKPType.INDEPENDENT_STUDY,
    ],
    "BKP Internal ITS": [
      BKPType.LOMBA,
      BKPType.PROYEK,
      BKPType.WIRAUSAHA,
      BKPType.MAGANG_INTERNAL,
    ],
    "Kerja Praktik": [BKPType.KERJA_PRAKTIK],
  };
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <Breadcrumbs items={breadcrumbItems} />

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-2xl font-bold">{pageTitle}</h1>
      <p class="text-base-content/70">{pageDescription}</p>
    </div>

    <div class="mb-8">
      <Alert type="info" message={infoMessage} />
    </div>

    <!-- BKP Types by Category -->
    {#each Object.entries(bkpTypesByCategory) as [category, types] (category)}
      <div class="mb-12">
        <h2 class="mb-6 text-lg font-semibold">{category}</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each types as type (type)}
            {@const info = bkpTypeInfo[type]}
            <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
              <div class="card-body">
                <div class="flex items-start gap-3">
                  <div class="shrink-0">
                    <div
                      class="w-12 h-12 rounded-lg bg-linear-to-br {info.color} flex items-center justify-center text-white"
                    >
                      <Icon icon={info.icon} class="text-2xl" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="card-title text-base mb-2">{info.name}</h3>
                    <p class="text-sm text-base-content/70">{info.description}</p>
                    <div class="card-actions justify-end mt-4">
                      <a href="/bkp-info/{info.slug}" class="btn btn-sm btn-primary">
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
