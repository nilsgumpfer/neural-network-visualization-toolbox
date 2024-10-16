function setupWeightArrays() {
    let maxWeight, minWeight;
    //console.log('doing setupWeightarrays');
    let i, j, weight;

    final_weightsa = Create2DArray(nFinalNodes, nInputValues);
    maxWeight = -100;
    minWeight = 100;

    for (i = 1; i <= nFinalNodes; i++) {
        for (j = 1; j <= nInputValues; j++) {
            weight = final_weights.e(i, j);
            if (weight > maxWeight)
                maxWeight = weight;
            if (weight < minWeight)
                minWeight = weight;
        }
    }

    for (i = 1; i <= nFinalNodes; i++) {
        for (j = 1; j <= nInputValues; j++) {
            weight = final_weights.e(i, j);
            final_weightsa[i - 1][j - 1] = (weight - minWeight) / (maxWeight - minWeight);
        }
    }
}


function getNNOutput() {
    allZeroes = false;
    const data = [0, 0, 1, 0];
    let i;

    for (i = 0; i < data.length; i++) {
        allNodeInputs[i] = data[i]
        allNodeOutputs[i] = data[i];
        allNodeNums[i] = i + 1;
    }

    const inp = Vector.create(data);
    let final_outputsa = new Array(nFinalNodes);
    final_outputsa = [0, 0.1, 0.2, 0.3, 0.35, 0.4, 0.45, 0.5, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 0.95, 1];

    for (i = 0; i < nFinalNodes; i++) {
        const weights = final_weights.col(i + 1);
        const sum = inp.dot(weights) + final_biases.e(i);
        // final_outputsa[i] = sigma(sum);

        allNodeInputs[nInputValues + i] = final_outputsa[i];
        allNodeOutputs[nInputValues + i] = final_outputsa[i];
        allNodeNums[nInputValues + i] = nInputValues + i + 1;
    }

    allNodeOutputsRaw = allNodeOutputs.slice();
    // normalizeWithinLayer(allNodeOutputs);

    finalOutputID = maxInd(final_outputsa);

    isComputed = true;
}


function maxInd(arr) {
    let ind = 0;
    let val = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > val) {
            ind = i;
            val = arr[i];
        }
    }
    return ind;
}


function Create2DArray(rows, columns) {
    const x = new Array(rows);
    for (var i = 0; i < rows; i++) {
        x[i] = new Array(columns);
    }
    return x;
}
