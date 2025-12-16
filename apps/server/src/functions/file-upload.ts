import { z } from "../lib.ts";
import { tuser } from "../trpc.ts";
import {
  generatePresignedUploadUrl,
  generateFileKey,
  getFileUrl,
} from "../s3.ts";

/**
 * Get a presigned URL for uploading a file to S3
 * Creates a File record with PENDING status first, then returns the presigned URL
 * Requires authentication
 */
export const getUploadUrl = tuser
  .input(
    z.object({
      filename: z.string().min(1).max(255),
      contentType: z.string().min(1).max(255),
      prefix: z.string().optional(),
      expiresIn: z.number().int().positive().max(3600).default(3600),
      metadata: z.record(z.string(), z.string()).optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const {
      filename: originalFilename,
      contentType,
      prefix,
      expiresIn,
      metadata,
    } = input;

    // Generate a unique key for the file
    const { key, filename } = generateFileKey(
      ctx.user.id,
      originalFilename,
      prefix,
    );

    // Generate presigned URL
    const uploadUrl = await generatePresignedUploadUrl({
      key,
      contentType,
      expiresIn,
      metadata,
    });

    // Create File record with PENDING status
    const file = await ctx.userDb.file.create({
      data: {
        userId: ctx.user.id,
        key,
        originalFilename,
        filename,
        contentType,
        status: "PENDING",
      },
    });

    // Log the upload request
    ctx.auditLog("file-upload:get-presigned-url", {
      key,
      filename,
      contentType,
    });

    return {
      uploadUrl,
      key,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    };
  });

/**
 * Confirm that a file upload was completed successfully
 * Updates the File record status from PENDING to UPLOADED
 */
export const confirmUpload = tuser
  .input(
    z.object({
      key: z.string().min(1),
      size: z.number().int().positive().nullable(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { key, size } = input;

    // Update File record status to UPLOADED
    const file = await ctx.userDb.file.update({
      where: {
        key,
      },
      data: {
        status: "UPLOADED",
        size,
      },
    });

    // Log the successful upload
    ctx.auditLog("file-upload:confirmed", {
      key: file.key,
      filename: file.filename,
      size,
    });

    return {
      success: true,
      file: {
        key: file.key,
        filename: file.filename,
        originalFilename: file.originalFilename,
        contentType: file.contentType,
        size: file.size,
        url: getFileUrl(file.key),
        status: file.status,
      },
    };
  });
