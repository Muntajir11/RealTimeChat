const Avatar = ({ src, alt = "", sizeClass = "w-10" }) => (
	<div className={`rounded-full ${sizeClass} overflow-hidden shrink-0`}>
		<img alt={alt} src={src} className='w-full h-full object-cover' />
	</div>
);

export default Avatar;
