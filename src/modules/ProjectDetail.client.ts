import ApexCharts from 'apexcharts';

// Wait for DOM to be ready
if (typeof window !== 'undefined') {
	// Get project data from data attribute
	const projectDetailElement = document.getElementById('project-detail-data');

	if (projectDetailElement) {
		const projectData = JSON.parse(projectDetailElement.dataset.project || '{}');

		if (projectData && projectData.status) {
			const statusData = projectData.status;
			const totalItems = projectData.total_items;

			// Status order for sorting
			const statusOrder = [
				'Production',
				'Passed UAT',
				'Testing In QA UAT',
				'Ready For QA UAT',
				'Passed Staging',
				'Checking QA Staging',
				'Ready For QA Staging',
				'Done in Local',
				'In Progress',
				'Backlog',
			];

			const sortStatusEntries = (entries: [string, number][]) => {
				return entries.sort((a, b) => {
					const indexA = statusOrder.findIndex(status =>
						a[0].toLowerCase().includes(status.toLowerCase()) ||
						status.toLowerCase().includes(a[0].toLowerCase())
					);
					const indexB = statusOrder.findIndex(status =>
						b[0].toLowerCase().includes(status.toLowerCase()) ||
						status.toLowerCase().includes(b[0].toLowerCase())
					);

					if (indexA !== -1 && indexB !== -1) return indexA - indexB;
					if (indexA !== -1) return -1;
					if (indexB !== -1) return 1;
					return a[0].localeCompare(b[0]);
				});
			};

			const sortedEntries = sortStatusEntries(Object.entries(statusData));
			const labels = sortedEntries.map(([key]) => key);
			const values = sortedEntries.map(([, value]) => value as number);
			const colors = ['#1A56DB', '#16BDCA', '#FDBA8C', '#E74694', '#9061F9', '#31C48D'];

			const getChartColors = () => {
				if (document.documentElement.classList.contains('dark')) {
					return {
						strokeColor: '#1f2937',
						labelColor: '#D1D5DB',
						borderColor: '#374151',
						opacityFrom: 0,
						opacityTo: 0.15,
					};
				}
				return {
					strokeColor: '#ffffff',
					labelColor: '#6B7280',
					borderColor: '#F3F4F6',
					opacityFrom: 0.45,
					opacityTo: 0,
				};
			};

			const chartColors = getChartColors();

			// Line Chart
			if (document.getElementById('line-chart')) {
				const areaOptions = {
					chart: {
						height: 420,
						type: 'area' as const,
						fontFamily: 'Inter, sans-serif',
						foreColor: chartColors.labelColor,
						toolbar: {
							show: false,
						},
					},
					fill: {
						type: 'gradient',
						gradient: {
							enabled: true,
							opacityFrom: chartColors.opacityFrom,
							opacityTo: chartColors.opacityTo,
						},
					},
					dataLabels: {
						enabled: true,
					},
					tooltip: {
						style: {
							fontSize: '14px',
							fontFamily: 'Inter, sans-serif',
						},
						y: {
							formatter: function(value: number) {
								const percentage = ((value / totalItems) * 100).toFixed(1);
								return value + ' items (' + percentage + '%)';
							}
						}
					},
					grid: {
						show: true,
						borderColor: chartColors.borderColor,
						strokeDashArray: 1,
						padding: {
							left: 35,
							bottom: 15,
						},
					},
					series: [{
						name: 'Items',
						data: values,
						color: '#1A56DB',
					}],
					markers: {
						size: 5,
						strokeColors: '#ffffff',
						hover: {
							size: undefined,
							sizeOffset: 3,
						},
					},
					xaxis: {
						categories: labels,
						labels: {
							style: {
								colors: [chartColors.labelColor],
								fontSize: '14px',
								fontWeight: 500,
							},
						},
						axisBorder: {
							color: chartColors.borderColor,
						},
						axisTicks: {
							color: chartColors.borderColor,
						},
					},
					yaxis: {
						labels: {
							style: {
								colors: [chartColors.labelColor],
								fontSize: '14px',
								fontWeight: 500,
							},
						},
					},
					legend: {
						show: false,
					},
				};

				const areaChart = new ApexCharts(document.getElementById('line-chart'), areaOptions);
				areaChart.render();

				document.addEventListener('dark-mode', () => {
					const newColors = getChartColors();
					const isDark = document.documentElement.classList.contains('dark');
					areaChart.updateOptions({
						chart: { foreColor: isDark ? '#D1D5DB' : '#6B7280' },
						grid: { borderColor: newColors.borderColor },
						fill: {
							gradient: {
								opacityFrom: newColors.opacityFrom,
								opacityTo: newColors.opacityTo,
							},
						},
						xaxis: {
							labels: { style: { colors: [isDark ? '#D1D5DB' : '#6B7280'] } },
							axisBorder: { color: newColors.borderColor },
							axisTicks: { color: newColors.borderColor },
						},
						yaxis: {
							labels: { style: { colors: [isDark ? '#D1D5DB' : '#6B7280'] } },
						},
						legend: {
							labels: { colors: [isDark ? '#E5E7EB' : '#374151'] },
						},
					});
				});
			}


			// Colored Bar Chart
			if (document.getElementById('colored-bar-chart')) {
				const barOptions = {
					colors: colors.slice(0, labels.length),
					series: [{
						name: 'Items',
						data: values,
					}],
					chart: {
						type: 'bar' as const,
						height: 420,
						fontFamily: 'Inter, sans-serif',
						foreColor: chartColors.labelColor,
						toolbar: {
							show: false,
						},
					},
					plotOptions: {
						bar: {
							columnWidth: '70%',
							borderRadius: 4,
							distributed: true,
						},
					},
					tooltip: {
						shared: false,
						intersect: false,
						style: {
							fontSize: '14px',
							fontFamily: 'Inter, sans-serif',
						},
						y: {
							formatter: function(value: number) {
								const percentage = ((value / totalItems) * 100).toFixed(1);
								return value + ' items (' + percentage + '%)';
							}
						}
					},
					states: {
						hover: {
							filter: {
								type: 'darken',
								value: 1,
							},
						},
					},
					grid: {
						show: true,
						borderColor: chartColors.borderColor,
					},
					dataLabels: {
						enabled: true,
					},
					legend: {
						show: false,
					},
					xaxis: {
						categories: labels,
						floating: false,
						labels: {
							show: true,
							style: {
								colors: [chartColors.labelColor],
								fontFamily: 'Inter, sans-serif',
							},
						},
						axisBorder: {
							show: false,
						},
						axisTicks: {
							show: false,
						},
					},
					yaxis: {
						show: true,
						labels: {
							style: {
								colors: [chartColors.labelColor],
								fontFamily: 'Inter, sans-serif',
							},
						},
					},
					fill: {
						opacity: 1,
					},
				};

				const barChart = new ApexCharts(document.getElementById('colored-bar-chart'), barOptions);
				barChart.render();

				document.addEventListener('dark-mode', () => {
					const newColors = getChartColors();
					const isDark = document.documentElement.classList.contains('dark');
					barChart.updateOptions({
						chart: { foreColor: isDark ? '#D1D5DB' : '#6B7280' },
						grid: { borderColor: newColors.borderColor },
						xaxis: { labels: { style: { colors: [isDark ? '#D1D5DB' : '#6B7280'] } } },
						yaxis: { labels: { style: { colors: [isDark ? '#D1D5DB' : '#6B7280'] } } },
					});
				});
			}

			// Donut Chart
			if (document.getElementById('donut-chart')) {
				const donutOptions = {
					series: values,
					labels: labels,
					colors: colors,
					chart: {
						type: 'donut' as const,
						height: 350,
						fontFamily: 'Inter, sans-serif',
						toolbar: {
							show: false,
						},
					},
					stroke: {
						colors: [chartColors.strokeColor],
					},
					legend: {
						position: 'bottom' as const,
						fontFamily: 'Inter, sans-serif',
						labels: {
							colors: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
							useSeriesColors: false,
						},
						markers: {
							fillColors: colors,
						},
					},
					dataLabels: {
						enabled: true,
						style: {
							fontFamily: 'Inter, sans-serif',
							fontSize: '14px',
							fontWeight: 600,
							colors: ['#fff'],
						},
						dropShadow: {
							enabled: true,
							top: 1,
							left: 1,
							blur: 1,
							color: '#000',
							opacity: 0.45,
						},
					},
					tooltip: {
						style: {
							fontSize: '14px',
							fontFamily: 'Inter, sans-serif',
						},
						y: {
							formatter: function(value: number) {
								const percentage = ((value / totalItems) * 100).toFixed(1);
								return value + ' items (' + percentage + '%)';
							}
						}
					},
					plotOptions: {
						pie: {
							donut: {
								size: '70%',
							},
						},
					},
				};

				const donutChart = new ApexCharts(document.getElementById('donut-chart'), donutOptions);
				donutChart.render();

				document.addEventListener('dark-mode', () => {
					const newColors = getChartColors();
					const isDark = document.documentElement.classList.contains('dark');
					donutChart.updateOptions({
						stroke: { colors: [newColors.strokeColor] },
						legend: {
							labels: {
								colors: isDark ? '#E5E7EB' : '#374151',
								useSeriesColors: false,
							}
						},
					});
				});
			}
		// Pie Chart
		if (document.getElementById('pie-chart')) {
			const pieOptions = {
				series: values,
				labels: labels,
				colors: colors,
				chart: {
					type: 'pie' as const,
					height: 350,
					fontFamily: 'Inter, sans-serif',
					toolbar: {
						show: false,
					},
				},
				stroke: {
					colors: [chartColors.strokeColor],
				},
				legend: {
					position: 'bottom' as const,
					fontFamily: 'Inter, sans-serif',
					labels: {
						colors: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
						useSeriesColors: false,
					},
					markers: {
						fillColors: colors,
					},
				},
				dataLabels: {
					enabled: true,
					style: {
						fontFamily: 'Inter, sans-serif',
						fontSize: '14px',
						fontWeight: 600,
						colors: ['#fff'],
					},
					dropShadow: {
						enabled: true,
						top: 1,
						left: 1,
						blur: 1,
						color: '#000',
						opacity: 0.45,
					},
				},
				tooltip: {
					style: {
						fontSize: '14px',
						fontFamily: 'Inter, sans-serif',
					},
					y: {
						formatter: function(value: number) {
							const percentage = ((value / totalItems) * 100).toFixed(1);
							return value + ' items (' + percentage + '%)';
						}
					}
				},
			};

			const pieChart = new ApexCharts(
				document.getElementById('pie-chart'),
				pieOptions,
			);
			pieChart.render();

			document.addEventListener('dark-mode', () => {
				const newColors = getChartColors();
				const isDark = document.documentElement.classList.contains('dark');
				pieChart.updateOptions({
					stroke: { colors: [newColors.strokeColor] },
					legend: {
						labels: {
							colors: isDark ? '#E5E7EB' : '#374151',
							useSeriesColors: false,
						}
					},
				});
			});
		}

		}
	}
}
