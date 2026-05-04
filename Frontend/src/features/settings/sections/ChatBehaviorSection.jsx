import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SubmitButton from "../../../components/ui/SubmitButton.jsx";
import { putPreferences } from "../../../api/preferencesApi.js";

const ChatBehaviorSection = ({ preferences, onUpdated }) => {
	const [showOnlineStatus, setShowOnlineStatus] = useState(preferences?.showOnlineStatus ?? true);
	const [enterToSend, setEnterToSend] = useState(preferences?.enterToSend ?? true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!preferences) return;
		setShowOnlineStatus(preferences.showOnlineStatus ?? true);
		setEnterToSend(preferences.enterToSend ?? true);
	}, [preferences]);

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const { ok, data } = await putPreferences({ showOnlineStatus, enterToSend });
			if (!ok || data.error) throw new Error(data.error || "Save failed");
			toast.success("Chat preferences saved");
			onUpdated(data);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className='rounded-lg bg-slate-700/60 p-4 space-y-3'>
			<h2 className='text-lg font-semibold text-white'>Chat behavior</h2>
			<label className='flex items-center gap-2 cursor-pointer text-slate-200'>
				<input
					type='checkbox'
					className='checkbox checkbox-sm'
					checked={showOnlineStatus}
					onChange={(e) => setShowOnlineStatus(e.target.checked)}
				/>
				Show online status to others
			</label>
			<label className='flex items-center gap-2 cursor-pointer text-slate-200'>
				<input
					type='checkbox'
					className='checkbox checkbox-sm'
					checked={enterToSend}
					onChange={(e) => setEnterToSend(e.target.checked)}
				/>
				Enter key sends message (when supported)
			</label>
			<SubmitButton className='btn btn-secondary btn-sm' loading={saving}>
				Save chat behavior
			</SubmitButton>
		</section>
	);
};

export default ChatBehaviorSection;
