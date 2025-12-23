
async function test() {
  try {
    const headers = {
      'zoneId': '[1]',
      'moduleId': '1',
      'Content-Type': 'application/json'
    };

    // 1. Get a store ID
    console.log("Fetching stores...");
    const storeRes = await fetch('https://market.bery.in/api/v1/stores/latest?limit=1&offset=0', { headers });
    const storeData = await storeRes.json();
    const stores = storeData.stores || storeData;
    const storeId = stores[0]?.id;
    console.log("Store ID:", storeId);

    if (!storeId) return;

    // 2. Try to get items for this store using different endpoints/params

    // Attempt 1: /api/v1/items/latest with store_id only (Confirmed fail, but let's re-verify error message)
    console.log("\nAttempt 1: /api/v1/items/latest?store_id=" + storeId);
    const res1 = await fetch(`https://market.bery.in/api/v1/items/latest?limit=10&offset=0&store_id=${storeId}`, { headers });
    console.log("Status:", res1.status);
    if (!res1.ok) {
        const txt = await res1.text();
        console.log("Error body:", txt.substring(0, 200));
    } else {
        const data = await res1.json();
        console.log("Success! Items:", data.products?.length);
    }

    // Attempt 2: /api/v1/items/popular?store_id=...
    console.log("\nAttempt 2: /api/v1/items/popular?store_id=" + storeId);
    const res2 = await fetch(`https://market.bery.in/api/v1/items/popular?limit=10&offset=0&store_id=${storeId}`, { headers });
    console.log("Status:", res2.status);
    if (!res2.ok) {
        const txt = await res2.text();
        console.log("Error body:", txt.substring(0, 200));
    } else {
        const data = await res2.json();
        console.log("Success! Items:", data.products?.length);
    }

    // Attempt 3: /api/v1/categories?store_id=... (Check if we can get categories for a store)
    console.log("\nAttempt 3: /api/v1/categories?store_id=" + storeId);
    const res3 = await fetch(`https://market.bery.in/api/v1/categories?store_id=${storeId}`, { headers });
    console.log("Status:", res3.status);
    const cats = await res3.json();
    console.log("Categories found:", Array.isArray(cats) ? cats.length : "Not an array");
    if (Array.isArray(cats) && cats.length > 0) {
        console.log("First Category:", cats[0]);
    }

    // Attempt 4: /api/v1/items/latest (No params)
    console.log("\nAttempt 4: /api/v1/items/latest (No params)");
    const res4 = await fetch(`https://market.bery.in/api/v1/items/latest?limit=10&offset=0`, { headers });
    console.log("Status:", res4.status);
    if (!res4.ok) {
        const txt = await res4.text();
        console.log("Error body:", txt.substring(0, 200));
    } else {
        const data = await res4.json();
        console.log("Success! Items:", data.products?.length);
    }

    // Attempt 5: /api/v1/items/popular (No store_id)
    console.log("\nAttempt 5: /api/v1/items/popular (No store_id)");
    const res5 = await fetch(`https://market.bery.in/api/v1/items/popular?limit=10&offset=0`, { headers });
    console.log("Status:", res5.status);
    if (!res5.ok) {
        const txt = await res5.text();
        console.log("Error body:", txt.substring(0, 200));
    } else {
        const data = await res5.json();
        console.log("Success! Items:", data.products?.length);
    }

  } catch (e) {
    console.error(e);
  }
}

test();
