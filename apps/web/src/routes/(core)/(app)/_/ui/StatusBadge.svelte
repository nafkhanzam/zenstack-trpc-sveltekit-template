<script lang="ts">
  interface Props {
    status: "draft" | "submitted" | "approved" | "rejected" | "pending" | "completed" | "in_progress";
    size?: "sm" | "md" | "lg";
  }

  let { status, size = "md" }: Props = $props();

  function getBadgeClass(status: Props["status"]): string {
    const badges = {
      draft: "badge-neutral",
      submitted: "badge-info",
      approved: "badge-success",
      rejected: "badge-error",
      pending: "badge-warning",
      completed: "badge-success",
      in_progress: "badge-info",
    };
    return badges[status];
  }

  function getStatusText(status: Props["status"]): string {
    const texts = {
      draft: "Draft",
      submitted: "Submitted",
      approved: "Approved",
      rejected: "Rejected",
      pending: "Pending",
      completed: "Completed",
      in_progress: "In Progress",
    };
    return texts[status];
  }

  const sizeClass = size === "sm" ? "badge-sm" : size === "lg" ? "badge-lg" : "";
</script>

<span class="badge {getBadgeClass(status)} {sizeClass}">
  {getStatusText(status)}
</span>
