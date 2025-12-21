import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, CircleCheckBig, ArrowLeft } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuViewProps {
  onBack?: () => void;
}

export function MenuView({ onBack }: MenuViewProps) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-443fc9b4/menu`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Menyu yüklənərkən xəta:", error);
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
      alert("Zəhmət olmasa bütün məlumatları doldurun");
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-443fc9b4/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
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
      console.error("Sifariş göndərilərkən xəta:", error);
      alert("Sifariş göndərilərkən xəta baş verdi");
    }
  };

  const categories = [...new Set(menu.map((item) => item.category))];

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
              <h1 className="text-2xl font-bold text-red-600">Restoran Menyusu</h1>
              <p className="text-sm text-gray-600">Xoş gəlmisiniz</p>
            </div>
          </div>
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
      </header>

      {/* Menu */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-red-600 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={item.image}
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
                          Əlavə et
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Səbət</h2>
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
                    Sifarişiniz qəbul edildi!
                  </h3>
                  <p className="text-gray-600">Tezliklə hazırlanacaq</p>
                </div>
              ) : (
                <>
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                      Səbət boşdur
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
                              src={item.image}
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
                          placeholder="Adınız"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        <input
                          type="text"
                          placeholder="Masa nömrəsi"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        <button
                          onClick={handleOrder}
                          className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
                        >
                          Sifariş et
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