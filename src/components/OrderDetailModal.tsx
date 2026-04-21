"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Phone, Package, Loader2, Mail } from "lucide-react";
import { useGetAdminOrderDetail, useUpdateAdminOrder } from "@/hooks/useOrder";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

export function OrderDetailModal({ isOpen, onClose, orderId }: OrderDetailModalProps) {
  const { data: order, isLoading } = useGetAdminOrderDetail(orderId || "");
  const updateMutation = useUpdateAdminOrder();

  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.delivery_status);
      setReason(order.reson_for_cancellation || "");
    }
  }, [order]);

  if (!isOpen) return null;

  const handleSaveChanges = async () => {
    if (!orderId) return;
    await updateMutation.mutateAsync({
      orderId,
      data: {
        delivery_status: status,
        reson_for_cancellation: status === "CANCELLED" ? reason : "",
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-green-600 w-10 h-10" />
            <p className="text-gray-500">Fetching Order Details...</p>
          </div>
        ) : order ? (
          <>
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-semibold">Order Details</h2>
                <p className="text-gray-500">{order.orderId} • {new Date(order.createdAt).toDateString()}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <label className="block text-sm font-medium">Update Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                {status === "CANCELLED" && (
                  <input
                    type="text"
                    placeholder="Reason for cancellation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2.5 border rounded-xl mt-2"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg"><Mail className="w-5 h-5 text-blue-500" /></div>
                    <div>
                      <p className="text-sm font-medium">{order.userId?.name}</p>
                      <p className="text-xs text-gray-500">{order.userId?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg"><Phone className="w-5 h-5 text-green-500" /></div>
                    <div>
                      <p className="text-sm font-medium">{order.delivery_address?.mobile || "N/A"}</p>
                      <p className="text-xs text-gray-500">Contact Number</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg"><MapPin className="w-5 h-5 text-orange-500" /></div>
                  <div>
                    <p className="text-sm font-medium">
                      {order.delivery_address?.street}, {order.delivery_address?.city}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.delivery_address?.state}, {order.delivery_address?.postalCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.list_items?.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-medium">{item.product_details?.name}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">₹{item.total?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{order.subTotalAmt?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Grand Total</span>
                  <span className="text-green-600">₹{order.totalAmt?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3 bg-white sticky bottom-0">
              <button onClick={onClose} className="px-6 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
              <button
                disabled={updateMutation.isPending}
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
              >
                {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <div className="p-20 text-center text-gray-500">Order not found.</div>
        )}
      </div>
    </div>
  );
}