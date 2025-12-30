import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Package, ShoppingBag, LogOut, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
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

interface Feedback {
  id: string;
  name: string;
  email?: string;
  type: "comment" | "suggestion" | "complaint";
  message: string;
  createdAt: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<"menu" | "orders" | "feedback">("orders");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const { t } = useTranslation();
  const categoryMap: Record<string, string> = {
    "Əsas yeməklər": t("admin.mainDishes"),
    "Desertlər": t("admin.desserts"),
    "İçkilər": t("admin.drinks"),
    "Salatlar": t("admin.salads"),
    "Başlanğıclar": t("admin.appetizers"),
  };

  useEffect(() => {
    fetchMenu();
    fetchOrders();
    fetchFeedback();
    const interval = setInterval(fetchOrders, 10000);
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

    const orders = data.map((o: any) => ({
      ...o,
      customerName: o.customerName,
      tableNumber: o.tableNumber,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
    })).reverse();

    setOrders(orders);
  } catch (error) {
    console.error(t("admin.errorLoadingOrders"), error);
  }
};



  const fetchFeedback = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/feedback');
    const data = await response.json();

    const sortedFeedback = data.sort(
      (a: Feedback, b: Feedback) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFeedback(sortedFeedback);
  } catch (error) {
    console.error(t("admin.errorLoadingFeedback"), error);
  }
};


  const handleAddMenuItem = async () => {
  if (!formData.name || !formData.price || !formData.category) {
    toast.error(t("admin.fillRequiredFields"));
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("http://localhost:4000/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl,
        price: parseFloat(formData.price),
      }),
    });

    const createdItem = await response.json();

    setMenu((prev) => [...prev, createdItem]);

    setShowMenuModal(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    });
  } catch (err) {
    toast.error("Xəta baş verdi");
  } finally {
    setLoading(false);
  }
};


  const handleUpdateMenuItem = async () => {
  if (!editingItem) return;

  setLoading(true);
  try {
    const response = await fetch(
      `http://localhost:4000/api/menu/${editingItem.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          imageUrl: formData.imageUrl,
          price: parseFloat(formData.price),
        }),
      }
    );

    const updatedItem = await response.json();

    setMenu((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );

    setShowMenuModal(false);
    setEditingItem(null);
  } catch {
    toast.error("Xəta baş verdi");
  } finally {
    setLoading(false);
  }
};


        const handleDeleteMenuItem = async (id: string) => {
        if (!confirm(t("admin.confirmDeleteMenuItem"))) return;

        try {
          const response = await fetch(`http://localhost:4000/api/menu/${id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            let errorMessage = "Xəta baş verdi";
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
              errorMessage = response.statusText || errorMessage;
            }
            console.error(`Məhsul silinərkən xəta: ${response.status} - ${errorMessage}`);
            toast.error(errorMessage);
            return;
          }

          const data = await response.json();
          setMenu(data);
          toast.success(t("admin.productDeletedSuccessfully"));
        } catch (error) {
          console.error("Məhsul silinərkən şəbəkə xətası və ya cavabın oxunmasında problem:", error);
          toast.error(t("admin.errorOccurred"));
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
      console.error(t("admin.errorOccurred"), error);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await fetch(`http://localhost:4000/api/orders/${orderToDelete}`,
        {
          method: "DELETE",
        }
      );
      fetchOrders();
      toast.success(t("admin.orderDeletedSuccessfully"));
    } catch (error) {
      console.error(t("admin.errorOccurred"), error);
      toast.error(t("admin.errorOccurred"));
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
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
      console.error(t("admin.errorOccurred"), error);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
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
      imageUrl: item.imageUrl,
    });
    setShowMenuModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "yeni":
        return "bg-blue-100 text-blue-800";
      case "{t('admin.preparing')}":
        return "bg-yellow-100 text-yellow-800";
      case "{t('admin.ready')}":
        return "bg-green-100 text-green-800";
      case "{t('admin.delivered')}":
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
              {t("admin.adminPanel")}
            </h1>
            <p className="text-sm text-gray-600">{t("admin.managementPanel")}</p>
          </div>
          <div className="ml-auto">
            <LanguageSelector />
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <LogOut className="size-4" />
            {t("admin.logout")}
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
            {t("admin.orders")}
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
            {t("admin.menuManagement")}
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "feedback"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="size-5" />
            {t("admin.feedback")}
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("admin.activeOrders")}</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <ShoppingBag className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t("admin.noOrdersYet")}</p>
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
                          {t("order.table")}: {order.tableNumber}
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
                      {order.items.map((items, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between py-2 border-b last:border-0"
                        >
                          <span>
                            {items.quantity}x {items.name}
                          </span>
                          <span className="font-semibold">
                            ₼{(items.price * items.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-red-600">
                        {t("admin.total")}: ₼{order.totalPrice.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, t("admin.preparing"))
                          }
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        >
                          {t("admin.preparing")}
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, t("admin.ready"))
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          {t("admin.ready")}
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, t("admin.delivered"))
                          }
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                          {t("admin.delivered")}
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
              <h2 className="text-2xl font-bold">{t("admin.menuManagement")}</h2>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <Plus className="size-5" />
                {t("admin.addMenuItem")}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(menu) ? menu : []).map((items) => (
                <div
                  key={items.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <img
                    src={items.imageUrl}
                    alt={items.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{items.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {items.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {categoryMap[items.category] || items.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 font-bold text-xl">
                        ₼{items.price.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(items)}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(items.id)}
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

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("admin.feedbackCustomer")}</h2>
            {feedback.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <MessageSquare className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t("admin.noFeedbackYet")}</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {feedback.map((items) => (
                  <div key={items.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{items.name}</h3>
                        {items.email && (
                          <p className="text-sm text-gray-600">{items.email}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(items.createdAt).toLocaleString('az-AZ')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        items.type === 'comment' ? 'bg-blue-100 text-blue-800' :
                        items.type === 'suggestion' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {items.type === 'comment' ? t("feedback.comment") :
                         items.type === 'suggestion' ? t("feedback.suggestion") : t("feedback.complaint")}
                      </span>
                    </div>
                    <p className="text-gray-700">{items.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingItem ? t("admin.editMenuItem") : t("admin.addNewMenuItem")}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder={t("admin.name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <textarea
                placeholder={t("admin.description")}
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
                placeholder={t("admin.price") + " (₼)"}
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
                <option value="">{t("admin.category")}</option>
                <option value="Əsas yeməklər">{t("admin.mainDishes")}</option>
                <option value="Desertlər">{t("admin.desserts")}</option>
                <option value="İçkilər">{t("admin.drinks")}</option>
                <option value="Salatlar">{t("admin.salads")}</option>
                <option value="Başlanğıclar">{t("admin.appetizers")}</option>
              </select>
              <input
                type="text"
                placeholder="Şəkil URL"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setShowMenuModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  {t("common.back")}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.confirmDeleteOrder")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.confirmDeleteOrderDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.back")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOrder} className="bg-red-600 hover:bg-red-700">
              {t("admin.confirmDeleteOrder")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminDashboard;