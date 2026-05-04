import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SubmitButton from "../../../components/ui/SubmitButton.jsx";
import { putPreferences } from "../../../api/preferencesApi.js";

const NotificationsSection = ({ preferences, onUpdated }) => {
	const [desktopNotifications, setDesktopNotifications] = useState(
		preferences?.desktopNotifications ?? true,
	);
	const [messageSound, setMessageSound] = useState(preferences?.messageSound ?? true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!preferences) return;
		setDesktopNotifications(preferences.desktopNotifications ?? true);
		setMessageSound(preferences.messageSound ?? true);
	}, [preferences]);

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const { ok, data } = await putPreferences({ desktopNotifications, messageSound });
			if (!ok || data.error) throw new Error(data.error || "Save failed");
			toast.success("Notification settings saved");
			onUpdated(data);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className='rounded-lg bg-slate-700/60 p-4 space-y-3'>
			<h2 className='text-lg font-semibold text-white'>Notifications</h2>
			<label className='flex items-center gap-2 cursor-pointer text-slate-200'>
				<input
					type='checkbox'
					className='checkbox checkbox-sm'
					checked={desktopNotifications}
					onChange={(e) => setDesktopNotifications(e.target.checked)}
				/>
				Desktop notifications
			</label>
			<label className='flex items-center gap-2 cursor-pointer text-slate-200'>
				<input
					type='checkbox'
					className='checkbox checkbox-sm'
					checked={messageSound}
					onChange={(e) => setMessageSound(e.target.checked)}
				/>
				Message sound
			</label>
			<SubmitButton className='btn btn-secondary btn-sm' loading={saving}>
				Save notifications
			</SubmitButton>
		</section>
	);
};

export default NotificationsSection;
