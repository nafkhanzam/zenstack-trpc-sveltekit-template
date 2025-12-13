export * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
export { express };
export * as z from "zod";
import cors from "cors";
export { cors };
export { default as bcrypt } from "bcrypt";
export { default as jwt } from "jsonwebtoken";
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((res) => setTimeout(res, ms));
}
export type JsonValue = string | number | boolean | JsonObject | JsonArray;
export type JsonObject = {
  [key: string]: JsonValue | null;
};
export type JsonArray = ReadonlyArray<JsonValue | null>;
