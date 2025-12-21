import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  ShoppingBag,
  LogOut,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("orders");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    fetchMenu();
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Refresh orders every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/menu');
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Menyu yüklənərkən xəta:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/orders');
      const data = await response.json();
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const freshOrders = data.filter((order: Order) => new Date(order.createdAt) >= oneDayAgo);
      const oldOrders = data.filter((order: Order) => new Date(order.createdAt) < oneDayAgo);
      setOrders(freshOrders);
      oldOrders.forEach((order: Order) => deleteOldOrder(order.id));
    } catch (error) {
      console.error("Sifarişlər yüklənərkən xəta:", error);
    }
  };

  const handleAddMenuItem = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert("Zəhmət olmasa bütün məlumatları doldurun");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/menu',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
          }),
        }
      );
      const data = await response.json();
      setMenu(data);
      setShowMenuModal(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.error("Məhsul əlavə edilərkən xəta:", error);
      alert("Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMenuItem = async () => {
    if (!editingItem) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/menu/${editingItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
          }),
        }
      );
      const data = await response.json();
      setMenu(data);
      setShowMenuModal(false);
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.error("Məhsul yenilənərkən xəta:", error);
      alert("Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm("Bu məhsulu silmək istədiyinizdən əminsiniz?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/menu/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Məhsul silinərkən xəta:", error);
      alert("Xəta baş verdi");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`http://localhost:4000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Status yenilənərkən xəta:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Bu sifarişi silmək istədiyinizdən əminsiniz?")) return;

    try {
      await fetch(`http://localhost:4000/api/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Sifariş silinərkən xəta:", error);
      alert("Xəta baş verdi");
    }
  };

  const deleteOldOrder = async (orderId: string) => {
    try {
      await fetch(`http://localhost:4000/api/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error("Köhnə sifariş silinərkən xəta:", error);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
    setShowMenuModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
    });
    setShowMenuModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "yeni":
        return "bg-blue-100 text-blue-800";
      case "hazırlanır":
        return "bg-yellow-100 text-yellow-800";
      case "hazırdır":
        return "bg-green-100 text-green-800";
      case "təhvil verilib":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-red-600">
              Admin Paneli
            </h1>
            <p className="text-sm text-gray-600">İdarəetmə paneli</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <LogOut className="size-4" />
            Çıxış
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "orders"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ShoppingBag className="size-5" />
            Sifarişlər
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "menu"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Package className="size-5" />
            Menyu İdarəsi
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Aktiv Sifarişlər</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <ShoppingBag className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Hələ sifariş yoxdur</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {order.customerName}
                        </h3>
                        <p className="text-gray-600">
                          Masa: {order.tableNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString("az-AZ")}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between py-2 border-b last:border-0"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-semibold">
                            ₼{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-red-600">
                        Cəmi: ₼{order.totalPrice.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, "hazırlanır")
                          }
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        >
                          Hazırlanır
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, "hazırdır")
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          Hazırdır
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, "təhvil verilib")
                          }
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                          Təhvil verilib
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Menyu İdarəsi</h2>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <Plus className="size-5" />
                Yeni Məhsul
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 font-bold text-xl">
                        ₼{item.price.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingItem ? "Məhsulu Redaktə Et" : "Yeni Məhsul Əlavə Et"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ad"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <textarea
                placeholder="Təsvir"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                rows={3}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Qiymət (₼)"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">Kateqoriya seçin</option>
                <option value="Əsas yeməklər">Əsas yeməklər</option>
                <option value="Desertlər">Desertlər</option>
                <option value="İçkilər">İçkilər</option>
                <option value="Salatlar">Salatlar</option>
                <option value="Başlanğıclar">Başlanğıclar</option>
              </select>
              <input
                type="text"
                placeholder="Şəkil URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setShowMenuModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Ləğv et
                </button>
                <button
                  onClick={
                    editingItem ? handleUpdateMenuItem : handleAddMenuItem
                  }
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Yüklənir..." : editingItem ? "Yenilə" : "Əlavə et"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}