# HTML Links
در این قسمت با تگ `<a>` آشنا می‌شویم که برای ساختن **لینک** استفاده می‌شود. با attribute به نام `href` مشخص می‌کنیم لینک به کجا برود.

---

## لینک به یک وب‌سایت
با گذاشتن یک آدرس کامل (URL) در `href`، کاربر با کلیک به آن سایت می‌رود.

```html
<a href="https://www.google.com">Google</a>
```

**نتیجه:** [Google](https://www.google.com)

---

## لینک ایمیل — `mailto:`
اگر بخواهیم با کلیک، برنامه ایمیل کاربر باز شود و آدرس گیرنده از قبل پر باشد، از `mailto:` استفاده می‌کنیم.

```html
<a href="mailto:sobhankj@gmail.com">Email</a>
```

**نتیجه:** [Email](mailto:sobhankj@gmail.com)  
(با کلیک، ایمیل به آدرس `sobhankj@gmail.com` باز می‌شود)

---

## لینک تلفن — `tel:`
با `tel:` می‌توان شماره تلفن گذاشت. روی موبایل معمولاً صفحه تماس باز می‌شود.

```html
<a href="tel:09123456789">Phone</a>
```

**نتیجه:** [Phone](tel:09123456789)  
(با کلیک روی موبایل، شماره `09123456789` برای تماس آماده می‌شود)

---

## Attribute به نام `target`
با `target` مشخص می‌کنیم لینک در کجا باز شود. مقادیر رایج:

---

### `target="_blank"` — تب جدید
لینک در یک **تب جدید** مرورگر باز می‌شود. صفحه فعلی بسته نمی‌شود.

```html
<a href="https://www.google.com" target="_blank">Google in new tab</a>
```

**نتیجه:** [Google in new tab](https://www.google.com) → در تب جدید باز می‌شود

---

### `target="_self"` — همان تب
لینک در **همان تب** باز می‌شود. این حالت پیش‌فرض است؛ حتی اگر `target` ننویسیم هم همین اتفاق می‌افتد.

```html
<a href="https://www.google.com" target="_self">Google in same tab</a>
```

**نتیجه:** [Google in same tab](https://www.google.com) → در همان تب باز می‌شود

---

### `target="_parent"` — فریم والد
اگر صفحه داخل یک `iframe` باشد، لینک در **فریم والد** (یک سطح بالاتر) باز می‌شود. اگر iframe نباشد، معمولاً مثل `_self` عمل می‌کند.

```html
<a href="https://www.google.com" target="_parent">Google in parent tab</a>
```

**نتیجه:** [Google in parent tab](https://www.google.com) → در فریم والد باز می‌شود

---

### `target="_top"` — کل پنجره
لینک کل صفحه را می‌گیرد و از همه iframeها خارج می‌شود؛ یعنی در **بالاترین سطح پنجره** باز می‌شود.

```html
<a href="https://www.google.com" target="_top">Google in top tab</a>
```

**نتیجه:** [Google in top tab](https://www.google.com) → در کل پنجره مرورگر باز می‌شود

---

## نکته
- تگ اصلی لینک: `<a href="...">متن لینک</a>`
- بدون `href` لینک واقعی ساخته نمی‌شود.
- `mailto:` برای ایمیل و `tel:` برای تماس تلفنی هستند.
- پرکاربردترین `target`ها: `_blank` (تب جدید) و `_self` (همان تب).
- `_parent` و `_top` بیشتر وقتی معنا دارند که صفحه داخل iframe باشد.
