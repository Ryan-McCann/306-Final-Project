let threadId = window.location.pathname.split('/')[4];
let boardName = window.location.pathname.split('/')[2];

function loadPosts() {    
    let postList = document.getElementById("postList");
    fetch('/posts/'+threadId)
    .then(response => response.json())
    .then(res_posts => {
        let now = new Date();
        
        res_posts.forEach(post => {
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
            
            postList.innerHTML +=
                `
                <li class="list-group-item">
                    <div>
                        Posted by: ${post.username} on: ${formatted}
                    </div>
                    <div>
                        ${post.contents}
                    </div>
                </li>
                `;
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('/getthreadtitle/'+threadId)
    .then(response => response.json())
    .then(res_thread => {
        console.log(res_thread);
        let threadTitleSpan = document.getElementById("threadTitleSpan");
        threadTitleSpan.innerText = res_thread[0].title;
    });
    
    loadPosts();
    
    document.getElementById("post_form").action = `/board/${boardName}/thread/${threadId}`;
    
    document.getElementById("post_form").addEventListener('submit', async (e) => {
        e.preventDefault();
        let contents = document.getElementById("post_txt").value;
        
        console.log(threadId);
        
        await fetch('/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ thread_id: threadId, contents})
        })
        .then(res =>{
            location.reload();
        });
        
    });
});