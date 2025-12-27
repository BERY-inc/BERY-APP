import * as React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ArrowLeft, Check, Package } from "lucide-react";
import { orderService } from '../services';
import { toast } from "sonner";

interface ScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-5 pt-14 pb-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{title}</h1>
      </div>
    </div>
  );
}

function Placeholder({ children }: { children?: React.ReactNode }) {
  return (
    <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40">
      <p className="text-sm text-slate-300">This screen is scaffolded and ready for data integration.</p>
      {children}
    </Card>
  );
}

export function OrderScreen({ onBack, orders = [] as any[], onNavigate }: ScreenProps & { orders?: any[]; onNavigate?: (screen: string) => void; }) {
  const [orderData, setOrderData] = React.useState<any[]>(orders);
  const [loading, setLoading] = React.useState(!orders || orders.length === 0);

  // Fetch orders from API if none provided
  React.useEffect(() => {
    if (orders && orders.length > 0) {
      setOrderData(orders);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderResponse = await orderService.getOrderHistory();
        setOrderData(orderResponse.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrderData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orders]);

  const displayOrders = orders && orders.length > 0 ? orders : orderData;

  const handleOrderClick = (order: any) => {
    // Store the selected order in localStorage so OrderDetailsScreen can access it
    localStorage.setItem('selectedOrderId', order.id.toString());
    // Navigate to order details screen
    if (onNavigate) {
      onNavigate('order-details');
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Orders" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading orders...</p>
          </Card>
        ) : displayOrders.length === 0 ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">No orders yet.</p>
          </Card>
        ) : (
          displayOrders.map((o: any) => (
            <Card 
              key={o.id} 
              className="p-4 bg-[#1a1a2e] border-slate-700/40 cursor-pointer hover:bg-[#1a1a2e]/80 transition-colors"
              onClick={() => handleOrderClick(o)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Order {o.id}</span>
                <Badge className="bg-green-500/20 text-green-300 border-0">{o.order_status || 'Confirmed'}</Badge>
              </div>
              <div className="mt-2 text-xs text-slate-400">Items: {o.order_items?.length || 0}</div>
              <div className="text-xs text-slate-400">Total: ${o.order_amount?.toFixed?.(2) || '0.00'}</div>
              <div className="mt-2 text-xs text-blue-400">Tap to view details</div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export function MyOrdersScreen({ onBack, onNavigate }: ScreenProps) {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch orders from API
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderResponse = await orderService.getOrderHistory();
        
        if (orderResponse && orderResponse.orders) {
          setOrders(orderResponse.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewOrder = (orderId: number) => {
    localStorage.setItem('selectedOrderId', orderId.toString());
    onNavigate('order-details');
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="My Orders" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading orders...</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-300 mb-1">No orders yet</p>
              <p className="text-xs text-slate-400">Your order history will appear here</p>
            </div>
          </Card>
        ) : (
          orders.map((order) => (
            <Card 
              key={order.id} 
              className="p-4 bg-[#1a1a2e] border-slate-700/40"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold text-white">Order #{order.id}</span>
                  <p className="text-xs text-slate-400 mt-0.5">Placed on {formatDate(order.created_at)}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">
                  {order.order_status?.replace('_', ' ') || 'Confirmed'}
                </Badge>
              </div>

              {/* Order Items - Show first 2 items */}
              <div className="space-y-2 mb-3">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.slice(0, 2).map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 bg-[#0f0f1a] rounded-lg">
                      {/* Item Image */}
                      <div className="w-16 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.item?.image ? (
                          <img
                            src={item.item.image}
                            alt={item.item?.name || item.item_details}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="text-2xl">📦</div>';
                            }}
                          />
                        ) : (
                          <Package className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-white font-semibold mb-1">
                          {item.item?.name || item.item_details || 'Order Item'}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-slate-400">Qty: {item.quantity || 1}</span>
                          <span className="text-sm text-white font-semibold">
                            ${(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No items found</p>
                )}
                
                {/* Show more items indicator */}
                {order.order_items && order.order_items.length > 2 && (
                  <p className="text-xs text-blue-400 pl-1">
                    +{order.order_items.length - 2} more item{order.order_items.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-700/50 pt-3 space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-medium">Total Items:</span>
                  <span className="text-sm text-white font-semibold">{order.order_items?.length || 0} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-medium">Order Total:</span>
                  <span className="text-lg text-white font-bold">
                    ${(order.order_amount || 0).toFixed(2)}
                  </span>
                </div>
                {order.id && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Tracking ID:</span>
                    <span className="text-xs text-blue-400 font-medium">#{order.id}</span>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <Button
                onClick={() => handleViewOrder(order.id)}
                variant="outline"
                size="sm"
                className="w-full bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 font-medium"
              >
                View Full Details
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}


export function OrderDetailsScreen({ onBack, onNavigate }: ScreenProps) {
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [trackingInfo, setTrackingInfo] = React.useState<any>(null);
  const [showTracking, setShowTracking] = React.useState(false);

  const parseItemDetails = (value: unknown): any | null => {
    if (!value) return null;
    if (typeof value === 'object') return value;
    if (typeof value !== 'string') return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const getItemName = (item: any) => {
    const directName = item?.item?.name;
    if (typeof directName === 'string' && directName.trim()) return directName;
    const detailsObj = parseItemDetails(item?.item_details);
    const detailsName = detailsObj?.name;
    if (typeof detailsName === 'string' && detailsName.trim()) return detailsName;
    if (typeof item?.item_details === 'string' && item.item_details.trim()) return item.item_details;
    return 'Unknown Item';
  };

  // Fetch order details from API
  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        const storedOrderId = localStorage.getItem('selectedOrderId');
        const orderData = await orderService.getOrderHistory();
        const orders = Array.isArray(orderData?.orders) ? orderData.orders : [];

        const selectedOrder: any =
          (storedOrderId ? orders.find((o: any) => String(o?.id) === String(storedOrderId)) : null) ??
          (orders.length > 0 ? orders[0] : null);

        if (!selectedOrder) {
          setOrder(null);
          setTrackingInfo(null);
          return;
        }

        try {
          localStorage.setItem('selectedOrderId', String(selectedOrder.id));
        } catch {}

        let orderItems: any[] | undefined;
        try {
          const details = await orderService.getOrderDetails(String(selectedOrder.id));
          if (Array.isArray(details) && details.length > 0) {
            orderItems = details.map((d: any, index: number) => {
              const detailsObj = parseItemDetails(d?.item_details);
              const name =
                (typeof d?.item?.name === 'string' && d.item.name.trim() ? d.item.name : '') ||
                (typeof detailsObj?.name === 'string' && detailsObj.name.trim() ? detailsObj.name : '') ||
                (typeof d?.item_details === 'string' && d.item_details.trim() ? d.item_details : 'Unknown Item');

              const image =
                d?.item?.image ||
                (Array.isArray(detailsObj?.image_full_url) ? detailsObj.image_full_url[0] : undefined) ||
                detailsObj?.image;

              const quantity = Number(d?.quantity ?? 1) || 1;
              const taxAmount = Number(d?.tax_amount ?? d?.tax ?? 0) || 0;
              const price = Number(d?.price ?? d?.item_price ?? 0) || 0;

              return {
                id: d?.id ?? index,
                item_id: d?.item_id ?? d?.item?.id ?? 0,
                order_id: d?.order_id ?? selectedOrder.id,
                item_details: typeof d?.item_details === 'string' ? d.item_details : JSON.stringify(d?.item_details ?? {}),
                quantity,
                price,
                tax_amount: taxAmount,
                discount_on_item: Number(d?.discount_on_item ?? d?.discount ?? 0) || 0,
                created_at: d?.created_at ?? selectedOrder.created_at,
                updated_at: d?.updated_at ?? selectedOrder.updated_at,
                item: {
                  name,
                  image: image || ''
                }
              };
            });
          }
        } catch {}

        const mergedOrder = {
          ...selectedOrder,
          ...(orderItems ? { order_items: orderItems } : {})
        };

        setOrder(mergedOrder);

        const status = mergedOrder.order_status || 'confirmed';
        const est = mergedOrder.updated_at || mergedOrder.created_at || '';
        const timeline = [
          { status: 'Order Placed', time: mergedOrder.created_at, completed: true },
          { status: 'Order Confirmed', time: mergedOrder.updated_at, completed: ['confirmed', 'processing', 'preparing', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
          { status: 'Preparing', time: mergedOrder.updated_at, completed: ['preparing', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
          { status: 'Out for Delivery', time: est, completed: ['out_for_delivery', 'delivered'].includes(status) },
          { status: 'Delivered', time: '', completed: status === 'delivered' }
        ];
        setTrackingInfo({ status, estimatedDelivery: est, timeline });
      } catch (error) {
        toast.error('Failed to load order details');
        setOrder(null);
        setTrackingInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const toggleTracking = () => {
    setShowTracking(!showTracking);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Order Details" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading order details...</p>
          </Card>
        ) : order ? (
          <div className="space-y-4">
            {/* Order Summary */}
            <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Order #{order.id}</span>
                <Badge className="bg-blue-500/20 text-blue-300 border-0">
                  {order.order_status?.replace('_', ' ') || 'Confirmed'}
                </Badge>
              </div>
              <div className="mt-3 text-xs text-slate-400 space-y-1">
                <p>Placed on: {formatDate(order.created_at)}</p>
                <p>Total items: {order.order_items?.length || 0}</p>
                <p className="text-white font-semibold mt-1">Total: {formatCurrency(order.order_amount || 0)}</p>
                {order.address && <p>Delivery to: {order.address}</p>}
              </div>
                
              {/* Tracking Button */}
              <Button 
                onClick={toggleTracking}
                variant="outline" 
                className="w-full mt-3 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
              >
                {showTracking ? 'Hide Tracking' : 'Track Order'}
              </Button>
            </Card>
  
            {/* Order Tracking Section */}
            {showTracking && trackingInfo && (
              <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
                <h3 className="text-white font-semibold text-sm mb-3">Order Tracking</h3>
                  
                {/* Estimated Delivery */}
                <div className="mb-4 p-3 bg-blue-500/10 rounded-lg">
                  <p className="text-xs text-slate-400">Estimated Delivery</p>
                  <p className="text-sm text-white">{formatDate(trackingInfo.estimatedDelivery)}</p>
                </div>
                  
                {/* Tracking Timeline */}
                <div className="space-y-3">
                  {trackingInfo.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                        step.completed 
                          ? 'bg-green-500' 
                          : 'bg-slate-700'
                      }`}>
                        {step.completed ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-3 border-l border-slate-700/50 pl-3 ml-2.5">
                        <p className={`text-sm ${
                          step.completed ? 'text-white' : 'text-slate-400'
                        }`}>
                          {step.status}
                        </p>
                        {step.time && (
                          <p className="text-xs text-slate-500">{formatDate(step.time)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
  
            {/* Items List */}
            <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
              <h3 className="text-white font-semibold text-sm mb-3">Items Purchased</h3>
              <div className="space-y-3">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-[#0f0f1a] rounded-lg">
                    {/* Item Image */}
                    {item.item?.image ? (
                      <div className="w-12 h-12 rounded-md bg-slate-700 flex items-center justify-center">
                        <img 
                          src={item.item.image} 
                          alt={item.item.name || item.item_details} 
                          className="w-10 h-10 object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-slate-700 flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                      
                    {/* Item Details */}
                    <div className="flex-1">
                      <h4 className="text-sm text-white font-medium">
                        {getItemName(item)}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <p className="text-xs text-slate-400">Qty: {item.quantity || 1}</p>
                          {item.discount_on_item > 0 && (
                            <p className="text-xs text-red-400 line-through">
                              {formatCurrency((Number(item.price || 0) + Number(item.discount_on_item || 0)) / (Number(item.quantity || 1) || 1))}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-white font-semibold">
                          {formatCurrency(item.price || 0)}
                        </p>
                      </div>
                        
                      {/* Item Price Breakdown */}
                      <div className="mt-2 pt-2 border-t border-slate-700/50">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Price:</span>
                          <span className="text-slate-300">
                            {formatCurrency((Number(item.price || 0) - Number(item.tax_amount || 0)) / (Number(item.quantity || 1) || 1))} × {item.quantity || 1}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Tax:</span>
                          <span className="text-slate-300">
                            {formatCurrency(Number(item.tax_amount || 0) / (Number(item.quantity || 1) || 1))} × {item.quantity || 1}
                          </span>
                        </div>
                        {item.discount_on_item > 0 && (
                          <div className="flex justify-between text-xs text-red-400">
                            <span>Discount:</span>
                            <span>-{formatCurrency(item.discount_on_item)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
              
            {/* Order Totals */}
            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Subtotal:</span>
                <span className="text-white">
                  {formatCurrency((order.order_amount || 0) - (order.total_tax_amount || 0) - (order.delivery_charge || 0))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Tax:</span>
                <span className="text-white">{formatCurrency(order.total_tax_amount || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Delivery Fee:</span>
                <span className="text-white">{formatCurrency(order.delivery_charge || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-700/50">
                <span className="text-white">Total:</span>
                <span className="text-white">{formatCurrency(order.order_amount || 0)}</span>
              </div>
            </div>

            {/* Payment Information */}
            <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
              <h3 className="text-white font-semibold text-sm mb-3">Payment Information</h3>
              <div className="text-xs text-slate-400 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Payment Method:</span>
                  <span className="text-white capitalize">
                    {order.payment_method?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Payment Status:</span>
                  <span className="text-white capitalize">
                    {order.payment_status?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Order Type:</span>
                  <span className="text-white capitalize">
                    {order.order_type?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
                onClick={() => {
                  try {
                    localStorage.setItem("selectedOrderId", String(order?.id ?? ""));
                  } catch {}
                  onNavigate("order-tracking");
                }}
              >
                Open Tracking
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  try {
                    localStorage.setItem("selectedOrderId", String(order?.id ?? ""));
                  } catch {}
                  onNavigate("refund-request");
                }}
              >
                Request Refund
              </Button>
            </div>
          </div>
        ) : (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">No order details available</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export function OrderTrackingScreen({ onBack }: ScreenProps) {
  const [orderId, setOrderId] = React.useState(() => localStorage.getItem('selectedOrderId') ?? '');
  const [order, setOrder] = React.useState<any>(null);
  const [trackingInfo, setTrackingInfo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return String(dateString);
    }
  };

  const buildTrackingInfo = (raw: any) => {
    const status = String(raw?.order_status ?? raw?.status ?? 'confirmed');
    const createdAt = raw?.created_at ?? '';
    const updatedAt = raw?.updated_at ?? raw?.created_at ?? '';
    const estimatedDelivery = raw?.updated_at ?? raw?.created_at ?? '';
    const timeline = [
      { status: 'Order Placed', time: createdAt, completed: Boolean(createdAt) || true },
      { status: 'Order Confirmed', time: updatedAt, completed: ['confirmed', 'processing', 'preparing', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
      { status: 'Preparing', time: updatedAt, completed: ['preparing', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
      { status: 'Out for Delivery', time: updatedAt, completed: ['out_for_delivery', 'delivered'].includes(status) },
      { status: 'Delivered', time: '', completed: status === 'delivered' },
    ];
    return { status, estimatedDelivery, timeline };
  };

  const fetchTracking = React.useCallback(async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) {
      setOrder(null);
      setTrackingInfo(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const trackRes = await orderService.trackOrder(trimmed);
      const first = Array.isArray(trackRes) ? (trackRes[0] ?? null) : (trackRes as any);
      if (!first) {
        setOrder(null);
        setTrackingInfo(null);
        setError('Order not found.');
        return;
      }
      setOrder(first);
      setTrackingInfo(buildTrackingInfo(first));
    } catch (e: any) {
      setOrder(null);
      setTrackingInfo(null);
      setError('Failed to load tracking information.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem('selectedOrderId') ?? '';
    if (stored && stored !== orderId) setOrderId(stored);
    fetchTracking(stored || orderId);
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Order Tracking" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white font-semibold">Track an order</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTracking(orderId)}
              className="bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
          <Input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID"
            className="bg-[#0a0a1a] border-slate-700/40 text-white"
          />
          <Button onClick={() => fetchTracking(orderId)} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
            {loading ? 'Loading...' : 'Track'}
          </Button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </Card>

        {trackingInfo && (
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Order #{order?.id ?? orderId.trim()}</h3>
              <Badge className="bg-blue-500/20 text-blue-300 border-0 capitalize">
                {String(trackingInfo.status).replace(/_/g, ' ')}
              </Badge>
            </div>

            <div className="mb-4 p-3 bg-blue-500/10 rounded-lg">
              <p className="text-xs text-slate-400">Estimated Delivery</p>
              <p className="text-sm text-white">{formatDate(trackingInfo.estimatedDelivery)}</p>
            </div>

            <div className="space-y-3">
              {trackingInfo.timeline.map((step: any, index: number) => (
                <div key={index} className="flex items-start">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                      step.completed ? 'bg-green-500' : 'bg-slate-700'
                    }`}
                  >
                    {step.completed ? <Check className="w-4 h-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                  </div>
                  <div className="flex-1 pb-3 border-l border-slate-700/50 pl-3 ml-2.5">
                    <p className={`text-sm ${step.completed ? 'text-white' : 'text-slate-400'}`}>{step.status}</p>
                    {step.time && <p className="text-xs text-slate-500">{formatDate(step.time)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export function GuestTrackOrderScreen({ onBack, onNavigate }: ScreenProps) {
  const [orderId, setOrderId] = React.useState('');
  const [order, setOrder] = React.useState<any>(null);
  const [trackingInfo, setTrackingInfo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return String(dateString);
    }
  };

  const buildTrackingInfo = (raw: any) => {
    const status = String(raw?.order_status ?? raw?.status ?? 'confirmed');
    const createdAt = raw?.created_at ?? '';
    const updatedAt = raw?.updated_at ?? raw?.created_at ?? '';
    const estimatedDelivery = raw?.updated_at ?? raw?.created_at ?? '';
    const timeline = [
      { status: 'Order Placed', time: createdAt, completed: Boolean(createdAt) || true },
      { status: 'Order Confirmed', time: updatedAt, completed: ['confirmed', 'processing', 'preparing', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
      { status: 'Preparing', time: updatedAt, completed: ['preparing', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
      { status: 'Out for Delivery', time: updatedAt, completed: ['out_for_delivery', 'delivered'].includes(status) },
      { status: 'Delivered', time: '', completed: status === 'delivered' },
    ];
    return { status, estimatedDelivery, timeline };
  };

  const track = async () => {
    const trimmed = orderId.trim();
    if (!trimmed) {
      toast.error("Enter an order ID");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setOrder(null);
      setTrackingInfo(null);
      const trackRes = await orderService.trackOrder(trimmed);
      const first = Array.isArray(trackRes) ? (trackRes[0] ?? null) : (trackRes as any);
      if (!first) {
        setError('Order not found.');
        return;
      }
      setOrder(first);
      setTrackingInfo(buildTrackingInfo(first));
    } catch {
      setError('Failed to load tracking information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Guest Track Order" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
          <Input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter order ID"
            className="bg-[#0a0a1a] border-slate-700/40 text-white"
          />
          <Button onClick={track} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
            {loading ? 'Loading...' : 'Track Order'}
          </Button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </Card>

        {trackingInfo && (
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Order #{order?.id ?? orderId.trim()}</h3>
              <Badge className="bg-blue-500/20 text-blue-300 border-0 capitalize">
                {String(trackingInfo.status).replace(/_/g, ' ')}
              </Badge>
            </div>

            <div className="p-3 bg-blue-500/10 rounded-lg">
              <p className="text-xs text-slate-400">Estimated Delivery</p>
              <p className="text-sm text-white">{formatDate(trackingInfo.estimatedDelivery)}</p>
            </div>

            <div className="space-y-3">
              {trackingInfo.timeline.map((step: any, index: number) => (
                <div key={index} className="flex items-start">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                      step.completed ? 'bg-green-500' : 'bg-slate-700'
                    }`}
                  >
                    {step.completed ? <Check className="w-4 h-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                  </div>
                  <div className="flex-1 pb-3 border-l border-slate-700/50 pl-3 ml-2.5">
                    <p className={`text-sm ${step.completed ? 'text-white' : 'text-slate-400'}`}>{step.status}</p>
                    {step.time && <p className="text-xs text-slate-500">{formatDate(step.time)}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
                onClick={() => {
                  localStorage.setItem('selectedOrderId', String(order?.id ?? orderId.trim()));
                  onNavigate('order-details');
                }}
              >
                View Details
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  localStorage.setItem('selectedOrderId', String(order?.id ?? orderId.trim()));
                  onNavigate('order-tracking');
                }}
              >
                Open Tracking
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              onClick={() => {
                try {
                  localStorage.setItem('selectedOrderId', String(order?.id ?? orderId.trim()));
                } catch {}
                onNavigate('refund-request');
              }}
            >
              Request Refund
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
