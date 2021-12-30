module.exports = (grades) => {

    const gradeTrends = grades
        .map((section) => {
            if (section.grades) {
                return [section.grades.sectionGPA, section.grades.total]
            }
            return []
        })
        .filter(x => x.length > 0)

    let total = 0
    let count = 0

    gradeTrends.forEach((semester) => {
        total += semester[0] * semester[1]
        count += semester[1]
    })

    return Number((total / count).toFixed(2))
}