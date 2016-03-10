$(document).ready(function(){
	var global = {
		whiteMoveFlag: true,
		selectedPiece: 'none',
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

//===================================CLICK LISTENERS=========================================
	$(".square").on('click', function(){
		var position = this.id;
		var row = position[0];
		var col = position[1];
		var piece = global.gameBoardArr[row][col].piece;
		console.log(piece);
		if(piece === 'none' && (!$(this).hasClass("highlight-yellow") && !$(this).hasClass("highlight-red"))){
			unhighlight();
			global.selectedPiece = 'none';
		} else if (piece !== 'none' && !$(this).hasClass("highlight-red")) {
			unhighlight();
			highlightYellow(row,col);
			highlightMoves(piece, global.gameBoardArr);
			global.selectedPiece = piece;
		} else if ($(this).hasClass("highlight-red")){
			unhighlight();
			capturePiece(piece, global.gameBoardArr);
			movePiece(row, col, global.selectedPiece, global.gameBoardArr);
			global.selectedPiece = 'none';
		} else if ($(this).hasClass("highlight-yellow")){
			unhighlight();
			movePiece(row, col, global.selectedPiece, global.gameBoardArr);
			global.selectedPiece = 'none';
		}
	});


//======================================FUNCTIONS=============================================
	function capitalize(str){
		str = str.substring(0,1).toUpperCase() + str.substring(1);
		return str;
	}

	function capturePiece(piece, gameBoardArr){
		row = piece.position[0];
		col = piece.position[1];
		if (piece.color === 'black'){
			$("#black-prison").append('<li>' + piece.image + '</li>');
		} else {
			$("#white-prison").append('<li>' + piece.image + '</li>');
		}
		emptySquare(row,col,gameBoardArr);
	}

	function clone(object) {
        function F() {}
        F.prototype = object;
        return new F();
    }

	function emptySquare(row, col, gameBoardArr){
		$("#"+row.toString()+col.toString()).text('');
		gameBoardArr[row][col].piece = 'none';
	}

	function fillThreatenedArrays(threatenedByWhiteArr, threatenedByBlackArr, gameBoardArr){
		for(var i = 0; i < gameBoardArr.length; i++){
			for(var j = 0; j < gameBoardArr[i].length; j++){
				
			}
		}
	}

	function highlightMoves(piece, gameBoardArr){
		if (piece.type === 'pawn'){
			highlightMovesPawn(piece, gameBoardArr);
		} else if(piece.type === 'rook'){
			highlightMovesRook(piece, gameBoardArr);
		} else if(piece.type === 'knight'){
			highlightMovesKnight(piece, gameBoardArr);
		} else if(piece.type === 'bishop'){
			highlightMovesBishop(piece, gameBoardArr);
		} else if(piece.type === 'queen'){
			highlightMovesQueen(piece, gameBoardArr);
		} else if(piece.type === 'king'){
			highlightMovesKing(piece, gameBoardArr);
		}	
	}

	function highlightMovesBishop(piece, gameBoardArr){
		var row = +piece.position[0];
		var col = +piece.position[1];
		for (var i = 1; i < 8; i++){
			if(inbounds(row+i,col+i) && isEmpty(row+i,col+i,gameBoardArr)){
				highlightYellow(row+i,col+i);
			}
			else if(inbounds(row+i,col+i) && !isEmpty(row+i,col+i,gameBoardArr) && !sameColor(piece,row+i,col+i,gameBoardArr)){
				highlightRed(row+i,col+i);
				break;
			}
			else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row+i,col-i) && isEmpty(row+i,col-i,gameBoardArr)){
				highlightYellow(row+i,col-i);
			}
			else if(inbounds(row+i,col-i) && !isEmpty(row+i,col-i,gameBoardArr) && !sameColor(piece,row+i,col-i,gameBoardArr)){
				highlightRed(row+i,col-i);
				break;
			}
			else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row-i,col+i) && isEmpty(row-i,col+i,gameBoardArr)){
				highlightYellow(row-i,col+i);
			}
			else if(inbounds(row-i,col+i) && !isEmpty(row-i,col+i,gameBoardArr) && !sameColor(piece,row-i,col+i,gameBoardArr)){
				highlightRed(row-i,col+i);
				break;
			}
			else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row-i,col-i) && isEmpty(row-i,col-i,gameBoardArr)){
				highlightYellow(row-i,col-i);
			}
			else if(inbounds(row-i,col-i) && !isEmpty(row-i,col-i,gameBoardArr) && !sameColor(piece,row-i,col-i,gameBoardArr)){
				highlightRed(row-i,col-i);
				break;
			}
			else{
				break;
			}
		}
	}

	function highlightMovesKing(piece, gameBoardArr){
		var row = +piece.position[0];
		var col = +piece.position[1];
		if(inbounds(row+1,col) && isEmpty(row+1,col,gameBoardArr)){
			highlightYellow(row+1,col);
		} else if(inbounds(row+1,col) && !isEmpty(row+1,col,gameBoardArr) && !sameColor(piece,row+1,col,gameBoardArr)){
			highlightRed(row+1,col);
		}
		if(inbounds(row-1,col) && isEmpty(row-1,col,gameBoardArr)){
			highlightYellow(row-1,col);
		} else if(inbounds(row-1,col) && !isEmpty(row-1,col,gameBoardArr) && !sameColor(piece,row-1,col,gameBoardArr)){
			highlightRed(row-1,col);
		}
		if(inbounds(row,col+1) && isEmpty(row,col+1,gameBoardArr)){
			highlightYellow(row,col+1);
		} else if(inbounds(row,col+1) && !isEmpty(row,col+1,gameBoardArr) && !sameColor(piece,row,col+1,gameBoardArr)){
			highlightRed(row,col+1);
		}
		if(inbounds(row,col-1) && isEmpty(row,col-1,gameBoardArr)){
			highlightYellow(row,col-1);
		} else if(inbounds(row,col-1) && !isEmpty(row,col-1,gameBoardArr) && !sameColor(piece,row,col-1,gameBoardArr)){
			highlightRed(row,col-1);
		}
		if(inbounds(row+1,col+1) && isEmpty(row+1,col+1,gameBoardArr)){
			highlightYellow(row+1,col+1);
		} else if(inbounds(row+1,col+1) && !isEmpty(row+1,col+1,gameBoardArr) && !sameColor(piece,row+1,col+1,gameBoardArr)){
			highlightRed(row+1,col+1);
		}
		if(inbounds(row+1,col-1) && isEmpty(row+1,col-1,gameBoardArr)){
			highlightYellow(row+1,col-1);
		} else if(inbounds(row+1,col-1) && !isEmpty(row+1,col-1,gameBoardArr) && !sameColor(piece,row+1,col-1,gameBoardArr)){
			highlightRed(row+1,col-1);
		}
		if(inbounds(row-1,col+1) && isEmpty(row-1,col+1,gameBoardArr)){
			highlightYellow(row-1,col+1);
		} else if(inbounds(row-1,col+1) && !isEmpty(row-1,col+1,gameBoardArr) && !sameColor(piece,row-1,col+1,gameBoardArr)){
			highlightRed(row-1,col+1);
		}
		if(inbounds(row-1,col-1) && isEmpty(row-1,col-1,gameBoardArr)){
			highlightYellow(row-1,col-1);
		} else if(inbounds(row-1,col-1) && !isEmpty(row-1,col-1,gameBoardArr) && !sameColor(piece,row-1,col-1,gameBoardArr)){
			highlightRed(row-1,col-1);
		}
	}

	function highlightMovesKnight(piece, gameBoardArr){
		var row = +piece.position[0];
		var col = +piece.position[1];
		if(inbounds(row-2,col-1) && isEmpty(row-2,col-1,gameBoardArr)){
			highlightYellow(row-2,col-1);
		} else if (inbounds(row-2,col-1) && !isEmpty(row-2,col-1,gameBoardArr) && !sameColor(piece,row-2,col-1,gameBoardArr)){
			highlightRed(row-2,col-1);
		}

		if(inbounds(row-2,col+1) && isEmpty(row-2,col+1,gameBoardArr)){
			highlightYellow(row-2,col+1);
		} else if (inbounds(row-2,col+1) && !isEmpty(row-2,col+1,gameBoardArr) && !sameColor(piece,row-2,col+1,gameBoardArr)){
			highlightRed(row-2,col+1);
		}
		if(inbounds(row-1,col+2) && isEmpty(row-1,col+2,gameBoardArr)){
			highlightYellow(row-1,col+2);
		} else if (inbounds(row-1,col+2) && !isEmpty(row-1,col+2,gameBoardArr) && !sameColor(piece,row-1,col+2,gameBoardArr)){
			highlightRed(row-1,col+2);
		}
		if(inbounds(row+1,col+2) && isEmpty(row+1,col+2,gameBoardArr)){
			highlightYellow(row+1,col+2);
		} else if (inbounds(row+1,col+2) && !isEmpty(row+1,col+2,gameBoardArr) && !sameColor(piece,row+1,col+2,gameBoardArr)){
			highlightRed(row+1,col+2);
		}
		if(inbounds(row+2,col+1) && isEmpty(row+2,col+1,gameBoardArr)){
			highlightYellow(row+2,col+1);
		} else if (inbounds(row+2,col+1) && !isEmpty(row+2,col+1,gameBoardArr) && !sameColor(piece,row+2,col+1,gameBoardArr)){
			highlightRed(row+2,col+1);
		}
		if(inbounds(row+2,col-1) && isEmpty(row+2,col-1,gameBoardArr)){
			highlightYellow(row+2,col-1);
		} else if (inbounds(row+2,col-1) && !isEmpty(row+2,col-1,gameBoardArr) && !sameColor(piece,row+2,col-1,gameBoardArr)){
			highlightRed(row+2,col-1);
		}
		if(inbounds(row+1,col-2) && isEmpty(row+1,col-2,gameBoardArr)){
			highlightYellow(row+1,col-2);
		} else if (inbounds(row+1,col-2) && !isEmpty(row+1,col-2,gameBoardArr) && !sameColor(piece,row+1,col-2,gameBoardArr)){
			highlightRed(row+1,col-2);
		}
		if(inbounds(row-1,col-2) && isEmpty(row-1,col-2,gameBoardArr)){
			highlightYellow(row-1,col-2);
		} else if (inbounds(row-1,col-2) && !isEmpty(row-1,col-2,gameBoardArr) && !sameColor(piece,row-1,col-2,gameBoardArr)){
			highlightRed(row-1,col-2);
		}
	}

	function highlightMovesPawn(piece, gameBoardArr){
		var row = +piece.position[0];
		var col = +piece.position[1];
		if (inbounds(row+1,col) && piece.color === 'black' && isEmpty(row+1,col,gameBoardArr)){
			highlightYellow(row+1,col);
			if (piece.initialPos && isEmpty(row+2, col,gameBoardArr)){
				highlightYellow(row+2,col);
			}
			
		} 
		if(inbounds(row+1,col+1) && piece.color === 'black' && !isEmpty(row+1,col+1,gameBoardArr) && !sameColor(piece,row+1,col+1,gameBoardArr)) {
			highlightRed(row+1,col+1);
		} 
		if(inbounds(row+1,col-1) && piece.color === 'black' && !isEmpty(row+1,col-1,gameBoardArr) && !sameColor(piece,row+1,col-1,gameBoardArr)){
			highlightRed(row+1,col-1);
		} 
		if (inbounds(row-1,col) && piece.color === 'white' && isEmpty(row-1,col,gameBoardArr)){
			highlightYellow(row-1,col);
			if (piece.initialPos && isEmpty(row-2, col,gameBoardArr)){
				highlightYellow(row-2,col);
			}
		} 
		if(inbounds(row-1,col+1) && piece.color === 'white' && !isEmpty(row-1,col+1,gameBoardArr) && !sameColor(piece,row-1,col+1,gameBoardArr)){
			highlightRed(row-1,col+1);
		} 
		if(inbounds(row-1,col-1) && piece.color === 'white' && !isEmpty(row-1,col-1,gameBoardArr) && !sameColor(piece,row-1,col-1,gameBoardArr)){
			highlightRed(row-1,col-1);
		}
	}

	function highlightMovesQueen(piece, gameBoardArr){
		var row = +piece.position[0];
		var col = +piece.position[1];
		for (var i = 1; i < 8; i++){
			if(inbounds(row+i,col) && isEmpty(row+i,col,gameBoardArr)){
				highlightYellow(row+i,col); 
			} else if (inbounds(row+i,col) && !isEmpty(row+i,col,gameBoardArr) && !sameColor(piece,row+i,col,gameBoardArr)){
				highlightRed(row+i,col);
				break;
			} else{
				break;
			}
		}

		for (var i = 1; i < 8; i++){
			if(inbounds(row-i,col) && isEmpty(row-i,col,gameBoardArr)){
				highlightYellow(row-i,col); 
			} else if (inbounds(row-i,col) && !isEmpty(row-i,col,gameBoardArr) && !sameColor(piece,row-i,col,gameBoardArr)){
				highlightRed(row-i,col);
				break;
			} else{
				break;
			}
		}

		for (var i = 1; i < 8; i++){
			if(inbounds(row,col+i) && isEmpty(row,col+i,gameBoardArr)){
				highlightYellow(row,col+i); 
			} else if (inbounds(row,col+i) && !isEmpty(row,col+i,gameBoardArr) && !sameColor(piece,row,col+i,gameBoardArr)){
				highlightRed(row,col+i);
				break;
			} else{
				break;
			}
		}

		for (var i = 1; i < 8; i++){
			if(inbounds(row,col-i) && isEmpty(row,col-i,gameBoardArr)){
				highlightYellow(row,col-i);
			} else if (inbounds(row,col-i) && !isEmpty(row,col-i,gameBoardArr) && !sameColor(piece,row,col-i,gameBoardArr)){
				highlightRed(row,col-i);
				break;
			} else{
				break;
			}
		}

		for (var i = 1; i < 8; i++){
			if(inbounds(row+i,col+i) && isEmpty(row+i,col+i,gameBoardArr)){
				highlightYellow(row+i,col+i);
			} else if (inbounds(row+i,col+i) && !isEmpty(row+i,col+i,gameBoardArr) && !sameColor(piece,row+i,col+i,gameBoardArr)){
				highlightRed(row+i,col+i);
				break;
			} else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row+i,col-i) && isEmpty(row+i,col-i,gameBoardArr)){
				highlightYellow(row+i,col-i);
			} else if (inbounds(row+i,col-i) && !isEmpty(row+i,col-i,gameBoardArr) && !sameColor(piece,row+i,col-i,gameBoardArr)){
				highlightRed(row+i,col-i);
				break;
			} else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row-i,col+i) && isEmpty(row-i,col+i,gameBoardArr)){
				highlightYellow(row-i,col+i);
			} else if (inbounds(row-i,col+i) && !isEmpty(row-i,col+i,gameBoardArr) && !sameColor(piece,row-i,col+i,gameBoardArr)){
				highlightRed(row-i,col+i);
				break;
			} else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row-i,col-i) && isEmpty(row-i,col-i,gameBoardArr)){
				highlightYellow(row-i,col-i);
			} else if (inbounds(row-i,col-i) && !isEmpty(row-i,col-i,gameBoardArr) && !sameColor(piece,row-i,col-i,gameBoardArr)){
				highlightRed(row-i,col-i);
				break;
			} else{
				break;
			}
		}
	}

	function highlightMovesRook(piece, gameBoardArr){
		var row = +piece.position[0];
		var col = +piece.position[1];
		for (var i = 1; i < 8; i++){
			if(inbounds(row+i,col) && isEmpty(row+i,col,gameBoardArr)){
				highlightYellow(row+i,col);
			} else if (inbounds(row+i,col) && !isEmpty(row+i,col,gameBoardArr) && !sameColor(piece,row+i,col,gameBoardArr)){
				highlightRed(row+i,col); 
				break;
			}
			else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row-i,col) && isEmpty(row-i,col,gameBoardArr)){
				highlightYellow(row-i,col);
			} else if (inbounds(row-i,col) && !isEmpty(row-i,col,gameBoardArr) && !sameColor(piece,row-i,col,gameBoardArr)){
				highlightRed(row-i,col); 
				break;
			}
			else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row,col+i) && isEmpty(row,col+i,gameBoardArr)){
				highlightYellow(row,col+i);
			} else if (inbounds(row,col+i) && !isEmpty(row,col+i,gameBoardArr) && !sameColor(piece,row,col+i,gameBoardArr)){
				highlightRed(row,col+i); 
				break;
			}
			else{
				break;
			}
		}
		for (var i = 1; i < 8; i++){
			if(inbounds(row,col-i) && isEmpty(row,col-i,gameBoardArr)){
				highlightYellow(row,col-i);
			} else if (inbounds(row,col-i) && !isEmpty(row,col-i,gameBoardArr) && !sameColor(piece,row,col-i,gameBoardArr)){
				highlightRed(row,col-i); 
				break;
			}
			else{
				break;
			}
		}
	}

	function highlightRed(row,col){
		$('#'+row.toString()+col.toString()).addClass('highlight-red');
	}

	function highlightYellow(row,col){
		$('#'+row.toString()+col.toString()).addClass('highlight-yellow');
	}

	function inbounds(row, col){
		if (row <= 7 && row >= 0 && col <= 7 && col >= 0){
			return true;
		} else {
			return false;
		}
	}

	function initializePiece(gameBoardArr, row, col){
		if(row === 1){
			gameBoardArr[row][col].piece = makePiece('black','pawn');
			var piece = gameBoardArr[row][col].piece;
			putPieceInSquare(piece,row,col,gameBoardArr);
		} else if(row === 6){
			gameBoardArr[row][col].piece = makePiece('white','pawn');
			var piece = gameBoardArr[row][col].piece;
			putPieceInSquare(piece,row,col,gameBoardArr);
		} else if(row === 0){
			gameBoardArr[row][col].piece = makeRoyal(gameBoardArr, 'black', col);
			var piece = gameBoardArr[row][col].piece;
			putPieceInSquare(piece,row,col,gameBoardArr);
		} else if(row === 7){
			gameBoardArr[row][col].piece = makeRoyal(gameBoardArr, 'white', col);
			var piece = gameBoardArr[row][col].piece;
			putPieceInSquare(piece,row,col,gameBoardArr);
		}
	}

	function initializePieces(gameBoardArr, height, width){
		for(var i = 0; i < height; i++){
			for(var j = 0; j < width; j++){
				initializePiece(gameBoardArr, i, j);
			}
		}
		return gameBoardArr;
	}

	function isEmpty(row, col, gameBoardArr){
		if (gameBoardArr[row][col].piece === 'none'){
			return true;
		} else {
			return false;
		}
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
						row.push({'position': i.toString()+j.toString(), 'piece': 'none'});
						flag = false;
					} else{
						$("#gameBoard").append('<div class="square whiteSquare"></div>');
						row.push({'position': i.toString()+j.toString(), 'piece': 'none'});
						flag = true;
					}

					$("#gameBoard div:last-child").attr("id",i.toString()+j.toString());
				}
			gameBoardArr.push(row);
			}
			return gameBoardArr;
	}

	function makePiece(color, type, row, col){
		var piece = {
			'color': color,
			'type': type,
			'image': '<img src="./Assets/'+color+capitalize(type)+'.png">',
			'targetSquares': [],
			'movesArr': [],
			'initialPos': true,
		}
		return piece
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

	function movePiece(newRow, newCol, piece, gameBoardArr){
		pos = piece.position;
		row = +pos[0];
		col = +pos[1];
		putPieceInSquare(piece,newRow,newCol,gameBoardArr);
		emptySquare(row,col,gameBoardArr);
		piece.initialPos = false;
	}

	function putPieceInSquare(piece,row,col,gameBoardArr){
		$("#"+row.toString()+col.toString()).append(piece.image);
		piece.position = row.toString()+col.toString();
		gameBoardArr[row][col].piece = piece;
	}

	function sameColor(piece, row, col, gameBoardArr){
		var targetPiece = gameBoardArr[row][col].piece;
		if(piece.color === targetPiece.color){
			return true;
		} else {
			return false;
		}
	}

	function unhighlight(){
		$('.square').removeClass('highlight-yellow');
		$('.square').removeClass('highlight-red');
	}

		
});

//every time I move a piece, look at all the pieces on the board, run their highlightmoves functions, and append those squares to the threatenedsquares array, have a separte array fro each color. each space should tell me what squares are threatening it