import React from "react";

const LoginTable = () => {
	return (
		<div className=''>
			<table className='w-full max-w-full mb-4 bg-transparent table-hover table-sm '>
				<tbody className='border border-slate-500 text-center'>
					<tr className='border border-slate-500'>
						<td className='border border-slate-500 px-9 py-3'>
							{" "}
							<strong>nom d'utilisateur</strong>
						</td>
						<td className='border border-slate-500 px-9 py-3'>
							{" "}
							<strong>mot de passe</strong>
						</td>
					</tr>

					<tr>
						<td className='border border-slate-500 px-9 py-2'>admin</td>
						<td className='border border-slate-500 px-9 py-2'>admin</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LoginTable;
