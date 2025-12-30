import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, CircleCheckBig, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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

interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuViewProps {
  onBack?: () => void;
}


const MenuView: React.FC<MenuViewProps> = ({ onBack }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/menu');
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error(t("menu.errorLoad"), error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find((i) => i.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      setCart(cart.filter((i) => i.id !== itemId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleOrder = async () => {
    if (!customerName || !tableNumber || cart.length === 0) {
      toast.error(t("order.fillAll"));
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/orders',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName,
            tableNumber,
            items: cart,
            totalPrice: getTotalPrice(),
          }),
        }
      );

      if (response.ok) {
        setOrderSuccess(true);
        setTimeout(() => {
          setCart([]);
          setCustomerName("");
          setTableNumber("");
          setShowCart(false);
          setOrderSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error(t("order.error"), error);
      toast.error(t("order.error"));
    }
  };

  const categories = [...new Set(menu.map((item) => item.category))];
  const allCategories = ["all", ...categories];

  const filteredMenu = menu.filter((item) => {
  const matchesCategory =
    selectedCategory === "all" || item.category === selectedCategory;

  const matchesSearch =
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesCategory && matchesSearch;
});


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Geri"
              >
                <ArrowLeft className="size-6 text-gray-700" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-red-600">
                {t("menu.title")}
              </h1>
              <p className="text-sm text-gray-600">{t("menu.welcome")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            {/* Language Selector Button */}
            <LanguageSelector />
            {/* Shopping Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"
            >
              <ShoppingCart className="size-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden w-full max-w-md">
              <input
                type="text"
                placeholder={t("menu.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-3 focus:outline-none"
              />
              <button
                onClick={() => setSearchQuery(searchInput)}
                className="bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition font-semibold"
              >
                {t("menu.searchBtn")}
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-gray-700 font-medium mb-1">{t("menu.category")}</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-semibold border transition
                     ${selectedCategory === cat
                        ? 'bg-red-600 text-white border-red-600 shadow-lg scale-105'
                        : 'bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400'}`}>
                      {cat === "all" ? t("menu.all") : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-bold text-xl">
                    ₼{item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <Plus className="size-4" />
                    {t("menu.addToCart")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("cart.title")}</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {orderSuccess ? (
                <div className="text-center py-12">
                  <CircleCheckBig className="size-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    {t("order.success")}
                  </h3>
                  <p className="text-gray-600">{t("order.preparing")}</p>
                </div>
              ) : (
                <>
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                      {t("cart.empty")}
                    </p>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 border-b pb-4"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold">{item.name}</h3>
                              <p className="text-red-600 font-bold">
                                ₼{item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                              >
                                <Minus className="size-4" />
                              </button>
                              <span className="font-bold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                              >
                                <Plus className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 mb-6">
                        <div className="flex justify-between items-center text-xl font-bold">
                          <span>Cəmi:</span>
                          <span className="text-red-600">
                            ₼{getTotalPrice().toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder={t("order.name")}
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        <input
                          type="text"
                          placeholder={t("order.table")}
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        <button
                          onClick={handleOrder}
                          className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
                        >
                          {t("order.submit")}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuView;