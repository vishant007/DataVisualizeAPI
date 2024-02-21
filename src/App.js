import React from 'react';
import Dashboard from './component/Dashboard';
export default function App() {
	return (
		<React.Fragment>
			<div className='App'>
				<h1 className='mt-3 m-5'>Data Visualization Dashboard</h1>
				<div className='container'>
					<div className='row'>
						<div className='col-md-12'>
							<Dashboard />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
