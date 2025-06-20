

const supabase = window.supabase.createClient(
  'https://qwdwcsdgjhuthhrpijoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZHdjc2Rnamh1dGhocnBpam96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjIzNTEsImV4cCI6MjA2NTU5ODM1MX0.oh2bBUPY_YJQkFWPy06JSA_B-sXkg1h5t0DoK1eqnrQ'
);

// Elements
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
const shoppingList = document.getElementById('shopping-list');
const newItemInput = document.getElementById('new-shopping-item');
const addShoppingItem = document.getElementById('add-shopping-item');

const footerNav = document.getElementById('footer-nav');
const navChores = document.getElementById('nav-chores');
const navShopping = document.getElementById('nav-shopping');

  function hideApps() {
    shoppingSection.style.display = 'none';
    navShopping.classList.remove('active');

    choreSection.style.display = 'none';
    navChores.classList.remove('active');
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




// Login
loginBtn.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
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



async function toggleShoppingComplete(id, completed) {
  await supabase
    .from('shopping_items')
    .update({ completed })
    .eq('id', id);
  loadShoppingItems();
}



//Event listeners
navChores.addEventListener('click', showChores);
navShopping.addEventListener('click', showShopping);


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