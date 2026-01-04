import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, CircleCheckBig, ArrowLeft, ArrowUp } from "lucide-react";
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
  const [tableDescription, setTableDescription] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MenuItem[]>([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const { t } = useTranslation();

  const categoryMap: Record<string, string> = {
    "Əsas yeməklər": t("admin.mainDishes"),
    "Desertlər": t("admin.desserts"),
    "İçkilər": t("admin.drinks"),
    "Salatlar": t("admin.salads"),
    "Başlanğıclar": t("admin.appetizers"),
  };

  const handleSearchInputChange = (value: string) => {
  setSearchInput(value);

  if (value.trim().length === 0) {
    setSuggestions([]);
    setShowSuggestions(false);
    return;
  }

  const q = value.toLowerCase();

  const filtered = menu.filter(
    item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );

  setSuggestions(filtered.slice(0, 5));
  setShowSuggestions(true);
};



  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const close = () => setShowSuggestions(false);
  window.addEventListener("click", close);
  return () => window.removeEventListener("click", close);
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
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      setCart(cart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    const existing = cart.find((i) => i.id === id);
    if (existing && existing.quantity > 1) {
      setCart(cart.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
      setCart(cart.filter((i) => i.id !== id));
    }
  };

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!customerName || !tableNumber || !tableDescription || cart.length === 0) {
      toast.error(t("order.fillAll"));
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/api/orders', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          tableNumber,
          tableDescription,
          items: cart,
          totalPrice: getTotalPrice(),
        }),
      });
      if (response.ok) {
        setOrderSuccess(true);
        setTimeout(() => {
          setCart([]);
          setCustomerName("");
          setTableNumber("");
          setTableDescription("");
          setShowCart(false);
          setOrderSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error(t("order.error"), error);
      toast.error(t("order.error"));
    }
  };

  const categories = ["all", ...Array.from(new Set(menu.map((item) => item.category)))];

  const filteredMenu = menu.filter(item => 
    (selectedCategory === "all" || item.category === selectedCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition" aria-label="Geri">
                <ArrowLeft className="size-6 text-gray-700" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-red-600">{t("menu.title")}</h1>
              <p className="text-sm text-gray-600">{t("menu.welcome")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            <LanguageSelector />
            <button onClick={() => setShowCart(true)} className="relative bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition">
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

      {/* Search & Filter */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 items-center justify-center">

        <div className="relative w-full max-w-md">
      <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden">
        <input
          type="text"
          placeholder={t("menu.searchPlaceholder")}
          value={searchInput}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          onFocus={() => searchInput && setShowSuggestions(true)}
          className="flex-1 px-4 py-3 focus:outline-none"
        />
        <button
          onClick={() => {
            setSearchQuery(searchInput);
            setShowSuggestions(false);
          }}
          className="bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition font-semibold"
        >
          {t("menu.searchBtn")}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
        >
          {suggestions.map((item) => (
  <button
    key={item.id}
    onClick={() => {
      setSearchInput(item.name);
      setSearchQuery(item.name);
      setShowSuggestions(false);
    }}
    className="w-full px-4 py-3 hover:bg-red-50 transition flex items-center gap-3"
  >
    <img
      src={item.imageUrl}
      alt={item.name}
      className="w-10 h-10 rounded-md object-cover flex-shrink-0"
    />

    <div className="flex-1 text-left">
      <p className="font-medium text-gray-800 leading-tight">
        {item.name}
      </p>
      <p className="text-xs text-gray-500 truncate">
        {item.description}
      </p>
    </div>

    <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
      ₼{item.price.toFixed(2)}
    </span>
  </button>
))}

        </div>
      )}
        </div>

    <div className="flex flex-col gap-2 items-center">
      <span className="text-gray-700 font-medium mb-1">
        {t("menu.category")}
      </span>
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold border transition ${
              selectedCategory === cat
                ? "bg-red-600 text-white border-red-600 shadow-lg scale-105"
                : "bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            }`}
          >
            {cat === "all"
              ? t("menu.all")
              : categoryMap[cat] || cat}
          </button>
        ))}
      </div>
    </div>

        </div>
      </div>



      {/* Menu Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover cursor-pointer" onClick={() => setSelectedProduct(item)} />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <p className="text-gray-500 text-sm mb-2">{categoryMap[item.category] || item.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-bold text-xfl">₼{item.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(item)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                    <Plus className="size-4" /> {t("menu.addToCart")}
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
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
              </div>

              {orderSuccess ? (
                <div className="text-center py-12">
                  <CircleCheckBig className="size-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-600 mb-2">{t("order.success")}</h3>
                  <p className="text-gray-600">{t("order.preparing")}</p>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-center text-gray-500 py-12">{t("cart.empty")}</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-red-600 font-bold">₼{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="bg-gray-200 p-1 rounded hover:bg-gray-300"><Minus className="size-4" /></button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="bg-gray-200 p-1 rounded hover:bg-gray-300"><Plus className="size-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 mb-6 flex justify-between items-center text-xl font-bold">
                    <span>Cəmi:</span>
                    <span className="text-red-600">₼{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="space-y-4">
                    <input type="text" placeholder={t("order.name")} value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600" />
                    <input type="text" placeholder={t("order.table")} value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600" />
                    <input type="text" placeholder={t("order.tableDescription")} value={tableDescription} onChange={(e) => setTableDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600" />
                    <button onClick={handleOrder} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">{t("order.submit")}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top */}
      {showScrollBtn && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-50 bg-red-600 text-white h-12 w-12 rounded-full shadow-lg hover:bg-red-700 transition flex items-center justify-center" aria-label="Scroll to top">
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Product Detail Bottom Sheet */}
      {selectedProduct && (
  <div
    className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
    onClick={() => setSelectedProduct(null)}
  >
    <div
      className="bg-white w-full md:w-full rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto animate-slideUp"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
        <button
          onClick={() => setSelectedProduct(null)}
          className="text-gray-500 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Content: Image left, Info right */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image */}
        <img
          src={selectedProduct.imageUrl}
          alt={selectedProduct.name}
          className="w-90 h-60 object-cover cursor-pointer rounded-lg"
        />

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
            <p className="text-gray-500 mb-2">
              {t("menu.category")} {selectedProduct.category}
            </p>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-bold text-red-600">
              ₼{selectedProduct.price.toFixed(2)}
            </span>
            <button
              onClick={() => {
                addToCart(selectedProduct);
                setSelectedProduct(null);
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              {t("menu.addToCart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default MenuView;