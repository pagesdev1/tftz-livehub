# TFTZ LiveHub — Cloudflare Worker

نسخة TFTZ الجديدة تعمل كـ **Cloudflare Worker + Static Assets**، لذلك لا تحتاج Pages Functions ولا رفع مجلد `functions/` من لوحة الرفع.

## الموجود داخل الموقع

- تصميم TFTZ Gaming بالأسود والذهبي.
- Kick player داخل الموقع.
- TikTok creator embed.
- Instagram profile card.
- أحدث فيديوهات YouTube تلقائيًا.
- API داخلي: `/api/youtube?limit=6`.
- تحديث فيديوهات YouTube كل 5 دقائق من الواجهة مع Cache على Cloudflare.
- روابط مباشرة لكل حسابات TFTZ.
- `_headers` و`_redirects` للحماية والروابط المختصرة.

## النشر — الموصى به

### 1) ثبّت Wrangler

```bash
npm install -g wrangler
```

### 2) سجّل الدخول

```bash
wrangler login
```

### 3) ادخل مجلد المشروع

```bash
cd TFTZ-LiveHub
```

### 4) جرّب محليًا

```bash
wrangler dev
```

### 5) انشر

```bash
wrangler deploy
```

الملف `wrangler.jsonc` يربط كل الملفات الثابتة مع Worker، والـWorker نفسه يشغّل `/api/youtube`.

## مهم

لا تستخدم شاشة **Upload static files to update your Worker** لرفع هذا المشروع، لأنها لا تدعم Pages Functions/هذا النوع من إعدادات Worker.

استخدم Wrangler من جهازك، أو اربط المشروع بمستودع Git ثم انشره بالطريقة المناسبة لـWorkers.

## YouTube

لا يوجد API key داخل الواجهة. الـWorker يقرأ الـRSS العام لقناة YouTube بعد اكتشاف Channel ID من صفحة القناة، ثم يعيد أحدث الفيديوهات للواجهة.

لو YouTube غيّر بنية صفحة القناة، يمكن تحويله لاحقًا إلى YouTube Data API مع API key محفوظ كـ Cloudflare secret.
