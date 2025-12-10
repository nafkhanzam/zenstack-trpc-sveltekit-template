import { useClientQueries } from "@zenstackhq/tanstack-query/svelte";
import { schema } from "./zenstack/schema-lite";

export const client = useClientQueries(schema);
