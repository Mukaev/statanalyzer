// Функция парсинга CSV-файла.
function CSVParse(csvString, delimiter = ";")
{
	if (!csvString || !csvString.length)
		return [];

	// Паттерн регулярного выражения для парсинга.
	const pattern = new RegExp
	(
		( "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
		  "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
		  "([^\"\\" + delimiter + "\\r\\n]*))"
		), "gi"
	);

	let rows = [[]]; 
	let matches = false;

	while (matches = pattern.exec(csvString)) 
	{
		const matched_delimiter = matches[1];
		const matched_cellQuote = matches[2];
		const matched_cellNoQuote = matches[3];

		// Данные, начинающиеся с разделителя.
		if (matches.index == 0 && matched_delimiter)
			rows[rows.length - 1].push("");

		// Фиксация пустых строк.
		if(!matches[2] && !matches[3])
			continue;

		if (matched_delimiter.length && matched_delimiter !== delimiter)
			rows.push([]);

		const matched_value = (matched_cellQuote)
			? matched_cellQuote.replace(new RegExp("\"\"", "g"), "\"")
			: matched_cellNoQuote;

		rows[rows.length - 1].push(matched_value);
   }

   return rows;
}
