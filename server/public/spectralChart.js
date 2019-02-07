var measurementData;

function updateSpectralChart(violet=0, blue=0, green=0, yellow=0, orange=0, red=0) {
  var ctx = document.getElementById('spectralChart').getContext('2d')
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
        text: 'Spectral Chart',
        fontSize: 30
      },
      legend: {
        display: false
      }
    }
  })
}

function updateWeatherChart(violet=0, blue=0, green=0, yellow=0, orange=0, red=0) {
  var ctx = document.getElementById('weatherChart').getContext('2d')
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
      datasets: [{
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18, 19, 20, 21, 22, 23, 24],
        fill: false
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Weather Chart',
        fontSize: 30
      },
      legend: {
        display: false
      }
    }
  })
}

updateSpectralChart()
updateWeatherChart()

document.getElementById('spectralButton').addEventListener('click', () => {
  var year = document.getElementById('spectralYear').value
  var month = document.getElementById('spectralMonth').value
  var day = document.getElementById('spectralDay').value
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
  updateSpectralChart(data['violet'], data['blue'], data['green'], data['yellow'], data['orange'], data['red']);
})

document.getElementById('waterButton').addEventListener('click', () => {
  var http = new XMLHttpRequest()
  http.open( 'POST', 'http://localhost:3000/water', false)
  http.send(null)
})

document.getElementById('weatherButton').addEventListener('click', () => {
  var year = document.getElementById('weatherYear').value
  var month = document.getElementById('weatherMonth').value
  var day = document.getElementById('weatherDay').value

  var date = year + month + day
  var http = new XMLHttpRequest()
  http.open( 'GET', 'http://localhost:3000/measurement/?date=' + date, false)
  http.send(null)

})
