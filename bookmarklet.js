// AI Chat Exporter Bookmarklet v1.1 • github.com/YOUR_GITHUB_USERNAME/ai-chat-exporter
(function() {
  const CONFIG = {
    INCLUDE_USER: true,
    INCLUDE_ASSISTANT: true,
    INCLUDE_TIMESTAMPS: true,
    INCLUDE_SOURCES: true,
    FILENAME_PREFIX: 'AI_Chat'
  };

  // ===== UTILITIES =====
  const sanitize = (str, fallback) => 
    (str || fallback || 'chat')
      .replace(/[^a-z0-9\s\-_]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase()
      .slice(0, 60) || 'export';
  
  const download = (content, filename) => {
    const blob = new Blob([content], {type: 'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {href: url, download: filename});
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
  };

  // ===== PLATFORM EXTRACTORS =====
  const extractors = {
    deepseek: () => {
      if (!window.__PRELOADED_STATE__) throw new Error('DeepSeek state not found');
      const s = window.__PRELOADED_STATE__.chat?.currentSessionData;
      if (!s?.messages?.length) throw new Error('No messages found');
      return {
        title: s.topicName || 'DeepSeek_Chat',
        model: s.modelName || 'deepseek-chat',
        messages: s.messages
          .filter(m => ['user','assistant'].includes(m.role))
          .map(m => ({
            role: m.role,
            content: m.content?.[0]?.text?.trim() || '',
            time: m.createTime,
            sources: m.citations?.map(c => ({title: c.title || c.url, url: c.url})) || []
          }))
      };
    },
    
    claude: () => {
      const messages = [...document.querySelectorAll('div[data-message]')].map(el => {
        const isUser = !!el.querySelector('[data-is-user-message]') || 
                       el.classList.toString().match(/user|human/i);
        const contentEl = el.querySelector('[data-content]') || el.querySelector('div.prose, div.markdown');
        const timeEl = el.querySelector('time');
        return {
          role: isUser ? 'user' : 'assistant',
          content: contentEl?.innerText.trim() || '',
          time: timeEl?.getAttribute('datetime') || null
        };
      }).filter(m => m.content);
      
      if (!messages.length) throw new Error('Could not find messages. Try scrolling up to load history.');
      
      const titleEl = document.querySelector('h1') || document.querySelector('[data-conversation-title]');
      return {
        title: titleEl?.innerText.trim().replace(/[^\w\s]/g, '') || 'Claude_Chat',
        model: 'claude',
        messages
      };
    },
    
    // Add more platforms here (grok, arena, etc.)
    default: () => {
      // Fallback: Copy visible chat text
      const text = document.body.innerText;
      return {
        title: 'Chat_Export',
        messages: [{role: 'system', content: `## Extracted Content\n\n${text.slice(0, 10000)}...`}]
      };
    }
  };

  // ===== MAIN FLOW =====
  try {
    // Detect platform
    const url = window.location.href.toLowerCase();
    let extractor = extractors.default;
    if (url.includes('deepseek.com')) extractor = extractors.deepseek;
    else if (url.includes('claude.ai')) extractor = extractors.claude;
    // Add more detections here
    
    // Extract data
    const {title, model, messages} = extractor();
    if (!messages?.length) throw new Error('No messages extracted');
    
    // Generate Markdown
    let md = `# ${sanitize(title)}\n\n`;
    md += `> **Exported from**: ${model?.toUpperCase() || 'AI Chat'}\n`;
    md += `> **Date**: ${new Date().toLocaleString()}\n`;
    md += `> **Source**: ${window.location.href}\n\n---\n\n`;
    
    messages.forEach((msg, i) => {
      if (!CONFIG.INCLUDE_USER && msg.role === 'user') return;
      if (!CONFIG.INCLUDE_ASSISTANT && msg.role === 'assistant') return;
      
      const role = msg.role === 'user' ? 'USER' : (model?.toUpperCase() || 'AI');
      md += `## ${role}${CONFIG.INCLUDE_TIMESTAMPS && msg.time ? ` • ${new Date(msg.time).toLocaleString()}` : ''}\n\n`;
      md += `${msg.content}\n\n`;
      
      if (CONFIG.INCLUDE_SOURCES && msg.sources?.length) {
        md += `**Sources:**\n`;
        msg.sources.forEach((s, i) => md += `${i+1}. [${sanitize(s.title, `Source_${i+1}`)}](${s.url})\n`);
        md += `\n`;
      }
      md += `---\n\n`;
    });
    
    // Download
    const filename = `${sanitize(title)}_${new Date().toISOString().slice(0,10)}.md`;
    download(md, filename);
    console.log(`✅ Exported ${messages.length} messages to ${filename}`);
    
  } catch (error) {
    console.error('Export failed:', error);
    const msg = `AI Chat Exporter Error:\n${error.message}\n\n✅ Works best on:\n• DeepSeek (chat.deepseek.com)\n• Claude.ai\n\n💡 Tip: Scroll to top of chat to load full history\n\n🐞 Report issue: github.com/YOUR_GITHUB_USERNAME/ai-chat-exporter`;
    if (confirm(msg + '\n\nShow technical details?')) alert(error.stack);
  }
})();
