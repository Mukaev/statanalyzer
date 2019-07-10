// Отрисовка диаграммы.
function drawDiagram(point) 
{
	var ctx = document.getElementById("myChart");
	var myChart = new Chart 
	(ctx, 
	{
		type: 'line',
		data: 
		{
			// Подписи оси OX.
			labels: [], 
			datasets: 
			[
				{
					// Метка.
					label: 'f(x)', 
					// Данные.
					data: [],
					// Цвет.
					borderColor: 'green',
					// Толщина линии.
					borderWidth: 2,
					fill: false 
				}
			]
		},
		
		options: 
		{
			responsive: false, 
			scales: 
			{
				xAxes: 
				[
				{
					display: true
				}
				],
				yAxes:
				[
				{
					display: true
				}
				]
			}
		}
	}
	);
	
	// Заполнение данными.
	for (var i = 0; i < point.x.length; i++) 
	{
		myChart.data.labels.push('' + point.x[i]);
		myChart.data.datasets[0].data.push(point.y[i]);
	}
	
  // Обновление.
  myChart.update();
}
