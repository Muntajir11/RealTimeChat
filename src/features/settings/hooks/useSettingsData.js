import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchPreferences } from "../../../api/preferencesApi.js";
import { fetchProfile } from "../../../api/profileApi.js";

export function useSettingsData() {
	const [profile, setProfile] = useState(null);
	const [preferences, setPreferences] = useState(null);
	const [loading, setLoading] = useState(true);

	const reload = useCallback(async () => {
		setLoading(true);
		try {
			const [pRes, prefRes] = await Promise.all([fetchProfile(), fetchPreferences()]);
			if (!pRes.ok || pRes.data.error) throw new Error(pRes.data.error || "Failed to load profile");
			if (!prefRes.ok || prefRes.data.error) throw new Error(prefRes.data.error || "Failed to load preferences");
			setProfile(pRes.data);
			setPreferences(prefRes.data);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		reload();
	}, [reload]);

	return { profile, preferences, setProfile, setPreferences, loading, reload };
}
