$(document).ready(function(){
	var global = {
		whiteMoveFlag: true,
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

	global.gameBoardArr = makeGameBoard(global.gameBoardArr, 8, 8);
	global.gameBoardArr = initializePieces(global.gameBoardArr, 8, 8);
	console.log(global.gameBoardArr);


//======================================FUNCTIONS=============================================
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
						row.push({'position': i.toString()+j.toString()});
						flag = false;
					} else{
						$("#gameBoard").append('<div class="whiteSquare"></div>');
						row.push({'position': i.toString()+j.toString()});
						flag = true;
					}

					$("#gameBoard div:last-child").attr("id",i.toString()+j.toString());
				}
			gameBoardArr.push(row);
			}
			return gameBoardArr;
	}

	function initializePieces(gameBoardArr, height, width){
		console.log("initializePieces");
		for(var i = 0; i < height; i++){
			for(var j = 0; j < width; j++){
				if(i === 1){
					gameBoardArr[i][j].piece = makePiece('black','pawn');
					var piece = gameBoardArr[i][j].piece;
					putPieceInSquare(piece,i,j);
				} else if(i === 6){
					gameBoardArr[i][j].piece = makePiece('white','pawn');
					var piece = gameBoardArr[i][j].piece;
					putPieceInSquare(piece,i,j);
				} else if(i === 0){
					gameBoardArr[i][j].piece = makeRoyal(gameBoardArr, 'black', j);
					var piece = gameBoardArr[i][j].piece;
					putPieceInSquare(piece,i,j);
				} else if(i === 7){
					gameBoardArr[i][j].piece = makeRoyal(gameBoardArr, 'white', j);
					var piece = gameBoardArr[i][j].piece;
					putPieceInSquare(piece,i,j);
				}
				
			}
		}
		return gameBoardArr;
	}

	function makePiece(color, type){
		console.log("makePiece");
		var piece = {
			'color': color,
			'type': type,
			'image': '<img src="./Assets/'+color+capitalize(type)+'.png">',
			'targetSquares': [],
			// 'image': imagePaths.blackKnight
		}
		return piece
	}

	function capitalize(str){
		str = str.substring(0,1).toUpperCase() + str.substring(1);
		return str;
	}

	function putPieceInSquare(piece,row,col){
		$("#"+row.toString()+col.toString()).append(piece.image);
	}

	function emptySquare(row,col){
		$("#"+row.toString()+col.toString()).text('');
	}

	function makeRoyal(gameBoardArr, color, col){
		var piece
		if(col === 0 || col === 7){
			piece = makePiece(color, 'rook');
		} else if(col === 1 || col === 6){
			piece = makePiece(color, 'knight');
		} else if(col === 2 || col === 5){
			piece = makePiece(color, 'bishop');
		}else if(col === 3){
			piece = makePiece(color, 'queen');
		}else{
			piece = makePiece(color, 'king');
		}
		return piece;
	}

	});