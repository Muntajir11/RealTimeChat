import mongoose from "mongoose";
import MessageAttachment from "../../models/messageAttachment.model.js";
import Message from "../../models/message.model.js";
import { HttpError } from "../../errors/HttpError.js";
import { assertReactionPeerAllowed } from "../blocking/blockPolicy.js";

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

const MIME_ALLOWLIST = /^image\/(png|jpeg|gif|webp)$|^video\/(mp4|webm)$|^audio\/(mpeg|wav|ogg)$/i;

export async function registerAttachment(userId, messageId, payload) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	const { url, mimeType, sizeBytes, width, height, durationMs, thumbnailUrl, checksumSha256 } = payload;
	if (typeof url !== "string" || url.length > 2048) {
		throw new HttpError(400, "Invalid url");
	}
	if (typeof mimeType !== "string" || !MIME_ALLOWLIST.test(mimeType)) {
		throw new HttpError(400, "Unsupported mime type");
	}
	const size = Number(sizeBytes) || 0;
	if (size < 0 || size > 200 * 1024 * 1024) {
		throw new HttpError(400, "Invalid size");
	}
	if (checksumSha256) {
		const dup = await MessageAttachment.findByChecksumForUser(userId, checksumSha256);
		if (dup && String(dup.messageId) !== String(mid)) {
			throw new HttpError(409, "Duplicate media checksum already linked");
		}
	}
	const doc = await MessageAttachment.create({
		messageId: mid,
		uploadedBy: userId,
		url,
		mimeType,
		sizeBytes: size,
		width: width ?? null,
		height: height ?? null,
		durationMs: durationMs ?? null,
		thumbnailUrl: thumbnailUrl || "",
		checksumSha256: checksumSha256 || "",
	});
	return doc.toObject();
}

export async function listAttachments(userId, messageId) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	return MessageAttachment.listForMessage(mid);
}

export async function removeAttachment(userId, attachmentId) {
	const aid = toOid(attachmentId);
	if (!aid) throw new HttpError(400, "Invalid attachment id");
	const row = await MessageAttachment.findById(aid).lean();
	if (!row) throw new HttpError(404, "Attachment not found");
	if (String(row.uploadedBy) !== String(userId)) {
		throw new HttpError(403, "You cannot delete this attachment");
	}
	const msg = await Message.findById(row.messageId).lean();
	await assertReactionPeerAllowed(userId, msg);
	await MessageAttachment.findByIdAndDelete(aid);
	return { ok: true };
}

export async function replaceAttachmentsForMessage(userId, messageId, payloadList) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	if (!Array.isArray(payloadList) || payloadList.length > 20) {
		throw new HttpError(400, "Invalid attachment list");
	}
	const first = payloadList[0];
	const doc = await MessageAttachment.replaceForMessage(mid, userId, {
		url: first.url,
		mimeType: first.mimeType,
		sizeBytes: Number(first.sizeBytes) || 0,
		width: first.width,
		height: first.height,
		durationMs: first.durationMs,
		thumbnailUrl: first.thumbnailUrl || "",
		checksumSha256: first.checksumSha256 || "",
	});
	return doc.toObject();
}

export async function sumAttachmentBytes(userId, messageId) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	return MessageAttachment.sumSizeForMessage(mid);
}

export async function listImagesForMessage(userId, messageId) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	return MessageAttachment.listImageLikeForMessage(mid);
}

export async function totalUserAttachmentStorage(userId) {
	return MessageAttachment.totalStorageForUser(userId);
}

export async function listRecentUploads(userId, limit) {
	const lim = Math.min(Math.max(Number(limit) || 40, 1), 200);
	return MessageAttachment.listRecentByUser(userId, lim);
}

export async function patchAttachmentMeta(userId, attachmentId, patch) {
	const aid = toOid(attachmentId);
	if (!aid) throw new HttpError(400, "Invalid attachment id");
	const row = await MessageAttachment.findById(aid).lean();
	if (!row) throw new HttpError(404, "Attachment not found");
	if (String(row.uploadedBy) !== String(userId)) {
		throw new HttpError(403, "Forbidden");
	}
	const allowed = {};
	if (patch.thumbnailUrl !== undefined) allowed.thumbnailUrl = String(patch.thumbnailUrl).slice(0, 2048);
	if (patch.width !== undefined) allowed.width = patch.width;
	if (patch.height !== undefined) allowed.height = patch.height;
	if (patch.durationMs !== undefined) allowed.durationMs = patch.durationMs;
	return MessageAttachment.patchMeta(aid, allowed);
}

export async function deleteAllAttachmentsOnMessage(userId, messageId) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	const res = await MessageAttachment.deleteForMessage(mid);
	return { removed: res.deletedCount ?? 0 };
}

export async function findOversizedAttachments(userId, messageId, maxBytes) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	return MessageAttachment.findOversizedForMessage(mid, maxBytes);
}
