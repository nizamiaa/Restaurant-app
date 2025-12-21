import { useState } from "react";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface FeedbackProps {
  onBack: () => void;
}

export function Feedback({ onBack }: FeedbackProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "comment" as "comment" | "suggestion" | "complaint",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      toast.error("Zəhmət olmasa adınızı və mesajınızı daxil edin");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Rəyiniz üçün təşəkkür edirik!");
        setFormData({
          name: "",
          email: "",
          type: "comment",
          message: "",
        });
      } else {
        toast.error("Xəta baş verdi, yenidən cəhd edin");
      }
    } catch (error) {
      console.error("Feedback göndərilərkən xəta:", error);
      toast.error("Xəta baş verdi, yenidən cəhd edin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Geri"
            >
              <ArrowLeft className="size-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Rəy və Təkliflər</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <MessageSquare className="size-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fikrinizi Bizimlə Paylaşın
            </h2>
            <p className="text-gray-600">
              Rəyləriniz və təklifləriniz bizim üçün çox qiymətlidir. Restoranımızı yaxşılaşdırmağa kömək edin!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adınız *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Adınızı daxil edin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-poçt (İxtiyari)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rəy növü
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "comment" | "suggestion" | "complaint" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="comment">Rəy</option>
                <option value="suggestion">Təklif</option>
                <option value="complaint">Şikayət</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mesajınız *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                rows={6}
                placeholder="Fikrinizi detallı şəkildə yazın..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Göndərilir...
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  Göndər
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Məxfilik</h3>
            <p className="text-sm text-gray-600">
              Göndərdiyiniz məlumatlar yalnız xidmətimizi yaxşılaşdırmaq üçün istifadə olunacaq.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}