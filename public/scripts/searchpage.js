document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (!query) return;
    
    fetch(`/searchresults?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
        
        const postList = document.getElementById('postsSearchList');
        const chatList = document.getElementById('chatSearchList');
        
        if(data.posts !== undefined && data.posts.length > 0) {
            postList.innerHTML = '';
            
            data.posts.forEach(post => {
                const li = document.createElement('li');
                li.className = "list-group-item";
                li.innerHTML = `
                    <div>${post.contents}</div>
                    <div class="text-muted">by <a class="text-decoration-none" href="/profile/${post.username}">${post.username}</a> in <a href="/board/${post.board_name}/thread/${post.thread_id}">${post.title}</a></div>
                    <div class="text-muted small">${post.creation_date}</div>
                `;
                postList.appendChild(li);
            });
        }
        
        if(data.rooms !== undefined && data.rooms.length > 0) {
            chatList.innerHTML = '';
            
            data.rooms.forEach(room => {
                const li = document.createElement('li');
                li.className = "list-group-item";
                li.innerHTML = `<a href="/room/${room.name}">${room.name}</a>`;
                chatList.appendChild(li);
            });
        }
    });
});