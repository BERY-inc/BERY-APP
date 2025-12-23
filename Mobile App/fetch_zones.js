
async function getZones() {
  try {
    const response = await fetch('https://market.bery.in/api/v1/zone/list');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

getZones();
