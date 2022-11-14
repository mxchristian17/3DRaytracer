const degreeToRad = (angle) => {
    return (angle * 2 * Math.PI / 360)
}
const radToDegree = (angle) => {
return (angle * 360 / (2 * Math.PI))
}

const normalizeVector = (v) => {
    let length = 0
    let retVal = []
    v.forEach((e) => {length += Math.pow(e, 2)})
    length = Math.sqrt(length)
    v.forEach((e) => {retVal.push( e / length )})
    return retVal
}

