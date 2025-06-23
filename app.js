

const supabase = window.supabase.createClient(
  'https://qwdwcsdgjhuthhrpijoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZHdjc2Rnamh1dGhocnBpam96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjIzNTEsImV4cCI6MjA2NTU5ODM1MX0.oh2bBUPY_YJQkFWPy06JSA_B-sXkg1h5t0DoK1eqnrQ'
);

// Elements
const toggleDarkMode = document.getElementById('toggle-theme');
const authSection = document.getElementById('auth-section');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usersName = document.getElementById('user-name');
const authMessage = document.getElementById('auth-message');

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

const addChore = document.getElementById('add-chore');
const choreInput = document.getElementById('new-chore');
const choreList = document.getElementById('chore-list');
const choreSection = document.getElementById('chore-section');

const shoppingSection = document.getElementById('shopping-section');
const toggleClubcard = document.getElementById('toggle-clubcard');
const clubcardQRCode = document.getElementById('clubcard-qr-code');
const shoppingList = document.getElementById('shopping-list');
const newItemInput = document.getElementById('new-shopping-item');
const addShoppingItem = document.getElementById('add-shopping-item');

const addWatch = document.getElementById('add-watch-item');
const watchInput = document.getElementById('new-watch-item');
const watchList = document.getElementById('watch-list');
const watchSection = document.getElementById('watch-section');

const footerNav = document.getElementById('footer-nav');
const navChores = document.getElementById('nav-chores');
const navShopping = document.getElementById('nav-shopping');
const navWatch = document.getElementById('nav-watch');


  function hideApps() {
    choreSection.style.display = 'none';
    navChores.classList.remove('active');

    shoppingSection.style.display = 'none';
    navShopping.classList.remove('active');
    clubcardQRCode.style.display = 'none';
    toggleClubcard.innerHTML = 'Display Clubcard QR Code'

    watchSection.style.display = 'none';
    navWatch.classList.remove('active');
  }

  function hideNav() {
    footerNav.style.display = 'none';
  }

  function showChores() {
    hideApps();
    loadChores();
    choreSection.style.display = 'block';
    navChores.classList.add('active');
  }

  function showShopping() {
    hideApps();
    loadShoppingItems();
    shoppingSection.style.display = 'block';
    navShopping.classList.add('active');
  }

  function showWatchList() {
    hideApps();
    loadWatchList();
    watchSection.style.display = 'block';
    navWatch.classList.add('active');
  }


// Login
loginBtn.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });

    if (error) {
      authMessage.textContent = error.message;
    } else {
      //read user's names
      const {
        data: { user }
      } = await supabase.auth.getUser();

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('forename, surname, nickname')
        .eq('id', user.id)
        .single();

      if (!error) {
        usersName.textContent = profile.forename;
      }

      loadChores();
      loadShoppingItems();
      loadWatchList();
      showChores();
      footerNav.style.display = 'flex';
      logoutBtn.style.display = 'block';
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  authSection.style.display = 'block';
  hideApps();
  hideNav();
  logoutBtn.style.display = 'none';
  usersName.textContent = '';
});

// Load chores
async function loadChores() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: chores, error } = await supabase.from('chores').select('*').order('inserted_at', { ascending: true });

  if (error) {
    alert('Error loading chores');
    return;
  }

  // Show app
  authSection.style.display = 'none';
  choreSection.style.display = 'block';

  choreList.innerHTML = '';
  chores.forEach((chore) => {
    createChoreItem(chore);
  });
}

function createChoreItem(chore) {
  const li = document.createElement('li');
  const div = document.createElement('div');
    div.setAttribute('class', 'chore-text')
    div.textContent = chore.completed ? `✅ ${chore.item}` : chore.item;
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => toggleChoreComplete(chore.id, !chore.completed));

  const bt = document.createElement('div');
    bt.setAttribute('class', 'chore-delete')
    bt.textContent = '❌';
    bt.style.cursor = 'pointer';
    bt.addEventListener('click', () => deleteChore(chore.id));

  li.append(div);
  li.append(bt);
  choreList.appendChild(li);
}

// Add chore
addChore.addEventListener('click', async () => {
  const item = choreInput.value.trim();
  if (!item) return;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  await supabase.from('chores').insert([
    { item: item, user_id: user.id, completed: false }
  ]);

  choreInput.value = '';
  loadChores();
});

// Delete chore
async function deleteChore(id) {
  await supabase
  .from('chores')
  .delete()
  .eq('id', id)
  loadChores();
}

