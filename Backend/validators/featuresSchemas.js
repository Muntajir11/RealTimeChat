import { z } from "zod";
import { REPORT_REASON_CODES } from "../models/report.model.js";

const reportReasonEnum = z.enum([REPORT_REASON_CODES[0], ...REPORT_REASON_CODES.slice(1)]);

export const blockCreateBodySchema = z.object({
	blockedId: z.string().min(1),
	reason: z.string().max(500).optional(),
});

export const reportCreateBodySchema = z.object({
	targetUserId: z.string().min(1),
	reasonCode: reportReasonEnum,
	details: z.string().max(4000).optional(),
	relatedMessageId: z.string().optional(),
});

export const reportStatusBodySchema = z.object({
	status: z.enum(["open", "reviewing", "closed", "dismissed"]),
});

export const reactionBodySchema = z.object({
	symbol: z.string().min(1).max(32),
});

export const pinCreateBodySchema = z.object({
	messageId: z.string().min(1),
	note: z.string().max(500).optional(),
});

export const draftUpsertBodySchema = z.object({
	body: z.string().min(1).max(8000),
	clientNonce: z.string().max(128).optional(),
});

export const attachmentRegisterBodySchema = z.object({
	url: z.string().url().max(2048),
	mimeType: z.string().min(3).max(128),
	sizeBytes: z.number().int().min(0).max(200 * 1024 * 1024).optional(),
	width: z.number().int().min(0).optional().nullable(),
	height: z.number().int().min(0).optional().nullable(),
	durationMs: z.number().int().min(0).optional().nullable(),
	thumbnailUrl: z.string().max(2048).optional(),
	checksumSha256: z.string().max(64).optional(),
});

export const searchQuerySchema = z.object({
	q: z.string().min(2).max(200),
	limit: z.coerce.number().int().min(1).max(200).optional(),
	before: z.string().optional(),
});

export const globalSearchQuerySchema = z.object({
	q: z.string().min(3).max(200),
	limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const exportQuerySchema = z.object({
	maxMessages: z.coerce.number().int().min(10).max(20000).optional(),
});

export const peerParamSchema = z.object({
	peerId: z.string().min(1),
});

export const messageIdParamSchema = z.object({
	messageId: z.string().min(1),
});

export const attachmentIdParamSchema = z.object({
	attachmentId: z.string().min(1),
});

export const reportIdParamSchema = z.object({
	reportId: z.string().min(1),
});

export const blockedIdParamSchema = z.object({
	blockedId: z.string().min(1),
});

export const preferencesPatchSchema = z
	.object({
		desktopNotifications: z.boolean().optional(),
		messageSound: z.boolean().optional(),
		showOnlineStatus: z.boolean().optional(),
		enterToSend: z.boolean().optional(),
	})
	.refine((o) => Object.keys(o).length > 0, { message: "empty" });

export const bulkBlockPreviewSchema = z.object({
	usernames: z.array(z.string().min(1)).min(1).max(50),
});

export const pinNotePatchSchema = z.object({
	note: z.string().max(500),
});

export const reactionBulkBodySchema = z.object({
	messageIds: z.array(z.string().min(1)).min(1).max(100),
});

export const draftAppendBodySchema = z.object({
	append: z.string().min(1).max(4000),
});

export const searchPhraseBodySchema = z.object({
	phrase: z.string().min(2).max(200),
});

export const attachmentReplaceBodySchema = z.object({
	items: z
		.array(
			z.object({
				url: z.string().url().max(2048),
				mimeType: z.string().min(3).max(128),
				sizeBytes: z.number().int().min(0).optional(),
				width: z.number().int().optional().nullable(),
				height: z.number().int().optional().nullable(),
				durationMs: z.number().int().optional().nullable(),
				thumbnailUrl: z.string().max(2048).optional(),
				checksumSha256: z.string().max(64).optional(),
			}),
		)
		.min(1)
		.max(20),
});
