function applyVertexColors( g, c ) {
    var count = 0;
    g.faces.forEach( function( f ) {

	var n = ( f instanceof THREE.Face3 ) ? 3 : 4;					
	for( var j = 0; j < n; j ++ ) {

	    f.vertexColors[ j ] = c;
	    count++;
	}

    } );
    //console.log('applied colors to ' + count + 'vertices');

}
function applySpecialVertexColors( g ) {
    
    var faceCount = 0;				
    var color = new THREE.Color();
    color.setHex( Math.random() * 0xffffff )
    var cubeNum = 0;
    g.faces.forEach( function( f ) {
	faceCount++;
	cubeNum = faceCount/12;
	if (faceCount % 12 == 1) {
	    color = new THREE.Color();
	    color.setHex( Math.random() * 0xffffff )
	}
	if (faceCount <= 12) {
	    color = new THREE.Color();
	    color.setHex( 0x0000ff )
	}
	var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
	for( var j = 0; j < n; j ++ ) {
	    f.vertexColors[ j ] = color;
	}
    });
}
function updateTinyBoard() {
    if (goodStart){
	var imageData = customBoard.getImg();
	
	var newCanvas = $("<canvas>")
	    .attr("width", imageData.width)
	    .attr("height", imageData.height)[0];
	
	newCanvas.getContext("2d").putImageData(imageData, 0, 0);
	tinyCtx.drawImage(newCanvas, 0, 0);
	getNNOutput();
    }
}

function setupWeightArrays() {
    var maxWeight, minWeight;
    //console.log('doing setupWeightarrays');
    var i, j;

	final_weightsa = Create2DArray(nFinalNodes,nPixels);
    maxWeight = -100;
    minWeight = 100;
    for (i=1; i<=nFinalNodes; i++){
		for (j=1; j<=nPixels; j++){
			var weight = final_weights.e(i,j);
			if (weight > maxWeight)
			maxWeight = weight;
			if (weight < minWeight)
			minWeight = weight;
		}
    }
    for (i=1; i<=nFinalNodes; i++){
		for (j=1; j<=nPixels; j++){
			var weight = final_weights.e(i,j);
			final_weightsa[i-1][j-1] = (weight - minWeight)/(maxWeight-minWeight);
		}
    }
    
}


function getNNOutput() {
	allZeroes = false;
    var data = [0, 0, 1, 0];

    for(var i = 0; i < data.length; i++) {
		allNodeInputs[i] = data[i]
		allNodeOutputs[i] = data[i];
		allNodeNums[i] = i+1;
    }

    var inp = Vector.create(data);
    var final_outputsa = new Array(nFinalNodes);
    
    for (var i=1; i<=nFinalNodes; i++){
		var weights = final_weights.row(i);
		// var sum = inp.dot(weights);
		var sum = 1;

		sum += final_biases.e(i);
		final_outputsa[i-1] = sigma(sum);
		allNodeInputs[nPixels+i-1] = sum;
		allNodeOutputs[nPixels+i-1]=final_outputsa[i-1];
		allNodeNums[nPixels+i-1] = nPixels+i+1;
    }
    
    // var sums = final_weights.x(hidden_outputs_2);
    // var newSums = sums.add(final_biases);
    //
    // for (i=1; i<=nFinalNodes; i++){
	// if (!allZeroes){
	//     final_outputsa[i-1] = sigma(newSums.e(i));
	//     allNodeInputs[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1]=newSums.e(i);
	//     allNodeOutputs[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1]=final_outputsa[i-1];
	// } else {
	//     final_outputsa[i-1] = 0;
	//     allNodeInputs[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1]=0;
	//     allNodeOutputs[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1]=0;
	// }
	// allNodeNums[nPixels+nHiddenNodes_1+nHiddenNodes_2+i-1] = i;
    // }
    
    allNodeOutputsRaw = allNodeOutputs.slice();
    // normalizeWithinLayer(allNodeOutputs);
    
    if (!allZeroes){
	var ind1 = maxInd(final_outputsa);
	finalOutputID = nPixels+i-1 + ind1 - nFinalNodes;
	final_outputsa[ind] = -nFinalNodes;
	var ind2 = maxInd(final_outputsa);
	document.getElementById("ans1").innerHTML = ind1;
	document.getElementById("ans2").innerHTML = ind2;
    } else {
	document.getElementById("ans1").innerHTML = "";
	document.getElementById("ans2").innerHTML = "";
    }
    
    isComputed = true;

    updateCubes();
    // updateEdges();
};

function sigma(x) {
    return 1.7159*math.tanh(0.666667*x);
}
function reshapeArray(arr){
    // The input array walks along pixels ltr ltr ltr.
    // For proper input, we need it to walk ttb ttb ttb.
    var arr2 = new Array(784);
    for (count = 0; count < 784; count++){
	if (goodStart) {
	    arr2[count] = -0.1;
	} else {
	    arr2[count] = 0;
	}
    }
    for (count = 0; count < 784; count++){
	var row = math.floor(count/28);
	var col = (count)%28;
	var newInd = col*28 + row;
	arr2[newInd] = arr[count];
    }
    return arr2;
}
function maxInd(arr) {
    ind = 0;
    val = arr[0];
    for (i=1; i<arr.length; i++){
	if (arr[i]>val){
	    ind = i;
	    val = arr[i];
	}				
    }
    return ind;
}
function normalizeWithinLayer(arr) {
    var len = arr.length;

    var minPixel = 100;
    var minHidden1 = 100;
    var minHidden2 = 100;
    var minFinal = 100;
    
    var maxPixel = -100;
    var maxHidden1 = -100;
    var maxHidden2 = -100;
    var maxFinal = -100;
    for (var i=0;i<len;i++){
	if (i<nPixels) {
	    if (arr[i]>maxPixel)
		maxPixel = arr[i];
	    else if (arr[i]<minPixel)
		minPixel = arr[i];
	} else if (i < nPixels+nHiddenNodes_1) {
	    if (arr[i]>maxHidden1)
		maxHidden1 = arr[i];
	    else if (arr[i]<minHidden1)
		minHidden1 = arr[i];
	} else if (i < nPixels+nHiddenNodes_1+nHiddenNodes_2) {
	    if (arr[i]>maxHidden2)
		maxHidden2 = arr[i];
	    else if (arr[i]<minHidden2)
		minHidden2 = arr[i];
	} else {
	    if (arr[i]>maxFinal)
		maxFinal = arr[i];
	    else if (arr[i]<minFinal)
		minFinal = arr[i];
	}
    }
    if (minPixel==maxPixel){					
	allZeroes = true;
	for (var i=0;i<len;i++){
	    arr[i] = 0;					
	}
    } else {
	allZeroes = false;
	for (var i=0;i<len;i++){
	    if (i<nPixels) {
		arr[i] = (arr[i] - minPixel)/(maxPixel-minPixel);
	    } else if (i < nPixels+nHiddenNodes_1) {
		arr[i] = (arr[i] - minHidden1)/(maxHidden1-minHidden1);
	    } else if (i < nPixels+nHiddenNodes_1+nHiddenNodes_2) {
		arr[i] = (arr[i] - minHidden2)/(maxHidden2-minHidden2);
	    } else {
		arr[i] = (arr[i] - minFinal)/(maxFinal-minFinal);
	    }
	}
    }
}


function Create2DArray(rows,columns) {
    var x = new Array(rows);
    for (var i = 0; i < rows; i++) {
	x[i] = new Array(columns);
    }
    return x;
}
