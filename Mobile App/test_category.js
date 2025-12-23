
async function test() {
  try {
    // 1. Fetch Categories
    console.log("Fetching categories...");
    const catRes = await fetch('https://market.bery.in/api/v1/categories', {
      headers: {
        'zoneId': '[1]',
        'moduleId': '1'
      }
    });
    const catData = await catRes.json();
    if (!catRes.ok) {
      console.error("Categories fetch failed:", catData);
      return;
    }
    console.log("Categories found:", catData.length);
    const firstCat = catData[0];
    console.log("First Category:", firstCat);

    if (!firstCat) return;

    // 2. Fetch Items with valid store and category
    // Need a store ID too.
    const storeRes = await fetch('https://market.bery.in/api/v1/stores/latest?limit=1&offset=0', {
       headers: { 'zoneId': '[1]', 'moduleId': '1' }
    });
    const storeData = await storeRes.json();
    console.log("Store Response Keys:", Object.keys(storeData));
    
    // Check if it is an array or object with stores key
    let stores = [];
    if (Array.isArray(storeData)) {
        stores = storeData;
    } else if (storeData.stores) {
        stores = storeData.stores;
    }

    const storeId = stores[0]?.id;
    console.log("Store ID:", storeId);

    if (!storeId) return;

    // Test 1: With store_id ONLY
    console.log(`\nTest 1: Fetching items with store_id=${storeId} ONLY...`);
    const itemRes1 = await fetch(`https://market.bery.in/api/v1/items/latest?limit=10&offset=0&store_id=${storeId}`, {
      headers: { 'zoneId': '[1]', 'moduleId': '1' }
    });
    const itemData1 = await itemRes1.json();
    console.log("Test 1 Status:", itemRes1.status);
    if (!itemRes1.ok) console.log("Test 1 Error:", JSON.stringify(itemData1));


    // Test 2: With store_id AND category_id
    console.log(`\nTest 2: Fetching items with store_id=${storeId} and category_id=${firstCat.id}...`);
    const itemRes = await fetch(`https://market.bery.in/api/v1/items/latest?limit=10&offset=0&store_id=${storeId}&category_id=${firstCat.id}`, {
      headers: {
        'zoneId': '[1]',
        'moduleId': '1'
      }
    });
    const itemData = await itemRes.json();
    console.log("Items response status:", itemRes.status);
    // console.log("Items data:", JSON.stringify(itemData, null, 2));

    if (itemRes.ok) {
        console.log("Items found:", itemData.products ? itemData.products.length : 0);
    } else {
        console.log("Error:", itemData);
    }

  } catch (e) {
    console.error(e);
  }
}

test();
