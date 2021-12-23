<template>
  <c-modal :is-open="isOpen" is-centered>
    <c-modal-content ref="content">
      <c-modal-header> Professor Name </c-modal-header>
      <c-modal-close-button @click="$emit('close')" />
      <c-modal-body m="2" p="5"> Grade trend content here </c-modal-body>
    </c-modal-content>
    <c-modal-overlay />
  </c-modal>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
}
</script>