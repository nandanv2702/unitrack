<template>
  <div class="container">
    <CBox
      v-bind="mainStyles[colorMode]"
      d="flex"
      w="100vw"
      min-h="100vh"
      h="full"
      flex-dir="column"
    >
      <c-box width="20px" height="20px">
        <dark-mode-toggle />
      </c-box>
      <c-box mt="10" justify-content="top">
        <CHeading text-align="center" mb="4"> ⚡️ UniTrack </CHeading>

        <c-flex justify="center" direction="column" align="center" mx="4">
          <c-flex as="form">
            <c-box mr="3" rounded="md">
              <c-select v-model="semesterCode" placeholder="Select Semester">
                <option value="grilled">Grilled Backyard Burger</option>
                <option value="pub-style">The Pub-Style Burger</option>
                <option value="jucy-lucy">The Jucy Lucy</option>
              </c-select>
            </c-box>
            <c-pseudo-box
              as="input"
              placeholder="Course, e.g., Econ 101"
              type="text"
              px="4"
              rounded="md"
              bg="gray.100"
              border-width="1px"
              :_hover="{ borderColor: 'gray.200', bg: 'gray.200' }"
              :_focus="{
                outline: 'none',
                bg: 'white',
                boxShadow: 'outline',
                borderColor: 'gray.300',
              }"
            />
            <CButton
              py="2"
              px="6"
              ml="3"
              rounded="md"
              font-weight="semibold"
              variant-color="blue"
              @click.prevent="showToast"
            >
              Search
            </CButton>
          </c-flex>
        </c-flex>
      </c-box>

      <c-divider m="8"></c-divider>

      <c-box justify-content="bottom" mx="12" my="4">
        <modal :is-open="isOpen" @close="close" />
        <c-simple-grid min-child-width="240px" spacing="20px">
          <professor-rating @open="open" />
          <professor-rating @open="open" />
          <professor-rating @open="open" />
          <professor-rating @open="open" />
          <professor-rating @open="open" />
          <professor-rating @open="open" />
        </c-simple-grid>
      </c-box>
    </CBox>
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
      semesterCode: undefined,
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
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
  },
}
</script>
