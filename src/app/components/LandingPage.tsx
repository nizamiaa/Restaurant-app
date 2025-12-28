import { ChefHat, QrCode, ShoppingBag, Clock, Star, MapPin, Phone, Mail, Menu as MenuIcon } from "lucide-react";
interface LandingPageProps {
  onViewMenu: () => void;
  onViewFeedback: () => void;
  onAdminAccess: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onViewMenu, onViewFeedback, onAdminAccess }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <ChefHat className="size-20 mx-auto mb-6 animate-bounce" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Xoş Gəlmisiniz
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Ənənəvi Azərbaycan mətbəxi indi onlayn sifariş ilə
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onViewMenu}
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
            >
              Menyuya bax
            </button>
            <button
              onClick={onViewFeedback}
              className="bg-gray-100 text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition transform hover:scale-105 shadow-lg"
            >
              Rəy və təkliflər
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Niyə Bizi Seçməlisiniz?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="size-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">QR Kod Menyusu</h3>
              <p className="text-gray-600">
                Masanızdan QR kod skan edərək menyumuza dərhal baxın və sifariş verin
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="size-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Asan Sifariş</h3>
              <p className="text-gray-600">
                Sadə və intuitiv interfeys ilə bir neçə kliklə sifariş edin
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="size-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sürətli Xidmət</h3>
              <p className="text-gray-600">
                Real vaxtda sifariş statusunuzu izləyin və tez xidmət alın
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Məşhur Yeməklərimiz
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600"
                alt="Plov"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Plov</h3>
                <p className="text-gray-600 mb-4">
                  Ənənəvi Azərbaycan plov - düyü, qoz və quru meyvələr ilə
                </p>
                <div className="flex items-center text-yellow-500">
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600"
                alt="Kabab"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Lülə Kabab</h3>
                <p className="text-gray-600 mb-4">
                  Əl ilə hazırlanmış təzə qoyun əti kabab
                </p>
                <div className="flex items-center text-yellow-500">
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1574484284002-952d92456975?w=600"
                alt="Dolma"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Dolma</h3>
                <p className="text-gray-600 mb-4">
                  Təzə üzüm yarpağında ət dolması
                </p>
                <div className="flex items-center text-yellow-500">
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                  <Star className="size-5 fill-current" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onViewMenu}
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              <MenuIcon className="size-6" />
              Tam Menyuya Bax
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Əlaqə
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <MapPin className="size-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ünvan</h3>
              <p className="text-gray-600">
                Nizami küçəsi 123<br />
                Bakı, Azərbaycan
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Phone className="size-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Telefon</h3>
              <p className="text-gray-600">
                +994 12 345 67 89<br />
                +994 50 123 45 67
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Mail className="size-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-600">
                info@restoran.az<br />
                sifaris@restoran.az
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Working Hours Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Clock className="size-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            İş Saatları
          </h2>
          <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">Bazar ertəsi - Cümə</span>
                <span className="text-gray-600">10:00 - 23:00</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">Şənbə</span>
                <span className="text-gray-600">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">Bazar</span>
                <span className="text-gray-600">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">Bayram günləri</span>
                <span className="text-gray-600">12:00 - 22:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ChefHat className="size-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Azərbaycan Mətbəxi Restoranı</h3>
          <p className="text-gray-400 mb-6">
            Ənənəvi dadlar, müasir xidmət
          </p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500">
              © 2024 Restoran. Bütün hüquqlar qorunur.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
