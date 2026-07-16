# Text Formatting
در این قسمت یک سری تگ formatting که به صورت پیش‌فرض در HTML وجود دارند را یاد می‌گیریم.

---

## `<b>` — Bold
برای اینکه متن **ضخیم (bold)** دیده شود استفاده می‌شود. فقط ظاهر را عوض می‌کند و معنای خاصی ندارد.

```html
<p>This is a <b>bold</b> text</p>
```

**نتیجه:** This is a **bold** text

---

## `<strong>` — Strong
ظاهرش شبیه `<b>` است، ولی از نظر معنایی می‌گوید این متن **مهم** است. برای accessibility و SEO بهتر از `<b>` است.

```html
<p>This is a <strong>strong</strong> text</p>
```

**نتیجه:** This is a **strong** text

---

## `<i>` — Italic
متن را **ایتالیک (کج)** نشان می‌دهد. بیشتر برای ظاهر است، نه معنا.

```html
<p>This is a <i>italic</i> text</p>
```

**نتیجه:** This is a *italic* text

---

## `<em>` — Emphasized
ظاهرش شبیه `<i>` است، ولی معنایش **تأکید** روی متن است. خواننده‌های صفحه (screen reader) این تأکید را هم در نظر می‌گیرند.

```html
<p>This is a <em>emphasized</em> text</p>
```

**نتیجه:** This is a *emphasized* text

---

## `<u>` — Underlined
متن را **زیرخط‌دار** می‌کند.

```html
<p>This is a <u>underlined</u> text</p>
```

**نتیجه:** This is a <u>underlined</u> text

---

## `<s>` — Strikethrough
روی متن یک **خط خورده** می‌کشد. معمولاً برای نشان دادن چیزی که دیگر درست نیست یا منقضی شده استفاده می‌شود.

```html
<p>This is a <s>strikethrough</s> text</p>
```

**نتیجه:** This is a ~~strikethrough~~ text

---

## `<del>` — Deleted
ظاهرش شبیه `<s>` است، ولی از نظر معنایی می‌گوید این متن **حذف شده** است (مثلاً در ویرایش یک سند).

```html
<p>This is a <del>deleted</del> text</p>
```

**نتیجه:** This is a ~~deleted~~ text

---

## `<mark>` — Highlighted
متن را **هایلایت** می‌کند (معمولاً با پس‌زمینه زرد). برای مشخص کردن بخش مهم در یک متن مفید است.

```html
<p>This is a <mark>highlighted</mark> text</p>
```

**نتیجه:** This is a <mark>highlighted</mark> text

---

## `<small>` — Small
متن را **کوچک‌تر** از متن اطراف نشان می‌دهد. معمولاً برای توضیح فرعی یا فوتر استفاده می‌شود.

```html
<p>This is a <small>small</small> text</p>
```

**نتیجه:** This is a <small>small</small> text

---

## `<big>` — Big
متن را **بزرگ‌تر** نشان می‌دهد. این تگ قدیمی است و در HTML5 توصیه نمی‌شود؛ بهتر است با CSS اندازه فونت را عوض کنیم.

```html
<p>This is a <big>big</big> text</p>
```

**نتیجه:** This is a <big>big</big> text

---

## `<sub>` — Subscript
متن را به صورت **زیرنویس** (پایین‌تر و کوچک‌تر) نشان می‌دهد. مثلاً در فرمول شیمیایی: H<sub>2</sub>O

```html
<p>This is a <sub>subscript</sub> text</p>
```

**نتیجه:** This is a <sub>subscript</sub> text

---

## `<sup>` — Superscript
متن را به صورت **بالانویس** (بالاتر و کوچک‌تر) نشان می‌دهد. مثلاً در توان: 2<sup>3</sup> = 8

```html
<p>This is a <sup>superscript</sup> text</p>
```

**نتیجه:** This is a <sup>superscript</sup> text

---

## `<code>` — Code
برای نمایش **کد یا نام دستور** داخل متن استفاده می‌شود. معمولاً با فونت monospace دیده می‌شود.

```html
<p>This is a <code>code</code> text</p>
```

**نتیجه:** This is a `code` text

---

## `<pre>` — Preformatted
متن را **همان‌طور که نوشته شده** نگه می‌دارد (فاصله‌ها و خط‌های جدید حفظ می‌شوند). معمولاً برای بلوک کد استفاده می‌شود.

```html
<p>This is a <pre>pre</pre> text</p>
```

**نتیجه:**
```
pre
```

---

## `<blockquote>` — Blockquote
برای نمایش یک **نقل‌قول بلند** به صورت بلوک جدا استفاده می‌شود. معمولاً با تورفتگی (indent) نشان داده می‌شود.

```html
<p>This is a <blockquote>blockquote</blockquote> text</p>
```

**نتیجه:**
> blockquote

---

## `<q>` — Quote (کوتاه)
برای **نقل‌قول کوتاه داخل جمله** استفاده می‌شود. مرورگر معمولاً خودش گیومه (`"..."`) دور آن می‌گذارد.

```html
<p>This is a <q>q</q> text</p>
```

**نتیجه:** This is a "q" text

---

## نکته
- `<b>` و `<i>` بیشتر ظاهری هستند.
- `<strong>` و `<em>` معنایی هم دارند و ترجیح داده می‌شوند.
- `<big>` منسوخ است؛ برای بزرگ کردن متن از CSS استفاده کنید.
