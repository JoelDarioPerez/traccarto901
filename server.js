let data =
  "POST /?id=013227009650882&timestamp=1690577411&lat=-31.5576437&lon=-68.507443&speed=0.0&bearing=0.0&altitude=642.800048828125&accuracy=16.322200775146484&batt=38.0&charge=true HTTP/1.1";

const startIndex = data.indexOf("/");
const endIndex = data.indexOf(" HTTP/");
const queryParams = data.slice(startIndex + 1, endIndex);

const paramsArray = queryParams.split("&");
const paramsObj = {};

for (const param of paramsArray) {
  const [keyWithPrefix, value] = param.split("=");
  const key = keyWithPrefix.replace("?", "");
  paramsObj[key] = value;
}

let lat = parseFloat(paramsObj.lat);
let long = parseFloat(paramsObj.lon);

let DireccionLat = (lat) => {
  if (lat < 0) {
    return "S";
  } else return "N";
};
let DireccionLong = (long) => {
  if (long < 0) {
    return "W";
  } else return "E";
};

let latitud = function convertLatitude(lat) {
  lat = parseFloat(lat);
  let degrees = Math.floor(Math.abs(lat));
  let minutes = (Math.abs(lat) - degrees) * 60;
  return `${degrees.toString().padStart(2, "0")}${minutes.toFixed(4)}`;
};
let longitud = function convertLongitude(long) {
  lat = parseFloat(long);
  let degrees = Math.floor(Math.abs(long));
  let minutes = (Math.abs(long) - degrees) * 60;
  let formattedMinutes = minutes.toFixed(4);
  return `${degrees.toString().padStart(3, "0")}${formattedMinutes}`;
};
let speed = paramsObj.speed;
let imei = paramsObj.id;
let timestamp = paramsObj.timestamp;
let Velocidad = function (speed) {
  // Convertir la velocidad a nudos.
  let knots = parseFloat(speed) * 0.539957;

  // Asegurar que la velocidad tenga siempre dos decimales.
  let formattedSpeed = knots.toFixed(2);

  // Asegurar que la velocidad tenga siempre tres dígitos.
  return formattedSpeed.padStart(6, "0");
};

let Hora = function (timestamp) {
  const fecha = new Date(timestamp * 1000);
  const horas = fecha.getUTCHours().toString().padStart(2, "0");
  const minutos = fecha.getUTCMinutes().toString().padStart(2, "0");
  const segundos = fecha.getUTCSeconds().toString().padStart(2, "0");
  return `${horas}${minutos}${segundos}`;
};

let fecha = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const dia = date.getUTCDate().toString().padStart(2, "0");
  const mes = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const ano = date.getUTCFullYear().toString().slice(-2).padStart(2, "0");
  return `${dia}${mes}${ano}`;
};
let latitudValue = latitud(lat);
let longitudValue = longitud(long);

let SendPackage = [
  "*HQ",
  imei,
  "V1",
  Hora(timestamp),
  "A",
  latitudValue,
  DireccionLat(lat),
  longitudValue,
  DireccionLong(long),
  Velocidad(speed),
  "0",
  fecha(timestamp),
  "FBFFBBFF", // Reemplazar "FFFFBBFF" por el estado del ACC
  "722",
  "310",
  "06211",
  "15036#",
];

let newPackage = SendPackage.join(",");

console.log(newPackage);
