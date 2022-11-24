const newInnerBox = (x,y,z,sideX, sideY, sideZ, material) => {
    const startX = x
    const endX = x+sideX
    const startY = y
    const endY = y+sideY
    const startZ = z
    const endZ = z+sideZ

    return new Object(
        [new polygon([{x:endX,y:endY,z:startZ}, {x:startX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:endY,z:startZ}, {x:startX,y:startY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:startZ}, {x:startX,y:startY,z:endZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:endX,y:startY,z:endZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:startZ}, {x:startX,y:endY,z:startZ}, {x:startX,y:startY,z:endZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:startX,y:endY,z:startZ}, {x:startX,y:endY,z:endZ}], material),
        new polygon([{x:startX,y:endY,z:endZ}, {x:startX,y:endY,z:startZ}, {x:endX,y:endY,z:startZ}], material),
        new polygon([{x:endX,y:endY,z:startZ}, {x:endX,y:endY,z:endZ}, {x:startX,y:endY,z:endZ}], material),
        new polygon([{x:endX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}, {x:endX,y:startY,z:endZ}], material),
        new polygon([{x:endX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}, {x:endX,y:endY,z:startZ}], material),
        new polygon([{x:endX,y:startY,z:endZ}, {x:startX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}], material),
        new polygon([{x:endX,y:endY,z:endZ}, {x:startX,y:startY,z:endZ}, {x:startX,y:endY,z:endZ}], material)], material
    )
}

const newOuterBox = (x,y,z,sideX, sideY, sideZ, material) => {
    const startX = x
    const endX = x+sideX
    const startY = y
    const endY = y+sideY
    const startZ = z
    const endZ = z+sideZ
    return new Object(
        [new polygon([{x:startX,y:endY,z:startZ}, {x:endX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:startZ}, {x:startX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:startX,y:startY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:endX,y:startY,z:endZ}, {x:startX,y:startY,z:endZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:endY,z:startZ}, {x:startX,y:startY,z:startZ}, {x:startX,y:startY,z:endZ}], material),
        new polygon([{x:startX,y:endY,z:startZ}, {x:startX,y:startY,z:endZ}, {x:startX,y:endY,z:endZ}], material),
        new polygon([{x:startX,y:endY,z:endZ}, {x:startX,y:endY,z:startZ}, {x:endX,y:endY,z:startZ}], material),
        new polygon([{x:endX,y:endY,z:startZ}, {x:endX,y:endY,z:endZ}, {x:startX,y:endY,z:endZ}], material),
        new polygon([{x:endX,y:startY,z:startZ}, {x:endX,y:endY,z:startZ}, {x:endX,y:startY,z:endZ}], material),
        new polygon([{x:endX,y:endY,z:endZ}, {x:endX,y:startY,z:endZ}, {x:endX,y:endY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:endX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}, {x:startX,y:endY,z:endZ}], material)], material
    )
}

const newInnerCube = (x,y,z,side, material) => {
    const startX = x
    const endX = x+side
    const startY = y
    const endY = y+side
    const startZ = z
    const endZ = z+side

    return new Object(
        [new polygon([{x:endX,y:endY,z:startZ}, {x:startX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:endY,z:startZ}, {x:startX,y:startY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:startZ}, {x:startX,y:startY,z:endZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:endX,y:startY,z:endZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:startZ}, {x:startX,y:endY,z:startZ}, {x:startX,y:startY,z:endZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:startX,y:endY,z:startZ}, {x:startX,y:endY,z:endZ}], material),
        new polygon([{x:startX,y:endY,z:endZ}, {x:startX,y:endY,z:startZ}, {x:endX,y:endY,z:startZ}], material),
        new polygon([{x:endX,y:endY,z:startZ}, {x:endX,y:endY,z:endZ}, {x:startX,y:endY,z:endZ}], material),
        new polygon([{x:endX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}, {x:endX,y:startY,z:endZ}], material),
        new polygon([{x:endX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}, {x:endX,y:endY,z:startZ}], material),
        new polygon([{x:endX,y:startY,z:endZ}, {x:startX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}], material),
        new polygon([{x:endX,y:endY,z:endZ}, {x:startX,y:startY,z:endZ}, {x:startX,y:endY,z:endZ}], material)], material
    )
}

const newOuterCube = (x,y,z,side, material) => {
    const startX = x
    const endX = x+side
    const startY = y
    const endY = y+side
    const startZ = z
    const endZ = z+side
    return new Object(
        [new polygon([{x:startX,y:endY,z:startZ}, {x:endX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:startZ}, {x:startX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:startX,y:startY,z:startZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:endX,y:startY,z:endZ}, {x:startX,y:startY,z:endZ}, {x:endX,y:startY,z:startZ}], material),
        new polygon([{x:startX,y:endY,z:startZ}, {x:startX,y:startY,z:startZ}, {x:startX,y:startY,z:endZ}], material),
        new polygon([{x:startX,y:endY,z:startZ}, {x:startX,y:startY,z:endZ}, {x:startX,y:endY,z:endZ}], material),
        new polygon([{x:startX,y:endY,z:endZ}, {x:startX,y:endY,z:startZ}, {x:endX,y:endY,z:startZ}], material),
        new polygon([{x:endX,y:endY,z:startZ}, {x:endX,y:endY,z:endZ}, {x:startX,y:endY,z:endZ}], material),
        new polygon([{x:endX,y:endY,z:startZ}, {x:endX,y:startY,z:startZ}, {x:endX,y:startY,z:endZ}], material),
        new polygon([{x:endX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}, {x:endX,y:endY,z:startZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:endX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}], material),
        new polygon([{x:startX,y:startY,z:endZ}, {x:endX,y:endY,z:endZ}, {x:startX,y:endY,z:endZ}], material)], material
    )
}