// DOM元素获取
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const keyInput = document.getElementById('key-input');
const algorithmSelect = document.getElementById('algorithm-select');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');

// 事件监听器绑定
encryptBtn.addEventListener('click', encryptText);
decryptBtn.addEventListener('click', decryptText);
copyBtn.addEventListener('click', copyResult);
clearBtn.addEventListener('click', clearAll);

// 加密文本函数
function encryptText() {
    const text = inputText.value.trim();
    const key = keyInput.value.trim();
    const algorithm = algorithmSelect.value;
    
    if (!text) {
        alert('请输入要加密的文本！');
        return;
    }
    
    let result = '';
    
    try {
        switch (algorithm) {
            case 'base64':
                result = base64Encode(text);
                break;
            case 'vigenere':
                if (!key) {
                    alert('使用维吉尼亚密码需要输入密钥！');
                    return;
                }
                result = vigenereEncrypt(text, key);
                break;
            case 'xor':
                if (!key) {
                    alert('使用异或加密需要输入密钥！');
                    return;
                }
                result = xorEncrypt(text, key);
                break;
            default:
                alert('请选择有效的加密算法！');
                return;
        }
        
        outputText.value = result;
    } catch (error) {
        alert('加密过程中发生错误: ' + error.message);
    }
}

// 解密文本函数
function decryptText() {
    const text = inputText.value.trim();
    const key = keyInput.value.trim();
    const algorithm = algorithmSelect.value;
    
    if (!text) {
        alert('请输入要解密的文本！');
        return;
    }
    
    let result = '';
    
    try {
        switch (algorithm) {
            case 'base64':
                result = base64Decode(text);
                break;
            case 'vigenere':
                if (!key) {
                    alert('使用维吉尼亚密码需要输入密钥！');
                    return;
                }
                result = vigenereDecrypt(text, key);
                break;
            case 'xor':
                if (!key) {
                    alert('使用异或加密需要输入密钥！');
                    return;
                }
                result = xorDecrypt(text, key);
                break;
            default:
                alert('请选择有效的解密算法！');
                return;
        }
        
        outputText.value = result;
    } catch (error) {
        alert('解密过程中发生错误: ' + error.message);
    }
}

// Base64编码函数
function base64Encode(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

// Base64解码函数
function base64Decode(text) {
    try {
        return decodeURIComponent(escape(atob(text)));
    } catch (e) {
        throw new Error('无效的Base64编码');
    }
}

// 维吉尼亚密码加密函数
function vigenereEncrypt(text, key) {
    let result = '';
    key = key.toUpperCase();
    
    for (let i = 0, j = 0; i < text.length; i++) {
        let char = text.charAt(i);
        
        if (/[a-zA-Z]/.test(char)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97;
            const keyChar = key.charCodeAt(j % key.length) - 65;
            char = String.fromCharCode((char.charCodeAt(0) - base + keyChar) % 26 + base);
            j++;
        }
        
        result += char;
    }
    
    return result;
}

// 维吉尼亚密码解密函数
function vigenereDecrypt(text, key) {
    let result = '';
    key = key.toUpperCase();
    
    for (let i = 0, j = 0; i < text.length; i++) {
        let char = text.charAt(i);
        
        if (/[a-zA-Z]/.test(char)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97;
            const keyChar = key.charCodeAt(j % key.length) - 65;
            char = String.fromCharCode((char.charCodeAt(0) - base - keyChar + 26) % 26 + base);
            j++;
        }
        
        result += char;
    }
    
    return result;
}

// 异或加密函数
function xorEncrypt(text, key) {
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        const textCharCode = text.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % key.length);
        const xorResult = textCharCode ^ keyCharCode;
        result += String.fromCharCode(xorResult);
    }
    
    // 对结果进行Base64编码以确保可显示性
    return base64Encode(result);
}

// 异或解密函数
function xorDecrypt(text, key) {
    try {
        // 先进行Base64解码
        const decodedText = base64Decode(text);
        let result = '';
        
        for (let i = 0; i < decodedText.length; i++) {
            const textCharCode = decodedText.charCodeAt(i);
            const keyCharCode = key.charCodeAt(i % key.length);
            const xorResult = textCharCode ^ keyCharCode;
            result += String.fromCharCode(xorResult);
        }
        
        return result;
    } catch (e) {
        throw new Error('无效的异或编码或密钥错误');
    }
}

// 复制结果到剪贴板函数
function copyResult() {
    if (outputText.value) {
        outputText.select();
        document.execCommand('copy');
        alert('结果已复制到剪贴板！');
    } else {
        alert('没有可复制的内容！');
    }
}

// 清空所有输入输出函数
function clearAll() {
    inputText.value = '';
    outputText.value = '';
    keyInput.value = '0000';
    inputText.focus();
}

// 页面加载完成后聚焦到输入框
window.addEventListener('load', function() {
    inputText.focus();
});