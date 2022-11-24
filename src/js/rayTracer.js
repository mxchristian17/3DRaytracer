const renderNext = (context, camera ,objects, lights, boxSize) => {
    let i, j
    
    const startingTime = new Date().getTime()
    let blockNumber = 0
    let polygonsCount = 0

    const cam = new Camera(camera)
    const cameraToWorld = cam.cameraToWorldSet()

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    let canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight)

    const scale = Math.tan(degreeToRad(cam.fov)*0.5)
    const imageAspectRatio = options.width / options.height;
    const orig = cam.origin()

    for(i=0;i<(Math.floor(canvasWidth/boxSize));i++) {
        for(j=0;j<(Math.floor(canvasWidth/boxSize));j++) {
            renderBox(context, camera, objects, lights, i, j, boxSize, scale, imageAspectRatio, cameraToWorld, orig, canvasData)
        }
    }
    
    const endingTime = new Date().getTime()
    context.putImageData(canvasData, 0, 0)

    //Print render data
    const elapsedTime = (endingTime-startingTime) / 1000
    objects.forEach((object) => {object.polygons.forEach((poli) => {polygonsCount++})})
    context.beginPath();
    context.fillStyle = "rgb(0,0,0,0.8)"
    context.fillRect(0, (options.height-20), options.width, options.height);
    context.stroke();
    context.font = "11px Arial";
    context.fillStyle = "#FFFFFF"
    context.fillText("Render time: " + elapsedTime + " sg | Polygons: " + polygonsCount + " | Orengia Christian Raytracer", 5, options.height-5)
}

const renderBox = (context, camera ,objects, lights, xStart, yStart, boxSize, scale, imageAspectRatio, cameraToWorld, orig, canvasData) => {
    let pix = []
    for(let j = options.height; j > 0; j--) {
        for (let i = 0; i < options.width; i++) {
            x = scale * imageAspectRatio * ((-options.width/2) + i) / options.width
            y = scale * ((-options.height/2) + j) / options.height
            if((i < xStart*boxSize || i >= xStart*boxSize+boxSize) || (j < yStart*boxSize || j >= yStart*boxSize+boxSize) ) {
                pix.push({ ray: false })
                continue
            }

            dir = cameraToWorld.multDirMatrix(new Vector(x, y, 1))
            tempRay = new ray({x: orig.x(), y: orig.y(), z: orig.z()}, dir, 0.2, { r:255, g:255, b:255 })

            dist = infinite
            closestCamRay = null
            closestPoli = null
            objects.forEach((object) => {
                object.polygons.forEach((poli) => {
                    camRay = poli.intersect(tempRay)
                    if(camRay == false) return
                    currentDistance = tempRay.distance(camRay.point)
                    if(currentDistance > dist) return

                    dist = currentDistance
                    closestPoli = poli
                    closestCamRay = camRay
                    return
                })
            })
        
            if( closestCamRay == undefined ) {
                pix.push({ ray: false })
                continue
            }

            pix.push({ x: x, y:y, ray: tempRay, dist: dist, closestPoli: closestPoli, closestCamRay: closestCamRay })
        }
        loadingValue = (i* (j-options.height))
        loadingContent.innerText = loadingValue
        //println(i* (j-options.height))
        
        //console.log(loadingValue)
    }

    pix.forEach( ( pixel, index ) => {
        //if(index != 68250) return
        //if(index != 68180) return
        //if(index != 81000) return
        if(pixel.ray == false) {
            drawPixel(canvasData, canvasWidth, canvasHeight, index, 0,0,0,255)
            return
        }
        hitRays = []
        

        //if (pixel.closestCamRay == undefined) return

        hitRays.push(pixel.ray)

        lights.forEach((light) => {
            if(light.intensity == 0) return
            tempDist = infinite
            interference = false

            dir = pixel.closestCamRay.point.subtract(light.origin())
            rayAngle = light.direction.angleBetween(dir)
            if(rayAngle > light.maxAngle/2) return
            tempRay = new ray({x: light.orig.x, y: light.orig.y, z: light.orig.z}, dir, light.intensity, light.color)
            objects.forEach((object) => {
                object.polygons.forEach((poliB) => {
                    lightRay = poliB.intersect(tempRay)
                    if(lightRay == false) return
                    tempCurrentDistance = tempRay.distance(lightRay.point)
                    if(tempCurrentDistance > tempDist) return
                    tempDist = tempCurrentDistance
                    closestLightRay = lightRay
                })
            })
            if( closestLightRay == undefined ) return
            if(Math.abs(pixel.closestCamRay.point.length() - closestLightRay.point.length()) > kEpsilon) interference = true
            /*console.log(closestCamRay.point.length())
            console.log(tempRay)
            console.log(closestPoliB)
            console.log(closestLightRay.point.length())
            console.log(interference)*/

            if (interference == false) {
                //console.log(light)
                tempRay.intensity = light.bright(tempDist, 2 * rayAngle)
                hitRays.push(tempRay)
            }

        })

        color = pixel.closestPoli.color(hitRays)
        drawPixel(canvasData, canvasWidth, canvasHeight, index, color.r,color.g,color.b,255)
    })
    
    
}


