function menu(data) {
  var option = "";
  data = data.sort((a, b) => a.Country.localeCompare(b.Country));

  for (var i = 0; i < data.length; i++) {
    option +=
      '<option value="' + data[i].Slug + '">' + data[i].Country + "</option>";
  }
  document.getElementById("cmbCountry").innerHTML = option;

}


function menuUpdate() {
  api
    .get("/countries")
    .then((response) => menu(response.data))
    .catch((err) => {
      console.error("ops! ocorreu um erro" + err);
    });
}