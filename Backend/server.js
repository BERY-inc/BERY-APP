const http = require('http');
const { randomUUID } = require('crypto');

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';

const nowIso = () => new Date().toISOString();

const sendJson = (res, status, body) => {
  const json = JSON.stringify(body ?? {});
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Expose-Headers': '*',
    'Cache-Control': 'no-store',
  });
  res.end(json);
};

const readBody = (req) =>
  new Promise((resolve) => {
    const contentType = String(req.headers['content-type'] || '').toLowerCase();
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 5_000_000) {
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({ raw: '', data: undefined });
      if (contentType.includes('application/json')) {
        try {
          return resolve({ raw, data: JSON.parse(raw) });
        } catch {
          return resolve({ raw, data: undefined });
        }
      }
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(raw);
        const obj = {};
        for (const [k, v] of params.entries()) obj[k] = v;
        return resolve({ raw, data: obj });
      }
      return resolve({ raw, data: undefined });
    });
  });

const parseAuthToken = (req) => {
  const header = String(req.headers.authorization || '');
  if (!header.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7).trim() || null;
};

const state = (() => {
  const zones = [
    {
      id: 1,
      name: 'Default Zone',
      display_name: 'Default Zone',
      status: 1,
      coordinates: { type: 'Polygon', coordinates: [] },
      formated_coordinates: [],
    },
  ];

  const modules = [
    {
      id: 1,
      module_name: 'Grocery',
      module_type: 'grocery',
      thumbnail: '',
      status: 1,
    },
  ];

  const categories = [
    {
      id: 1,
      name: 'Demo category',
      image_full_url: '',
      slug: 'demo-category',
      childes: [{ id: 2, name: 'Demo sub category', slug: 'demo-sub-category' }],
    },
  ];

  const stores = [
    {
      id: 1,
      name: 'Demo Store',
      phone: '0000000000',
      email: 'store@example.com',
      logo: '',
      latitude: '0',
      longitude: '0',
      address: 'Demo Address',
      minimum_order: 0,
      comission: 0,
      schedule_order: false,
      status: 1,
      vendor_id: 1,
      created_at: nowIso(),
      updated_at: nowIso(),
      free_delivery: true,
      cover_photo: '',
      delivery: true,
      take_away: true,
      item_section: true,
      tax: 0,
      zone_id: 1,
      reviews_section: true,
      active: true,
      off_day: '',
      gst: '',
      self_delivery_system: 0,
      pos_system: false,
      minimum_shipping_charge: 0,
      delivery_time: '30-40',
      veg: 0,
      non_veg: 0,
      order_count: 0,
      total_order: 0,
      module_id: 1,
      order_place_to_schedule_interval: 0,
      featured: 1,
      per_km_shipping_charge: 0,
      prescription_order: false,
      slug: 'demo-store',
      maximum_shipping_charge: 0,
      cutlery: false,
      meta_title: '',
      meta_description: '',
      meta_image: '',
      announcement: 0,
      announcement_message: '',
      rating_count: 10,
      avg_rating: 4.5,
      rating: '4.5',
      items_count: 1,
      approved: 1,
    },
  ];

  const items = [
    {
      id: 1,
      name: 'Demo Product',
      description: 'Demo product description',
      image: '',
      price: 10,
      discount: 0,
      discount_type: 'percent',
      available_time_starts: '00:00',
      available_time_ends: '23:59',
      veg: 0,
      status: 1,
      store_id: 1,
      module_id: 1,
      category_id: 1,
      rating_count: 10,
      avg_rating: 4.5,
      created_at: nowIso(),
      updated_at: nowIso(),
      images: [],
      choice_options: [],
      variations: [],
      add_ons: [],
      tags: [],
      organic: 0,
      stock: 999,
    },
  ];

  const usersById = new Map();
  const userIdByEmailOrPhone = new Map();
  const tokenToUserId = new Map();

  const cartsByKey = new Map();
  const wishlistByKey = new Map();
  const addressesByKey = new Map();
  const ordersByKey = new Map();

  let nextUserId = 1;
  let nextCartId = 1;
  let nextWishlistId = 1;
  let nextAddressId = 1;
  let nextOrderId = 1000;
  let nextOrderItemId = 5000;

  const getKeyFromReq = (req, query, guestIdOverride) => {
    const token = parseAuthToken(req);
    if (token && tokenToUserId.has(token)) return `u:${tokenToUserId.get(token)}`;
    const guestId = String(guestIdOverride || query.get('guest_id') || '').trim();
    if (guestId) return `g:${guestId}`;
    return 'g:anonymous';
  };

  const getOrCreateUser = ({ email_or_phone, password }) => {
    const key = String(email_or_phone || '').trim() || 'user';
    if (userIdByEmailOrPhone.has(key)) {
      const id = userIdByEmailOrPhone.get(key);
      return usersById.get(id);
    }
    const id = nextUserId++;
    const user = {
      id,
      f_name: 'Demo',
      l_name: 'User',
      email: key.includes('@') ? key : `${key}@example.com`,
      phone: key.includes('@') ? '0000000000' : key,
      image: '',
      is_phone_verified: 1,
      email_verified_at: null,
      created_at: nowIso(),
      updated_at: nowIso(),
      password: String(password || ''),
      wallet_balance: 1000,
      loyalty_point: 0,
    };
    usersById.set(id, user);
    userIdByEmailOrPhone.set(key, id);
    return user;
  };

  const requireUser = (req) => {
    const token = parseAuthToken(req);
    if (!token) return { ok: false };
    const userId = tokenToUserId.get(token);
    if (!userId) return { ok: false };
    const user = usersById.get(userId);
    if (!user) return { ok: false };
    return { ok: true, token, user, userId };
  };

  const getCart = (key) => {
    if (!cartsByKey.has(key)) cartsByKey.set(key, []);
    return cartsByKey.get(key);
  };

  const getWishlist = (key) => {
    if (!wishlistByKey.has(key)) wishlistByKey.set(key, []);
    return wishlistByKey.get(key);
  };

  const getAddresses = (key) => {
    if (!addressesByKey.has(key)) addressesByKey.set(key, []);
    return addressesByKey.get(key);
  };

  const getOrders = (key) => {
    if (!ordersByKey.has(key)) ordersByKey.set(key, []);
    return ordersByKey.get(key);
  };

  const buildOrderFromCart = (key, orderData) => {
    const cart = getCart(key);
    const orderId = nextOrderId++;
    const orderItems = cart.map((ci) => {
      const id = nextOrderItemId++;
      return {
        id,
        item_id: ci.item_id,
        order_id: orderId,
        item_details: JSON.stringify(ci.item),
        quantity: ci.quantity,
        price: ci.price,
        tax_amount: 0,
        discount_on_item: 0,
        created_at: nowIso(),
        updated_at: nowIso(),
        item: { name: ci.item?.name || 'Item', image: ci.item?.image || '' },
      };
    });

    const store = stores.find((s) => s.id === Number(orderData.store_id)) || stores[0];
    const order = {
      id: orderId,
      user_id: key.startsWith('u:') ? Number(key.slice(2)) : 0,
      store_id: Number(orderData.store_id || store.id),
      order_amount: Number(orderData.order_amount || 0),
      coupon_discount_amount: 0,
      coupon_discount_title: '',
      payment_status: 'paid',
      order_status: 'pending',
      total_tax_amount: 0,
      payment_method: String(orderData.payment_method || 'wallet'),
      coupon_code: '',
      order_note: String(orderData.order_note || ''),
      order_type: String(orderData.order_type || 'delivery'),
      created_at: nowIso(),
      updated_at: nowIso(),
      store: { name: store.name, logo: store.logo },
      order_items: orderItems,
    };
    return order;
  };

  return {
    zones,
    modules,
    categories,
    stores,
    items,
    usersById,
    userIdByEmailOrPhone,
    tokenToUserId,
    cartsByKey,
    wishlistByKey,
    addressesByKey,
    ordersByKey,
    getKeyFromReq,
    getOrCreateUser,
    requireUser,
    getCart,
    getWishlist,
    getAddresses,
    getOrders,
    buildOrderFromCart,
    nextCartId: () => nextCartId++,
    nextWishlistId: () => nextWishlistId++,
    nextAddressId: () => nextAddressId++,
  };
})();

