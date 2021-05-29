const api = axios.create({
  baseURL: "https://api.covid19api.com",
});
api
  .get("/summary")
  .then((response) => globalSummary(response.data))
  .catch((err) => {
    console.error("ops! ocorreu um erro" + err);
  });

function globalSummary(data) {
  document.getElementById("recovered").innerText =
    data.Global.TotalRecovered.toLocaleString("PT-BR");
  document.getElementById("confirmed").innerText =
    data.Global.TotalConfirmed.toLocaleString("PT-BR");
  document.getElementById("death").innerText =
    data.Global.TotalDeaths.toLocaleString("PT-BR");
  dataConverter(data.Date);
  chartPie(data.Global);
  barChart(data.Countries);
}

function dataConverter(date) {
  var dateFormat = dateFns.format(date, [(format = " DD-MM-YY HH:mm:ss")]);
  document.getElementById("date-text").innerText = dateFormat;
}

function chartPie(dataSet) {
  var canvas = document.getElementById("pizza");
  var ctx = canvas.getContext("2d");
  ctx.width = 100;
  ctx.height = 100;
  var data = {
    labels: ["Confirmados ", "Recuperados", "Mortes"],
    datasets: [
      {
        fill: true,
        data: [
          dataSet.TotalConfirmed,
          dataSet.TotalRecovered,
          dataSet.TotalDeaths,
        ],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };
  // Chart declaration:
  var myBarChart = new Chart(ctx, {
    type: "pie",
    data: data,
    options: {
      maintainAspectRatio: false,
      responsive: false,
    },
  });
}

function barChart(dataSet) {
  var dataFilter = _.orderBy(dataSet, ["TotalDeaths"], ["desc"]);
  dataFilter.length = 10;
  var ctx = document.getElementById("barras");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dataFilter.map(function (a) {
        return a.Country;
      }),
      datasets: [
        {
          label: "Total de Mortes por pais - Top 10",
          data: dataFilter.map(function (a) {
            return a.TotalDeaths;
          }),
          borderWidth: 1,
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      maintainAspectRatio: false,
      responsive: false,
    },
  });
}
