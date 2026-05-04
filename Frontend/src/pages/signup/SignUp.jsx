import { useState } from "react";
import GenderCheckbox from "./genderCheckBox";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";
import TextField from "../../components/ui/TextField.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};
	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Sιɠɳ Uρ ƚσ <span className='text-blue-500'> ᑕOᑎᑎEᑕT🪢</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<TextField
						label='Full Name'
						id='signup-fullname'
						placeholder='Full Name'
						value={inputs.fullName}
						onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
					/>

					<TextField
						label='Username'
						id='signup-username'
						placeholder='Username'
						value={inputs.username}
						onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
					/>

					<TextField
						label='Email'
						id='signup-email'
						type='email'
						placeholder='Email'
						value={inputs.email}
						onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
					/>

					<TextField
						label='Password'
						id='signup-password'
						type='password'
						placeholder='Enter Password'
						value={inputs.password}
						onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
					/>

					<TextField
						label='Confirm Password'
						id='signup-confirm'
						type='password'
						placeholder='Confirm Password'
						value={inputs.confirmPassword}
						onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
					/>

					<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

					<Link
						to={"/login"}
						className='text-sm hover:underline text-emerald-950 hover:text-blue-600 mt-2 inline-block'
					>
						Already have an account?
					</Link>

					<div>
						<SubmitButton
							className='btn btn-block btn-sm mt-2 border border-slate-700'
							loading={loading}
						>
							Sign Up
						</SubmitButton>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;
