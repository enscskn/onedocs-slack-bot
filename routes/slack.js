const { App } = require('@slack/bolt');
const axios = require('axios');

// Bot token ve signing secret'ı environment variables'dan al
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// API base URL - kendi API'nizin URL'sini buraya yazın
const API_BASE_URL = process.env.API_BASE_URL || 'https://your-api-url.com';

// Yardım menüsü
app.command('/onedocs-help', async ({ command, ack, respond }) => {
  await ack();
  
  const helpText = `
*OneDocs Bot Komutları:*

*📋 Görevler (Tasks):*
• \`/tasks-list\` - Tüm görevleri listele
• \`/tasks-user [userId]\` - Kullanıcıya atanan görevleri getir
• \`/task-get [taskId]\` - Belirli görevi getir

*📄 Dökümanlar (Documents):*
• \`/docs-list\` - Tüm dökümanları listele
• \`/docs-user [userId]\` - Kullanıcıya atanan dökümanları getir
• \`/doc-get [docId]\` - Belirli dökümanı getir

*📧 E-postalar (Emails):*
• \`/emails-list\` - Tüm e-postaları listele
• \`/emails-user [userId]\` - Kullanıcıya atanan e-postaları getir
• \`/email-get [emailId]\` - Belirli e-postayı getir

*👥 Kullanıcılar (Users):*
• \`/users-list\` - Tüm kullanıcıları listele
• \`/user-get [userId]\` - Belirli kullanıcıyı getir

*⚙️ Sistem:*
• \`/system-health\` - Sistem sağlığını kontrol et
• \`/system-info\` - API bilgilerini getir

*Örnek kullanım:*
\`/tasks-user 2\` - 2 numaralı kullanıcının görevlerini getir
\`/doc-get 5\` - 5 numaralı dökümanı getir
  `;
  
  await respond(helpText);
});

// ===== GÖREV KOMUTLARI =====

