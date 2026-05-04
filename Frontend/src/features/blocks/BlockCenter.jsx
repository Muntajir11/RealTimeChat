import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
	deleteBlockUser,
	fetchBlockedList,
	fetchBlockTotals,
	postBlockUser,
	postBulkBlockPreview,
} from "../../api/blocksApi.js";

const emptyList = { items: [], total: 0, page: 1, pageSize: 25 };

function BlockListRow({ entry, onRemoved }) {
	const blocked = entry.blocked;
	const name = blocked?.fullName || blocked?.username || String(blocked?._id || "");
	const handleRemove = async () => {
		const id = blocked?._id;
		if (!id) return;
		const { ok, data } = await deleteBlockUser(id);
		if (!ok || data.error) {
			toast.error(data.error || "Unblock failed");
			return;
		}
		toast.success("Unblocked");
		onRemoved();
	};
	return (
		<li className='flex items-center justify-between gap-2 py-2 border-b border-slate-600'>
			<div>
				<div className='font-medium text-white'>{name}</div>
				<div className='text-xs text-slate-400'>@{blocked?.username}</div>
			</div>
			<button type='button' className='btn btn-xs btn-outline btn-error' onClick={handleRemove}>
				Unblock
			</button>
		</li>
	);
}

const BlockCenter = () => {
	const [totals, setTotals] = useState({ incoming: 0, outgoing: 0 });
	const [listState, setListState] = useState(emptyList);
	const [page, setPage] = useState(1);
	const [busy, setBusy] = useState(false);
	const [targetId, setTargetId] = useState("");
	const [bulkInput, setBulkInput] = useState("");

	const loadTotals = useCallback(async () => {
		const { ok, data } = await fetchBlockTotals();
		if (ok && data) setTotals(data);
	}, []);

	const loadList = useCallback(async () => {
		setBusy(true);
		try {
			const { ok, data } = await fetchBlockedList(page, 25);
			if (!ok || data.error) throw new Error(data.error || "Failed to load list");
			setListState({
				items: data.items || [],
				total: data.total ?? 0,
				page: data.page ?? page,
				pageSize: data.pageSize ?? 25,
			});
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}, [page]);

	useEffect(() => {
		loadTotals();
	}, [loadTotals]);

	useEffect(() => {
		loadList();
	}, [loadList]);

	const totalPages = useMemo(() => {
		const ps = listState.pageSize || 25;
		return Math.max(1, Math.ceil((listState.total || 0) / ps));
	}, [listState.total, listState.pageSize]);

	const handleBlock = async (e) => {
		e.preventDefault();
		if (!targetId.trim()) return;
		const { ok, data } = await postBlockUser(targetId.trim(), "");
		if (!ok || data.error) {
			toast.error(data.error || "Block failed");
			return;
		}
		toast.success("User blocked");
		setTargetId("");
		await loadTotals();
		await loadList();
	};

	const handleBulkPreview = async (e) => {
		e.preventDefault();
		const parts = bulkInput
			.split(/[\n,]+/)
			.map((s) => s.trim())
			.filter(Boolean);
		if (!parts.length) return;
		const { ok, data } = await postBulkBlockPreview(parts);
		if (!ok || data.error) {
			toast.error(data.error || "Preview failed");
			return;
		}
		const lines = (data.items || []).map((r) => `${r.username}: ${r.status || (r.alreadyBlocked ? "blocked" : "ok")}`);
		toast.success(`Preview: ${lines.slice(0, 5).join(" | ")}${lines.length > 5 ? "…" : ""}`);
	};

	return (
		<div className='min-h-screen w-full max-w-3xl mx-auto p-6 space-y-6 text-left'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold text-white'>Blocked accounts</h1>
				<Link to='/settings' className='btn btn-ghost btn-sm text-sky-300'>
					← Settings
				</Link>
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<div className='rounded-lg bg-slate-800 p-4'>
					<div className='text-slate-400 text-sm'>You blocked</div>
					<div className='text-3xl font-semibold text-white'>{totals.outgoing}</div>
				</div>
				<div className='rounded-lg bg-slate-800 p-4'>
					<div className='text-slate-400 text-sm'>Blocked you</div>
					<div className='text-3xl font-semibold text-white'>{totals.incoming}</div>
				</div>
			</div>
			<form onSubmit={handleBlock} className='flex flex-wrap gap-2 items-end'>
				<div className='flex-1 min-w-[200px]'>
					<label className='label'>
						<span className='label-text text-slate-300'>Block by user id</span>
					</label>
					<input
						className='input input-bordered w-full bg-slate-900 text-white'
						value={targetId}
						onChange={(e) => setTargetId(e.target.value)}
						placeholder='Mongo ObjectId string'
					/>
				</div>
				<button type='submit' className='btn btn-error'>
					Block
				</button>
			</form>
			<form onSubmit={handleBulkPreview} className='space-y-2'>
				<label className='label'>
					<span className='label-text text-slate-300'>Bulk lookup (usernames)</span>
				</label>
				<textarea
					className='textarea textarea-bordered w-full bg-slate-900 text-white'
					rows={3}
					value={bulkInput}
					onChange={(e) => setBulkInput(e.target.value)}
					placeholder='alice, bob'
				/>
				<button type='submit' className='btn btn-secondary btn-sm'>
					Preview
				</button>
			</form>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg text-white font-semibold'>Your block list</h2>
				<div className='join'>
					<button
						type='button'
						className='btn btn-sm join-item'
						disabled={page <= 1 || busy}
						onClick={() => setPage((p) => Math.max(1, p - 1))}
					>
						Prev
					</button>
					<button type='button' className='btn btn-sm join-item btn-disabled'>
						{page}/{totalPages}
					</button>
					<button
						type='button'
						className='btn btn-sm join-item'
						disabled={page >= totalPages || busy}
						onClick={() => setPage((p) => p + 1)}
					>
						Next
					</button>
				</div>
			</div>
			{busy ? (
				<div className='flex justify-center py-8'>
					<span className='loading loading-spinner loading-lg' />
				</div>
			) : (
				<ul className='rounded-lg bg-slate-800 p-2'>
					{listState.items.length === 0 ? (
						<li className='text-slate-400 p-4'>No blocks on this page.</li>
					) : (
						listState.items.map((entry, idx) => (
							<BlockListRow key={String(entry.blocked?._id || idx)} entry={entry} onRemoved={loadList} />
						))
					)}
				</ul>
			)}
		</div>
	);
};

export default BlockCenter;
