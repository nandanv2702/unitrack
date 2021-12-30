<template>
  <c-modal :size="'3xl'" :is-open="isOpen" is-centered>
    <c-modal-content ref="content" py="4" px="2">
      <c-modal-header py="2"> {{ prof.prof }} </c-modal-header>
      <c-modal-close-button @click="$emit('close')" />
      <c-modal-body my="1">
        <ModalGradesChart :terms="terms" :grades="grades" />
        <c-box w="full" justify-content="center" spacing="10px">
          <c-heading as="h4" size="md" mt="4">
            MadGrades Professor Match/(es)
          </c-heading>
          <c-box w="xl">
            <c-divider></c-divider>
          </c-box>
          <c-list v-for="name in bestGuessName" :key="name" style-type="disc">
            <c-list-item>{{ name }}</c-list-item>
          </c-list>
        </c-box>
      </c-modal-body>
    </c-modal-content>
    <c-modal-overlay />
  </c-modal>
</template>

<script>
import ModalGradesChart from './ModalGradesChart.vue'
export default {
  components: {
    ModalGradesChart,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    prof: {
      type: Object,
      required: true,
    },
    terms: {
      type: Object,
      required: true,
    },
  },
  computed: {
    grades() {
      if (this.prof.grades) {
        return this.prof.grades
          .filter((x) => x.grades)
          .map((sem) => {
            return { x: sem.semesterCode, y: sem.grades.sectionGPA }
          })
          .sort((a, b) => a.x - b.x)
      }
      return []
    },
    bestGuessName() {
      if (!this.prof.grades) {
        return []
      }
      return this.prof.grades
        .map((semester) => semester.profName)
        .filter((v, i, a) => a.indexOf(v) === i)
    },
  },
}
</script>