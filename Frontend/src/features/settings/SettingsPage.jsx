import BackToChatLink from "./components/BackToChatLink.jsx";
import { useSettingsData } from "./hooks/useSettingsData.js";
import AccountSection from "./sections/AccountSection.jsx";
import ChatBehaviorSection from "./sections/ChatBehaviorSection.jsx";
import NotificationsSection from "./sections/NotificationsSection.jsx";

const SettingsPage = () => {
	const { profile, preferences, setProfile, setPreferences, loading } = useSettingsData();

	if (loading && !profile) {
		return (
			<div className='min-h-screen flex items-center justify-center text-slate-200'>
				<span className='loading loading-spinner loading-lg' />
			</div>
		);
	}

	return (
		<div className='min-h-screen w-full max-w-2xl mx-auto p-6 text-left space-y-6'>
			<div className='flex items-center justify-between gap-4'>
				<h1 className='text-2xl font-bold text-white'>Settings</h1>
				<BackToChatLink />
			</div>

			{profile ? (
				<AccountSection
					profile={profile}
					onUpdated={(next) => setProfile((prev) => ({ ...prev, ...next }))}
				/>
			) : null}

			{preferences ? (
				<>
					<NotificationsSection
						preferences={preferences}
						onUpdated={(next) => setPreferences((prev) => ({ ...prev, ...next }))}
					/>
					<ChatBehaviorSection
						preferences={preferences}
						onUpdated={(next) => setPreferences((prev) => ({ ...prev, ...next }))}
					/>
				</>
			) : null}
		</div>
	);
};

export default SettingsPage;
