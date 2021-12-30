<template>
  <div id="canvas-bg">
    <canvas id="grades-chart"></canvas>
  </div>
</template>

<script>
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from 'chart.js'

export default {
  name: 'ModalGradesChart',
  props: {
    grades: {
      type: Array,
      required: true,
    },
    terms: {
      type: Object,
      required: true,
    }
  },
  computed: {
    data() {
      return {
        type: 'line',
        data: {
          labels: this.grades.map((sem) => this.terms[sem.x]),
          datasets: [
            {
              label: {
                display: true,
                text: 'Semester',
                color: '#333333',
                font: {
                  size: 20,
                  weight: 'bold',
                },
                padding: { top: 10, left: 0, right: 0, bottom: 0 },
              },
              color: '#333333',
              data: this.grades,
              borderColor: '#8bbdd9',
              backgroundColor: '#8bbdd9',
              cubicInterpolationMode: 'monotone',
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Semester Code',
                color: '#333333',
                font: {
                  size: 15,
                  weight: 'bold',
                },
                padding: { top: 10, left: 0, right: 0, bottom: 0 },
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Avg. GPA',
                color: '#333333',
                font: {
                  size: 15,
                  weight: 'bold',
                },
                padding: { top: 0, left: 0, right: 20, bottom: 0 },
              },
              ticks: {
                min: 1,
                stepSize: 0.1,
              }
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'Grade Trends',
              color: '#333333',
              font: {
                size: 20,
                color: '#333333'
              }
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
        },
      }
    },
  },
  mounted() {
    console.log(this.data)
    const ctx = document.getElementById('grades-chart')
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      Title,
      CategoryScale
    )
    // eslint-disable-next-line no-new
    new Chart(ctx, this.data)
  },
}
</script>

<style scoped>
#canvas-bg {
  background: white;
  padding: 25px;
  border-radius: 10px;
}
</style>