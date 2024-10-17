function applyVertexColors(g, c) {
    var count = 0;
    g.faces.forEach(function (f) {

        var n = (f instanceof THREE.Face3) ? 3 : 4;
        for (var j = 0; j < n; j++) {

            f.vertexColors[j] = c;
            count++;
        }

    });

}

function drawCubes() {
    var geometry = new THREE.Geometry();
    var pickingGeometry = new THREE.Geometry();
    var pickingMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
    var defaultMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors,
        transparent: true
    });

    var geom = new THREE.BoxGeometry(9, 9, 9);
    var hideGeom = new THREE.BoxGeometry(1, 1, 1);
    var color = new THREE.Color();

    var matrix = new THREE.Matrix4();
    var quaternion = new THREE.Quaternion();

    for (var i = 0; i < nNodes; i++) {
        var position = new THREE.Vector3();
        position.x = posX[i];
        position.y = posY[i];
        position.z = posZ[i];

        var rotation = new THREE.Euler();
        rotation.x = 0;
        rotation.y = 0;
        rotation.z = 0;

        var scale = new THREE.Vector3();
        scale.x = 1;
        scale.y = 1;
        scale.z = 1;

        quaternion.setFromEuler(rotation, false);
        matrix.compose(position, quaternion, scale);

        if (isComputed) {
            var v = allNodeOutputs[i];
            var colorNum = math.round(v * 99);
            r = redLookup[colorNum];
            g = greenLookup[colorNum];
            b = blueLookup[colorNum];
            applyVertexColors(geom, color.setRGB(r, g, b));
        } else {
            applyVertexColors(geom, color.setRGB(0, 0, 0));
        }

        geometry.merge(geom, matrix);

        // give the geom's vertices a color corresponding to the "id"

        applyVertexColors(geom, color.setHex(i));

        pickingGeometry.merge(geom, matrix);

        pickingData[i] = {
            position: position,
            rotation: rotation,
            scale: scale,
            id: i
        };
    }

    var drawnObject = new THREE.Mesh(geometry, defaultMaterial);
    drawnObject.name = 'cubes';
    scene.add(drawnObject);

    pickingScene.add(new THREE.Mesh(pickingGeometry, pickingMaterial));
}

function drawEdges() {
    //console.log('draw edges');
    var lineMat = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        transparent: true,
        linewidth: 2
    });
    var lineGeom = new THREE.Geometry();
    lineGeom.dynamic = true;
    var line = new THREE.Line(lineGeom, lineMat);
    line.name = 'edges';
    scene.add(line);
}

function updateInfoBoxPos() {
    var infobox = document.getElementById("infobox");
    var boxHeight = infobox.clientHeight;
    var boxWidth = infobox.clientWidth;
    var bot = Math.min(window.innerHeight - mousepx.y + 20, window.innerHeight - boxHeight);
    infobox.style.bottom = bot + "px";
    infobox.style.left = mousepx.x - boxWidth / 2 + "px";

}
