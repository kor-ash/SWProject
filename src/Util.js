const dis = ({ sx, sy, ex, ey, tx, ty }) => {
    let m = 0;
    let b = 0;
    if (ex !== sx)
        m = (ey - sy) / (ex - sx)
    else
        m = 0;
    b = sy - m * sx;
    let dis = Math.abs(((m * tx) - ty + b)) / (Math.sqrt(m ** 2 + 1))
    return dis;
}
const findClickedVector = (vectors, clickedX, clickedY) => {
    let res = false
    vectors.forEach((vector) => {
        const { sx, sy, ex, ey } = vector.props;
        const dist = dis({ sx: sx, sy: sy, ex: ex, ey: ey, tx: clickedX, ty: clickedY })
        if (dist < 10) {
            res = true
            vector.isClicked = true
        }
    });
    return res
}
const findClickedCircle = (circles, clickedX, clickedY) => {
    let res = false
    circles.forEach((circle) => {
        const { sx, sy, rad } = circle.props;
        const dist = Math.sqrt((clickedX - sx) ** 2 + (clickedY - sy) ** 2)
        if (Math.abs(dist - rad) < 10) {
            res = true
            circle.isClicked = true;
        }
    })
    return res
}

export { dis, findClickedCircle, findClickedVector }