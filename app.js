

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qwdwcsdgjhuthhrpijoz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

const supabase = supabase.createClient(
  'https://qwdwcsdgjhuthhrpijoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZHdjc2Rnamh1dGhocnBpam96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjIzNTEsImV4cCI6MjA2NTU5ODM1MX0.oh2bBUPY_YJQkFWPy06JSA_B-sXkg1h5t0DoK1eqnrQ'
);

// Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addBtn = document.getElementById('add-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const choreInput = document.getElementById('new-chore');
const choreList = document.getElementById('chore-list');
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authMessage = document.getElementById('auth-message');

// Login
loginBtn.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });

  if (error) {
    authMessage.textContent = error.message;
  } else {
    loadChores();
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  authSection.style.display = 'block';
  appSection.style.display = 'none';
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
  appSection.style.display = 'block';

  choreList.innerHTML = '';
  chores.forEach((chore) => {
    const li = document.createElement('li');
    li.textContent = chore.completed ? `✅ ${chore.item}` : chore.item;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => toggleComplete(chore.id, !chore.completed));
    choreList.appendChild(li);
  });
}

// Add chore
addBtn.addEventListener('click', async () => {
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

// Toggle completed
async function toggleComplete(id, completed) {
  await supabase.from('chores').update({ completed }).eq('id', id);
  loadChores();
}

// Auto-login if session exists
supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    loadChores();
  }
});
