var measurementData;


function updateChart(violet=0, blue=0, green=0, yellow=0, orange=0, red=0) {
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: ['Violet', 'Blue', 'Green', 'Yellow', 'Orange', 'Red'],
          datasets: [{
              label: 'My First dataset',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [violet, blue, green, yellow, orange, red],
          }]
      },

      // Configuration options go here
      options: {}
  });
}

updateChart();

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
