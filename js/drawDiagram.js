// Отрисовка диаграммы.
function drawDiagram(dataset) 
{
	var ctx = document.getElementById("myChart");
	let points = [];
	for (let i = 0; i < dataset.x.length; i++){
		points.push({
			x: dataset.x[i],
			y: dataset.y[i],
		});
	}
	var myChart = new Chart 
	(ctx, {
		type: 'scatter',
		data: {
			datasets:[{
				label: "Зависимость " +axisY+" от "+axisX,
				data: points,
				showLine: true,
			}],
		},
		options: {
			responsive: false,
		}
	});
	console.log(points);
}

function drawCoef(coef){
	let ctx = document.getElementById("myChart2");
	let myChart = new Chart 
	(ctx, {
		type: 'bar',
		data: {
			labels: coef.pearson.map(object => object.title),
			datasets: [{
				label: "Коэффициент Пирсона",
				barPercentage: 0.5,
				barThickness: 6,
				maxBarThickness: 8,
				minBarLength: 2,
				data: coef.pearson,
				backgroundColor: "#800000",
			},{
				label: "Коэффициент Спирмена",
				barPercentage: 0.5,
				barThickness: 6,
				maxBarThickness: 8,
				minBarLength: 2,
				data: coef.spearman,
				backgroundColor: "#000075",
			},{
				label: "Коэффициент Кендалла",
				barPercentage: 0.5,
				barThickness: 6,
				maxBarThickness: 8,
				minBarLength: 2,
				data: coef.kendall,
				backgroundColor: "#ffe119",
			},
			{
				label: "Коэффициент Фехнера",
				barPercentage: 0.5,
				barThickness: 6,
				maxBarThickness: 8,
				minBarLength: 2,
				data: coef.fechman,
				backgroundColor: "#3cb44b",
			}],
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			},
			responsive: true,
			title: {
				display: true,
				text: coef.title,
			}
		}
	});
}
