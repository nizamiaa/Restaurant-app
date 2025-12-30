import { useState, useEffect } from "react";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface FeedbackProps {
  onBack: () => void;
}

interface FeedbackItem {
  name: string;
  email?: string;
  type: "comment" | "suggestion" | "complaint";
  message: string;
  rating: number;
  createdAt: string;
}

export function Feedback({ onBack }: FeedbackProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "comment" as "comment" | "suggestion" | "complaint",
    message: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  const fetchAllFeedback = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/feedback');
    if (!response.ok) throw new Error("Failed to fetch feedback");
    const data: FeedbackItem[] = await response.json();

    const last40Feedback = data.slice(-40);

    setAllFeedback(last40Feedback);

    if (last40Feedback.length > 0) {
      const total = last40Feedback.reduce((sum, item) => sum + (item.rating || 0), 0);
      setAverageRating(total / last40Feedback.length);
    } else {
      setAverageRating(0);
    }
  } catch (error) {
    console.error("Error fetching feedback:", error);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      toast.error(t('feedback.fillRequiredFields'));
      return;
    }
    if (formData.rating < 1) {
      toast.error(t('feedback.ratingRequired') || 'Please give at least 1 star.');
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
        toast.success(t('feedback.thankYou'));
        setFormData({
          name: "",
          email: "",
          type: "comment",
          message: "",
          rating: 0,
        });
        // Yeni feedback əlavə olunduqdan sonra yenilə
        fetchAllFeedback();
      } else {
        toast.error(t('feedback.submissionFailed'));
      }
    } catch (error) {
      console.error(t('feedback.errorOccurred'), error);
      toast.error(t('feedback.errorOccurred'));
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
            <h1 className="text-2xl font-bold text-gray-900">{t('feedback.title')}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <MessageSquare className="size-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('feedback.shareYourThoughts')}
            </h2>
            <p className="text-gray-600">
              {t('feedback.valuableFeedback')}
            </p>
          </div>

          {/* Ortalama Rating */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold">{t('feedback.averageRating') || "Orta Reytinq"}</h2>
            <div className="flex justify-center items-center gap-1 mt-2">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className={star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}>★</span>
              ))}
              <span className="ml-2 text-gray-700">{averageRating.toFixed(1)} / 5</span>
            </div>
          </div>

          {/* Rating seçimi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('feedback.rating') || 'Rating'}
            </label>
            <div className="flex gap-2 items-center">
              {[1,2,3,4,5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-7 h-7">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">{formData.rating > 0 ? formData.rating : ''}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('feedback.yourName')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder={t('feedback.yourName')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('feedback.emailOptional')}
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
                {t('feedback.feedbackType')}
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "comment" | "suggestion" | "complaint" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="comment">{t('feedback.comment')}</option>
                <option value="suggestion">{t('feedback.suggestion')}</option>
                <option value="complaint">{t('feedback.complaint')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('feedback.yourMessage')} *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                rows={6}
                placeholder={t('feedback.yourMessagePlaceholder')}
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
                  {t('feedback.sending')}
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  {t('feedback.send')}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{t('feedback.privacy')}</h3>
            <p className="text-sm text-gray-600">
              {t('feedback.privacyMessage')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
