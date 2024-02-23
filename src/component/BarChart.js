// VehicleChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ chartData }) => {
	const chartRef = useRef(null);

	useEffect(() => {
		if (chartData) {
			const ctx = chartRef.current.getContext('2d');
			new Chart(ctx, {
				type: 'bar',
				data: {
					labels: Object.keys(chartData),
					datasets: [
						{
							label: 'Vehicle Count',
							data: Object.values(chartData),
							backgroundColor: 'rgba(54, 162, 235, 0.5)',
							borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 1,
						},
					],
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
	}, [chartData]);

	return <canvas ref={chartRef} width='400' height='200'></canvas>;
};

export default BarChart;
