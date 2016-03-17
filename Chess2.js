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
		// putPieceInSquare(this,newRow,newCol,gameBoardArr);
		// emptySquare(row,col,gameBoardArr);
		this.initialPosition = false;
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

	makeGameBoard(global.gameBoardArr, 8, 8);

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

	placePieces(global.gameBoardArr);

	function makeMoves(obj){
		obj.targetsArr = [1,2,3];
	}

	function makeBoardMoves(gameBoardArr){
		for(var i = 0; i < gameBoardArr.length; i++){
			for(var j = 0; j < gameBoardArr[i].length; j++){
				if(gameBoardArr[i][j]){
					makeMoves(gameBoardArr[i][j]);
				}
			}
		}
	}

	makeBoardMoves(global.gameBoardArr);

	$(".square").on('click', function(){
		var position = this.id;
		var row = +position[0];
		var col = +position[1];
		
	});

	console.log(global.gameBoardArr);

});