const matchPath = (pathname, pattern) => {
  const p = pattern.split('/').filter(Boolean);
  const s = pathname.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    const seg = p[i];
    const actual = s[i];
    if (seg.startsWith(':')) {
      params[seg.slice(1)] = actual;
    } else if (seg !== actual) {
      return null;
    }
  }
  return params;
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    });
    return res.end();
  }

  if (req.method === 'GET' && pathname === '/health') {
    return sendJson(res, 200, { ok: true, time: nowIso() });
  }

  if (req.method === 'GET' && pathname === '/api/v1/zone/list') {
    return sendJson(res, 200, state.zones);
  }

  if (req.method === 'GET' && pathname === '/api/v1/module') {
    return sendJson(res, 200, state.modules);
  }

  if (req.method === 'GET' && pathname === '/api/v1/categories') {
    return sendJson(res, 200, state.categories);
  }

  {
    const params = matchPath(pathname, '/api/v1/categories/items/:categoryId');
    if (req.method === 'GET' && params) {
      const categoryId = Number(params.categoryId);
      const products = state.items.filter((it) => it.category_id === categoryId);
      return sendJson(res, 200, { products });
    }
  }

  if (req.method === 'GET' && pathname === '/api/v1/stores/latest') {
    const limit = Number(url.searchParams.get('limit') || 20);
    const offset = Number(url.searchParams.get('offset') || 0);
    const start = Math.max(0, offset);
    const stores = state.stores.slice(start, start + Math.max(1, limit));
    return sendJson(res, 200, { total_size: state.stores.length, limit, offset, stores });
  }

  if (req.method === 'GET' && pathname === '/api/v1/stores/popular') {
    const limit = Number(url.searchParams.get('limit') || 20);
    const offset = Number(url.searchParams.get('offset') || 0);
    const start = Math.max(0, offset);
    const stores = state.stores.slice(start, start + Math.max(1, limit));
    return sendJson(res, 200, { total_size: state.stores.length, limit, offset, stores });
  }

  if (req.method === 'GET' && pathname === '/api/v1/stores/recommended') {
    const limit = Number(url.searchParams.get('limit') || 20);
    const offset = Number(url.searchParams.get('offset') || 0);
    const start = Math.max(0, offset);
    const stores = state.stores.slice(start, start + Math.max(1, limit));
    return sendJson(res, 200, { total_size: state.stores.length, limit, offset, stores });
  }

  {
    const params = matchPath(pathname, '/api/v1/stores/get-stores/:filter');
    if (req.method === 'GET' && params) {
      const limit = Number(url.searchParams.get('limit') || 20);
      const offset = Number(url.searchParams.get('offset') || 0);
      const start = Math.max(0, offset);
      const stores = state.stores.slice(start, start + Math.max(1, limit));
      return sendJson(res, 200, { total_size: state.stores.length, limit, offset, stores });
    }
  }

  if (req.method === 'GET' && pathname === '/api/v1/items/popular') {
    const storeId = Number(url.searchParams.get('store_id') || 0);
    const products = storeId ? state.items.filter((it) => it.store_id === storeId) : state.items;
    return sendJson(res, 200, { products });
  }

  if (req.method === 'GET' && pathname === '/api/v1/items/recommended') {
    return sendJson(res, 200, { products: state.items });
  }

  if (req.method === 'GET' && pathname === '/api/v1/items/discounted') {
    return sendJson(res, 200, { products: [] });
  }

  if (req.method === 'GET' && pathname === '/api/v1/items/latest') {
    const storeIdRaw = url.searchParams.get('store_id');
    const categoryIdRaw = url.searchParams.get('category_id');
    if (!storeIdRaw || !categoryIdRaw) {
      const errors = [];
      if (!storeIdRaw) errors.push({ code: 'store_id', message: 'The store id field is required.' });
      if (!categoryIdRaw) errors.push({ code: 'category_id', message: 'The category id field is required.' });
      return sendJson(res, 403, { errors });
    }
    const storeId = Number(storeIdRaw);
    const categoryId = Number(categoryIdRaw);
    const products = state.items.filter((it) => it.store_id === storeId && it.category_id === categoryId);
    return sendJson(res, 200, { products });
  }

  {
    const params = matchPath(pathname, '/api/v1/items/details/:itemId');
    if (req.method === 'GET' && params) {
      const itemId = Number(params.itemId);
      const item = state.items.find((it) => it.id === itemId);
      if (!item) return sendJson(res, 404, { message: 'Not Found' });
      return sendJson(res, 200, item);
    }
  }

  if (req.method === 'GET' && pathname === '/api/v1/items/search') {
    const name = String(url.searchParams.get('name') || '').toLowerCase();
    const products = state.items.filter((it) => it.name.toLowerCase().includes(name));
    return sendJson(res, 200, { products });
  }

  if (req.method === 'POST' && pathname === '/api/v1/auth/guest/request') {
    const guest_id = `${Date.now()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    return sendJson(res, 200, { guest_id });
  }

  if (req.method === 'POST' && pathname === '/api/v1/auth/login') {
    const { data } = await readBody(req);
    const user = state.getOrCreateUser(data || {});
    const token = randomUUID();
    state.tokenToUserId.set(token, user.id);
    return sendJson(res, 200, {
      token,
      is_phone_verified: 1,
      is_email_verified: 1,
      is_personal_info: 1,
      is_exist_user: true,
      login_type: (data && data.login_type) || 'manual',
      email: user.email,
    });
  }

  if (req.method === 'POST' && pathname === '/api/v1/auth/sign-up') {
    const { data } = await readBody(req);
    const user = state.getOrCreateUser({ email_or_phone: data?.email || data?.phone || 'user', password: data?.password });
    const token = randomUUID();
    state.tokenToUserId.set(token, user.id);
    return sendJson(res, 200, {
      token,
      is_phone_verified: 1,
      is_email_verified: 1,
      is_personal_info: 1,
      is_exist_user: true,
      login_type: 'manual',
      email: user.email,
    });
  }

  if (req.method === 'POST' && pathname === '/api/v1/auth/verify-phone') {
    const token = randomUUID();
    const user = state.getOrCreateUser({ email_or_phone: 'otp_user', password: '' });
    state.tokenToUserId.set(token, user.id);
    return sendJson(res, 200, {
      token,
      is_phone_verified: 1,
      is_email_verified: 1,
      is_personal_info: 1,
      is_exist_user: true,
      login_type: 'otp',
      email: user.email,
    });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/info') {
    const auth = state.requireUser(req);
    if (!auth.ok) return sendJson(res, 401, { message: 'Unauthorized' });
    const u = auth.user;
    return sendJson(res, 200, {
      id: u.id,
      f_name: u.f_name,
      l_name: u.l_name,
      email: u.email,
      phone: u.phone,
      image: u.image,
      is_phone_verified: u.is_phone_verified,
      email_verified_at: u.email_verified_at,
      created_at: u.created_at,
      updated_at: u.updated_at,
      order_count: 0,
      member_since_days: 0,
      wallet_balance: u.wallet_balance,
      loyalty_point: u.loyalty_point,
      ref_code: '',
    });
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/wallet/check-user') {
    const { data } = await readBody(req);
    return sendJson(res, 200, { exists: true, recipient: data?.email_or_phone || '' });
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/wallet/fund-transfer') {
    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/wallet/transactions') {
    return sendJson(res, 200, { transactions: [] });
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/update-profile') {
    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/address/list') {
    const key = state.getKeyFromReq(req, url.searchParams);
    return sendJson(res, 200, { addresses: state.getAddresses(key) });
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/address/add') {
    const { data } = await readBody(req);
    const key = state.getKeyFromReq(req, url.searchParams, data?.guest_id);
    const addresses = state.getAddresses(key);
    const id = state.nextAddressId();
    const record = {
      id,
      user_id: key.startsWith('u:') ? Number(key.slice(2)) : 0,
      contact_person_name: String(data?.contact_person_name || ''),
      contact_person_number: String(data?.contact_person_number || ''),
      address_type: String(data?.address_type || 'home'),
      address: String(data?.address || ''),
      latitude: String(data?.latitude || '0'),
      longitude: String(data?.longitude || '0'),
      zone_id: Number(data?.zone_id || 1),
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    addresses.push(record);
    return sendJson(res, 200, record);
  }

  {
    const params = matchPath(pathname, '/api/v1/customer/address/update/:id');
    if (req.method === 'PUT' && params) {
      const { data } = await readBody(req);
      const key = state.getKeyFromReq(req, url.searchParams);
      const addresses = state.getAddresses(key);
      const id = Number(params.id);
      const idx = addresses.findIndex((a) => a.id === id);
      if (idx === -1) return sendJson(res, 404, { message: 'Not Found' });
      const existing = addresses[idx];
      addresses[idx] = { ...existing, ...data, id, updated_at: nowIso() };
      return sendJson(res, 200, addresses[idx]);
    }
  }

  if (req.method === 'DELETE' && pathname === '/api/v1/customer/address/delete') {
    const { data } = await readBody(req);
    const key = state.getKeyFromReq(req, url.searchParams, data?.guest_id);
    const addresses = state.getAddresses(key);
    const id = Number(data?.id);
    const idx = addresses.findIndex((a) => a.id === id);
    if (idx !== -1) addresses.splice(idx, 1);
    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/cart/list') {
    const key = state.getKeyFromReq(req, url.searchParams);
    return sendJson(res, 200, { cart_items: state.getCart(key) });
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/cart/add') {
    const { data } = await readBody(req);
    const key = state.getKeyFromReq(req, url.searchParams, data?.guest_id);
    const cart = state.getCart(key);
    const itemId = Number(data?.item_id);
    const existing = cart.find((c) => c.item_id === itemId);
    if (existing) return sendJson(res, 409, { message: 'Item already exists' });
    const item = state.items.find((it) => it.id === itemId) || state.items[0];
    const cartItem = {
      id: state.nextCartId(),
      item_id: itemId,
      item,
      quantity: Number(data?.quantity || 1),
      price: Number(data?.price || item.price || 0),
      discount: 0,
      tax: 0,
      variant: String(data?.variant || ''),
      variation: Array.isArray(data?.variation) ? data.variation : [],
      add_ons: Array.isArray(data?.add_ons) ? data.add_ons : [],
      add_on_qtys: Array.isArray(data?.add_on_qtys) ? data.add_on_qtys : [],
      add_on_prices: [],
    };
    cart.push(cartItem);
    return sendJson(res, 200, cartItem);
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/cart/update') {
    const { data } = await readBody(req);
    const key = state.getKeyFromReq(req, url.searchParams, data?.guest_id);
    const cart = state.getCart(key);
    const cartId = Number(data?.cart_id);
    const idx = cart.findIndex((c) => Number(c.id) === cartId);
    if (idx !== -1) {
      cart[idx] = { ...cart[idx], quantity: Number(data?.quantity || cart[idx].quantity), price: Number(data?.price || cart[idx].price) };
    }
    return sendJson(res, 200, { cart_items: cart });
  }

  if (req.method === 'DELETE' && pathname === '/api/v1/customer/cart/remove-item') {
    const { data } = await readBody(req);
    const key = state.getKeyFromReq(req, url.searchParams, data?.guest_id);
    const cart = state.getCart(key);
    const cartId = Number(data?.cart_id);
    const idx = cart.findIndex((c) => Number(c.id) === cartId);
    if (idx !== -1) cart.splice(idx, 1);
    return sendJson(res, 200, { cart_items: cart });
  }

  if (req.method === 'DELETE' && pathname === '/api/v1/customer/cart/remove') {
    const key = state.getKeyFromReq(req, url.searchParams);
    state.cartsByKey.set(key, []);
    return sendJson(res, 200, { cart_items: [] });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/wish-list/') {
    const key = state.getKeyFromReq(req, url.searchParams);
    const list = state.getWishlist(key);
    return sendJson(res, 200, { products: list });
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/wish-list/add') {
    const { data } = await readBody(req);
    const key = state.getKeyFromReq(req, url.searchParams);
    const list = state.getWishlist(key);
    const itemId = Number(data?.item_id);
    const item = state.items.find((it) => it.id === itemId) || state.items[0];
    const record = {
      id: state.nextWishlistId(),
      user_id: key.startsWith('u:') ? Number(key.slice(2)) : 0,
      item_id: itemId,
      created_at: nowIso(),
      updated_at: nowIso(),
      item,
    };
    list.push(record);
    return sendJson(res, 200, record);
  }

  if (req.method === 'DELETE' && pathname === '/api/v1/customer/wish-list/remove') {
    const { data } = await readBody(req);
    const key = state.getKeyFromReq(req, url.searchParams);
    const list = state.getWishlist(key);
    const itemId = Number(data?.item_id);
    const idx = list.findIndex((w) => w.item_id === itemId);
    if (idx !== -1) list.splice(idx, 1);
    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/order/running-orders') {
    const key = state.getKeyFromReq(req, url.searchParams);
    const orders = state.getOrders(key).filter((o) => o.order_status !== 'delivered');
    const limit = Number(url.searchParams.get('limit') || 10);
    const offset = Number(url.searchParams.get('offset') || 1);
    return sendJson(res, 200, { total_size: orders.length, limit, offset, orders });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/order/list') {
    const key = state.getKeyFromReq(req, url.searchParams);
    const orders = state.getOrders(key);
    const limit = Number(url.searchParams.get('limit') || 10);
    const offset = Number(url.searchParams.get('offset') || 1);
    return sendJson(res, 200, { total_size: orders.length, limit, offset, orders });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/order/details') {
    const key = state.getKeyFromReq(req, url.searchParams);
    const orderId = Number(url.searchParams.get('order_id'));
    const orders = state.getOrders(key).filter((o) => o.id === orderId);
    return sendJson(res, 200, orders);
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/order/track') {
    const key = state.getKeyFromReq(req, url.searchParams);
    const orderId = Number(url.searchParams.get('order_id'));
    const orders = state.getOrders(key).filter((o) => o.id === orderId);
    return sendJson(res, 200, orders);
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/order/cancel') {
    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/order/cancellation-reasons') {
    return sendJson(res, 200, {
      reasons: [
        { id: 1, reason: 'Changed my mind', user_type: 'customer', status: 1, created_at: nowIso(), updated_at: nowIso() },
      ],
    });
  }

  if (req.method === 'GET' && pathname === '/api/v1/customer/order/refund-reasons') {
    return sendJson(res, 200, {
      refundReasons: [{ id: 1, reason: 'Damaged item', status: 1, created_at: nowIso(), updated_at: nowIso() }],
    });
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/order/refund-request') {
    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'POST' && pathname === '/api/v1/customer/order/place') {
    const { data } = await readBody(req);
    const key = state.getKeyFromReq(req, url.searchParams, data?.guest_id);
    const order = state.buildOrderFromCart(key, data || {});
    const orders = state.getOrders(key);
    orders.unshift(order);
    state.cartsByKey.set(key, []);
    return sendJson(res, 200, { order_id: order.id, order });
  }

  if (req.method === 'GET' && pathname === '/message/list') {
    return sendJson(res, 200, { type: null, total_size: 0, limit: Number(url.searchParams.get('limit') || 10), offset: Number(url.searchParams.get('offset') || 1), conversations: [] });
  }

  if (req.method === 'GET' && pathname === '/message/search-list') {
    return sendJson(res, 200, { type: null, total_size: 0, limit: Number(url.searchParams.get('limit') || 10), offset: Number(url.searchParams.get('offset') || 1), conversations: [] });
  }

  if (req.method === 'GET' && pathname === '/message/details') {
    return sendJson(res, 200, {
      total_size: 0,
      limit: Number(url.searchParams.get('limit') || 10),
      offset: Number(url.searchParams.get('offset') || 1),
      status: true,
      message: 'ok',
      messages: [],
      conversation: {
        id: 1,
        sender_id: 0,
        sender_type: 'customer',
        receiver_id: 0,
        receiver_type: 'admin',
        unread_message_count: 0,
        last_message_id: 0,
        last_message_time: nowIso(),
        created_at: nowIso(),
        updated_at: nowIso(),
      },
    });
  }

  if (req.method === 'POST' && pathname === '/message/send') {
    return sendJson(res, 200, {
      total_size: 1,
      limit: 10,
      offset: 1,
      status: true,
      message: 'sent',
      messages: [
        {
          id: 1,
          conversation_id: 1,
          sender_id: 0,
          message: 'sent',
          is_seen: 1,
          created_at: nowIso(),
          updated_at: nowIso(),
        },
      ],
      conversation: {
        id: 1,
        sender_id: 0,
        sender_type: 'customer',
        receiver_id: 0,
        receiver_type: 'admin',
        unread_message_count: 0,
        last_message_id: 1,
        last_message_time: nowIso(),
        created_at: nowIso(),
        updated_at: nowIso(),
      },
    });
  }

  return sendJson(res, 404, { message: 'Not Found', path: pathname });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`Backend running on http://${HOST}:${PORT}\n`);
});
