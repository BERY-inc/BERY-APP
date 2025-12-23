
async function test() {
  try {
    const response = await fetch('https://market.bery.in/api/v1/items/latest?limit=1&offset=0', {
      headers: {
        'zoneId': '[1]',
        'moduleId': '1'
      }
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
