const maps = document.getElementById("map");
const inputValueIp = document.querySelector("input");
const btnValidation = document.querySelector("button");
const ipChange = document.querySelector("article ul li:nth-child(1) p");
const locationChange = document.querySelector("article ul li:nth-child(2) p");
const timezoneChange = document.querySelector("article ul li:nth-child(3) p");
const ispChange = document.querySelector("article ul li:nth-child(4) p");
let mapper, markerIcon, mark;

writeInnerHtmlData();

async function fetchIpData(ipValue) {
  let { ip } = await fetch("https://api.ipify.org?format=json").then((r) => r.json());
  return await fetch(`https://ipapi.co/${ipValue || ip}/json/`).then((reponse) => reponse.json());
}

async function writeInnerHtmlData(ipvalue) {
  const data = await fetchIpData(ipvalue);
  ipChange.textContent = data.ip;
  ispChange.textContent = data.org;
  locationChange.innerHTML = `${data.city}, ${data.country}<br>${data.postal}`;
  const timezone = `${data.utc_offset.slice(0, 3)}:${data.utc_offset.slice(3, 5)}`;
  timezoneChange.textContent = "UTC " + timezone;

  setMapLocation(data.latitude, data.longitude, ipvalue);
}

inputValueIp.addEventListener("keydown", (e) => {
  if (e.key === "Enter") validationIp(e);
});
btnValidation.addEventListener("click", validationIp);
function validationIp(e) {
  const ipAddress = inputValueIp.value;
  new RegExp("^(?:[0-9]{1,3}.){3}[0-9]{1,3}$").test(ipAddress) ? writeInnerHtmlData(ipAddress) : e.preventDefault();
}

function setMapLocation(lat, lng, newLoc) {
  markerIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [36, 46],
    iconAnchor: [20, 45],
  });

  if (!newLoc) {
    mapper = L.map("map", {
      center: [lat + 0.0004, lng],
      zoom: 18,
      zoomControl: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapper);
    mark = L.marker([lat, lng], {
      icon: markerIcon,
    }).addTo(mapper);
  }

  if (newLoc) {
    if (mark) {
      mapper.removeLayer(mark);
    }
    mapper.flyTo(new L.LatLng(lat, lng));
    mark = L.marker([lat, lng], {
      icon: markerIcon,
    }).addTo(mapper);

    newLoc = undefined;
  }
}
