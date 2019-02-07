var measurementData;

function updateChart(violet=0, blue=0, green=0, yellow=0, orange=0, red=0) {
  var ctx = document.getElementById('myChart').getContext('2d')
  var gradientStroke = ctx.createLinearGradient(window.outerWidth, 0, 0, 0)
  gradientStroke.addColorStop(1, '#EE82EE');
  gradientStroke.addColorStop(0.8, '#0000FF');
  gradientStroke.addColorStop(0.6, '#008000');
  gradientStroke.addColorStop(0.4, '#FFFF00');
  gradientStroke.addColorStop(0.2, '#FFA500');
  gradientStroke.addColorStop(0, '#FF0000');
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Violet', 'Blue', 'Green', 'Yellow', 'Orange', 'Red'],
      datasets: [{
        backgroundColor: gradientStroke,
        borderColor: gradientStroke,
        data: [violet, blue, green, yellow, orange, red],
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Spectral Data',
        fontSize: 30
      },
      legend: {
        display: false
      }
    }
  })
}

updateChart()

document.getElementById('spectralButton').addEventListener('click', () => {
  var year = document.getElementById('year').value
  var month = document.getElementById('month').value
  var day = document.getElementById('day').value
  var spectralSelect = document.getElementById('spectralSelect')

  var date = year + month + day
  var http = new XMLHttpRequest()
  http.open( 'GET', 'http://localhost:3000/measurement/?date=' + date, false)
  http.send(null)
  console.log(http.responseText)
  measurementData = JSON.parse(http.responseText)

  for (var i = 0; i < measurementData.length; i++) {
    console.log(measurementData[i].date)
    var item = document.createElement('option')
    var itemText = document.createTextNode(measurementData[i].date)
    item.appendChild(itemText)
    item.setAttribute('value', i)
    spectralSelect.appendChild(item)
  }
})

document.getElementById('spectralSelect').addEventListener('change', () => {
  data = measurementData[document.getElementById('spectralSelect').value]
  updateChart(data['violet'], data['blue'], data['green'], data['yellow'], data['orange'], data['red']);
})

document.getElementById('waterButton').addEventListener('click', () => {
  var http = new XMLHttpRequest()
  http.open( 'POST', 'http://localhost:3000/water', false)
  http.send(null)
})
