import crypto from 'crypto';

// 生成一个随机的盐值
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

// 使用AES-256-CBC算法加密
function encrypt(text, key, salt) {
  const iv = crypto.randomBytes(16); // 初始化向量
  const keyBuffer = crypto.scryptSync(key, salt, 32); // 生成密钥
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted; // 返回IV和加密后的字符串
}

// 使用AES-256-CBC算法解密
function decrypt(encryptedText, key, salt) {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const keyBuffer = crypto.scryptSync(key, salt, 32); // 生成密钥
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// 测试
const text = 'Hello, this is a secret message!';
const key = 'super-secret-key'; // 密钥
const salt = generateSalt(); // 盐值

console.log('Original text:', text);

const encryptedText = encrypt(text, key, salt);
console.log('Encrypted text:', encryptedText);

const decryptedText = decrypt(encryptedText, key, salt);
console.log('Decrypted text:', decryptedText);