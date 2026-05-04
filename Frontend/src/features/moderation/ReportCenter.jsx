import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
	deleteReport,
	fetchMyReports,
	fetchOpenSummary,
	fetchReportReasons,
	patchReportStatus,
	postCreateReport,
} from "../../api/reportsApi.js";

const STATUS_OPTIONS = ["open", "reviewing", "closed", "dismissed"];

function ReportRow({ row, onChanged }) {
	const [status, setStatus] = useState(row.status || "open");
	const target = row.targetUserId;
	const label = target?.username || target?.fullName || String(target?._id || "");

	const save = async () => {
		const { ok, data } = await patchReportStatus(row._id, status);
		if (!ok || data.error) {
			toast.error(data.error || "Update failed");
			return;
		}
		toast.success("Updated");
		onChanged();
	};

	const remove = async () => {
		const { ok, data } = await deleteReport(row._id);
		if (!ok || data.error) {
			toast.error(data.error || "Delete failed");
			return;
		}
		toast.success("Removed");
		onChanged();
	};

	return (
		<li className='border-b border-slate-600 py-3 space-y-2'>
			<div className='flex justify-between gap-2'>
				<div>
					<div className='text-white font-medium'>Target: {label}</div>
					<div className='text-xs text-slate-400'>
						{row.reasonCode} · {new Date(row.createdAt).toLocaleString()}
					</div>
				</div>
				<div className='text-xs text-slate-300 max-w-xs truncate'>{row.details}</div>
			</div>
			<div className='flex flex-wrap gap-2 items-center'>
				<select
					className='select select-bordered select-sm bg-slate-900 text-white'
					value={status}
					onChange={(e) => setStatus(e.target.value)}
				>
					{STATUS_OPTIONS.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</select>
				<button type='button' className='btn btn-xs btn-primary' onClick={save}>
					Save status
				</button>
				<button type='button' className='btn btn-xs btn-outline btn-error' onClick={remove}>
					Delete (open only)
				</button>
			</div>
		</li>
	);
}

const ReportCenter = () => {
	const [reasons, setReasons] = useState([]);
	const [summary, setSummary] = useState({ openCount: 0, byReason: [] });
	const [reports, setReports] = useState([]);
	const [targetId, setTargetId] = useState("");
	const [reasonCode, setReasonCode] = useState("spam");
	const [details, setDetails] = useState("");
	const [loading, setLoading] = useState(false);

	const loadMeta = useCallback(async () => {
		const [r1, r2, r3] = await Promise.all([fetchReportReasons(), fetchOpenSummary(), fetchMyReports({ limit: 50 })]);
		if (r1.ok && r1.data?.reasons) setReasons(r1.data.reasons);
		if (r2.ok && r2.data) setSummary({ openCount: r2.data.openCount ?? 0, byReason: r2.data.byReason ?? [] });
		if (r3.ok && Array.isArray(r3.data)) setReports(r3.data);
	}, []);

	useEffect(() => {
		loadMeta();
	}, [loadMeta]);

	useEffect(() => {
		if (reasons.length && !reasons.includes(reasonCode)) {
			setReasonCode(reasons[0]);
		}
	}, [reasons, reasonCode]);

	const reasonOptions = useMemo(() => reasons.map((r) => ({ value: r, label: r })), [reasons]);

	const submit = async (e) => {
		e.preventDefault();
		if (!targetId.trim()) {
			toast.error("Target user id required");
			return;
		}
		setLoading(true);
		try {
			const { ok, data } = await postCreateReport({
				targetUserId: targetId.trim(),
				reasonCode,
				details,
			});
			if (!ok || data.error) throw new Error(data.error || "Submit failed");
			toast.success("Report submitted");
			setDetails("");
			await loadMeta();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen w-full max-w-3xl mx-auto p-6 space-y-6 text-left'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold text-white'>Reports</h1>
				<Link to='/settings' className='btn btn-ghost btn-sm text-sky-300'>
					← Settings
				</Link>
			</div>
			<div className='rounded-lg bg-slate-800 p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<div className='text-slate-400 text-sm'>Open queue (global)</div>
					<div className='text-3xl font-semibold text-white'>{summary.openCount}</div>
				</div>
				<div>
					<div className='text-slate-400 text-sm'>By reason</div>
					<ul className='text-sm text-slate-200 space-y-1'>
						{(summary.byReason || []).map((r) => (
							<li key={r._id}>
								{r._id}: {r.count}
							</li>
						))}
					</ul>
				</div>
			</div>
			<form onSubmit={submit} className='rounded-lg bg-slate-800 p-4 space-y-3'>
				<h2 className='text-lg text-white font-semibold'>New report</h2>
				<input
					className='input input-bordered w-full bg-slate-900 text-white'
					placeholder='Target user id'
					value={targetId}
					onChange={(e) => setTargetId(e.target.value)}
				/>
				<select
					className='select select-bordered w-full bg-slate-900 text-white'
					value={reasonCode}
					onChange={(e) => setReasonCode(e.target.value)}
				>
					{reasonOptions.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
				<textarea
					className='textarea textarea-bordered w-full bg-slate-900 text-white'
					rows={4}
					placeholder='Details'
					value={details}
					onChange={(e) => setDetails(e.target.value)}
				/>
				<button type='submit' className='btn btn-primary' disabled={loading}>
					{loading ? <span className='loading loading-spinner' /> : "Submit"}
				</button>
			</form>
			<div>
				<h2 className='text-lg text-white font-semibold mb-2'>Your reports</h2>
				<ul className='rounded-lg bg-slate-800 p-2'>
					{reports.length === 0 ? (
						<li className='text-slate-400 p-4'>None yet.</li>
					) : (
						reports.map((row) => <ReportRow key={String(row._id)} row={row} onChanged={loadMeta} />)
					)}
				</ul>
			</div>
		</div>
	);
};

export default ReportCenter;
