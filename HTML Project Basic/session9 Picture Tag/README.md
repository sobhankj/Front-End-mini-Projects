# Picture Tag
در این قسمت با تگ `<picture>` آشنا می‌شویم. این تگ اجازه می‌دهد برای **اندازه‌های مختلف صفحه**، تصویرهای متفاوت نشان دهیم (مثلاً موبایل یک عکس، دسکتاپ عکس دیگر).

---

## ساختار کلی

```html
<picture>
  <source srcset="..." media="...">
  <source srcset="..." media="...">
  <img src="..." alt="...">
</picture>
```

مرورگر از بالا به پایین `source`ها را چک می‌کند؛ **اولین** موردی که شرطش درست باشد را نشان می‌دهد. اگر هیچ‌کدام جور نبود، تصویر داخل `<img>` نمایش داده می‌شود.

---

## تگ `<source>`
داخل `<picture>` می‌آید و یک گزینهٔ تصویر تعریف می‌کند.

### `srcset`
آدرس تصویری که می‌خواهیم در این حالت نشان دهیم.

### `media`
شرط اندازهٔ صفحه (مثل CSS media query). اگر شرط برقرار باشد، همین `srcset` استفاده می‌شود.

---

## مثال این جلسه

```html
<picture>
  <source srcset="https://www.w3schools.com/html/pic_trulli.jpg" media="(min-width: 650px)">
  <source srcset="https://www.w3schools.com/html/img_girl.jpg" media="(min-width: 465px)">
  <img src="https://www.w3schools.com/html/img_chania.jpg" alt="Flowers" style="width: auto;">
</picture>
```

### رفتار بر اساس عرض صفحه

| عرض صفحه | تصویر نمایش‌داده‌شده |
|---|---|
| `650px` یا بیشتر | `pic_trulli.jpg` |
| بین `465px` تا `649px` | `img_girl.jpg` |
| کمتر از `465px` | `img_chania.jpg` (fallback داخل `<img>`) |

**نتیجه:** با کوچک و بزرگ کردن پنجرهٔ مرورگر، تصویر عوض می‌شود.

---

## تگ `<img>` داخل `<picture>`
حتماً باید یک `<img>` در آخر باشد:

- اگر هیچ `source`ای جور نبود، همین تصویر نشان داده می‌شود
- مرورگرهای قدیمی که `<picture>` را نمی‌شناسند هم همین `<img>` را می‌بینند
- `alt` برای accessibility روی همین تگ نوشته می‌شود

```html
<img src="https://www.w3schools.com/html/img_chania.jpg" alt="Flowers" style="width: auto;">
```

---

## نکته
- ترتیب `source`ها مهم است؛ از شرط **بزرگ‌تر** به **کوچک‌تر** بنویسید.
- `<picture>` برای responsive image است (تصویر مناسب هر صفحه).
- بدون `<img>` در انتها، ساختار کامل و درست نیست.
- تفاوت با `<img>` معمولی: یک تصویر ثابت نیست؛ بر اساس اندازهٔ صفحه یکی از چند تصویر انتخاب می‌شود.
