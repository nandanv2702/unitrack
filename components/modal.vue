<template>
  <c-modal :is-open="isOpen" is-centered>
    <c-modal-content ref="content" py="4" px="2">
      <c-modal-header> {{ prof.prof }} </c-modal-header>
      <c-modal-close-button @click="$emit('close')" />
      <c-modal-body my="2"> Grade trend content here </c-modal-body>
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
    prof: {
      type: Object,
      required: true
    }
  },
}
</script>