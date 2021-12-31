<template>
  <div class="container">
    <c-box
      v-bind="mainStyles[colorMode]"
      d="flex"
      w="100vw"
      min-h="100vh"
      h="full"
      flex-dir="column"
    >
      <c-box mt="10" justify-content="top">
        <c-stack is-inline w="full" justify-content="center">
                    <c-box mx="1">
            <dark-mode-toggle />
          </c-box>
          <c-heading text-align="center" mb="4"> ⚡️ UniTrack ⚡️ </c-heading>
        </c-stack>

        <c-flex justify="center" direction="column" align="center" mx="4">
          <c-flex as="form">
            <c-box mr="3" rounded="md" w="48">
              <c-select v-model="semesterCode">
                <option value="1224" selected>Spring 2022</option>
                <option value="1222">Fall 2021</option>
              </c-select>
            </c-box>
            <c-input
              v-model="courseName"
              as="input"
              variant="filled"
              placeholder="Course, e.g., Econ 101"
              type="text"
              px="4"
              rounded="md"
              border-width="1px"
            />
            <c-button
              py="2"
              px="6"
              ml="3"
              rounded="md"
              font-weight="semibold"
              variant-color="blue"
              @click.prevent="getData"
            >
              Search
            </c-button>
          </c-flex>
        </c-flex>
      </c-box>

      <c-divider m="8"></c-divider>

      <c-flex v-if="isLoading" justify-content="center" w="full">
        <c-circular-progress
          :value="30"
          size="120px"
          :thickness="0.1"
          is-indeterminate
        />
      </c-flex>

      <c-box justify-content="bottom" mx="12" my="4">
        <modal
          :is-open="isOpen"
          :terms="terms"
          :prof="activeProf"
          @close="close"
        />
        <c-simple-grid
          w="full"
          justify-content="center"
          spacing="10px"
          min-child-width="240px"
        >
          <professor-rating
            v-for="professor in professors"
            :key="professor.prof"
            :prof="professor"
            @open="open"
          />
        </c-simple-grid>
      </c-box>
    </c-box>
  </div>
</template>

<script>
import { CBox, CButton, CFlex, CHeading } from '@chakra-ui/vue'

export default {
  name: 'App',
  components: {
    CBox,
    CButton,
    CFlex,
    CHeading,
  },
  inject: ['$chakraColorMode', '$toggleColorMode'],
  data() {
    return {
      isLoading: false,
      semesterCode: 1224,
      courseName: '',
      professors: [],
      activeProf: {},
      grades: [],
      terms: {},
      mainStyles: {
        dark: {
          bg: 'gray.700',
          color: 'whiteAlpha.900',
        },
        light: {
          bg: 'white',
          color: 'gray.900',
        },
      },
      isOpen: false,
    }
  },
  computed: {
    colorMode() {
      return this.$chakraColorMode()
    },
    theme() {
      return this.$chakraTheme()
    },
    toggleColorMode() {
      return this.$toggleColorMode
    },
  },
  async mounted() {
    const { data } = await this.$axios('/api/terms')

    this.terms = data
  },
  methods: {
    showToast() {
      this.$toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })
    },
    open(name) {
      this.activeProf = this.professors.find((prof) => prof.prof === name)
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
    async getData() {
      try {
        this.professors = []
        this.grades = []

        this.isLoading = true
        const { data: results } = await this.$axios(
          `/api/stats?course=${this.courseName}&semesterCode=${this.semesterCode}`
        )

        this.professors = results.professors
        this.grades = results.grades

        this.isLoading = false
      } catch (err) {
        this.$toast({
          title: 'Error',
          description: 'Error in Finding Course Info',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        })
      }
    },
  },
}
</script>
