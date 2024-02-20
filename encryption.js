const crypto = require('crypto');

const encryptEditor = (editor, secretKey)=>{
    const eCipher = crypto.createCipher('aes-256-gcm', secretKey);
    let encryptedEditor = eCipher.update(editor, 'utf-8', 'hex');
    encryptedEditor += eCipher.final('hex');
    return encryptedEditor
}

const decryptEditor = (encryptedEditor, secretKey) => {
    const dCipher = crypto.createDecipher('aes-256-gcm', secretKey);
    let decryptedEditor = dCipher.update(encryptedEditor, 'hex', 'utf-8');
    decryptedEditor += dCipher.final('utf-8');
    return decryptedEditor;
}

exports.encryptEditor = encryptEditor;
exports.decryptEditor = decryptEditor;