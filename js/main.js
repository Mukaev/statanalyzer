// Инициализация.
function init()
{
	// Добавление события на выбор файла.
	document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}

// Функция при выборе файла.
function handleFileSelect(event)
{
	// Чтение файла.
	const reader = new FileReader()
	// Загрузка обработчика.
	reader.onload = handleFileLoad;
	// Чтение файла как текст.
	reader.readAsText(event.target.files[0]);
}

// Обработка файла.
function handleFileLoad(event)
{
	// Парсинг CSV-файла.
	var arr = CSVParse(event.target.result);
  
	// Парсинг строки X как вещественное.
	var x = arr[0].map(parseFloat);
	// Парсинг строки X как вещественное.
	var y = arr[1].map(parseFloat);
	
	// Создание объекта для хранения массивов (точки).
	var point = {};
  
	// Добавление массивов.
	point.x = x;
	point.y = y;
 
	// Сортировка массивов (по возрастанию Х).
	sortPoint(point);
 
	// Вывод результатов.
	document.getElementById('content').textContent = 
	 	"ВЫВОД КОРРЕЛЯЦИИ "+
		"\n\nX = " + point.x +"\nY = " + point.y +
		"\n\nКоэффициент корреляции Пирсона,  r = " + correlationPearson(point) +
		"\nКоэффициент корреляции Спирмэна, r = " + correlationSpearman(point) +
		"\nКоэффициент корреляции Кендалла, τ = " + correlationKendall(point);
  
	// Отрисовка диаграммы (графика).
	drawDiagram(point);
}
