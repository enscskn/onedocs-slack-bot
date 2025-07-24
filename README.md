# OneDocs Slack Bot

## Proje Hakkında

**OneDocs Slack Bot**, Slack üzerinden görev, döküman, e-posta ve kullanıcı yönetimini kolaylaştıran bir bottur. Kullanıcılar, Slack komutları ile API üzerinden bilgi çekebilir ve sistemin durumunu kontrol edebilir.

## Kurulum

1. **Depoyu klonlayın:**
   ```bash
   git clone <repo-url>
   cd onedocs-slack-bot
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**
   Proje kök dizininde bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri girin:
   ```
   SLACK_BOT_TOKEN=...
   SLACK_SIGNING_SECRET=...
   API_BASE_URL=...
   PORT=3001
   ```

4. **Botu başlatın:**
   ```bash
   npm start
   ```

## Kullanılan Teknolojiler

- Node.js
- Express.js
- @slack/bolt
- Axios
- dotenv
- body-parser

## Komutlar ve Özellikler

Bot, Slack üzerinden aşağıdaki komutları destekler:

### Görevler (Tasks)
- `/tasks-list` — Tüm görevleri listeler
- `/tasks-user [userId]` — Belirli kullanıcıya atanan görevleri getirir
- `/task-get [taskId]` — Belirli bir görevin detaylarını getirir

### Dökümanlar (Documents)
- `/docs-list` — Tüm dökümanları listeler
- `/docs-user [userId]` — Kullanıcıya atanan dökümanları getirir
- `/doc-get [docId]` — Belirli bir dökümanın detaylarını getirir

### E-postalar (Emails)
- `/emails-list` — Tüm e-postaları listeler
- `/emails-user [userId]` — Kullanıcıya atanan e-postaları getirir
- `/email-get [emailId]` — Belirli bir e-postanın detaylarını getirir

### Kullanıcılar (Users)
- `/users-list` — Tüm kullanıcıları listeler
- `/user-get [userId]` — Belirli bir kullanıcının detaylarını getirir

### Sistem
- `/system-health` — API ve veritabanı sağlığını kontrol eder
- `/system-info` — API hakkında genel bilgi verir

### Yardım
- `/onedocs-help` — Tüm komutların listesini ve örnek kullanımları gösterir

## Proje Yapısı

```
onedocs-slack-bot/
│
├── index.js              # Express sunucusu ve ana giriş noktası
├── package.json          # Bağımlılıklar ve scriptler
├── routes/
│   └── slack.js          # Slack bot komutlarının tamamı
├── utils/                # (Boş veya yardımcı fonksiyonlar için)
└── .gitignore
```