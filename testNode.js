const solution = (m, n) => {
    let initialVlue = 1
    let Flowers = []
    let night = n
    let flower = m

    if (!m || !n || m <= 0 || n <= 0) {
        return
    }

    if (night === 1) {
        for (flower = 1; flower >= m; flower++) {
            return Flowers.push(initialVlue)
        }

    }
    if (night > 1) {
        let result = night + Flowers[night - 1]
        for (flower = 1; flower >= m; flower++) {
            Flowers.push(result)
            return Flowers
        }
    }

}

console.log(solution(2, 5))