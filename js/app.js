// Bookmarklet source code (readable version)
const bookmarkletSource = `
(function() {
    const host = window.location.hostname;
    const title = document.title || 'chat';
    const date = new Date().toISOString().slice(0, 10);
    
    let markdown = '# ' + title + '\\n\\n';
    markdown += '> Exported: ' + date + '\\n';
    markdown += '> Source: ' + window.location.href + '\\n\\n';
    markdown += '---\\n\\n';
    
    function formatMessage(role, content) {
        const icon = role === 'user' ? '👤 User' : '🤖 Assistant';
        return '## ' + icon + '\\n\\n' + content.trim() + '\\n\\n---\\n\\n';
    }
    
    // ChatGPT
    if (host.includes('chatgpt.com') || host.includes('chat.openai.com')) {
        document.querySelectorAll('[data-message-author-role]').forEach(function(el) {
            const role = el.getAttribute('data-message-author-role');
            const content = el.innerText;
            markdown += formatMessage(role, content);
        });
    }
    // Gemini
    else if (host.includes('gemini.google.com')) {
        document.querySelectorAll('message-content').forEach(function(el, i) {
            const role = i % 2 === 0 ? 'user' : 'assistant';
            markdown += formatMessage(role, el.innerText);
        });
    }
    // DeepSeek
    else if (host.includes('chat.deepseek.com')) {
        document.querySelectorAll('[class*="message"]').forEach(function(el) {
            const isUser = el.classList.toString().includes('user');
            const role = isUser ? 'user' : 'assistant';
            if (el.innerText.trim()) {
                markdown += formatMessage(role, el.innerText);
            }
        });
    }
    // LMArena
    else if (host.includes('lmarena.ai') || host.includes('chat.lmsys.org')) {
        document.querySelectorAll('[class*="message"],[class*="chat"]').forEach(function(el) {
            const text = el.innerText.trim();
            if (text.length > 0) {
                const isUser = el.classList.toString().toLowerCase().includes('user');
                markdown += formatMessage(isUser ? 'user' : 'assistant', text);
            }
        });
    }
    // Generic fallback
    else {
        const messages = [];
        document.querySelectorAll('div[class*="message"],div[class*="chat"],div[class*="turn"]').forEach(function(el) {
            const text = el.innerText.trim();
            if (text.length > 10) messages.push(text);
        });
        messages.forEach(function(msg, i) {
            markdown += formatMessage(i % 2 === 0 ? 'user' : 'assistant', msg);
        });
    }
    
    // Check if we got any messages
    if (markdown.split('---').length < 3) {
        alert('Could not detect chat messages on this page.\\n\\nSupported platforms:\\n• ChatGPT (chatgpt.com)\\n• Gemini (gemini.google.com)\\n• DeepSeek (chat.deepseek.com)\\n• LMArena (lmarena.ai)');
        return;
    }
    
    // Download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title.replace(/[^a-z0-9]/gi, '_').slice(0, 50) + '_' + date + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
})();
`;

// Minified version for the bookmarklet href
const bookmarkletCode = `javascript:(function(){const e=window.location.hostname,t=document.title||"chat",n=new Date().toISOString().slice(0,10);let a="# "+t+"\\n\\n> Exported: "+n+"\\n> Source: "+window.location.href+"\\n\\n---\\n\\n";function o(e,t){return"## "+("user"===e?"👤 User":"🤖 Assistant")+"\\n\\n"+t.trim()+"\\n\\n---\\n\\n"}if(e.includes("chatgpt.com")||e.includes("chat.openai.com"))document.querySelectorAll("[data-message-author-role]").forEach(e=>{const t=e.getAttribute("data-message-author-role"),n=e.innerText;a+=o(t,n)});else if(e.includes("gemini.google.com"))document.querySelectorAll("message-content").forEach((e,t)=>{const n=t%2==0?"user":"assistant";a+=o(n,e.innerText)});else if(e.includes("chat.deepseek.com"))document.querySelectorAll('[class*="message"]').forEach(e=>{const t=e.classList.toString().includes("user")?"user":"assistant";e.innerText.trim()&&(a+=o(t,e.innerText))});else if(e.includes("lmarena.ai")||e.includes("chat.lmsys.org"))document.querySelectorAll('[class*="message"],[class*="chat"]').forEach(e=>{const t=e.innerText.trim();if(t.length>0){const n=e.classList.toString().toLowerCase().includes("user")?"user":"assistant";a+=o(n,t)}});else{const e=[];document.querySelectorAll('div[class*="message"],div[class*="chat"],div[class*="turn"]').forEach(t=>{const n=t.innerText.trim();n.length>10&&e.push(n)}),e.forEach((e,t)=>{a+=o(t%2==0?"user":"assistant",e)})}if(a.split("---").length<3)return void alert("Could not detect chat messages on this page.");const s=new Blob([a],{type:"text/markdown"}),i=URL.createObjectURL(s),r=document.createElement("a");r.href=i,r.download=t.replace(/[^a-z0-9]/gi,"_").slice(0,50)+"_"+n+".md",document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)})();`;

// Set bookmarklet href
document.getElementById('bookmarklet').href = bookmarkletCode;
document.getElementById('bookmarkletCode').value = bookmarkletCode;

// Show code block
function showCode() {
    const codeBlock = document.getElementById('codeBlock');
    codeBlock.classList.toggle('hidden');
}

// Copy code to clipboard
function copyCode() {
    const code = document.getElementById('bookmarkletCode').value;
    navigator.clipboard.writeText(code).then(() => {
        showToast();
    });
}

// Show toast notification
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Make functions globally available
window.showCode = showCode;
window.copyCode = copyCode;