// Tüm görevleri listele
app.command('/tasks-list', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tasks`);
    const tasks = response.data;
    
    if (tasks.length === 0) {
      await respond('📋 Hiç görev bulunamadı.');
      return;
    }
    
    let message = '*📋 Tüm Görevler:*\n\n';
    tasks.forEach(task => {
      message += `*${task.title}* (ID: ${task.id})\n`;
      message += `📝 ${task.description}\n`;
      message += `👤 Atanan: ${task.assigned_to} | Oluşturan: ${task.created_by}\n`;
      message += `📅 Son tarih: ${task.due_date}\n`;
      message += `🔸 Durum: ${task.status}\n\n`;
    });
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// Kullanıcıya atanan görevleri getir
app.command('/tasks-user', async ({ command, ack, respond }) => {
  await ack();
  
  const userId = command.text.trim();
  if (!userId) {
    await respond('❌ Lütfen kullanıcı ID\'si belirtin. Örnek: `/tasks-user 2`');
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tasks/assigned/${userId}`);
    const tasks = response.data;
    
    if (tasks.length === 0) {
      await respond(`📋 ${userId} numaralı kullanıcıya atanmış görev bulunamadı.`);
      return;
    }
    
    let message = `*📋 Kullanıcı ${userId} - Atanan Görevler:*\n\n`;
    tasks.forEach(task => {
      message += `*${task.title}* (ID: ${task.id})\n`;
      message += `📝 ${task.description}\n`;
      message += `👤 Oluşturan: ${task.created_by}\n`;
      message += `📅 Son tarih: ${task.due_date}\n`;
      message += `🔸 Durum: ${task.status}\n\n`;
    });
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// Belirli görevi getir
app.command('/task-get', async ({ command, ack, respond }) => {
  await ack();
  
  const taskId = command.text.trim();
  if (!taskId) {
    await respond('❌ Lütfen görev ID\'si belirtin. Örnek: `/task-get 3`');
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tasks/${taskId}`);
    const task = response.data;
    
    const message = `*📋 Görev Detayı:*\n\n` +
      `*${task.title}* (ID: ${task.id})\n` +
      `📝 ${task.description}\n` +
      `👤 Atanan: ${task.assigned_to} | Oluşturan: ${task.created_by}\n` +
      `📅 Son tarih: ${task.due_date}\n` +
      `🔸 Durum: ${task.status}\n` +
      `🕐 Oluşturulma: ${new Date(task.created_at).toLocaleString('tr-TR')}`;
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// ===== DÖKÜMAN KOMUTLARI =====

// Tüm dökümanları listele
app.command('/docs-list', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/documents`);
    const docs = response.data;
    
    if (docs.length === 0) {
      await respond('📄 Hiç döküman bulunamadı.');
      return;
    }
    
    let message = '*📄 Tüm Dökümanlar:*\n\n';
    docs.forEach(doc => {
      message += `*${doc.title}* (ID: ${doc.id})\n`;
      message += `📝 ${doc.content.substring(0, 50)}...\n`;
      message += `👤 Atanan: ${doc.assigned_to} | Oluşturan: ${doc.created_by}\n`;
      message += `📅 Son tarih: ${doc.due_date}\n`;
      message += `🔸 Durum: ${doc.status}\n\n`;
    });
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// Kullanıcıya atanan dökümanları getir
app.command('/docs-user', async ({ command, ack, respond }) => {
  await ack();
  
  const userId = command.text.trim();
  if (!userId) {
    await respond('❌ Lütfen kullanıcı ID\'si belirtin. Örnek: `/docs-user 2`');
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/documents/assigned/${userId}`);
    const docs = response.data;
    
    if (docs.length === 0) {
      await respond(`📄 ${userId} numaralı kullanıcıya atanmış döküman bulunamadı.`);
      return;
    }
    
    let message = `*📄 Kullanıcı ${userId} - Atanan Dökümanlar:*\n\n`;
    docs.forEach(doc => {
      message += `*${doc.title}* (ID: ${doc.id})\n`;
      message += `📝 ${doc.content.substring(0, 50)}...\n`;
      message += `👤 Oluşturan: ${doc.created_by}\n`;
      message += `📅 Son tarih: ${doc.due_date}\n`;
      message += `🔸 Durum: ${doc.status}\n\n`;
    });
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// Belirli dökümanı getir
app.command('/doc-get', async ({ command, ack, respond }) => {
  await ack();
  
  const docId = command.text.trim();
  if (!docId) {
    await respond('❌ Lütfen döküman ID\'si belirtin. Örnek: `/doc-get 3`');
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/documents/${docId}`);
    const doc = response.data;
    
    const message = `*📄 Döküman Detayı:*\n\n` +
      `*${doc.title}* (ID: ${doc.id})\n` +
      `📝 ${doc.content}\n` +
      `👤 Atanan: ${doc.assigned_to} | Oluşturan: ${doc.created_by}\n` +
      `📅 Son tarih: ${doc.due_date}\n` +
      `🔸 Durum: ${doc.status}\n` +
      `🕐 Oluşturulma: ${new Date(doc.created_at).toLocaleString('tr-TR')}`;
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// ===== E-POSTA KOMUTLARI =====

// Tüm e-postaları listele
app.command('/emails-list', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/emails`);
    const emails = response.data;
    
    if (emails.length === 0) {
      await respond('📧 Hiç e-posta bulunamadı.');
      return;
    }
    
    let message = '*📧 Tüm E-postalar:*\n\n';
    emails.forEach(email => {
      message += `*${email.subject}* (ID: ${email.id})\n`;
      message += `📝 ${email.body.substring(0, 50)}...\n`;
      message += `👤 Atanan: ${email.assigned_to} | Oluşturan: ${email.created_by}\n`;
      message += `📅 Son tarih: ${email.due_date}\n`;
      message += `🔸 Durum: ${email.status}\n\n`;
    });
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// Kullanıcıya atanan e-postaları getir
app.command('/emails-user', async ({ command, ack, respond }) => {
  await ack();
  
  const userId = command.text.trim();
  if (!userId) {
    await respond('❌ Lütfen kullanıcı ID\'si belirtin. Örnek: `/emails-user 2`');
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/emails/assigned/${userId}`);
    const emails = response.data;
    
    if (emails.length === 0) {
      await respond(`📧 ${userId} numaralı kullanıcıya atanmış e-posta bulunamadı.`);
      return;
    }
    
    let message = `*📧 Kullanıcı ${userId} - Atanan E-postalar:*\n\n`;
    emails.forEach(email => {
      message += `*${email.subject}* (ID: ${email.id})\n`;
      message += `📝 ${email.body.substring(0, 50)}...\n`;
      message += `👤 Oluşturan: ${email.created_by}\n`;
      message += `📅 Son tarih: ${email.due_date}\n`;
      message += `🔸 Durum: ${email.status}\n\n`;
    });
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// Belirli e-postayı getir
app.command('/email-get', async ({ command, ack, respond }) => {
  await ack();
  
  const emailId = command.text.trim();
  if (!emailId) {
    await respond('❌ Lütfen e-posta ID\'si belirtin. Örnek: `/email-get 1`');
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/emails/${emailId}`);
    const email = response.data;
    
    const message = `*📧 E-posta Detayı:*\n\n` +
      `*${email.subject}* (ID: ${email.id})\n` +
      `📝 ${email.body}\n` +
      `👤 Atanan: ${email.assigned_to} | Oluşturan: ${email.created_by}\n` +
      `📅 Son tarih: ${email.due_date}\n` +
      `🔸 Durum: ${email.status}\n` +
      `🕐 Oluşturulma: ${new Date(email.created_at).toLocaleString('tr-TR')}`;
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// ===== KULLANICI KOMUTLARI =====

// Tüm kullanıcıları listele
app.command('/users-list', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users`);
    const users = response.data;
    
    if (users.length === 0) {
      await respond('👥 Hiç kullanıcı bulunamadı.');
      return;
    }
    
    let message = '*👥 Tüm Kullanıcılar:*\n\n';
    users.forEach(user => {
      message += `*${user.full_name}* (ID: ${user.id})\n`;
      message += `📧 ${user.email}\n`;
      message += `🔰 Rol: ${user.role}\n`;
      message += `🕐 Kayıt: ${new Date(user.created_at).toLocaleString('tr-TR')}\n\n`;
    });
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// Belirli kullanıcıyı getir
app.command('/user-get', async ({ command, ack, respond }) => {
  await ack();
  
  const userId = command.text.trim();
  if (!userId) {
    await respond('❌ Lütfen kullanıcı ID\'si belirtin. Örnek: `/user-get 1`');
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
    const user = response.data;
    
    const message = `*👥 Kullanıcı Detayı:*\n\n` +
      `*${user.full_name}* (ID: ${user.id})\n` +
      `📧 ${user.email}\n` +
      `🔰 Rol: ${user.role}\n` +
      `🕐 Kayıt tarihi: ${new Date(user.created_at).toLocaleString('tr-TR')}`;
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// ===== SİSTEM KOMUTLARI =====

// Sistem sağlığını kontrol et
app.command('/system-health', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    const health = response.data;
    
    const message = `*⚙️ Sistem Sağlığı:*\n\n` +
      `🔸 Durum: ${health.status}\n` +
      `🕐 Zaman: ${new Date(health.timestamp).toLocaleString('tr-TR')}\n` +
      `📊 API: ${health.services.api}\n` +
      `🗄️ Veritabanı: ${health.services.database}`;
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// API bilgilerini getir
app.command('/system-info', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/info`);
    const info = response.data;
    
    const message = `*ℹ️ API Bilgileri:*\n\n` +
      `📱 Uygulama: ${info.application}\n` +
      `🔢 Versiyon: ${info.version}\n` +
      `📝 Açıklama: ${info.description}\n\n` +
      `*🔗 Endpoints:*\n` +
      `📋 Görevler: ${info.endpoints.tasks}\n` +
      `📄 Dökümanlar: ${info.endpoints.documents}\n` +
      `📧 E-postalar: ${info.endpoints.emails}\n` +
      `⚙️ Sağlık: ${info.endpoints.health}`;
    
    await respond(message);
  } catch (error) {
    await respond(`❌ Hata: ${error.message}`);
  }
});

// Bot'u başlat
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ OneDocs Slack Bot çalışıyor!');
})();