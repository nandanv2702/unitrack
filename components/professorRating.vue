<template>
  <c-pseudo-box
    as="button"
    rounded="md"
    border="1px"
    outline="gray.400"
    max-width="64"
    shadow="md"
    p="3"
    m="3"
    @click="$emit('open')"
  >
    <c-heading size="md" is-truncated text-align="center">Professor Name</c-heading>
    <c-simple-grid :columns="2" :spacing="8" pt="3" text-align="center">
      <c-stat>
        <c-stat-label>Rating</c-stat-label>
        <c-stat-number>3.4</c-stat-number>
      </c-stat>
      <c-stat>
        <c-stat-label>Avg GPA</c-stat-label>
        <c-stat-number>3.40</c-stat-number>
      </c-stat>
    </c-simple-grid>
    <c-progress my="2" rounded="md" color="vue" :value="Math.round(Math.random() * 100)" />
  </c-pseudo-box>
</template>

<script>
export default {
  inject: ['$chakraColorMode', '$toggleColorMode'],
}
</script>