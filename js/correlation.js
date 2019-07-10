// Расчёт коэффициента корреляции Кенделла.
function correlationKendall(point)
{
	var n = point.x.length;
	var rankX = rankify(point.x);
	var rankY = rankify(point.y);
	
	var p = [];
		
	for (var i = 0; i < n; i++)
	{
		p[i] = 0;
		
		for (var j = i + 1; j < n; j++)
		{
			if (rankX[i] < rankY[j])
				p[i]++;
		}
	}
	
	var sumP = 0;
	for (var i = 0; i < n; i++)
		sumP += p[i];
		
	var sumQ = n * (n - 1) / 2 - sumP;	
	
	return (sumP - sumQ) / (0.5 * n * (n - 1));
}
	
	
	
// Расчёт коэффициента корреляции Спирмена.
function correlationSpearman(point)
{
	var n = point.x.length;

	var rankX = rankify(point.x);
	var rankY = rankify(point.y);
	
	var sumX = 0;
	var sumY = 0;
	var sumXY = 0;
	
	var squareSumX = 0;
	var squareSumY = 0;
	
	for (var i = 0; i < n; i++) 
    { 
        sumX += rankX[i]; 
        sumY += rankY[i]; 
        sumXY += rankX[i] * rankY[i]; 
 
        squareSumX += rankX[i] * rankX[i]; 
        squareSumY += rankY[i] * rankY[i]; 
    } 
	
   return (n * sumXY - sumX * sumY) / Math.sqrt((n * squareSumX - sumX * sumX) * (n * squareSumY - sumY * sumY)); 		
}
	
	
	
// Расчёт коэффициента корреляции Пирсона.
function correlationPearson(point)
{
	var sumX = 0;
	var sumY = 0;
	var n = point.x.length;
	
	for (var i = 0; i < n; i++)
	{
		sumX += point.x[i];
		sumY += point.y[i];
	}
		
	var avgX = sumX / n;
	var avgY = sumY / n;
	
	var sumoffsetX = 0;
	var sumoffsetY = 0;
	var summul = 0;
	
	for (var i = 0; i < n; i++)
	{
		summul += (point.x[i] - avgX) * (point.y[i] - avgY);
		sumoffsetX += (point.x[i] - avgX) * (point.x[i] - avgX);
		sumoffsetY += (point.y[i] - avgY) * (point.y[i] - avgY);
	}
	
	return summul / Math.sqrt(sumoffsetX * sumoffsetY);
}
	
	
	
// Вспомогательная функция для определения рангов.
function rankify(arr)
{
	var n = arr.length;
	var rank = [];

	for (var i = 0; i < n; i++)
	{
		var r = 1;
		var s = 1;
	
		for (var j = 0; j < i; j++) 
		{ 
			if (+arr[j] < arr[i] ) r++; 
			if (+arr[j] == arr[i] ) s++; 
		} 
	
		for (var j = i+1; j < n; j++) 
		{ 
			if (+arr[j] < arr[i] ) r++; 
			if (+arr[j] == arr[i] ) s++; 
		} 
	
		rank[i] = r + (s - 1) * 0.5;	
	}

	return rank;
}
	
	
	
// Функция сортировки методом Пузырька массивов X, Y.
function sortPoint(point)
{
	for (var i = 0, endI = point.x.length - 1; i < endI; i++) 
	{
        for (var j = 0, endJ = endI - i; j < endJ; j++) 
		{
            if (point.x[j] > point.x[j + 1]) 
			{
                var swap = point.x[j];
                point.x[j] = point.x[j + 1];
                point.x[j + 1] = swap;
				
				swap = point.y[j];
                point.y[j] = point.y[j + 1];
                point.y[j + 1] = swap;
            }
        }
    }
}
	