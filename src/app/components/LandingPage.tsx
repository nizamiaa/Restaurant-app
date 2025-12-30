import { ChefHat, QrCode, ShoppingBag, Clock, Star, MapPin, Phone, Mail, Menu as MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";

interface LandingPageProps {
  onViewMenu: () => void;
  onViewFeedback: () => void;
  onAdminAccess: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onViewMenu, onViewFeedback, onAdminAccess }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-4 right-4 z-20">
          <LanguageSelector />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <ChefHat className="size-20 mx-auto mb-6 animate-bounce" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {t("menu.welcome")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            {t("landingpage.kitchen")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onViewMenu}
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
            >
              {t("landingpage.allMenu")}
            </button>
            <button
              onClick={onViewFeedback}
              className="bg-gray-100 text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition transform hover:scale-105 shadow-lg"
            >
              {t("landingpage.feedback")}
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
            {t("landingpage.whyChooseUs")}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="size-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("landingpage.qrCodeMenu")}</h3>
              <p className="text-gray-600">
                {t("landingpage.scanToViewMenu")}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="size-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("landingpage.easyOrder")}</h3>
              <p className="text-gray-600">
                {t("landingpage.orderFromTable")}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="size-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("landingpage.fastService")}</h3>
              <p className="text-gray-600">
                {t("landingpage.trackOrder")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            {t("landingpage.popularDishes")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600"
                alt="Plov"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{t("landingpage.riceDish")}</h3>
                <p className="text-gray-600 mb-4">
                  {t("landingpage.traditionalRiceDish")}
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
                <h3 className="text-2xl font-bold mb-2">{t("landingpage.lambKebab")}</h3>
                <p className="text-gray-600 mb-4">
                  {t("landingpage.handmadeFreshLambKebab")}
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
                src="https://www.giverecipe.com/wp-content/uploads/2016/08/Dolmades-in-a-pot-500x500.jpg"
                alt="Dolma"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{t("landingpage.dolma")}</h3>
                <p className="text-gray-600 mb-4">
                  {t("landingpage.freshGrapeLeafMeatDolma")}
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
              {t("landingpage.viewFullMenu")}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            {t("landingpage.contactUs")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <MapPin className="size-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t("landingpage.address")}</h3>
              <p className="text-gray-600">
                  {t("landingpage.addressLine1")}<br />
                  {t("landingpage.addressLine2")}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Phone className="size-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t("landingpage.phone")}</h3>
              <p className="text-gray-600">
                +994 12 345 67 89<br />
                +994 50 123 45 67
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Mail className="size-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t("landingpage.email")}</h3>
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
            {t("landingpage.workingHours")}
          </h2>
          <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">{t("landingpage.mondayToFriday")}</span>
                <span className="text-gray-600">10:00 - 23:00</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">{t("landingpage.saturday")}</span>
                <span className="text-gray-600">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">{t("landingpage.sunday")}</span>
                <span className="text-gray-600">10:00 - 00:00</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">{t("landingpage.holiday")}</span>
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
          <h3 className="text-2xl font-bold mb-4">{t("landingpage.footerKitchen")}</h3>
          <p className="text-gray-400 mb-6">
            {t("landingpage.footerDescription")}
          </p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500">
              © {new Date().getFullYear()} {t("Restaurant")}. {t("landingpage.allRightsReserved")}
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
