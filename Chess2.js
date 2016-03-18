$(document).ready(function(){
	var global = {
		whiteMoveFlag: true,
		selectedPiece: undefined,
		gameBoardArr: [],
		threatenedByWhiteArr: [],
		threatenedByBlackArr: [],
		historyArr: [],
		redoArr: [],
	}

	var imagePaths = {
		whitePawn:'<img src="./Assets/whitePawn.png">',
		whiteRook:'<img src="./Assets/whiteRook.png">',
		whiteBishop:'<img src="./Assets/whiteBishop.png">',
		whiteKnight:'<img src="./Assets/whiteKnight.png">',
		whiteQueen:'<img src="./Assets/whiteQueen.png">',
		wKing:'<img src="./Assets/whiteKing.png">',
		blackPawn:'<img src="./Assets/blackPawn.png">',
		blackRook:'<img src="./Assets/blackRook.png">',
		blackBishop:'<img src="./Assets/blackBishop.png">',
		blackKnight:'<img src="./Assets/blackKnight.png">',
		blackQueen:'<img src="./Assets/blackQueen.png">',
		blackKing:'<img src="./Assets/blackKing.png">',
	}

	function Piece (id, color, type, image, position){
		this.id = id;
		this.color = color;
		this.type = type;
		this.image = image;
		this.position = position;
		this.targetsArr = [];
	}

	Piece.prototype.move = function (newRow, newCol, gameBoardArr){
		pos = this.position;
		row = +pos[0];
		col = +pos[1];
		putPieceInSquare(this);
		this.initialPosition = false;
		emptySquare(row,col,gameBoardArr);
		function putPieceInSquare(piece){
			$("#"+newRow.toString()+newCol.toString()).append(piece.image);
			piece.position = newRow.toString()+newCol.toString();
			gameBoardArr[newRow][newCol] = piece;
		}

		function emptySquare(){
			$("#"+row.toString()+col.toString()).text('');
			gameBoardArr[row][col] = undefined;
		}
	}
	Piece.prototype.initialPosition = true;

	Object.create = function (object) {
        function Prot() {}
        Prot.prototype = object;
        return new Prot();
    } 

    var Pawn = {};
	var Rook = {};
	var Knight = {};
	var Bishop = {};
	var Queen = {};
	var King = {};
	Pawn.prototype = Object.create(Piece.prototype);
	Rook.prototype = Object.create(Piece.prototype);
	Knight.prototype = Object.create(Piece.prototype);
	Bishop.prototype = Object.create(Piece.prototype);
	Queen.prototype = Object.create(Piece.prototype);
	King.prototype = Object.create(Piece.prototype);
    // console.log(Pawn, Rook, Knight, Bishop, Queen, King);

	

	makeGameBoard(global.gameBoardArr, 8, 8);

	

	placePieces(global.gameBoardArr);

	

	makeBoardTargets(global.gameBoardArr);

	$(".square").on('click', function(){
		var position = this.id;
		var row = +position[0];
		var col = +position[1];
		if(global.gameBoardArr[row][col] && !$(this).hasClass('highlight-yellow')){
			unhighlight();
			global.selectedPiece = global.gameBoardArr[row][col];
			highlightTargets(global.gameBoardArr[row][col].targetsArr);
		} else if($(this).hasClass('highlight-yellow')){
			unhighlight();
			global.selectedPiece.move(row,col,global.gameBoardArr);
		}
		
		makeBoardTargets(global.gameBoardArr)
	});

	console.log(global.gameBoardArr);
	// highlightTargets(global.threatenedByWhiteArr);
	// highlightTargets(global.threatenedByBlackArr);
	// console.log(global.threatenedByBlackArr);
	// console.log(global.threatenedByWhiteArr);


//=================================FUNCTIONS==============================
	function putPieceInSquare(piece,row,col,gameBoardArr){
		$("#"+row.toString()+col.toString()).append(piece.image);
		piece.position = row.toString()+col.toString();
		gameBoardArr[row][col].piece = piece;
	}

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
						$("#gameBoard").append('<div class="square blackSquare"></div>');
						row.push(undefined);
						flag = false;
					} else{
						$("#gameBoard").append('<div class="square whiteSquare"></div>');
						row.push(undefined);
						flag = true;
					}

					$("#gameBoard div:last-child").attr("id",i.toString()+j.toString());
				}
			gameBoardArr.push(row);
			}
			return gameBoardArr;
	}

	function placeImage(img, row, col){
		$("#"+row.toString()+col.toString()).append(img);
	}

	function capitalize(str){
		str = str.substring(0,1).toUpperCase() + str.substring(1);
		return str;
	}

	function placeRoyal(gameBoardArr, row, col, color){
		if (col === 0 || col === 7){
			gameBoardArr[row][col] = new Rook.prototype.constructor(capitalize(color)+'Rook'+col, color, 'rook', '<img src="./Assets/'+color+'Rook.png">',row.toString()+col.toString());
			placeImage('<img src="./Assets/'+color+'Rook.png">', row, col);
		} else if (col === 1 || col === 6){
			gameBoardArr[row][col] = new Knight.prototype.constructor(capitalize(color)+'Knight'+col, color, 'knight', '<img src="./Assets/'+color+'Knight.png">',row.toString()+col.toString());
			placeImage('<img src="./Assets/'+color+'Knight.png">', row, col);
		} else if (col === 2 || col === 5){
			gameBoardArr[row][col] = new Bishop.prototype.constructor(capitalize(color)+'Bishop'+col, color, 'bishop', '<img src="./Assets/'+color+'Bishop.png">',row.toString()+col.toString());
			placeImage('<img src="./Assets/'+color+'Bishop.png">', row, col);
		} else if (col === 3){
			gameBoardArr[row][col] = new Queen.prototype.constructor(capitalize(color)+'Queen'+col, color, 'queen', '<img src="./Assets/'+color+'Queen.png">',row.toString()+col.toString());
			placeImage('<img src="./Assets/'+color+'Queen.png">', row, col);
		} else if (col === 4){
			gameBoardArr[row][col] = new King.prototype.constructor(capitalize(color)+'King'+col, color, 'king', '<img src="./Assets/'+color+'King.png">',row.toString()+col.toString());
			placeImage('<img src="./Assets/'+color+'King.png">', row, col);
		}
	}

	function placePiece(gameBoardArr, row, col){
		if(row == 1){
			gameBoardArr[row][col] = new Pawn.prototype.constructor('BlackPawn'+col, 'black', 'pawn', imagePaths.blackPawn,row.toString()+col.toString());
			placeImage(imagePaths.blackPawn, row, col);
		} else if (row == 6){
			gameBoardArr[row][col] = new Pawn.prototype.constructor('WhitePawn'+col, 'white', 'pawn', imagePaths.whitePawn,row.toString()+col.toString());
			placeImage(imagePaths.whitePawn, row, col);
		} else if (row === 0){
			placeRoyal(gameBoardArr, row, col, 'black');
		} else if (row === 7){
			placeRoyal(gameBoardArr, row, col, 'white');
		} else {
			return;
		}
	}

	function placePieces(gameBoardArr){
		for(var i = 0; i < gameBoardArr.length; i++){
			for(var j = 0; j < gameBoardArr[i].length; j++){
				placePiece(gameBoardArr,i,j);

			}
		}
	}

	function inbounds(row, col){
		if (row <= 7 && row >= 0 && col <= 7 && col >= 0){
			return true;
		} else {
			return false;
		}
	}

	function sameColor(gameBoardArr, row, col, color){
		if(gameBoardArr[row][col].color === color){
			return true;
		} else {
			return false;
		}
	}

	function threatenedArrays(id, color){
		if (color === 'black'){
			global.threatenedByBlackArr.push(id);
		} else if (color === 'white'){
			global.threatenedByWhiteArr.push(id);
		}
	}

	function verticalTargets(gameBoardArr, row, col, dist){
		obj = gameBoardArr[row][col];
		for (var i = 1; i < dist; i++){
			if (inbounds(row+i, col) && !gameBoardArr[row+i][col]){
				obj.targetsArr.push((row+i).toString()+col.toString());
				threatenedArrays((row+i).toString()+col.toString(), obj.color);
			} else if(inbounds(row+i, col) && gameBoardArr[row+i][col]){
				threatenedArrays((row+i).toString()+col.toString(), obj.color);
				if(!sameColor(gameBoardArr,row+i,col,obj.color)){
					obj.targetsArr.push((row+i).toString()+col.toString());
				}
				break;
			}
		}
		for (var i = 1; i < dist; i++){
			if (inbounds(row-i, col) && !gameBoardArr[row-i][col]){
				obj.targetsArr.push((row-i).toString()+col.toString());
				threatenedArrays((row-i).toString()+col.toString(), obj.color);
			} else if(inbounds(row-i, col) && gameBoardArr[row-i][col]){
				threatenedArrays((row-i).toString()+col.toString(), obj.color);
				if(!sameColor(gameBoardArr,row-i,col,obj.color)){
					obj.targetsArr.push((row-i).toString()+col.toString());
				}
				break;
			}
		}
	}

	function horizontalTargets(gameBoardArr, row, col, dist){
		obj = gameBoardArr[row][col];
		for (var i = 1; i < dist; i++){
			if (inbounds(row, col+i) && !gameBoardArr[row][col+i]){
				obj.targetsArr.push(row.toString()+(col+i).toString());
				threatenedArrays(row.toString()+(col+i).toString(), obj.color);
			} else if(inbounds(row, col+i) && gameBoardArr[row][col+i]){
				threatenedArrays(row.toString()+(col+i).toString(), obj.color);
				if(!sameColor(gameBoardArr,row,col+i,obj.color)){
					obj.targetsArr.push(row.toString()+(col+i).toString());
				}
				break;
			}
		}
		for (var i = 1; i < dist; i++){
			if (inbounds(row, col-i) && !gameBoardArr[row][col-i]){
				obj.targetsArr.push(row.toString()+(col-i).toString());
				threatenedArrays(row.toString()+(col-i).toString(), obj.color);
			} else if(inbounds(row, col-i) && gameBoardArr[row][col-i]){
				threatenedArrays(row.toString()+(col-i).toString(), obj.color);
				if(!sameColor(gameBoardArr,row,col-i,obj.color)){
					obj.targetsArr.push(row.toString()+(col-i).toString());
				}
				break;
			}
		}
	}

	function diagonalUpTargets(gameBoardArr, row, col, dist){
		obj = gameBoardArr[row][col];
		for(var i = 1; i < dist; i++){
			if (inbounds(row-i, col-i) && !gameBoardArr[row-i][col-i]){
				obj.targetsArr.push((row-i).toString()+(col-i).toString());
				threatenedArrays((row-i).toString()+(col-i).toString(),obj.color);
			} else if(inbounds(row-i, col-i) && gameBoardArr[row-i][col-i]){
				threatenedArrays((row-i).toString()+(col-i).toString(),obj.color);
				if(!sameColor(gameBoardArr,row-i,col-i,obj.color)){
					obj.targetsArr.push((row-i).toString()+(col-i).toString());
				}
				break;
			}
		}
		for(var i = 1; i < dist; i++){
			if (inbounds(row-i, col+i) && !gameBoardArr[row-i][col+i]){
				obj.targetsArr.push((row-i).toString()+(col+i).toString());
				threatenedArrays((row-i).toString()+(col+i).toString(),obj.color);
			} else if(inbounds(row-i, col+i) && gameBoardArr[row-i][col+i]){
				threatenedArrays((row-i).toString()+(col+i).toString(),obj.color);
				if(!sameColor(gameBoardArr,row-i,col+i,obj.color)){
					obj.targetsArr.push((row-i).toString()+(col+i).toString());
				}
				break;
			}
		}
	}

	function diagonalDownTargets(gameBoardArr, row, col, dist){
		obj = gameBoardArr[row][col];
		for(var i = 1; i < dist; i++){
			if (inbounds(row+i, col-i) && !gameBoardArr[row+i][col-i]){
				obj.targetsArr.push((row+i).toString()+(col-i).toString());
				threatenedArrays((row+i).toString()+(col-i).toString(),obj.color);
			} else if(inbounds(row+i, col-i) && gameBoardArr[row+i][col-i]){
				threatenedArrays((row+i).toString()+(col-i).toString(),obj.color);
				if(!sameColor(gameBoardArr,row+i,col-i,obj.color)){
					obj.targetsArr.push((row+i).toString()+(col-i).toString());
				}
				break;
			}
		}
		for(var i = 1; i < dist; i++){
			if (inbounds(row+i, col+i) && !gameBoardArr[row+i][col+i]){
				obj.targetsArr.push((row+i).toString()+(col+i).toString());
				threatenedArrays((row+i).toString()+(col+i).toString(),obj.color);
			} else if(inbounds(row+i, col+i) && gameBoardArr[row+i][col+i]){
				threatenedArrays((row+i).toString()+(col+i).toString(),obj.color);
				if(!sameColor(gameBoardArr,row+i,col+i,obj.color)){
					obj.targetsArr.push((row+i).toString()+(col+i).toString());
				}
				break;
			}
		}
	}

	function pawnAttackTargets(gameBoardArr, row, col){
		obj = gameBoardArr[row][col];
		if(obj.color === 'black'){
			threatenedArrays((row+1).toString()+(col-1).toString(), 'black');
			threatenedArrays((row+1).toString()+(col+1).toString(), 'black');
			if(inbounds(row+1,col+1) && gameBoardArr[row+1][col+1] && !sameColor(gameBoardArr,row+1,col+1,obj.color)){
				obj.targetsArr.push((row+1).toString()+(col+1).toString());
			}
			if(inbounds(row+1,col-1) && gameBoardArr[row+1][col-1] && !sameColor(gameBoardArr,row+1,col-1,obj.color)){
				obj.targetsArr.push((row+1).toString()+(col-1).toString());
			}
		} else if(obj.color === 'white'){
			threatenedArrays((row-1).toString()+(col-1).toString(), 'white');
			threatenedArrays((row-1).toString()+(col+1).toString(), 'white');
			if(inbounds(row-1,col+1) && gameBoardArr[row-1][col+1] && !sameColor(gameBoardArr,row-1,col+1,obj.color)){
				obj.targetsArr.push((row-1).toString()+(col+1).toString());
			}
			if(inbounds(row-1,col-1) && gameBoardArr[row-1][col-1] && !sameColor(gameBoardArr,row-1,col-1,obj.color)){
				obj.targetsArr.push((row-1).toString()+(col-1).toString());
			}
		}
	}

	function pawnMoveTargets(gameBoardArr, row, col){
		obj = gameBoardArr[row][col];
		if(obj.color === 'black'){
			if(inbounds(row+1,col) && !gameBoardArr[row+1][col]){
				obj.targetsArr.push((row+1).toString()+col.toString());
			}
			if (obj.initialPosition){
				if(!gameBoardArr[row+2][col]){
					obj.targetsArr.push((row+2).toString()+col.toString());
				}
			}
		} else if(obj.color === 'white'){
			if(inbounds(row-1,col) && !gameBoardArr[row-1][col]){
				obj.targetsArr.push((row-1).toString()+col.toString());
			}
			if (obj.initialPosition){
				if(!gameBoardArr[row-2][col]){
					obj.targetsArr.push((row-2).toString()+col.toString());
				}
			}
		}
	}

	function knightTargets(gameBoardArr, row, col){
		obj = gameBoardArr[row][col];
		var knightArr = [[-2,-1],[-2,1],[-1,2],[1,2],[2,1],[2,-1],[-1,-2],[1,-2]];
		for(var i = 0; i < knightArr.length; i++){
			if(inbounds(row+knightArr[i][0],col+knightArr[i][1])){
				threatenedArrays((row+knightArr[i][0]).toString()+(col+knightArr[i][1]).toString(),obj.color);
				if(inbounds(row+knightArr[i][0],col+knightArr[i][1]) && !gameBoardArr[row+knightArr[i][0]][col+knightArr[i][1]]){
					obj.targetsArr.push((row+knightArr[i][0]).toString()+(col+knightArr[i][1]).toString());
				} else if(inbounds(row+knightArr[i][0],col+knightArr[i][1]) && gameBoardArr[row+knightArr[i][0]][col+knightArr[i][1]] && !sameColor(gameBoardArr,row+knightArr[i][0],col+knightArr[i][1],obj.color)){
					obj.targetsArr.push((row+knightArr[i][0]).toString()+(col+knightArr[i][1]).toString());
				}
			}
		}

	}

	function makeTargets(gameBoardArr, row, col){
		obj = gameBoardArr[row][col];
		obj.targetsArr = [];
		if(obj.type === 'pawn'){
			pawnMoveTargets(gameBoardArr, row, col);
			pawnAttackTargets(gameBoardArr, row, col);
		} else if(obj.type === 'rook'){
			horizontalTargets(gameBoardArr, row, col, 8);
			verticalTargets(gameBoardArr, row, col, 8);
		} else if(obj.type === 'knight'){
			knightTargets(gameBoardArr, row, col);
		} else if(obj.type === 'bishop'){
			diagonalDownTargets(gameBoardArr, row, col, 8);
			diagonalUpTargets(gameBoardArr, row, col, 8);
		} else if(obj.type === 'queen'){
			horizontalTargets(gameBoardArr, row, col, 8);
			verticalTargets(gameBoardArr, row, col, 8);
			diagonalDownTargets(gameBoardArr, row, col, 8);
			diagonalUpTargets(gameBoardArr, row, col, 8);
		} else if(obj.type === 'king'){
			horizontalTargets(gameBoardArr, row, col, 2);
			verticalTargets(gameBoardArr, row, col, 2);
			diagonalDownTargets(gameBoardArr, row, col, 2);
			diagonalUpTargets(gameBoardArr, row, col, 2);
		}
	}

	function makeBoardTargets(gameBoardArr){
		global.threatenedByWhiteArr = [];
		global.threatenedByBlackArr = [];
		for(var i = 0; i < gameBoardArr.length; i++){
			for(var j = 0; j < gameBoardArr[i].length; j++){
				if(gameBoardArr[i][j]){
					makeTargets(gameBoardArr,i,j);
				}
			}
		}
	}

	function unhighlight(){
		$('.square').removeClass('highlight-yellow');
		$('.square').removeClass('highlight-red');
	}

	function highlightYellow(id){
		$('#'+id).addClass('highlight-yellow');
	}

	function highlightTargets(arr){
		for (var i = 0; i < arr.length; i++){
			highlightYellow(arr[i]);
		}
	}


});