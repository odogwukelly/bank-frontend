export default function generateTransactionId(prefix: string = "TXN"): string {
    const timestamp = Date.now().toString(36).toUpperCase(); // Encoded timestamp
    const randomPart = Math.floor(100000 + Math.random() * 900000).toString(); // 6 random digits
    return `${prefix}-${timestamp}-${randomPart}`;
  }