(() => {

var measurementData = {};

// updates spectral chart
function updateSpectralChart(data=[]) {
  var ctx = document.getElementById('spectralChart').getContext('2d');
  var gradientStroke = ctx.createLinearGradient(window.outerWidth - 100, 0, 0, 0);
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
        pointBackgroundColor: 'white',
        pointBorderWidth: 3,
        data: data,
        pointRadius: 6
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
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Wavelength',
            fontSize: 16
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Intensity (arbitary unit)',
            fontSize: 16
          }
        }]
      }
    }
  });
}

// updates weather chart
function updateWeatherChart(humidityData={}, temperatureData={}) {
  var color = Chart.helpers.color;
  var ctx = document.getElementById('weatherChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Humidity',
        data: humidityData,
        yAxisID: 'y-axis-1',
        borderColor: 'red',
        backgroundColor: color('red').alpha(0.4).rgbString(),
        fill: false,
        pointRadius: 5
      }, {
        label: 'Temperature',
        data: temperatureData,
        yAxisID: 'y-axis-2',
        borderColor: 'blue',
        backgroundColor: color('blue').alpha(0.4).rgbString(),
        fill: false,
        pointRadius: 5
      }]},
    options: {
      title: {
        display: true,
        text: 'Weather Chart',
        fontSize: 30
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'hA'
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Time',
            fontSize: 16
          }
        }],
        yAxes: [{
          id: 'y-axis-1',
          scaleLabel: {
            display: true,
            labelString: 'Humidity (%)',
            fontSize: 16
          }
        }, {
          id: 'y-axis-2',
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: 'Temperature (\xB0C)',
            fontSize: 16
          }
        }]
      }
    }
  });
}

// Get measurements from server
document.getElementById('spectralButton').addEventListener('click', () => {
  var year = document.getElementById('spectralYear').value;
  var month = document.getElementById('spectralMonth').value;
  var day = document.getElementById('spectralDay').value;
  var spectralSelect = document.getElementById('spectralSelect');
  var date = year + month + day;
  spectralSelect.innerHTML = '<option>Select data</option>';

  var http = new XMLHttpRequest();
  http.open( 'GET', 'http://localhost:3000/measurement/?date=' + date, false);
  http.send(null);
  measurementData = JSON.parse(http.responseText);

  for (var i = 0; i < measurementData.length; i++) {
    var item = document.createElement('option');
    var date = measurementData[i].date.toString();
    var itemText = document.createTextNode(date.substring(8, 10) + ':' + date.substring(10, 12) + ':' + date.substring(12));
    item.appendChild(itemText);
    item.setAttribute('value', i);
    spectralSelect.appendChild(item);
  }
});

// Updates spectral chart when data is selected
document.getElementById('spectralSelect').addEventListener('change', () => {
  data = measurementData[document.getElementById('spectralSelect').value];
  updateSpectralChart([data['violet'], data['blue'], data['green'], data['yellow'], data['orange'], data['red']]);
});

// Manually waters plant
document.getElementById('waterButton').addEventListener('click', () => {
  var http = new XMLHttpRequest();
  http.open( 'POST', 'http://localhost:3000/water', false);
  http.send(null);
});

// Updates weather chart when date is submitted
document.getElementById('weatherButton').addEventListener('click', () => {
  var year = document.getElementById('weatherYear').value;
  var month = document.getElementById('weatherMonth').value;
  var day = document.getElementById('weatherDay').value;
  var date = year + month + day;

  var http = new XMLHttpRequest()
  http.open( 'GET', 'http://localhost:3000/measurement/?date=' + date, false);
  http.send(null);
  measurementData = JSON.parse(http.responseText);

  var humidityData = [];
  var temperatureData = [];
  for (var i = 0; i < measurementData.length; i++) {
    var date = measurementData[i].date.toString();
    humidityData.push({
      x: new Date(date.substring(0, 4), date.substring(4, 6), date.substring(6, 8), date.substring(8, 10), date.substring(10, 12), date.substring(12)),
      y: measurementData[i].humidity
    });
    temperatureData.push({
      x: new Date(date.substring(0, 4), date.substring(4, 6), date.substring(6, 8), date.substring(8, 10), date.substring(10, 12), date.substring(12)),
      y: measurementData[i].temperature
    });
  }

  updateWeatherChart(humidityData, temperatureData);
});

updateSpectralChart();
updateWeatherChart();

})();
