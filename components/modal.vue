<template>
  <c-modal :size="'3xl'" :is-open="isOpen" is-centered>
    <c-modal-content ref="content" py="4" px="2">
      <c-modal-header py="2"> {{ prof.prof }} </c-modal-header>
      <c-modal-close-button @click="$emit('close')" />
      <c-modal-body my="1">
        <c-simple-grid :columns="2" :spacing="8" py="3" text-align="center">
          <c-stat>
            <c-link :href="prof.ratingLink" is-external>
              <c-stat-label> Rating </c-stat-label>
              <c-stat-number>
                {{ prof.rating }}
              </c-stat-number>
            </c-link>
          </c-stat>
          <c-stat>
            <c-link :href="`https://madgrades.com/courses/${courseUuid}`" is-external>
            <c-stat-label>Avg GPA</c-stat-label>
            <c-stat-number>{{ prof.averageGPA }}</c-stat-number>
            </c-link>
          </c-stat>
        </c-simple-grid>
        <ModalGradesChart :terms="terms" :grades="grades" />
        <c-box p="2" w="full">
          <c-heading as="h4" size="sm" my="2">
            MadGrades Professor Match/(es)
          </c-heading>
          <c-stack is-inline>
            <c-tag
              v-for="name in bestGuessName"
              :key="name"
              size="sm"
              variant-color="vue"
              >{{ name }}</c-tag
            >
          </c-stack>
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
    courseUuid: {
      type: String,
      required: true,
    }
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