function updateChart(violet=0, blue=0, green=0, yellow=0, orange=0, red=0) {
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: ["Violet", "Blue", "Green", "Yellow", "Orange", "Red"],
          datasets: [{
              label: "My First dataset",
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

document.getElementById("spectralButton").addEventListener("click", () => {
  var spectralText = document.getElementById("spectralText")
  var http = new XMLHttpRequest()
  http.open( "GET", "http://localhost:3000/data/?date=" + spectralText.value, false)
  http.send(null)
  data = JSON.parse(http.responseText)
  updateChart(data["violet"], data["blue"], data["green"], data["yellow"], data["orange"], data["red"]);
})
