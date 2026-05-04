import asyncHandler from "../middleware/asyncHandler.js";
import * as reportService from "../domain/moderation/reportService.js";

export const postReport = asyncHandler(async (req, res) => {
	const doc = await reportService.createReport(req.user._id, req.validatedBody);
	res.status(201).json(doc);
});

export const getMyReports = asyncHandler(async (req, res) => {
	const rows = await reportService.listMyReports(req.user._id, req.query);
	res.status(200).json(rows);
});

export const getReport = asyncHandler(async (req, res) => {
	const row = await reportService.getReportByIdForReporter(req.params.reportId, req.user._id);
	res.status(200).json(row);
});

export const patchReportStatus = asyncHandler(async (req, res) => {
	const { status } = req.validatedBody;
	const doc = await reportService.transitionReportStatus(req.params.reportId, status, req.user._id);
	res.status(200).json(doc);
});

export const postReopen = asyncHandler(async (req, res) => {
	const doc = await reportService.reopenReportIfOwned(req.params.reportId, req.user._id);
	res.status(200).json(doc);
});

export const getReasonCodes = asyncHandler(async (req, res) => {
	res.status(200).json({ reasons: reportService.listReportReasonCodes() });
});

export const getOpenSummary = asyncHandler(async (req, res) => {
	const payload = await reportService.summarizeOpenReports();
	res.status(200).json(payload);
});

export const getOpenAgainstUser = asyncHandler(async (req, res) => {
	const limit = Number(req.query.limit) || 100;
	const rows = await reportService.listOpenReportsAgainstUser(req.params.userId, limit);
	res.status(200).json(rows);
});

export const getPeerHistory = asyncHandler(async (req, res) => {
	const limit = Number(req.query.limit) || 20;
	const rows = await reportService.listPeerReportHistory(req.user._id, req.params.userId, limit);
	res.status(200).json(rows);
});

export const postAttachEvidence = asyncHandler(async (req, res) => {
	const { messageId } = req.validatedBody;
	const doc = await reportService.attachMessageEvidence(req.params.reportId, req.user._id, messageId);
	res.status(200).json(doc);
});

export const deleteReport = asyncHandler(async (req, res) => {
	await reportService.deleteDraftReport(req.params.reportId, req.user._id);
	res.status(200).json({ ok: true });
});

export const getExportNdjson = asyncHandler(async (req, res) => {
	const limit = Number(req.query.limit) || 500;
	const lines = await reportService.bulkExportReportsJsonLines(req.user._id, limit);
	res.setHeader("Content-Type", "application/x-ndjson");
	res.status(200).send(lines.join("\n"));
});

export const getCountSince = asyncHandler(async (req, res) => {
	const since = new Date(req.query.since || Date.now() - 86400000 * 30);
	const n = await reportService.countReportsForTarget(req.params.userId, since);
	res.status(200).json({ count: n });
});
