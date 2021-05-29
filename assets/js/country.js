const api = axios.create({
  baseURL: "https://api.covid19api.com",
});
var myChart;

(function dataVazia() {
  if (document.getElementById("date_end").value == "") {
    dateToday = new Date(Date.now());
    document.getElementById("date_end").value = dateFns.format(dateToday, [
      (format = "YYYY-MM-DD"),
    ]);
  }
  if (document.getElementById("date_start").value == "") {
    document.getElementById("date_start").value = "2020-03-01";
  }
})();

function selectApply() {
  select = document.getElementById("cmbCountry").value;
  dateStart = document.getElementById("date_start").value; // Preciso substrair -1 data
  dateStart = dateFns.subDays(dateStart, 1);
  dateStart = dateFns.format(dateStart, [(format = "YYYY-MM-DD")]);
  dateEnd = document.getElementById("date_end").value;
  if (select == "") {
    select = "brazil";
  }
  api
    .get(
      `/country/${select}?from=${dateStart}T00:00:00Z&to=${dateEnd}T00:00:00Z`
    )
    .then((response) => {
      summaryData(response.data);
      var dataFrame = dataFrameCovid(response.data);
      averageDataFrame = _.meanBy(dataFrame, (p) => p.Value)
      lineGraphjs(dataFrame,averageDataFrame);
    })
    .catch((err) => {
      console.error("ops! ocorreu um erro" + err);
    });
}

function summaryData(data) {
  var data = data[data.length - 1];
  document.getElementById("kpiconfirmed").innerText =
    data.Confirmed.toLocaleString("PT-BR");
  document.getElementById("kpideaths").innerText =
    data.Deaths.toLocaleString("PT-BR");
  document.getElementById("kpirecovered").innerText =
    data.Recovered.toLocaleString("PT-BR");
}

function dataFrameCovid(data) {
  typeSelect = document.getElementById("cmbData").value;
  curvaDiaria = [];
  for (i = 1; i < data.length; i++) {
    curvaDiaria[i - 1] = new Object({
      Date: dateFns.format(data[i].Date, [(format = "YYYY-MM-DD")]),
      Value: data[i][typeSelect] - data[i - 1][typeSelect],
    });
  }
  return curvaDiaria;
}

function lineGraphjs(dataSet,averageDataFrame) {
  typeSelect = document.getElementById("cmbData").value;
  if (typeSelect == "Deaths") {
    labelChart = "Mortes";
  } else if (typeSelect == "Confirmed") {
    labelChart = "Confirmados";
  } else if (typeSelect == "Recovered") {
    labelChart = "Recuperados";
  }
  var ctx = document.getElementById("linhas").getContext("2d");
  try {
    myChart.destroy();
  } catch {}
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dataSet.map(function (a) {
        return a.Date;
      }),
      datasets: [
        {
          label: `Curva ${labelChart} Diaria Covid-19`,
          data: dataSet.map(function (a) {
            return a.Value;
          }),
          tension: 0.3,
          pointRadius: 0.5,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgb(54, 162, 235)",
        },
        {
            label: `Média de ${labelChart} Diaria Covid-19`,
            data: dataSet.map(function (a) {
                return averageDataFrame;
              }),
            tension: 0.3,
            pointRadius: 0.5,
            borderColor: "rgba(67, 255, 0, 1)",
            backgroundColor: "rgba(67, 255, 0, 1)",
          },
      ],
    },
    options: {
      animation : false,
      plugins: {
        title: {
          display: true,
          text: `Casos do ${select.replace(/^\w/, (c) => c.toUpperCase()) } Diarios de Covid-19`,
        },
      },
    },
  });
}

(function () {
  menuUpdate();
  selectApply();
})();
