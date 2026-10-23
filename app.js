const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const form = document.querySelector('#post-form');
const formMessage = document.querySelector('#form-message');
const listStatus = document.querySelector('#list-status');
const list = document.querySelector('#post-list');

// ---------- helpers ----------

// Shows a message in the list area. Passing '' hides it.
function setListStatus(text, isError = false) {
  listStatus.textContent = text;
  listStatus.classList.toggle('error', isError);
}

// Builds one <li> for a post. textContent (not innerHTML) so API data
// can never be interpreted as HTML.
function createPostElement(post) {
  const li = document.createElement('li');
  li.dataset.id = post.id;

  const title = document.createElement('h3');
  title.textContent = post.title;

  const body = document.createElement('p');
  body.textContent = post.body;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'delete';
  button.textContent = 'Delete';

  li.append(title, body, button);
  return li;
}

function showEmptyIfNeeded() {
  if (list.children.length === 0) {
    setListStatus('Nu există postări.');
  }
}

// ---------- GET: load the list ----------

async function loadPosts() {
  setListStatus('Loading...');
  try {
    const response = await fetch(`${API_URL}?_limit=10`);
    if (!response.ok) {
      throw new Error(`Server answered ${response.status}`);
    }
    const posts = await response.json();

    list.replaceChildren(...posts.map(createPostElement));
    setListStatus('');
    showEmptyIfNeeded();
  } catch (error) {
    setListStatus('Could not load posts. Please try again later.', true);
  }
}

// ---------- POST: create a post ----------

async function handleSubmit(event) {
  event.preventDefault(); // stop the browser from reloading the page
  formMessage.textContent = '';

  // FormData reads the fields by their name attribute
  const data = Object.fromEntries(new FormData(form));
  data.userId = Number(data.userId);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // 4xx/5xx: show what the server said, if it sent a message
      const error = await response.json().catch(() => ({}));
      formMessage.textContent = error.message || `Server error (${response.status}).`;
      return;
    }

    // 201 Created: add it to the top of the list, no re-fetch
    const created = await response.json();
    list.prepend(createPostElement(created));
    setListStatus(''); // hides the "No posts yet" message if it was shown
    form.reset();
  } catch (error) {
    // fetch itself failed (offline, blocked, ...)
    formMessage.textContent = 'Network error. Please check your connection.';
  }
}

// ---------- DELETE: one listener for all buttons ----------

async function handleListClick(event) {
  const button = event.target.closest('.delete');
  if (!button) return; // click was not on a delete button

  const item = button.closest('li');
  button.disabled = true;

  try {
    const response = await fetch(`${API_URL}/${item.dataset.id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Server answered ${response.status}`);
    }
    item.remove();
    showEmptyIfNeeded();
  } catch (error) {
    button.disabled = false;
    setListStatus('Could not delete the post. Please try again.', true);
  }
}

// ---------- start ----------

form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleListClick);
loadPosts();

