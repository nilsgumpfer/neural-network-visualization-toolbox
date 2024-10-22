function setupWeightArrays() {
    const absMax = deriveAbsMax2([final_weights, final_biases]);

    final_weights_normalized = normalizeMatrix(final_weights, absMax);
    final_biases_normalized = normalizeMatrix(final_biases, absMax);
}


function deriveAbsMax2(values) {
    // Flatten the 3D array into a 1D array
    const flatArray = values.flat(2);

    // Get the minimum and maximum values
    const min = Math.min(...flatArray);
    const max = Math.max(...flatArray);

    return Math.max(Math.abs(min), Math.abs(max));
}

function deriveAbsMax(values) {
    // Flatten the 2D array into a 1D array
    const flatArray = values.flat(1);

    // Get the minimum and maximum values
    const min = Math.min(...flatArray);
    const max = Math.max(...flatArray);

    return Math.max(Math.abs(min), Math.abs(max));
}


function normalizeMatrix(matrix, absMax) {
    // Normalize each element in the matrix
    return matrix.map(row => row.map(value => ((value / absMax) / 2) + 0.5));
}


function getNNOutput() {
    allZeroes = false;
    let i;

    for (i = 0; i < nInputValues; i++) {
        allNodeInputs[i] = input_data[0][i];
        allNodeOutputs[i] = input_data[0][i];
        allNodeOutputsNormalized[i] = input_data_normalized[0][i];
        allNodeNums[i] = i + 1;
    }

    for (i = 0; i < nFinalNodes; i++) {
        allNodeInputs[nInputValues + i] = final_outputs[0][i];
        allNodeOutputs[nInputValues + i] = final_outputs[0][i];
        allNodeOutputsNormalized[nInputValues + i] = final_outputs_normalized[0][i];
        allNodeNums[nInputValues + i] = nInputValues + i + 1;
    }

    finalOutputID = maxInd(final_outputs);

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
