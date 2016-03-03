$(document).ready(function(){
	var settings = {
		whiteMoveFlag: true,
		gameBoardArr: [],
		threatenedByWhiteArr: [],
		threatenedByBlackArr: [],
		historyArr: [],
		redoArr: [],
	}

	makeGameBoard(settings.gameBoardArr, 8, 8)

//===============================FUNCTIONS====================================
	function makeGameBoard(gameBoardArr, height, width){
	
	var flag;
		for(var i = 0; i < height; i++){
			var row = [];
			if(i%2 == 0){
				flag = true;
			}else{
				flag = false;
			}
			for(var j = 0; j < width; j++){
				if(flag){
					$("#gameBoard").append('<div class="blackSquare"></div>');
					row.push({'position': [i,j]})
					flag = false;
				} else{
					$("#gameBoard").append('<div class="whiteSquare"></div>');
					flag = true;
				}

				$("#gameBoard div:last-child").attr("id",i.toString()+j.toString());
			}
		}
		gameBoardArr.push(row);
	}
});