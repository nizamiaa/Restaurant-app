# Restoran Veb Tətbiqi

Azərbaycan dili ilə restoran sifarişləri üçün tam funksional veb tətbiqi.

## Xüsusiyyətlər

### Ana Səhifə (Landing Page)
- 🏠 Peşəkar restoran təqdimatı
- 🎨 Müasir və cəlbedici dizayn
- 📱 Tam responsive (mobil və desktop)
- ⭐ Məşhur yeməklərin nümayişi
- 📞 Əlaqə məlumatları və iş saatları
- 🔗 Menyuya və admin panelinə keçid

### Müştəri Tərəfi
- 📱 QR kod ilə menyu görüntülənməsi
- 🛒 Səbət funksiyası
- 📝 Onlayn sifariş vermək
- 💳 Əsas məlumatları doldurma (ad, masa nömrəsi)
- ✅ Sifariş təsdiq bildirişi
- ⬅️ Ana səhifəyə qayıtma düyməsi

### Admin Paneli
- 🔐 Təhlükəsiz giriş (demo şifrə: `admin123`)
- 📊 Real vaxt sifarişləri görüntülənmə
- 🔄 Sifariş statusunu yenilənmə (yeni, hazırlanır, hazırdır, təhvil verilib)
- 🍽️ Menyu məhsullarını idarə etmək (əlavə et, redaktə et, sil)
- 📦 Kateqoriyalar əsasında təşkilat

## İstifadə

### Ana Səhifə
Tətbiqi açdığınız zaman avtomatik olaraq ana səhifə görünür. Buradan:
1. "Menyuya bax" düyməsi ilə müştəri menyusuna keçid
2. "Admin girişi" düyməsi ilə admin panelinə giriş

### Müştəri Görünüşü
Ana səhifədən "Menyuya bax" düyməsinə klikləyərək və ya URL-ə `?menu=true` əlavə edərək daxil olun:
```
https://your-app-url.com?menu=true
```

Müştərilər:
1. Menyudan məhsul seçə bilər
2. Səbətə əlavə edə bilər
3. Ad və masa nömrəsini daxil edə bilər
4. Sifariş verə bilər
5. Sol yuxarı küncdəki geri oxu ilə ana səhifəyə qayıda bilər

### Admin Panelinə Daxil Olma
Ana səhifədən "Admin girişi" düyməsinə klikləyərək və ya URL-ə `?admin=true` əlavə edərək daxil olun:
```
https://your-app-url.com?admin=true
```

Demo şifrə: `admin123`

## Səhifələr

1. **Ana Səhifə (Landing)** - Restoran təqdimatı və əsas məlumatlar
2. **Müştəri Menyusu** - Məhsul görüntüləmə və sifariş vermə
3. **Admin Girişi** - Təhlükəsiz giriş səhifəsi
4. **Admin Paneli** - Sifariş və menyu idarəetməsi

## Texnologiyalar

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase Edge Functions (Hono)
- **Verilənlər bazası:** Supabase KV Store
- **İkonlar:** Lucide React

## Kateqoriyalar

- Əsas yeməklər
- Desertlər
- İçkilər
- Salatlar
- Başlanğıclar

## Status Növləri

- **Yeni** - Yeni sifariş alındı
- **Hazırlanır** - Mətbəxdə hazırlanır
- **Hazırdır** - Götürülməyə hazırdır
- **Təhvil verilib** - Müştəriyə çatdırılıb

## QR Kod İstifadəsi

Müştərilərin menyuya tez daxil olması üçün QR kod yaradın:
1. QR kod generator istifadə edin (məsələn: qr-code-generator.com)
2. Tətbiqin URL-ini daxil edin: `https://your-app-url.com?menu=true`
3. QR kodu çap edin və masalara yerləşdirin