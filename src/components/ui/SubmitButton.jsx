import Spinner from "./Spinner.jsx";

const SubmitButton = ({ children, loading, disabled, className = "", type = "submit" }) => {
	return (
		<button type={type} className={className} disabled={disabled || loading}>
			{loading ? <Spinner /> : children}
		</button>
	);
};

export default SubmitButton;
