export const ChannelType = Object.freeze({
	DIRECT: "direct",
	GROUP: "group",
});

export function isDirectChannel(type) {
	return type === ChannelType.DIRECT;
}
