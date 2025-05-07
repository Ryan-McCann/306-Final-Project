let threadId = window.location.pathname.split('/')[4];
let boardName = window.location.pathname.split('/')[2];

function loadPosts() {    
    let postList = document.getElementById("postList");
    fetch('/posts/'+threadId)
    .then(response => response.json())
    .then(res_posts => {
        let now = new Date();
        
        res_posts.forEach((post, index) => {
            let date = new Date(post.creation_date.replace(' ', 'T')+'Z');
            let isToday = 
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate();

            let formatted = new Date(date).toLocaleString(undefined, isToday ? {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            } : {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            
            const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-light';
            
            const card = document.createElement('div');
            card.className = `card shadow-sm ${bgClass}`;

            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex">
                        <a href="/profile/${post.username}"><img src="/images/${post.profile_photo}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;"></a>
                        <div class="w-100">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <a href="/profile/${post.username}" class="fw-semibold text-primary text-decoration-none">${post.username}</a>
                                <small class="text-muted">${formatted}</small>
                            </div>
                            <div class="ps-2 border-start border-2">
                                ${post.contents}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            postList.appendChild(card);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('/getthreadtitle/'+threadId)
    .then(response => response.json())
    .then(res_thread => {
        let threadTitleSpan = document.getElementById("threadTitleSpan");
        threadTitleSpan.innerText = res_thread[0].title;
        document.title = `${res_thread[0].title} | Chatpost`;
    });
    
    loadPosts();
    
    document.getElementById("post_form").action = `/board/${boardName}/thread/${threadId}`;
    
    document.getElementById("post_form").addEventListener('submit', async (e) => {
        e.preventDefault();
        let contents = document.getElementById("post_txt").value;
        
        await fetch('/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ thread_id: threadId, contents})
        })
        .then(res =>{
            location.reload();
        });
        
    });
    
    fetch('/loggedin')
    .then(res => res.json())
    .then(data => {
        let postForm = document.getElementById("postForm");
        
        if(data.loggedIn) {
            postForm.hidden = false;
        } else {
            postForm.hidden = true;
        }
    });
});