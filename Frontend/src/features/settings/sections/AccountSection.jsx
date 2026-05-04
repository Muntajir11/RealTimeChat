import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TextField from "../../../components/ui/TextField.jsx";
import SubmitButton from "../../../components/ui/SubmitButton.jsx";
import { patchProfileFullName } from "../../../api/profileApi.js";
import { useAuthContext } from "../../../context/AuthContext";

const AccountSection = ({ profile, onUpdated }) => {
	const { authUser, setAuthUser } = useAuthContext();
	const [fullName, setFullName] = useState(profile?.fullName ?? "");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (profile?.fullName != null) setFullName(profile.fullName);
	}, [profile?.fullName]);

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const { ok, data } = await patchProfileFullName(fullName);
			if (!ok || data.error) throw new Error(data.error || "Save failed");
			toast.success("Profile updated");
			onUpdated(data);
			if (authUser && String(authUser._id) === String(data._id)) {
				const next = { ...authUser, ...data };
				localStorage.setItem("chat-user", JSON.stringify(next));
				setAuthUser(next);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className='rounded-lg bg-slate-700/60 p-4 space-y-3'>
			<h2 className='text-lg font-semibold text-white'>Account</h2>
			<p className='text-sm text-slate-300'>Username: {profile?.username}</p>
			<p className='text-sm text-slate-300'>Email: {profile?.email}</p>
			<form onSubmit={handleSave} className='space-y-2 max-w-md'>
				<TextField
					label='Display name'
					id='settings-fullname'
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
				/>
				<SubmitButton className='btn btn-primary btn-sm' loading={saving}>
					Save
				</SubmitButton>
			</form>
		</section>
	);
};

export default AccountSection;
