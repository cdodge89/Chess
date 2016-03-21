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

	function Piece (id, color, type, image, position){
		this.id = id;
		this.color = color;
		this.type = type;
		this.image = image;
		this.position = position;
		this.targetsArr = [];
		this.initialPosition = true;
		this.move = function (newRow, newCol, gameBoardArr){
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
		this.addToThreatenedArrays = function (id, threatenedByWhiteArr, threatenedByBlackArr){
		if (this.color === 'black'){
			threatenedByBlackArr.push(id);
		} else if (this.color === 'white'){
			threatenedByWhiteArr.push(id);
		}
	}
	}

	function Pawn (id, color, type, image, position){
		Piece.call(this, id, color, type, image, position);
	}

	function Rook (id, color, type, image, position){
		Piece.call(this, id, color, type, image, position);
	}

	function Knight (id, color, type, image, position){
		Piece.call(this, id, color, type, image, position);
	}

	function Bishop (id, color, type, image, position){
		Piece.call(this, id, color, type, image, position);
	}

	function Queen (id, color, type, image, position){
		Piece.call(this, id, color, type, image, position);
	}

	function King (id, color, type, image, position){
		Piece.call(this, id, color, type, image, position);
	}

	Object.create = function (object) {
        function Prot() {}
        Prot.prototype = object;
        return new Prot();
    } 

	Pawn.prototype.getTargets = pawnTargetsWrapper(global.gameBoardArr, global.threatenedByWhiteArr, global.threatenedByBlackArr);
	Rook.prototype.getTargets = straightTargetsWrapper(global.gameBoardArr, global.threatenedByWhiteArr, global.threatenedByBlackArr, 8);
	Knight.prototype.getTargets = knightTargetsWrapper(global.gameBoardArr, global.threatenedByWhiteArr, global.threatenedByBlackArr);
	Bishop.prototype.getTargets = diagonalTargetsWrapper(global.gameBoardArr, global.threatenedByWhiteArr, global.threatenedByBlackArr, 8);
	Queen.prototype.getTargets = queenTargetsWrapper(global.gameBoardArr, global.threatenedByWhiteArr, global.threatenedByBlackArr, 8);
	King.prototype.getTargets = queenTargetsWrapper(global.gameBoardArr, global.threatenedByWhiteArr, global.threatenedByBlackArr, 2);

	makeGameBoard(global.gameBoardArr, 8, 8);

	placePieces(global.gameBoardArr);

	makeBoardTargets(global.gameBoardArr, global.threatenedByWhiteArr, global.threatenedByBlackArr);

	$(".square").on('click', function(){
		var position = this.id;
		var row = +position[0];
		var col = +position[1];
		var obj = global.gameBoardArr[row][col];
		if(global.gameBoardArr[row][col] && !$(this).hasClass('highlight-yellow') && (global.whiteMoveFlag && obj.color === 'white' || !global.whiteMoveFlag && obj.color === 'black')){
			unhighlight();
			global.selectedPiece = global.gameBoardArr[row][col];
			highlightTargets(global.gameBoardArr[row][col].targetsArr);
		} else if($(this).hasClass('highlight-yellow')){
			unhighlight();
			if(global.gameBoardArr[row][col]){
				capturePiece(global.gameBoardArr[row][col], global.gameBoardArr);
			}
			global.selectedPiece.move(row,col,global.gameBoardArr);
			if(global.whiteMoveFlag){
				global.whiteMoveFlag = false;
			} else {
				global.whiteMoveFlag = true;
			}
		}
		makeBoardTargets(global.gameBoardArr, global.threatenedByWhiteArr, global.threatenedByBlackArr);
		// console.log('white ', global.threatenedByWhiteArr);
		// console.log('black ', global.threatenedByBlackArr);
	});

	console.log(global.gameBoardArr);
	// highlightTargets(global.threatenedByWhiteArr);
	// highlightTargets(global.threatenedByBlackArr);
	console.log(global.threatenedByBlackArr);
	console.log(global.threatenedByWhiteArr);


//=================================FUNCTIONS==============================
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
		$("#"+row.toString()+col.toString()).text('');
		gameBoardArr[row][col] = undefined;
	}

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

	function placeRoyal(gameBoardArr, row, col, color){
		if (col === 0 || col === 7){
			gameBoardArr[row][col] = new Rook(capitalize(color)+'Rook'+col, color, 'rook', '<img src="./Assets/'+color+'Rook.png">',row.toString()+col.toString());
			placeImage(gameBoardArr[row][col].image, row, col);
		} else if (col === 1 || col === 6){
			gameBoardArr[row][col] = new Knight(capitalize(color)+'Knight'+col, color, 'knight', '<img src="./Assets/'+color+'Knight.png">',row.toString()+col.toString());
			placeImage(gameBoardArr[row][col].image, row, col);
		} else if (col === 2 || col === 5){
			gameBoardArr[row][col] = new Bishop(capitalize(color)+'Bishop'+col, color, 'bishop', '<img src="./Assets/'+color+'Bishop.png">',row.toString()+col.toString());
			placeImage(gameBoardArr[row][col].image, row, col);
		} else if (col === 3){
			gameBoardArr[row][col] = new Queen(capitalize(color)+'Queen'+col, color, 'queen', '<img src="./Assets/'+color+'Queen.png">',row.toString()+col.toString());
			placeImage(gameBoardArr[row][col].image, row, col);
		} else if (col === 4){
			gameBoardArr[row][col] = new King(capitalize(color)+'King'+col, color, 'king', '<img src="./Assets/'+color+'King.png">',row.toString()+col.toString());
			placeImage(gameBoardArr[row][col].image, row, col);
		}
	}

	function placePiece(gameBoardArr, row, col){
		if(row == 1){
			gameBoardArr[row][col] = new Pawn('BlackPawn'+col, 'black', 'pawn', '<img src="./Assets/blackPawn.png">',row.toString()+col.toString());
			placeImage(gameBoardArr[row][col].image, row, col);
		} else if (row == 6){
			gameBoardArr[row][col] = new Pawn('WhitePawn'+col, 'white', 'pawn', '<img src="./Assets/whitePawn.png">',row.toString()+col.toString());
			placeImage(gameBoardArr[row][col].image, row, col);
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

	function straightTargetsWrapper(gameBoardArr, threatenedByWhiteArr, threatenedByBlackArr, dist){
		return function(row, col){
			obj = this;
			for (var i = 1; i < dist; i++){
				if (inbounds(row, col+i) && !gameBoardArr[row][col+i]){
					obj.targetsArr.push(row.toString()+(col+i).toString());
					obj.addToThreatenedArrays(row.toString()+(col+i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
				} else if(inbounds(row, col+i) && gameBoardArr[row][col+i]){
					obj.addToThreatenedArrays(row.toString()+(col+i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(!sameColor(gameBoardArr,row,col+i,obj.color)){
						obj.targetsArr.push(row.toString()+(col+i).toString());
					}
					break;
				}
			}
			for (var i = 1; i < dist; i++){
				if (inbounds(row, col-i) && !gameBoardArr[row][col-i]){
					obj.targetsArr.push(row.toString()+(col-i).toString());
					obj.addToThreatenedArrays(row.toString()+(col-i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
				} else if(inbounds(row, col-i) && gameBoardArr[row][col-i]){
					obj.addToThreatenedArrays(row.toString()+(col-i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(!sameColor(gameBoardArr,row,col-i,obj.color)){
						obj.targetsArr.push(row.toString()+(col-i).toString());
					}
					break;
				}
			}
			for (var i = 1; i < dist; i++){
				if (inbounds(row+i, col) && !gameBoardArr[row+i][col]){
					obj.targetsArr.push((row+i).toString()+col.toString());
					obj.addToThreatenedArrays((row+i).toString()+col.toString(), threatenedByWhiteArr, threatenedByBlackArr);
				} else if(inbounds(row+i, col) && gameBoardArr[row+i][col]){
					obj.addToThreatenedArrays((row+i).toString()+col.toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(!sameColor(gameBoardArr,row+i,col,obj.color)){
						obj.targetsArr.push((row+i).toString()+col.toString());
					}
					break;
				}
			}
			for (var i = 1; i < dist; i++){
				if (inbounds(row-i, col) && !gameBoardArr[row-i][col]){
					obj.targetsArr.push((row-i).toString()+col.toString());
					obj.addToThreatenedArrays((row-i).toString()+col.toString(), threatenedByWhiteArr, threatenedByBlackArr);
				} else if(inbounds(row-i, col) && gameBoardArr[row-i][col]){
					obj.addToThreatenedArrays((row-i).toString()+col.toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(!sameColor(gameBoardArr,row-i,col,obj.color)){
						obj.targetsArr.push((row-i).toString()+col.toString());
					}
					break;
				}
			}
		}
	}

	function diagonalTargetsWrapper(gameBoardArr, threatenedByWhiteArr, threatenedByBlackArr, dist){
		return function(row, col){
			obj = this;
			for(var i = 1; i < dist; i++){
				if (inbounds(row-i, col-i) && !gameBoardArr[row-i][col-i]){
					obj.targetsArr.push((row-i).toString()+(col-i).toString());
					obj.addToThreatenedArrays((row-i).toString()+(col-i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
				} else if(inbounds(row-i, col-i) && gameBoardArr[row-i][col-i]){
					obj.addToThreatenedArrays((row-i).toString()+(col-i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(!sameColor(gameBoardArr,row-i,col-i,obj.color)){
						obj.targetsArr.push((row-i).toString()+(col-i).toString());
					}
					break;
				}
			}
			for(var i = 1; i < dist; i++){
				if (inbounds(row-i, col+i) && !gameBoardArr[row-i][col+i]){
					obj.targetsArr.push((row-i).toString()+(col+i).toString());
					obj.addToThreatenedArrays((row-i).toString()+(col+i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
				} else if(inbounds(row-i, col+i) && gameBoardArr[row-i][col+i]){
					obj.addToThreatenedArrays((row-i).toString()+(col+i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(!sameColor(gameBoardArr,row-i,col+i,obj.color)){
						obj.targetsArr.push((row-i).toString()+(col+i).toString());
					}
					break;
				}
			}
			for(var i = 1; i < dist; i++){
				if (inbounds(row+i, col-i) && !gameBoardArr[row+i][col-i]){
					obj.targetsArr.push((row+i).toString()+(col-i).toString());
					obj.addToThreatenedArrays((row+i).toString()+(col-i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
				} else if(inbounds(row+i, col-i) && gameBoardArr[row+i][col-i]){
					obj.addToThreatenedArrays((row+i).toString()+(col-i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(!sameColor(gameBoardArr,row+i,col-i,obj.color)){
						obj.targetsArr.push((row+i).toString()+(col-i).toString());
					}
					break;
				}
			}
			for(var i = 1; i < dist; i++){
				if (inbounds(row+i, col+i) && !gameBoardArr[row+i][col+i]){
					obj.targetsArr.push((row+i).toString()+(col+i).toString());
					obj.addToThreatenedArrays((row+i).toString()+(col+i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
				} else if(inbounds(row+i, col+i) && gameBoardArr[row+i][col+i]){
					obj.addToThreatenedArrays((row+i).toString()+(col+i).toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(!sameColor(gameBoardArr,row+i,col+i,obj.color)){
						obj.targetsArr.push((row+i).toString()+(col+i).toString());
					}
					break;
				}
			}
		}
	}

	function pawnTargetsWrapper(gameBoardArr, threatenedByWhiteArr, threatenedByBlackArr){
		return function(row, col){
			obj = this;
			if(obj.color === 'black'){
				if(inbounds(row+1,col-1)){
					obj.addToThreatenedArrays((row+1).toString()+(col-1).toString(), threatenedByWhiteArr, threatenedByBlackArr);	
				}
				if( inbounds(row+1, col+1)){
					obj.addToThreatenedArrays((row+1).toString()+(col+1).toString(), threatenedByWhiteArr, threatenedByBlackArr);	
				}
				if(inbounds(row+1,col+1) && gameBoardArr[row+1][col+1] && !sameColor(gameBoardArr,row+1,col+1,obj.color)){
					obj.targetsArr.push((row+1).toString()+(col+1).toString());
				}
				if(inbounds(row+1,col-1) && gameBoardArr[row+1][col-1] && !sameColor(gameBoardArr,row+1,col-1,obj.color)){
					obj.targetsArr.push((row+1).toString()+(col-1).toString());
				}
			} else if(obj.color === 'white'){
				if(inbounds(row-1,col-1)){
					obj.addToThreatenedArrays((row-1).toString()+(col-1).toString(), threatenedByWhiteArr, threatenedByBlackArr);	
				}
				if( inbounds(row-1, col+1)){
					obj.addToThreatenedArrays((row-1).toString()+(col+1).toString(), threatenedByWhiteArr, threatenedByBlackArr);	
				}
				if(inbounds(row-1,col+1) && gameBoardArr[row-1][col+1] && !sameColor(gameBoardArr,row-1,col+1,obj.color)){
					obj.targetsArr.push((row-1).toString()+(col+1).toString());
				}
				if(inbounds(row-1,col-1) && gameBoardArr[row-1][col-1] && !sameColor(gameBoardArr,row-1,col-1,obj.color)){
					obj.targetsArr.push((row-1).toString()+(col-1).toString());
				}
			}
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
	}

	function knightTargetsWrapper(gameBoardArr, threatenedByWhiteArr, threatenedByBlackArr){
		return function(row, col){
			obj = this;
			var knightArr = [[-2,-1],[-2,1],[-1,2],[1,2],[2,1],[2,-1],[-1,-2],[1,-2]];
			for(var i = 0; i < knightArr.length; i++){
				if(inbounds(row+knightArr[i][0],col+knightArr[i][1])){
					obj.addToThreatenedArrays((row+knightArr[i][0]).toString()+(col+knightArr[i][1]).toString(), threatenedByWhiteArr, threatenedByBlackArr);
					if(inbounds(row+knightArr[i][0],col+knightArr[i][1]) && !gameBoardArr[row+knightArr[i][0]][col+knightArr[i][1]]){
						obj.targetsArr.push((row+knightArr[i][0]).toString()+(col+knightArr[i][1]).toString());
					} else if(inbounds(row+knightArr[i][0],col+knightArr[i][1]) && gameBoardArr[row+knightArr[i][0]][col+knightArr[i][1]] && !sameColor(gameBoardArr,row+knightArr[i][0],col+knightArr[i][1],obj.color)){
						obj.targetsArr.push((row+knightArr[i][0]).toString()+(col+knightArr[i][1]).toString());
					}
				}
			}
		}
	}

	function queenTargetsWrapper(gameBoardArr, threatenedByWhiteArr, threatenedByBlackArr, dist){ 
		return function(row, col){
			var tar1 = straightTargetsWrapper(gameBoardArr, threatenedByWhiteArr, threatenedByBlackArr, dist);
			var tar2 = diagonalTargetsWrapper(gameBoardArr, threatenedByWhiteArr, threatenedByBlackArr, dist);
			tar1.call(this,row, col);
			tar2.call(this,row, col);
		}
	}

	function makeBoardTargets(gameBoardArr, threatenedByWhiteArr, threatenedByBlackArr){
		threatenedByWhiteArr = [];
		threatenedByBlackArr = [];
		for(var i = 0; i < gameBoardArr.length; i++){
			for(var j = 0; j < gameBoardArr[i].length; j++){
				if(gameBoardArr[i][j]){
					gameBoardArr[i][j].targetsArr = [];
					gameBoardArr[i][j].getTargets(i, j);
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