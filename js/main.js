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

var data;

// Обработка файла.
function handleFileLoad(event)
{
	data = new Object();
	console.log("BEFORE PARSING");

	
	//угадываем разделитель
	const del = guessDelimiters(event.target.result, [",", ";", " "])[0];
	console.warn(del);
	
	// Парсинг CSV-файла.
	let papa = Papa.parse(event.target.result, {
		delimiter: del,
		header: true,
		skipEmptyLines: true,
	});
	console.log("papa", papa);

	//если возникла ошибка
	if(papa.errors.length !== 0){
		const error = papa.errors[0];
		const errorMessage = error.message + ' at line ' + (error.row + 1);
		errorDiv(errorMessage);
		
	}else{
		hideError();
		
	}
	
	console.log("BEFORE ACOS");
	initData(papa);

	console.log("AFTER ACOS");
	console.log("asociative data", data);

	drawTable(papa);


}

function drawTable(papa){
	const tabledata = papa.data;
	
	const table = new Tabulator("#content", {
			data: tabledata,
			autoColumns:true,
			pagination:"local",
			paginationSize:50,
	});
}

function initData(papa){
	let checkbox_div = document.getElementById('checkboxes');
	checkbox_div.innerHTML = "";
	checkbox_div.innerHTML+= "<h3>Поля</h3>";
	let tableCheckBox = "<table>";
	
	//Забиваем ассоциативный массив
	let number = true;
	for (let key of papa.meta.fields){
		tableCheckBox += "<tr><td>" + key + "</td>";
		data[key] = papa.data.map(field => {
			if (number){
			    if(isNaN(field[key]*1)){
					number = false;
			    }else{
					return field[key]*1;
				}
			}
			return field[key];
		});
		if(number) data[key].type = 'number';
		else       data[key].type = 'string';
		if (number){
			tableCheckBox += "<td>" + '<input type="checkbox" id="" name="" checked onclick="javascript: switchType(`'+key+'`)"><label for="" class="ml-2">Колличественное</label></td>';
		}else{
			tableCheckBox += "<td></td>";
		}number = true;
		tableCheckBox += "</tr>";
	}
	tableCheckBox += "</table>";

	checkbox_div.innerHTML += tableCheckBox;

	let dropdown =  '<div class="my-2" >'+
	'<h3>График</h3>' +
    '<label for="selectX">Выберите поле для Оси X</label>'+
	'<select class="form-control mx-2" style="width: auto; display:inline-block;" id="selectX" onchange="processSelectAxes(this)">'+
	Object.keys(data).map( key => "<option>"+key+"</option>").join() +
	'<option value="none" selected disabled hidden></option>'+
	'</select><br>'+
	'<label for="selectY">Выберите поле для Оси Y</label>'+
    '<select class="form-control mx-2" style="width: auto; display:inline-block;" id="selectY" onchange="processSelectAxes(this)">'+
	Object.keys(data).map( key => "<option>"+key+"</option>").join() +
	'<option value="none" selected disabled hidden></option>'+
	'</select><br>'+
	'<label for="selectCoef">Выберите столбец для расчета коэффициентов</label>'+
	'<select class="form-control mx-2" style="width: auto; display:inline-block;" id="selectX" onchange="processSelectCoef(this)">'+
	Object.keys(data).map( key => "<option>"+key+"</option>").join() +
	'<option value="none" selected disabled hidden></option>'+
	'</select>'+
  '</div>';

  checkbox_div.innerHTML += dropdown;
  checkbox_div.innerHTML +="<h3>Таблица с данными</h3>";

}

function switchType(key){

	switch(data[key].type){
		case "number":
			data[key].type = "string";
			break;
		case "string":
			data[key].type = "number";
			break;
	}
	
}

function guessDelimiters (text, possibleDelimiters) {
    return possibleDelimiters.filter(weedOut);

    function weedOut (delimiter) {
        var cache = -1;
        return text.split('\n').every(checkLength);

        function checkLength (line) {
            if (!line) {
                return true;
            }

            var length = line.split(delimiter).length;
            if (cache < 0) {
                cache = length;
            }
            return cache === length && length > 1;
        }
    }
}

var axisX = undefined;
var axisY = undefined;
function processSelectAxes(e){

	if (data[e.value].type === "string"){
		errorDiv("Ошибка! Поле " + e.value + " не колличественное!");
		return;
	}else{
		hideError();
	}

	if (e.id === "selectX"){
		axisX = e.value;
	}
	if (e.id === "selectY"){
		axisY = e.value;
	}

	if (axisX !== undefined && axisY !== undefined){
		document.getElementById('canvas_container').innerHTML = "<canvas id = 'myChart' width ='600' height = '500'></canvas>";
		drawDiagram({x: data[axisX], y: data[axisY]});
	}

}

function processSelectCoef(e){
	if (data[e.value].type === "string"){
		errorDiv("Ошибка! Поле " + e.value + " не колличественное!");
		return;
	}else{
		hideError();
	}
	document.getElementById('canvas_container2').innerHTML = "";


	let coef = {title: "Коэффициенты корреляции между "+e.value+" и другими столбцами", pearson: [], spearman: [], kendall: [],  fechman: []};


	for (const [key, value] of Object.entries(data)) {
		//if (key === e.value) continue;
		if (data[key].type === "number"){
			let point = {x: data[e.value].slice(), y: data[key].slice()};
			coef.pearson.push(  {title: key, y: correlationPearson(point)  });
			console.warn("PEARSON READY");
			coef.spearman.push( {title: key, y: correlationSpearman(point) });
			console.warn("SPEARMAN READY");
			coef.kendall.push(  {title: key, y: kendall(point)  });
			console.warn("Kendall READY");
			coef.fechman.push(  {title: key, y: correlationFechman(point)  });
			console.warn("Fechman READY");
		}
	}

	console.log("COEFS", coef);

	document.getElementById('canvas_container2').innerHTML += "<canvas id = 'myChart2' width ='600' height = '500'></canvas>";
	drawCoef(coef);
}


function errorDiv(error){
	let error_div = document.getElementById('error_content');
	error_div.style.display = "block";
	error_div.innerText = error;
}

function hideError(){
	document.getElementById('error_content').style.display = "none";
}