<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import { Alert } from "../_/ui";
  import { BKPTypeSelectionCard } from "../_/bkp";

  interface BKPType {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    detailsHref?: string;
  }

  async function handleBKPTypeSelect(typeId: string) {
    // TODO: Replace with actual API call to create BKP
    // For now, generate a temporary ID
    const newBKPId = crypto.randomUUID();

    // In a real implementation, you would:
    // 1. Call API to create a new BKP with the selected type
    // 2. Get the created BKP ID from the response
    // 3. Redirect to the BKP detail page

    // Example:
    // const response = await fetch('/api/bkp', {
    //   method: 'POST',
    //   body: JSON.stringify({ type: typeId }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // const { id } = await response.json();
    // goto(`/bkp/${id}`);

    goto(`/bkp/${newBKPId}`);
  }

  // Page content
  const pageTitle = "Choose BKP Type";
  const pageDescription = "Select the type of BKP you want to submit";
  const infoMessage = "Choose the appropriate BKP type for your activity. Each type has specific requirements and documentation.";

  // Breadcrumb configuration
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: "My BKP",
      href: "/bkp",
      icon: "heroicons:clipboard-document-list",
    },
    {
      label: pageTitle,
      icon: "heroicons:plus",
    },
  ];

  const bkpTypes: Record<string, BKPType[]> = {
    "BKP Flagship": [
      {
        id: "magang-berdampak",
        name: "Magang Berdampak",
        description:
          "Program magang yang berdampak langsung pada masyarakat dan industri melalui platform Kemendikbud",
        icon: "heroicons:briefcase",
        color: "from-blue-500 to-blue-700",
        detailsHref: "/bkp-info/magang-berdampak",
      },
      {
        id: "magang-magenta",
        name: "Magang Magenta",
        description: "Program magang melalui kerjasama Magenta dengan berbagai perusahaan teknologi",
        icon: "heroicons:shield-check",
        color: "from-purple-500 to-purple-700",
        detailsHref: "/bkp-info/magang-magenta",
      },
      {
        id: "magang-kerjasama",
        name: "Magang Kerjasama",
        description: "Magang melalui kerjasama resmi antara ITS dengan perusahaan partner",
        icon: "heroicons:user-group",
        color: "from-indigo-500 to-indigo-700",
        detailsHref: "/bkp-info/magang-kerjasama",
      },
      {
        id: "magang-mandiri",
        name: "Magang Mandiri",
        description:
          "Magang yang diselenggarakan secara mandiri oleh mahasiswa dengan perusahaan pilihan",
        icon: "heroicons:user-circle",
        color: "from-cyan-500 to-cyan-700",
        detailsHref: "/bkp-info/magang-mandiri",
      },
      {
        id: "independent-study",
        name: "Studi Independen",
        description: "Program studi independen dengan fokus pada pembelajaran berbasis proyek",
        icon: "heroicons:book-open",
        color: "from-teal-500 to-teal-700",
        detailsHref: "/bkp-info/independent-study",
      },
    ],
    "BKP Internal ITS": [
      {
        id: "lomba",
        name: "Lomba",
        description: "Partisipasi dalam kompetisi baik tingkat nasional maupun internasional",
        icon: "heroicons:trophy",
        color: "from-yellow-500 to-yellow-700",
        detailsHref: "/bkp-info/lomba",
      },
      {
        id: "proyek",
        name: "Proyek",
        description: "Pengerjaan proyek penelitian atau pengembangan dengan dosen atau unit di ITS",
        icon: "heroicons:briefcase",
        color: "from-orange-500 to-orange-700",
        detailsHref: "/bkp-info/proyek",
      },
      {
        id: "wirausaha",
        name: "Wirausaha",
        description: "Kegiatan kewirausahaan atau startup yang dikembangkan mahasiswa",
        icon: "heroicons:banknotes",
        color: "from-green-500 to-green-700",
        detailsHref: "/bkp-info/wirausaha",
      },
      {
        id: "magang-internal",
        name: "Magang Internal",
        description: "Magang di unit kerja atau laboratorium internal ITS",
        icon: "heroicons:building-office",
        color: "from-pink-500 to-pink-700",
        detailsHref: "/bkp-info/magang-internal",
      },
    ],
    "Kerja Praktik": [
      {
        id: "kerja-praktik",
        name: "Kerja Praktik",
        description: "Program kerja praktik sebagai bagian dari kurikulum wajib",
        icon: "heroicons:check-badge",
        color: "from-red-500 to-red-700",
        detailsHref: "/bkp-info/kerja-praktik",
      },
    ],
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
    {#each Object.entries(bkpTypes) as [category, types] (category)}
      <div class="mb-12">
        <h2 class="mb-6 text-lg font-semibold">{category}</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each types as type (type.id)}
            <BKPTypeSelectionCard {...type} onSelect={handleBKPTypeSelect} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
