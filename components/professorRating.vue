<template>
  <c-pseudo-box
    as="button"
    rounded="md"
    border="1px"
    outline="green"
    max-width="64"
    shadow="md"
    p="3"
    m="3"
    @click="$emit('open', prof.prof)"
  >
    <c-heading size="md" is-truncated text-align="center">{{ prof.prof }}</c-heading>
    <c-simple-grid :columns="2" :spacing="8" pt="3" text-align="center">
      <c-stat>
        <c-stat-label>Rating</c-stat-label>
        <c-stat-number>{{ prof.rating }}</c-stat-number>
      </c-stat>
      <c-stat>
        <c-stat-label>Avg GPA</c-stat-label>
        <c-stat-number>{{ averageGpa }}</c-stat-number>
      </c-stat>
    </c-simple-grid>
    <c-progress my="2" rounded="md" color="vue" :value="progress" />
  </c-pseudo-box>
</template>

<script>
export default {
  inject: ['$chakraColorMode', '$toggleColorMode'],
  props: {
    prof: {
      type: Object,
      required: true
    }
  },
  computed: {
    averageGpa(){
      const semesterlyGrades = this.prof.grades
      .map((section) => {
        if (section.grades) {
          return [section.grades.sectionGPA, section.grades.total]
        }
        return []
      })
      .filter(x => x.length > 0)

      let total = 0
      let count = 0

      semesterlyGrades.forEach((semester) => {
        total += semester[0] * semester[1]
        count += semester[1]
      })

      return Number((total / count).toFixed(2))
    },
    progress() {
      const score = this.averageGpa + this.prof.rating

      return score * 10
    }
  }
}
</script>