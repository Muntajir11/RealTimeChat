import asyncHandler from "../middleware/asyncHandler.js";
import * as attachmentService from "../domain/attachments/attachmentService.js";

export const postRegister = asyncHandler(async (req, res) => {
	const doc = await attachmentService.registerAttachment(req.user._id, req.params.messageId, req.validatedBody);
	res.status(201).json(doc);
});

export const getList = asyncHandler(async (req, res) => {
	const rows = await attachmentService.listAttachments(req.user._id, req.params.messageId);
	res.status(200).json(rows);
});

export const deleteOne = asyncHandler(async (req, res) => {
	await attachmentService.removeAttachment(req.user._id, req.params.attachmentId);
	res.status(200).json({ ok: true });
});

export const putReplace = asyncHandler(async (req, res) => {
	const doc = await attachmentService.replaceAttachmentsForMessage(
		req.user._id,
		req.params.messageId,
		req.validatedBody.items,
	);
	res.status(200).json(doc);
});

export const getSum = asyncHandler(async (req, res) => {
	const n = await attachmentService.sumAttachmentBytes(req.user._id, req.params.messageId);
	res.status(200).json({ bytes: n });
});

export const getImages = asyncHandler(async (req, res) => {
	const rows = await attachmentService.listImagesForMessage(req.user._id, req.params.messageId);
	res.status(200).json(rows);
});

export const getStorage = asyncHandler(async (req, res) => {
	const n = await attachmentService.totalUserAttachmentStorage(req.user._id);
	res.status(200).json({ bytes: n });
});

export const getRecent = asyncHandler(async (req, res) => {
	const limit = Number(req.query.limit) || 40;
	const rows = await attachmentService.listRecentUploads(req.user._id, limit);
	res.status(200).json(rows);
});

export const patchMeta = asyncHandler(async (req, res) => {
	const doc = await attachmentService.patchAttachmentMeta(req.user._id, req.params.attachmentId, req.body);
	res.status(200).json(doc);
});

export const deleteAll = asyncHandler(async (req, res) => {
	const payload = await attachmentService.deleteAllAttachmentsOnMessage(req.user._id, req.params.messageId);
	res.status(200).json(payload);
});

export const getOversized = asyncHandler(async (req, res) => {
	const maxBytes = Number(req.query.maxBytes) || 5 * 1024 * 1024;
	const rows = await attachmentService.findOversizedAttachments(req.user._id, req.params.messageId, maxBytes);
	res.status(200).json(rows);
});
