const TextField = ({ label, id, type = "text", inputClassName = "", ...props }) => {
	return (
		<div>
			{label ? (
				<label className='label p-2' htmlFor={id}>
					<span className='text-base text-emerald-950 label-text'>{label}</span>
				</label>
			) : null}
			<input
				id={id}
				type={type}
				className={`w-full input input-bordered h-10 ${inputClassName}`}
				{...props}
			/>
		</div>
	);
};

export default TextField;
