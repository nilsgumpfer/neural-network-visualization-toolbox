function updateConnectionArrays() {
    if (weightsDisplayed) {
        const absMax = deriveAbsMax2([final_connections, final_biases]);
        final_connections_normalized = normalizeMatrix(final_connections, absMax);
    }
    else {
        final_connections_normalized = normalizeMatrix(final_connections, deriveAbsMax(final_connections));
    }
    final_outputs_normalized = normalizeMatrix(final_outputs, deriveAbsMax(final_outputs));
    final_outputs_wo_act_normalized = normalizeMatrix(final_outputs_wo_act, deriveAbsMax(final_outputs_wo_act));
    input_data_normalized = normalizeMatrix(input_data, deriveAbsMax(input_data));
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
    if(absMax === 0)
        absMax = 1

    return matrix.map(row => row.map(value => ((value / absMax) / 2) + 0.5));
}


function getNNOutput() {
    updateArrays();

    allZeroes = false;
    let i;

    for (i = 0; i < nInputValues; i++) {
        allNodeInputs[i] = input_data[0][i];
        allNodeOutputs[i] = input_data[0][i];
        allNodeOutputsNormalized[i] = input_data_normalized[0][i];
        allNodeNums[i] = i + 1;
    }

    for (i = 0; i < nFinalNodes; i++) {
        allNodeInputs[nInputValues + i] = final_outputs_wo_act[0][i];
        allNodeOutputs[nInputValues + i] = final_outputs_wo_act[0][i];
        allNodeOutputsNormalized[nInputValues + i] = final_outputs_wo_act_normalized[0][i];
        allNodeNums[nInputValues + i] = nInputValues + i + 1;
    }

    for (i = 0; i < nFinalNodes; i++) {
        allNodeInputs[nInputValues + nFinalNodes + i] = final_outputs[0][i];
        allNodeOutputs[nInputValues + nFinalNodes + i] = final_outputs[0][i];
        allNodeOutputsNormalized[nInputValues + nFinalNodes + i] = final_outputs_normalized[0][i];
        allNodeNums[nInputValues + nFinalNodes + i] = nInputValues + nFinalNodes + i + 1;
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
