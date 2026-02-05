/* ===================================================
   CHAT EXPORTER - Main JavaScript
   =================================================== */

// The bookmarklet code that will be saved to user's bookmarks
var bookmarkletCode = "javascript:(function(){var host=window.location.hostname;var title=document.title||'chat';var date=new Date().toISOString().slice(0,10);var md='# '+title+'\\n\\n';md+='> Exported: '+date+'\\n';md+='> Source: '+window.location.href+'\\n\\n';md+='---\\n\\n';function addMsg(role,text){var icon=role==='user'?'👤 User':'🤖 Assistant';md+='## '+icon+'\\n\\n'+text.trim()+'\\n\\n---\\n\\n';}var found=false;if(host.includes('chatgpt.com')||host.includes('chat.openai.com')){var msgs=document.querySelectorAll('[data-message-author-role]');msgs.forEach(function(el){var role=el.getAttribute('data-message-author-role');var text=el.innerText;if(text.trim()){addMsg(role,text);found=true;}});}else if(host.includes('gemini.google.com')){var msgs=document.querySelectorAll('message-content');msgs.forEach(function(el,i){var role=i%2===0?'user':'assistant';if(el.innerText.trim()){addMsg(role,el.innerText);found=true;}});}else if(host.includes('chat.deepseek.com')){var msgs=document.querySelectorAll('[class*=\"message\"]');msgs.forEach(function(el){if(el.innerText.trim().length>5){var role=el.className.includes('user')?'user':'assistant';addMsg(role,el.innerText);found=true;}});}else if(host.includes('lmarena.ai')||host.includes('chat.lmsys.org')){var msgs=document.querySelectorAll('[class*=\"message\"],[class*=\"chat\"]');msgs.forEach(function(el){var text=el.innerText.trim();if(text.length>10){var role=el.className.toLowerCase().includes('user')?'user':'assistant';addMsg(role,text);found=true;}});}else{var msgs=document.querySelectorAll('div[class*=\"message\"],div[class*=\"chat\"],div[class*=\"turn\"]');var texts=[];msgs.forEach(function(el){var text=el.innerText.trim();if(text.length>20){texts.push(text);}});texts.forEach(function(text,i){addMsg(i%2===0?'user':'assistant',text);found=true;});}if(!found){alert('No chat messages found on this page.\\n\\nMake sure you are on:\\n• chatgpt.com\\n• gemini.google.com\\n• chat.deepseek.com\\n• lmarena.ai\\n\\nAnd have a conversation open.');return;}var filename=title.replace(/[^a-z0-9]/gi,'_').substring(0,50)+'_'+date+'.md';var blob=new Blob([md],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);})();";

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set bookmarklet href
    var bookmarkletBtn = document.getElementById('bookmarklet');
    if (bookmarkletBtn) {
        bookmarkletBtn.setAttribute('href', bookmarkletCode);
    }
    
    // Set code in textarea
    var codeArea = document.getElementById('bookmarkletCode');
    if (codeArea) {
        codeArea.value = bookmarkletCode;
    }
    
    // Prevent default click on bookmarklet (it should be dragged)
    if (bookmarkletBtn) {
        bookmarkletBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Drag this button to your bookmarks bar!');
        });
    }
});

// Toggle code block visibility
function showCode() {
    var codeBlock = document.getElementById('codeBlock');
    if (codeBlock) {
        if (codeBlock.classList.contains('hidden')) {
            codeBlock.classList.remove('hidden');
        } else {
            codeBlock.classList.add('hidden');
        }
    }
}

// Copy bookmarklet code to clipboard
function copyCode() {
    var codeArea = document.getElementById('bookmarkletCode');
    if (!codeArea) return;
    
    // Select the text
    codeArea.select();
    codeArea.setSelectionRange(0, 99999);
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeArea.value)
            .then(function() {
                showToast('Copied! Now create a bookmark and paste as URL.');
            })
            .catch(function() {
                fallbackCopy(codeArea);
            });
    } else {
        fallbackCopy(codeArea);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(textArea) {
    try {
        document.execCommand('copy');
        showToast('Copied! Now create a bookmark and paste as URL.');
    } catch (err) {
        showToast('Failed to copy. Please select and copy manually.');
    }
}

// Show toast notification
function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// Open test page in new window
function openTestPage() {
    var testHTML = '<!DOCTYPE html><html><head><title>Test Chat - Export Test</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;background:#f5f5f5;}h1{color:#333;}.message{padding:16px;margin:12px 0;border-radius:12px;}.user{background:#e3f2fd;border-left:4px solid #2196f3;}.assistant{background:#f5f5f5;border-left:4px solid #4caf50;}.label{font-weight:bold;margin-bottom:8px;color:#666;font-size:12px;text-transform:uppercase;}.note{background:#fff3cd;padding:20px;border-radius:8px;margin-bottom:30px;border:1px solid #ffc107;}</style></head><body><h1>🧪 Test Chat Page</h1><div class=\"note\"><strong>Instructions:</strong><ol><li>Make sure you dragged the \"Export Chat\" button to your bookmarks bar</li><li>Click the bookmark now to test the export</li><li>A markdown file should download!</li></ol></div><div data-message-author-role=\"user\" class=\"message user\"><div class=\"label\">User</div>Hello! Can you explain what machine learning is?</div><div data-message-author-role=\"assistant\" class=\"message assistant\"><div class=\"label\">Assistant</div>Machine learning is a subset of artificial intelligence (AI) that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data, learn from it, and make predictions or decisions.<br><br>Key concepts include:<br>• **Supervised Learning**: Learning from labeled examples<br>• **Unsupervised Learning**: Finding patterns in unlabeled data<br>• **Reinforcement Learning**: Learning through trial and error</div><div data-message-author-role=\"user\" class=\"message user\"><div class=\"label\">User</div>That makes sense! What are some real-world applications?</div><div data-message-author-role=\"assistant\" class=\"message assistant\"><div class=\"label\">Assistant</div>Machine learning is used everywhere! Here are some examples:<br><br>1. **Recommendation Systems** - Netflix, Spotify, Amazon<br>2. **Virtual Assistants** - Siri, Alexa, Google Assistant<br>3. **Image Recognition** - Face unlock, medical imaging<br>4. **Fraud Detection** - Banking and credit cards<br>5. **Self-driving Cars** - Tesla, Waymo<br>6. **Language Translation** - Google Translate<br><br>The possibilities are endless!</div></body></html>';
    
    var newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(testHTML);
        newWindow.document.close();
    } else {
        showToast('Please allow popups to open the test page.');
    }
}

// Make functions globally available
window.showCode = showCode;
window.copyCode = copyCode;
window.showToast = showToast;
window.openTestPage = openTestPage;
