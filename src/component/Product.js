import React, { useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import { FaFilter } from 'react-icons/fa';
import { CSVLink } from 'react-csv';

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
	const [showOptions, setShowOptions] = useState(false);
	const optionsRef = useRef(null);

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
		const handleClickOutside = (event) => {
			if (optionsRef.current && !optionsRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const handleFilterByZone = () => {
		// Sorting the data by zone
		const sortedData = [...data].sort((a, b) => a.zone.localeCompare(b.zone));
		setFilter(sortedData);
		setShowOptions(false); // Close the options after clicking
	};

	const handleFilterByBrand = () => {
		// Sorting the data by brand
		const sortedData = [...data].sort((a, b) =>
			a.device_brand.localeCompare(b.device_brand)
		);
		setFilter(sortedData);
		setShowOptions(false); // Close the options after clicking
	};

	const toggleOptions = () => {
		setShowOptions(!showOptions);
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
			<div className='flex items-center justify-between mb-2'>
				<input
					type='text'
					className='w-full sm:w-64 p-2 border border-gray-300 rounded-md'
					placeholder='Search...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className='relative' ref={optionsRef}>
					<button className='ml-2' onClick={toggleOptions}>
						<FaFilter className='cursor-pointer' size={20} />
					</button>
					{showOptions && (
						<div className='fixed z-10  right-0 mt-2 sm:mt-0 sm:ml-2 bg-white border border-gray-300 rounded-md shadow-md'>
							<button
								onClick={handleFilterByZone}
								className='block px-4 py-2 hover:bg-gray-100  '
							>
								Filter by Zone
							</button>
							<button
								onClick={handleFilterByBrand}
								className='block px-4 py-2 hover:bg-gray-100  '
							>
								Filter by Device
							</button>
						</div>
					)}
				</div>
			</div>
			<DataTable
				customStyles={tableHeaderStyle}
				columns={columns}
				data={filter}
				pagination
				fixedHeader
				selectableRowsHighlight
				// actions={<button className='btn btn-success'>Export CSV</button>}
				highlightOnHover
				subHeader
				subHeaderAlign='left'
				responsive={true}
			/>
			<div>
				<CSVLink data={filter} filename='data.csv'>
					<button className='btn btn-success'>Export CSV</button>
				</CSVLink>
			</div>
		</div>
	);
}
