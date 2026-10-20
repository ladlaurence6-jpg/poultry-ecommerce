// Updated sample data with Peso values
const defaultChickens = [
  {
    id: "1",
    breed: "Rhode Island Red",
    ageCategory: "4-month-old",
    price: 350.00,
    inventory: 12,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80",
    traits: "Excellent egg layer, hardy in cold weather, friendly temperament.",
    description: "4-month-old Rhode Island Red pullet. Strong, healthy, and nearing point-of-lay stage."
  },
  {
    id: "2",
    breed: "Leghorn",
    ageCategory: "5-month-old",
    price: 420.00,
    inventory: 8,
    image: "https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=600&q=80",
    traits: "Active, prolific white egg production, energetic.",
    description: "5-month-old Leghorn pullet. High productivity potential, ready for farm flock integration."
  },
  {
    id: "3",
    breed: "Plymouth Rock",
    ageCategory: "6-month-old and older",
    price: 500.00,
    inventory: 0,
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80",
    traits: "Dual-purpose breed, gentle nature, beautiful barred plumage.",
    description: "Mature 6-month+ Plymouth Rock hen. Fully grown, laying brown eggs regularly."
  }
];

let chickens = JSON.parse(localStorage.getItem('poultry_inventory')) || defaultChickens;

function saveToLocalStorage() {
  localStorage.setItem('poultry_inventory', JSON.stringify(chickens));
}

// Render Products
function renderProducts(categoryFilter = 'All') {
  const grid = document.getElementById('product-grid');
  const featuredGrid = document.getElementById('featured-container');
  
  grid.innerHTML = '';
  featuredGrid.innerHTML = '';

  const filtered = categoryFilter === 'All' 
    ? chickens 
    : chickens.filter(c => c.ageCategory === categoryFilter);

  filtered.forEach(item => {
    grid.innerHTML += createCardHTML(item);
  });

  chickens.filter(c => c.inventory > 0).slice(0, 3).forEach(item => {
    featuredGrid.innerHTML += createCardHTML(item);
  });
}

function createCardHTML(item) {
  const isAvailable = item.inventory > 0;
  return `
    <div class="card">
      <img src="${item.image}" alt="${item.breed}">
      <div class="card-content">
        <span class="badge ${isAvailable ? 'badge-instock' : 'badge-outstock'}">
          ${isAvailable ? `In Stock (${item.inventory})` : 'Out of Stock'}
        </span>
        <h3 class="card-title">${item.breed}</h3>
        <p><strong>Age:</strong> ${item.ageCategory}</p>
        <p class="price">₱${parseFloat(item.price).toFixed(2)}</p>
        <p>${item.description.substring(0, 70)}...</p>
        <button class="btn-primary" style="margin-top: auto;" onclick="openModal('${item.id}')">View Details</button>
      </div>
    </div>
  `;
}

function filterCategory(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText.toLowerCase().includes(category.toLowerCase()) || (category === 'All' && btn.innerText === 'All Chickens'));
  });
  renderProducts(category);
}

// Details Modal
function openModal(id) {
  const item = chickens.find(c => c.id === id);
  if (!item) return;

  const modalBody = document.getElementById('modal-body');
  const isAvailable = item.inventory > 0;

  modalBody.innerHTML = `
    <h2>${item.breed} Details</h2>
    <img src="${item.image}" alt="${item.breed}" style="width:100%; max-height:250px; object-fit:cover; border-radius:6px; margin: 1rem 0;">
    <p><strong>Age Category:</strong> ${item.ageCategory}</p>
    <p><strong>Price:</strong> ₱${parseFloat(item.price).toFixed(2)}</p>
    <p><strong>Availability:</strong> <span class="badge ${isAvailable ? 'badge-instock' : 'badge-outstock'}">${isAvailable ? `In Stock (${item.inventory} units available)` : 'Out of Stock'}</span></p>
    <p><strong>Characteristics & Traits:</strong> ${item.traits || 'N/A'}</p>
    <p style="margin-top: 1rem;"><strong>Full Description:</strong><br>${item.description}</p>
  `;

  document.getElementById('detail-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('detail-modal').style.display = 'none';
}

// Admin Table
function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  tbody.innerHTML = '';

  chickens.forEach(item => {
    const isAvailable = item.inventory > 0;
    tbody.innerHTML += `
      <tr>
        <td><img src="${item.image}" class="thumb-img" alt=""></td>
        <td><strong>${item.breed}</strong></td>
        <td>${item.ageCategory}</td>
        <td>₱${parseFloat(item.price).toFixed(2)}</td>
        <td>${item.inventory}</td>
        <td><span class="badge ${isAvailable ? 'badge-instock' : 'badge-outstock'}">${isAvailable ? 'Available' : 'Sold Out'}</span></td>
        <td>
          <button onclick="editChicken('${item.id}')" style="padding:4px 8px; cursor:pointer;">Edit</button>
          <button onclick="deleteChicken('${item.id}')" style="padding:4px 8px; cursor:pointer; background:#fee2e2; color:#991b1b; border:none; border-radius:3px;">Delete</button>
        </td>
      </tr>
    `;
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('chicken-id').value;
  const breed = document.getElementById('breed').value;
  const ageCategory = document.getElementById('ageCategory').value;
  const price = parseFloat(document.getElementById('price').value);
  const inventory = parseInt(document.getElementById('inventory').value);
  const image = document.getElementById('image').value;
  const traits = document.getElementById('traits').value;
  const description = document.getElementById('description').value;

  if (id) {
    const index = chickens.findIndex(c => c.id === id);
    if (index !== -1) {
      chickens[index] = { id, breed, ageCategory, price, inventory, image, traits, description };
    }
  } else {
    const newChicken = {
      id: Date.now().toString(),
      breed, ageCategory, price, inventory, image, traits, description
    };
    chickens.push(newChicken);
  }

  saveToLocalStorage();
  resetForm();
  renderProducts();
  renderAdminTable();
}

function editChicken(id) {
  const item = chickens.find(c => c.id === id);
  if (!item) return;

  document.getElementById('chicken-id').value = item.id;
  document.getElementById('breed').value = item.breed;
  document.getElementById('ageCategory').value = item.ageCategory;
  document.getElementById('price').value = item.price;
  document.getElementById('inventory').value = item.inventory;
  document.getElementById('image').value = item.image;
  document.getElementById('traits').value = item.traits;
  document.getElementById('description').value = item.description;

  document.getElementById('form-title').innerText = 'Edit Chicken Listing';
  document.getElementById('save-btn').innerText = 'Update Listing';
  window.location.hash = 'admin';
}

function deleteChicken(id) {
  if (confirm('Are you sure you want to delete this listing?')) {
    chickens = chickens.filter(c => c.id !== id);
    saveToLocalStorage();
    renderProducts();
    renderAdminTable();
  }
}

function resetForm() {
  document.getElementById('admin-form').reset();
  document.getElementById('chicken-id').value = '';
  document.getElementById('form-title').innerText = 'Add New Chicken Listing';
  document.getElementById('save-btn').innerText = 'Add Listing';
}

window.onload = () => {
  saveToLocalStorage();
  renderProducts();
  renderAdminTable();
};