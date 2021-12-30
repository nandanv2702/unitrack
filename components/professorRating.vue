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
    <c-heading size="md" is-truncated text-align="center">{{
      prof.prof
    }}</c-heading>
    <c-simple-grid :columns="2" :spacing="8" pt="3" text-align="center">
      <c-stat>
        <c-stat-label>
          Rating
        </c-stat-label>
        <c-stat-number>
          {{ prof.rating }}
        </c-stat-number>
      </c-stat>
      <c-stat>
        <c-stat-label>Avg GPA</c-stat-label>
        <c-stat-number>{{ prof.averageGPA }}</c-stat-number>
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
      required: true,
    },
  },
  computed: {
    progress() {
      const score = this.prof.averageGPA + this.prof.rating

      return score * 10
    },
  },
}
</script>