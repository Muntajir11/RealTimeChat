import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import TextField from "../../components/ui/TextField.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Lσɠιɳ Tσ
					<span className='text-blue-500'> ᑕOᑎᑎEᑕT🪢</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<TextField
						label='Username'
						id='login-username'
						placeholder='Enter username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>

					<TextField
						label='Password'
						id='login-password'
						type='password'
						placeholder='Enter Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Link
						to='/signup'
						className='text-sm  hover:underline text-emerald-950 hover:text-blue-600 mt-2 inline-block'
					>
						{"Don't"} have an account?
					</Link>

					<div>
						<SubmitButton className='btn btn-block btn-sm mt-2' loading={loading}>
							Login
						</SubmitButton>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;
