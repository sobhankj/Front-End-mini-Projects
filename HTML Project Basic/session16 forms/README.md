# Forms in HTML
در این جلسه با **فرم‌ها** آشنا می‌شویم. فرم برای گرفتن اطلاعات از کاربر است (ثبت‌نام، ورود، جستجو و ...).

فایل‌های این جلسه:
- `index.html` → فرم ساده
- `part2.html` → انواع input و کنترل‌های فرم

---

## تگ `<form>`
همهٔ فیلدهای فرم داخل `<form>` قرار می‌گیرند.

```html
<form action="" method="get" autocomplete="on" target="_blank">
  ...
</form>
```

| Attribute | معنی |
|---|---|
| `action` | آدرسی که داده‌های فرم به آن ارسال می‌شود (خالی = همان صفحه) |
| `method` | روش ارسال: معمولاً `get` یا `post` |
| `autocomplete` | آیا مرورگر پیشنهاد پر کردن خودکار بدهد (`on` / `off`) |
| `target` | نتیجه ارسال کجا باز شود (مثل `_blank` برای تب جدید) |

---

## `<label>` و اتصال به input
با `for` روی `<label>` و `id` روی `<input>` آن‌ها را به هم وصل می‌کنیم. با کلیک روی نوشته، فیلد مربوطه فوکوس می‌گیرد.

```html
<label for="name">Name:</label>
<input type="text" id="name" name="fname">
```

---

## `<fieldset>` و `<legend>`
`<fieldset>` یک گروه از فیلدها را داخل یک کادر می‌گذارد.  
`<legend>` عنوان همان گروه است.

```html
<fieldset>
  <legend>User Registration</legend>
  <label for="name">Name:</label>
  <input type="text" id="name" name="fname">
</fieldset>
```

**نتیجه:** یک کادر با عنوان «User Registration» و فیلد Name داخل آن.

---

## Attributeهای مهم روی `<input>`

| Attribute | نقش |
|---|---|
| `type` | نوع فیلد (text, email, password, ...) |
| `id` | شناسه یکتا — برای وصل شدن به `label` |
| `name` | نام فیلد هنگام ارسال فرم (مهم‌ترین attribute برای submit) |
| `value` | مقدار اولیه یا مقداری که ارسال می‌شود |
| `list` | وصل کردن input به یک `<datalist>` |

---

## انواع `<input>`

### `type="text"` — متن معمولی
```html
<input type="text" id="name" name="fname">
```
**نتیجه:** یک جعبهٔ متن برای نوشتن نام و ...

---

### `type="email"` — ایمیل
```html
<input type="email" id="email" name="email">
```
**نتیجه:** فیلد ایمیل؛ مرورگر معمولاً فرمت ایمیل را چک می‌کند.

---

### `type="password"` — رمز عبور
```html
<input type="password" id="password" name="password">
```
**نتیجه:** متن به صورت `••••` دیده می‌شود.

---

### `type="number"` — عدد
```html
<input type="number" id="number" name="number">
```
**نتیجه:** فقط عدد؛ معمولاً دکمه‌های بالا/پایین برای کم و زیاد کردن دارد.

---

### `type="radio"` — انتخاب یکی از چند گزینه
همهٔ radioهایی که با هم هستند باید **`name` یکسان** داشته باشند تا فقط یکی انتخاب شود.

```html
<input type="radio" id="male" name="gender" value="male">
<label for="male">Male</label>
<input type="radio" id="female" name="gender" value="female">
<label for="female">Female</label>
```

**نتیجه:** ○ Male  ○ Female — فقط یکی قابل انتخاب است.

---

### `type="checkbox"` — انتخاب چندتایی
هر checkbox می‌تواند جداگانه روشن/خاموش شود.

```html
<input type="checkbox" id="html" name="skills1" value="html">
<label for="html">HTML</label>
<input type="checkbox" id="css" name="skills2" value="css">
<label for="css">CSS</label>
<input type="checkbox" id="javascript" name="skills3" value="javascript">
<label for="javascript">JavaScript</label>
```