// Toggle completed
async function toggleChoreComplete(id, completed) {
  await supabase.from('chores').update({ completed }).eq('id', id);
  loadChores();
}


async function loadShoppingItems() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: items, error } = await supabase
    .from('shopping_items')
    .select('*')
    .order('inserted_at', { ascending: true });

  if (error) {
    alert('Error loading shopping items');
    return;
  }

  shoppingList.innerHTML = '';
  items.forEach((item) => {
    createShoppingItem(item);
  });
}

function createShoppingItem(item) {
  const li = document.createElement('li');
  const div = document.createElement('div');
    div.setAttribute('class', 'shopping-item-text')
    div.textContent = item.completed ? `✅ ${item.item}` : item.item;
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => toggleShoppingComplete(item.id, !item.completed));

  const bt = document.createElement('div');
    bt.setAttribute('class', 'shopping-item-delete')
    bt.textContent = '❌';
    bt.style.cursor = 'pointer';
    bt.addEventListener('click', () => deleteShoppingItem(item.id));

  li.append(div);
  li.append(bt);
  shoppingList.appendChild(li);
}

// Delete shopping item
async function deleteShoppingItem(id) {
  await supabase
  .from('shopping_items')
  .delete()
  .eq('id', id)
  loadShoppingItems();
}


addShoppingItem.addEventListener('click', async () => {
  const item = newItemInput.value.trim();
  if (!item) return;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  await supabase.from('shopping_items').insert([
    { item: item, user_id: user.id, completed: false }
  ]);

  newItemInput.value = '';
  loadShoppingItems();
});


toggleClubcard.addEventListener('click', async () => {
  if (clubcardQRCode.style.display == 'none') {
    clubcardQRCode.style.display = 'block';
    toggleClubcard.innerHTML = 'Hide Clubcard QR Code'
  } else {
    clubcardQRCode.style.display = 'none';
    toggleClubcard.innerHTML = 'Display Clubcard QR Code'
  }
});


async function toggleShoppingComplete(id, completed) {
  await supabase
    .from('shopping_items')
    .update({ completed })
    .eq('id', id);
  loadShoppingItems();
}



// Load watch list
async function loadWatchList() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: watchItems, error } = await supabase.from('watchlist').select('*').order('inserted_at', { ascending: true });

  if (error) {
    alert('Error loading watch items');
    return;
  }

  // Show app
  authSection.style.display = 'none';
  watchSection.style.display = 'block';

  watchList.innerHTML = '';
  watchItems.forEach((watchItem) => {
    createWatchItem(watchItem);
  });
}

function createWatchItem(watchItem) {
  const li = document.createElement('li');
  const div = document.createElement('div');
    div.setAttribute('class', 'watch-item-text')
    div.textContent = watchItem.name;

  const bt = document.createElement('div');
    bt.setAttribute('class', 'watch-item-delete')
    bt.textContent = '❌';
    bt.style.cursor = 'pointer';
    bt.addEventListener('click', () => deleteWatchItem(watchItem.id));

  li.append(div);
  li.append(bt);
  watchList.appendChild(li);
}


// Add watch item
addWatch.addEventListener('click', async () => {
  const item = watchInput.value.trim();
  if (!item) return;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  await supabase.from('watchlist').insert([
    { name: item, user_id: user.id }
  ]);

  watchInput.value = '';
  loadWatchList();
});

// Delete watch item
async function deleteWatchItem(id) {
  await supabase
  .from('watchlist')
  .delete()
  .eq('id', id)
  loadWatchList();
}



//Event listeners
toggleDarkMode.addEventListener('click', toggleTheme);

navChores.addEventListener('click', showChores);
navShopping.addEventListener('click', showShopping);
navWatch.addEventListener('click', showWatchList);

function toggleTheme() {
  if (toggleDarkMode.innerHTML == '⏾') {
    setDarkMode();
  } else {
    setLightMode();
  }
}

function setDarkMode() {
  toggleDarkMode.innerHTML = '☀︎';
  document.body.classList.add('dark');
}

function setLightMode() {
  toggleDarkMode.innerHTML = '⏾';
  document.body.classList.remove('dark');
}

// Auto-login if session exists
supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    showChores();
  } else {
    hideApps();
    hideNav();
    logoutBtn.style.display = 'none';
  }
});


if (authSection.style.display == '') {
  footerNav.style.display = 'flex';
  logoutBtn.style.display = 'block';
}