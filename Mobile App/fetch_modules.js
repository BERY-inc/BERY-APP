
async function getModules() {
  const zones = [1, 2, 3];
  for (const zone of zones) {
    console.log(`Fetching modules for Zone ${zone}...`);
    try {
      const response = await fetch('https://market.bery.in/api/v1/module', {
        headers: {
          'zoneId': JSON.stringify([zone])
        }
      });
      const data = await response.json();
      console.log(`Zone ${zone} Modules:`, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
}

getModules();
