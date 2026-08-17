import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
	fetchPopularTerms,
	fetchThreadSearch,
	fetchThreadSearchCount,
	postExactPhraseSearch,
} from "../../api/searchMessagesApi.js";
import { extractTime } from "../../utils/extractTime.js";

function HitRow({ row }) {
	const preview = (row.message || "").slice(0, 160);
	return (
		<li className='border-b border-slate-700 py-2'>
			<div className='text-xs text-slate-400'>{extractTime(row.createdAt)}</div>
			<div className='text-sm text-white whitespace-pre-wrap'>{preview}</div>
		</li>
	);
}

const ConversationSearch = () => {
	const [peerId, setPeerId] = useState("");
	const [query, setQuery] = useState("");
	const [hits, setHits] = useState([]);
	const [count, setCount] = useState(null);
	const [terms, setTerms] = useState([]);
	const [phrase, setPhrase] = useState("");
	const [busy, setBusy] = useState(false);

	const canRun = useMemo(() => peerId.trim().length > 5 && query.trim().length >= 2, [peerId, query]);

	const runSearch = useCallback(async () => {
		if (!canRun) return;
		setBusy(true);
		try {
			const [r1, r2, r3] = await Promise.all([
				fetchThreadSearch(peerId.trim(), query.trim(), 60),
				fetchThreadSearchCount(peerId.trim(), query.trim()),
				fetchPopularTerms(peerId.trim(), 400),
			]);
			if (!r1.ok || r1.data.error) throw new Error(r1.data.error || "Search failed");
			setHits(Array.isArray(r1.data) ? r1.data : []);
			if (r2.ok && r2.data && typeof r2.data.count === "number") setCount(r2.data.count);
			if (r3.ok && Array.isArray(r3.data)) setTerms(r3.data);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}, [canRun, peerId, query]);

	const runPhrase = async (e) => {
		e.preventDefault();
		if (!peerId.trim() || phrase.trim().length < 2) return;
		setBusy(true);
		try {
			const { ok, data } = await postExactPhraseSearch(peerId.trim(), phrase.trim());
			if (!ok || data.error) throw new Error(data.error || "Lookup failed");
			setHits(Array.isArray(data) ? data : []);
			setCount(Array.isArray(data) ? data.length : 0);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className='min-h-screen w-full max-w-3xl mx-auto p-6 space-y-6 text-left'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold text-white'>Conversation search</h1>
				<Link to='/settings' className='btn btn-ghost btn-sm text-sky-300'>
					← Settings
				</Link>
			</div>
			<div className='rounded-lg bg-slate-800 p-4 space-y-3'>
				<input
					className='input input-bordered w-full bg-slate-900 text-white'
					placeholder='Peer user id'
					value={peerId}
					onChange={(e) => setPeerId(e.target.value)}
				/>
				<div className='flex gap-2'>
					<input
						className='input input-bordered flex-1 bg-slate-900 text-white'
						placeholder='Search text (min 2 chars)'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<button type='button' className='btn btn-primary' disabled={!canRun || busy} onClick={runSearch}>
						Search
					</button>
				</div>
				{count != null ? <div className='text-sm text-slate-300'>Matches: {count}</div> : null}
			</div>
			<form onSubmit={runPhrase} className='rounded-lg bg-slate-800 p-4 flex gap-2 items-end'>
				<div className='flex-1'>
					<label className='label'>
						<span className='label-text text-slate-300'>Exact phrase</span>
					</label>
					<input
						className='input input-bordered w-full bg-slate-900 text-white'
						value={phrase}
						onChange={(e) => setPhrase(e.target.value)}
					/>
				</div>
				<button type='submit' className='btn btn-secondary' disabled={busy}>
					Find exact
				</button>
			</form>
			<div className='rounded-lg bg-slate-800 p-4'>
				<h2 className='text-white font-semibold mb-2'>Popular tokens</h2>
				<div className='flex flex-wrap gap-2'>
					{terms.map((t) => (
						<button
							type='button'
							key={t.word}
							className='badge badge-lg cursor-pointer'
							onClick={() => setQuery(t.word)}
						>
							{t.word} ({t.count})
						</button>
					))}
				</div>
			</div>
			<div>
				<h2 className='text-lg text-white font-semibold mb-2'>Results</h2>
				{busy ? (
					<div className='flex justify-center py-10'>
						<span className='loading loading-spinner loading-lg' />
					</div>
				) : (
					<ul className='rounded-lg bg-slate-900 p-2 max-h-[480px] overflow-y-auto'>
						{hits.length === 0 ? (
							<li className='text-slate-500 p-4'>No results.</li>
						) : (
							hits.map((row) => <HitRow key={String(row._id)} row={row} />)
						)}
					</ul>
				)}
			</div>
		</div>
	);
};

export default ConversationSearch;
