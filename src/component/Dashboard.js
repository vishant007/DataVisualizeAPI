import React, { useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import { FaFilter } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import Chart from 'chart.js/auto';

export default function Dashboard() {
	// Define table columns
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

	// State variables
	const [data, setData] = useState([]); // Fetched data from the API
	const [search, setSearch] = useState(''); // Search input value
	const [filter, setFilter] = useState([]); // Filtered data based on search and filters
	const [showOptions, setShowOptions] = useState(false); // Flag to show/hide filter options
	const optionsRef = useRef(null); // Reference to filter options dropdown
	const chartRef = useRef(null); // Reference to device chart canvas
	const vehicleChartRef = useRef(null); // Reference to vehicle chart canvas

	// Fetch data from the API and cache it in local storage
	useEffect(() => {
		const cachedData = localStorage.getItem('deviceBrandChartData');

		const fetchData = async () => {
			try {
				const response = await fetch(
					'http://20.121.141.248:5000/assignment/feb/sde_fe'
				);
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				const { data } = await response.json();
				setData(data);
				setFilter(data);
				localStorage.setItem('deviceBrandChartData', JSON.stringify(data));
			} catch (error) {
				console.log(error);
				// Handle error here (e.g., display an error message to the user)
			}
		};

		if (cachedData) {
			setData(JSON.parse(cachedData));
			setFilter(JSON.parse(cachedData));
		} else {
			fetchData();
		}
	}, []);

	// Close filter options dropdown when clicked outside
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

	// Sort data by zone
	const handleFilterByZone = () => {
		const sortedData = [...data].sort((a, b) => a.zone.localeCompare(b.zone));
		setFilter(sortedData);
		setShowOptions(false);
	};

	// Sort data by device brand
	const handleFilterByBrand = () => {
		const sortedData = [...data].sort((a, b) =>
			a.device_brand.localeCompare(b.device_brand)
		);
		setFilter(sortedData);
		setShowOptions(false);
	};

	// Toggle filter options dropdown
	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};

	// Generate chart data for devices based on zone and SDK version
	const generateChartData = () => {
		const chartData = {};
		filter.forEach((item) => {
			if (!chartData[item.zone]) {
				chartData[item.zone] = {};
			}
			if (!chartData[item.zone][item.sdk_int]) {
				chartData[item.zone][item.sdk_int] = 0;
			}
			chartData[item.zone][item.sdk_int]++;
		});
		return chartData;
	};

	// Generate chart data for vehicles based on zone and vehicle brand
	const generateVehicleChartData = () => {
		const vehicleChartData = {};
		filter.forEach((item) => {
			if (!vehicleChartData[item.zone]) {
				vehicleChartData[item.zone] = {};
			}
			if (!vehicleChartData[item.zone][item.vehicle_brand]) {
				vehicleChartData[item.zone][item.vehicle_brand] = 0;
			}
			vehicleChartData[item.zone][item.vehicle_brand]++;
		});
		return vehicleChartData;
	};

	// Create device chart when filter changes
	useEffect(() => {
		if (filter.length > 0) {
			const ctx = chartRef.current.getContext('2d');
			if (window.chartInstance) {
				window.chartInstance.destroy();
			}
			window.chartInstance = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: Object.keys(generateChartData()),
					datasets: Object.keys(generateChartData()).map((zone) => ({
						label: zone,
						data: Object.values(generateChartData()[zone]),
						backgroundColor: getRandomColor(),
						borderColor: getRandomColor(),
						borderWidth: 1,
					})),
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
							stepSize: 10,
							max: getMaxCount(generateChartData()) + 10,
						},
					},
				},
			});

			const vehicleCtx = vehicleChartRef.current.getContext('2d');
			if (window.vehicleChartInstance) {
				window.vehicleChartInstance.destroy();
			}
			window.vehicleChartInstance = new Chart(vehicleCtx, {
				type: 'bar',
				data: {
					labels: Object.keys(generateVehicleChartData()),
					datasets: Object.keys(generateVehicleChartData()).map((zone) => ({
						label: zone,
						data: Object.values(generateVehicleChartData()[zone]),
						backgroundColor: getRandomColor(),
						borderColor: getRandomColor(),
						borderWidth: 1,
					})),
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		}
	}, [filter]);

	// Custom styles for table header
	const tableHeaderStyle = {
		headCells: {
			style: {
				fontWeight: 'bold',
				fontSize: '14px',
				backgroundColor: '#ccc',
			},
		},
	};

	// Generate a random color for chart elements
	const getRandomColor = () => {
		return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
			Math.random() * 256
		)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
	};

	// Get the maximum count of devices in a zone for scaling the chart
	const getMaxCount = (chartData) => {
		let maxCount = 0;
		Object.keys(chartData).forEach((zone) => {
			const counts = Object.values(chartData[zone]);
			const maxInZone = Math.max(...counts);
			if (maxInZone > maxCount) {
				maxCount = maxInZone;
			}
		});
		return maxCount;
	};

	return (
		<div>
			{/* Search input and filter options */}
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
			{/* Data table */}
			<DataTable
				customStyles={tableHeaderStyle}
				columns={columns}
				data={filter}
				pagination
				fixedHeader
				selectableRowsHighlight
				highlightOnHover
				subHeader
				subHeaderAlign='left'
				responsive={true}
			/>
			{/* Device chart */}
			<h1 className='text-center text-2xl font-bold mt-5'>
				Bar Chart based on the zones showing the distribution of the total
				number of devices used over different handset SDK int values.
			</h1>
			<canvas ref={chartRef} width='400' height='200'></canvas>
			{/* Vehicle chart */}
			<h1 className='text-center text-2xl font-bold mt-5'>
				Bar Chart based on the zones showing the distribution of the total
				number of vehicles over different vehicle brands.
			</h1>
			<canvas ref={vehicleChartRef} width='400' height='200'></canvas>
			{/* Export CSV button */}
			<div>
				<CSVLink data={filter} filename='data.csv'>
					<button className='btn btn-success'>Export CSV</button>
				</CSVLink>
			</div>
		</div>
	);
}