**نتیجه:** ☐ HTML  ☐ CSS  ☐ JavaScript — چند تا همزمان قابل انتخاب است.

---

### `type="submit"` و `type="reset"`
```html
<input type="submit" value="Submit">
<input type="reset" value="Reset">
```

| دکمه | کار |
|---|---|
| `submit` | فرم را ارسال می‌کند |
| `reset` | همهٔ فیلدها را به حالت اول برمی‌گرداند |

`value` همان متن روی دکمه است.

---

### `type="color"` — انتخاب رنگ
```html
<input type="color" id="color" name="color">
```
**نتیجه:** یک color picker باز می‌شود.

---

### `type="time"` — ساعت
```html
<input type="time" id="time" name="time">
```
**نتیجه:** انتخاب ساعت (مثلاً 14:30).

---

### `type="date"` — تاریخ
```html
<input type="date" id="date" name="date">
```
**نتیجه:** تقویم برای انتخاب تاریخ.

---

### `type="file"` — آپلود فایل
```html
<input type="file" id="file" name="file">
```
**نتیجه:** دکمهٔ انتخاب فایل از سیستم.

---

### `type="range"` — اسلایدر
```html
<input type="range" id="range" name="range">
```
**نتیجه:** یک میلهٔ کشویی برای انتخاب مقدار در یک بازه.

---

## `<select>` و `<option>` — لیست کشویی
```html
<select name="country" id="country">
  <option value="india">India</option>
  <option value="usa">USA</option>
  <option value="uk">UK</option>
  <option value="canada">Canada</option>
  <option value="australia">Australia</option>
</select>
```

**نتیجه:** یک منوی بازشو برای انتخاب کشور.  
متن داخل `<option>` چیزی است که کاربر می‌بیند؛ `value` چیزی است که با فرم ارسال می‌شود.

---

## `<textarea>` — متن چندخطی
برای پیام‌های بلندتر از یک خط.

```html
<textarea name="message" id="message" cols="30" rows="5"></textarea>
```

| Attribute | معنی |
|---|---|
| `cols` | عرض تقریبی (تعداد کاراکتر در هر خط) |
| `rows` | ارتفاع (تعداد خط‌ها) |

**نتیجه:** یک جعبهٔ متن بزرگ چندخطی.

---

## `<datalist>` — پیشنهادهای قابل جستجو
با `list` روی input و `id` روی datalist وصل می‌شوند. کاربر می‌تواند بنویسد یا از پیشنهادها انتخاب کند.

```html
<input type="text" id="fruit" name="fruit" list="fruits">
<datalist id="fruits">
  <option>Apple</option>
  <option>Banana</option>
  <option>Orange</option>
  <option>Pineapple</option>
</datalist>
```

**نتیجه:** با فوکوس روی فیلد، پیشنهادهایی مثل Apple و Banana دیده می‌شود.

---

## تفاوت‌های مهم

| مورد | رفتار |
|---|---|
| `radio` | فقط یکی از گروه با `name` یکسان |
| `checkbox` | چند تا همزمان |
| `select` | انتخاب از لیست ثابت |
| `datalist` | پیشنهاد + امکان تایپ آزاد |
| `textarea` | چند خط؛ `input type="text"` یک خط |

---

## نکته
- بدون `name`، مقدار فیلد معمولاً با submit ارسال نمی‌شود.
- `label` + `for` / `id` برای usability و accessibility مهم است.
- `method="get"` داده‌ها را در URL نشان می‌دهد؛ برای رمز عبور مناسب نیست (`post` بهتر است).
- `fieldset` و `legend` فرم‌های شلوغ را مرتب‌تر می‌کنند.
- فایل‌های این جلسه: شروع با `index.html`، جزئیات کامل در `part2.html`.
