export function shouldExposeOnlineStatus(preferencesDoc) {
	if (!preferencesDoc) return true;
	return preferencesDoc.showOnlineStatus !== false;
}
