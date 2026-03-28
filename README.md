# JoinForJoin (J4J)

JoinForJoin, Discord OAuth2 ile giriş yapan kullanıcıların davet kodu tanımlayıp eşleşme sırasına girmesine ve karşılıklı sunucu katılım sürecinin otomatik ilerletilmesine odaklanan bir Discord bot + web panel projesidir.

Bu repo; Discord bot mantığını, Express tabanlı paneli, Socket.IO ile gerçek zamanlı durum akışını ve MongoDB üzerinde tutulan kullanıcı verilerini bir araya getirir.

## Özellikler

- Discord hesabı ile giriş (`passport-discord`)
- Kullanıcıya ait sunucu davet kodunu kaydetme
- Eşleşme kuyruğuna girme ve kullanıcıları otomatik eşleştirme
- Socket.IO ile anlık durum güncellemesi
- MongoDB üzerinde basit kullanıcı/veri saklama yapısı
- Discord botu üzerinden sunucuya katılım işlemlerini tetikleme

## Nasıl Çalışır?

1. Kullanıcı Discord ile giriş yapar.
2. Panel üzerinden kendi sunucusuna ait davet kodunu girer.
3. Eşleşme başlatıldığında kullanıcı sıraya alınır.
4. `events/finding.js` arka planda uygun ikinci kullanıcıyı bulur.
5. Bot, iki tarafın davetlerini kontrol eder ve katılım işlemlerini dener.
6. Sonuç Socket.IO üzerinden panele gerçek zamanlı olarak yansıtılır.

## Teknoloji Yığını

- Node.js 16.x
- Express
- Socket.IO
- Discord.js v13
- Passport Discord
- EJS
- MongoDB / Mongoose

## Proje Yapısı

- `main.js`: Botu, Express uygulamasını ve Socket.IO sunucusunu başlatır.
- `events/ready.js`: Bot hazır olduğunda çalışan event.
- `events/finding.js`: Kuyruktaki kullanıcıları eşleştiren ana akış.
- `functions/global.js`: Yardımcı fonksiyonlar, veri erişimi ve Discord join işlemleri.
- `views/`: Panel tarafındaki route, template ve istemci kodları.
- `databases/`: MongoDB bağlantısı ve model tanımları.
- `config.js`: Panel ve Discord uygulamasıyla ilgili temel yapılandırmalar.

## Kurulum

### Gereksinimler

- Node.js `16.x`
- npm
- MongoDB bağlantısı
- Discord Developer Portal üzerinden oluşturulmuş bir uygulama/bot

### Adımlar

1. Bağımlılıkları yükleyin:

```bash
npm install
```

Not: Kaynak kod `mongoose` kullanıyor. Eğer temiz kurulumda bu paket eksikse ayrıca `npm install mongoose` çalıştırmanız gerekir.

2. Gerekli yapılandırmaları düzenleyin:

- `config.js` içindeki `panel`, `owners` ve `bot` alanlarını kendi bilgilerinizle güncelleyin.
- `databases/database.js` içindeki MongoDB bağlantı adresini kendi veritabanınıza göre değiştirin.

3. Ortam değişkenlerini tanımlayın:

```bash
export PORT=3000
export token=YOUR_DISCORD_BOT_TOKEN
```

4. Uygulamayı çalıştırın:

```bash
npm start
```

## Yapılandırma Notları

Bu sürümde bazı ayarlar doğrudan dosyalar içinden okunuyor:

- `config.js > panel`: Panelin çalışacağı public adres
- `config.js > bot.id`: Discord uygulama/bot ID'si
- `config.js > bot.secret`: Discord OAuth2 client secret
- `process.env.token`: Discord bot token
- `process.env.PORT`: Web sunucusunun dinleyeceği port
- `databases/database.js`: MongoDB connection string