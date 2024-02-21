import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

export default function Product() {
	const columns = [
		{
			name: 'Username',
			selector: (row) => row.username,
		},
		{
			name: 'Zone',
			selector: (row) => row.zone,
		},
		{
			name: 'Device Brand',
			selector: (row) => row.device_brand,
		},
		{
			name: 'SDK Version',
			selector: (row) => row.sdk_int,
		},
		{
			name: 'Vehicle Brand',
			selector: (row) => row.vehicle_brand,
		},
		{
			name: 'Vehicle CC',
			selector: (row) => row.vehicle_cc,
		},
	];

	const [data, setData] = useState([]);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState([]);

	const fetchData = async () => {
		try {
			const response = await fetch(
				'http://20.121.141.248:5000/assignment/feb/sde_fe'
			);
			const { data } = await response.json();
			setData(data);
			setFilter(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		const result = data.filter((item) =>
			item.username.toLowerCase().includes(search.toLowerCase())
		);
		setFilter(result);
	}, [search, data]);

	const handleDelete = (id) => {
		const newData = data.filter((item) => item.id !== id);
		setData(newData);
		setFilter(newData);
	};

	const tableHeaderStyle = {
		headCells: {
			style: {
				fontWeight: 'bold',
				fontSize: '14px',
				backgroundColor: '#ccc',
			},
		},
	};

	return (
		<div>
			<h1>User Data</h1>
			<DataTable
				customStyles={tableHeaderStyle}
				columns={columns}
				data={filter}
				pagination
				selectableRows
				fixedHeader
				selectableRowsHighlight
				highlightOnHover
				subHeader
				subHeaderComponent={
					<input
						type='text'
						className='w-25 form-control'
						placeholder='Search...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				}
				subHeaderAlign='right'
			/>
		</div>
	);
}