function render(objects, lights) {
    const startingTime = new Date().getTime();
    let checkPoint = startingTime
    const cam = new Camera(camera)
    const cameraToWorld = cam.cameraToWorldSet()
    let x,y, dir, color, dist, camRay, lightRay, tempRay, tempDist, closestPoli, closestCamRay, closestLightRay, interference, rayAngle, currentDistance, tempCurrentDistance
    let polygonsCount = 0
    let pix = []
    let hitRays = []
    const pixelUpdateTimeDivision = options.height / 50
    const pixelUpdateTimeDivisionB = pixelCount / 50

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    let canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight)

    const scale = Math.tan(degreeToRad(cam.fov)*0.5)
    const imageAspectRatio = options.width / options.height;
    const orig = cam.origin()
    
    for(let j = options.height; j > 0; j--) {
        for (let i = 0; i < options.width; i++) {
            x = scale * imageAspectRatio * ((-options.width/2) + i) / options.width
            y = scale * ((-options.height/2) + j) / options.height
            dir = cameraToWorld.multDirMatrix(new Vector(x, y, 1))
            tempRay = new ray({x: orig.x(), y: orig.y(), z: orig.z()}, dir, 0.2, { r:255, g:255, b:255 })

            dist = infinite
            closestCamRay = null
            closestPoli = null
            objects.forEach((object) => {
                object.polygons.forEach((poli) => {
                    camRay = poli.intersect(tempRay)
                    if(camRay == false) return
                    currentDistance = tempRay.distance(camRay.point)
                    if(currentDistance > dist) return

                    dist = currentDistance
                    closestPoli = poli
                    closestCamRay = camRay
                    return
                })
            })
        
            if( closestCamRay == undefined ) {
                pix.push({ ray: false })
                continue
            }

            pix.push({ x: x, y:y, ray: tempRay, dist: dist, closestPoli: closestPoli, closestCamRay: closestCamRay })
        }
        if(options.consoleTimes) if(j % pixelUpdateTimeDivision === 0) {
            loadingValue = 100 * (((options.height-j)) / options.height)
            console.clear()
            console.log("Trazando rayos de camara " + Math.floor(loadingValue) + "% " + ((new Date().getTime()-checkPoint) / 1000) + "sg")
            //console.log(loadingValue)
        }
    }
    loadingValue=0
    const pixLength = pix.length
    let pixPos = 0
    
    const camRaysTraceTime = ((new Date().getTime()-checkPoint) / 1000)

    if(options.consoleTimes) {
        checkPoint = new Date().getTime()
    }

    pix.forEach( ( pixel, index ) => {
        pixPos++
        //if(index != 68250) return
        //if(index != 68180) return
        //if(index != 81000) return
        if(pixel.ray == false) {
            drawPixel(canvasData, canvasWidth, canvasHeight, index, 0,0,0,255)
            return
        }
        hitRays = []
        

        //if (pixel.closestCamRay == undefined) return

        hitRays.push(pixel.ray)

        lights.forEach((light) => {
            if(light.intensity == 0) return
            tempDist = infinite
            interference = false

            dir = pixel.closestCamRay.point.subtract(light.origin())
            rayAngle = light.direction.angleBetween(dir)
            if(rayAngle > light.maxAngle/2) return
            tempRay = new ray({x: light.orig.x, y: light.orig.y, z: light.orig.z}, dir, light.intensity, light.color)
            objects.forEach((object) => {
                object.polygons.forEach((poliB) => {
                    lightRay = poliB.intersect(tempRay)
                    if(lightRay == false) return
                    tempCurrentDistance = tempRay.distance(lightRay.point)
                    if(tempCurrentDistance > tempDist) return
                    tempDist = tempCurrentDistance
                    closestLightRay = lightRay
                })
            })
            if( closestLightRay == undefined ) return
            if(Math.abs(pixel.closestCamRay.point.length() - closestLightRay.point.length()) > kEpsilon) interference = true
            /*console.log(closestCamRay.point.length())
            console.log(tempRay)
            console.log(closestPoliB)
            console.log(closestLightRay.point.length())
            console.log(interference)*/

            if (interference == false) {
                //console.log(light)
                tempRay.intensity = light.bright(tempDist, 2 * rayAngle)
                hitRays.push(tempRay)
            }

        })

        color = pixel.closestPoli.color(hitRays)
        drawPixel(canvasData, canvasWidth, canvasHeight, index, color.r,color.g,color.b,255)

        if(options.consoleTimes) if(pixPos % pixelUpdateTimeDivisionB === 0) {
            loadingValue = 100 * pixPos / pixLength
            console.clear()
            console.log("Rayos de camara trazados 100% " + camRaysTraceTime + "sg")
            console.log("Trazando rayos de luces " + Math.floor(loadingValue) + "% " + ((new Date().getTime()-checkPoint) / 1000) + "sg")
        }
    })

    if(options.consoleTimes) {
        console.clear()
        console.log("Rayos de camara trazados 100% " + camRaysTraceTime + "sg")
        console.log("Rayos de luces trazados 100% " + ((new Date().getTime()-checkPoint) / 1000) + "sg")
    }

    context.putImageData(canvasData, 0, 0)
    
    const endingTime = new Date().getTime()
    canvas.style.display = "block"
    loading.style.display = "none"
    
    //Print render data
    const elapsedTime = (endingTime-startingTime) / 1000
    if(options.showRenderData) {
        objects.forEach((object) => {object.polygons.forEach((poli) => {polygonsCount++})})
        context.beginPath();
        context.fillStyle = "rgb(0,0,0,0.8)"
        context.fillRect(0, (options.height-20), options.width, options.height);
        context.stroke();
        context.font = "11px Arial";
        context.fillStyle = "#FFFFFF"
        context.fillText("Render: " + elapsedTime + " sg | Polygons: " + polygonsCount + " | " + options.width + "x" + options.height + "px" + " | Orengia Christian Raytracer", 5, options.height-5)
    }

}