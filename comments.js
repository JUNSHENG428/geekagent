(function(){
  const roots = document.querySelectorAll('[data-comments]');
  if(!roots.length) return;

  const escapeHtml = value => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function keyFor(root) {
    const pageId = root.dataset.comments || location.pathname;
    return `law_comments:${pageId}`;
  }

  function load(root) {
    try { return JSON.parse(localStorage.getItem(keyFor(root)) || '[]'); }
    catch (_) { return []; }
  }

  function save(root, comments) {
    localStorage.setItem(keyFor(root), JSON.stringify(comments));
  }

  function makeComment(name, body) {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: name || '匿名用户',
      body,
      likes: 0,
      replies: [],
      createdAt: new Date().toISOString()
    };
  }

  function render(root) {
    const comments = load(root);
    root.innerHTML = `
      <section class="comments card">
        <div class="eyebrow">Comments</div>
        <h2>留言互动</h2>
        <p class="muted">分享你的配置、报错或建议。留言会先保存在当前浏览器里，适合记录自己的排查过程。</p>
        <form class="comment-form" data-comment-form>
          <input name="name" maxlength="40" placeholder="昵称（选填）">
          <textarea name="body" maxlength="800" placeholder="写下你的问题、配置经验或建议..." required></textarea>
          <div class="comment-tools">
            <button class="btn primary" type="submit">发布留言</button>
            <button class="btn" type="button" data-export-comments>导出本页留言</button>
            <button class="btn" type="button" data-clear-comments>清空本地留言</button>
          </div>
        </form>
        <div class="comment-list" data-comment-list>
          ${comments.length ? comments.map(comment => renderComment(comment)).join('') : '<div class="comment-empty">还没有留言，成为第一个反馈的人。</div>'}
        </div>
      </section>
    `;
  }

  function renderComment(comment, isReply = false) {
    const date = new Date(comment.createdAt).toLocaleString('zh-CN', {dateStyle:'medium', timeStyle:'short'});
    return `
      <article class="comment-item" data-comment-id="${comment.id}">
        <div class="comment-meta"><strong>${escapeHtml(comment.name)}</strong><span>${date}</span></div>
        <div class="comment-body">${escapeHtml(comment.body)}</div>
        <div class="comment-actions">
          <button type="button" data-like-comment>赞 ${comment.likes || 0}</button>
          ${isReply ? '' : '<button type="button" data-reply-comment>回复</button>'}
        </div>
        ${comment.replies && comment.replies.length ? `<div class="comment-replies">${comment.replies.map(reply => renderComment(reply, true)).join('')}</div>` : ''}
      </article>
    `;
  }

  function findComment(comments, id) {
    for (const comment of comments) {
      if(comment.id === id) return comment;
      const reply = findComment(comment.replies || [], id);
      if(reply) return reply;
    }
    return null;
  }

  function bind(root) {
    root.addEventListener('submit', event => {
      const form = event.target.closest('[data-comment-form]');
      if(!form) return;
      event.preventDefault();
      const data = new FormData(form);
      const body = String(data.get('body') || '').trim();
      if(!body) return;
      const comments = load(root);
      comments.unshift(makeComment(String(data.get('name') || '').trim(), body));
      save(root, comments);
      window.lawTrack && window.lawTrack('comment_create', {page: root.dataset.comments || location.pathname});
      render(root);
    });

    root.addEventListener('click', event => {
      const item = event.target.closest('[data-comment-id]');
      if(event.target.matches('[data-like-comment]') && item) {
        const comments = load(root);
        const comment = findComment(comments, item.dataset.commentId);
        if(comment) comment.likes = (comment.likes || 0) + 1;
        save(root, comments);
        window.lawTrack && window.lawTrack('comment_like');
        render(root);
      }
      if(event.target.matches('[data-reply-comment]') && item) {
        const body = prompt('回复内容：');
        if(!body || !body.trim()) return;
        const name = prompt('昵称（选填）：') || '';
        const comments = load(root);
        const comment = findComment(comments, item.dataset.commentId);
        if(comment) comment.replies.push(makeComment(name.trim(), body.trim()));
        save(root, comments);
        window.lawTrack && window.lawTrack('comment_reply');
        render(root);
      }
      if(event.target.matches('[data-clear-comments]')) {
        if(confirm('只会清空当前浏览器里的本页留言，确定继续？')) {
          localStorage.removeItem(keyFor(root));
          render(root);
        }
      }
      if(event.target.matches('[data-export-comments]')) {
        const blob = new Blob([JSON.stringify(load(root), null, 2)], {type:'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'local-agent-wizard-comments.json';
        a.click();
        URL.revokeObjectURL(a.href);
      }
    });
  }

  roots.forEach(root => {
    render(root);
    bind(root);
  });
})();
