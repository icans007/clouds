// Data harga produk
const originalPrice = {
  gelang: 79000,
  vest: 129000
};

const discountPrice = {
  gelang: 59000,
  vest: 99000
};

const currentPrice = { ...originalPrice }; // Salin harga asli untuk modifikasi

// Fungsi untuk mengaktifkan Flash Sale
function activateFlashSaleTodayOnly() {
  currentPrice.gelang = discountPrice.gelang;
  currentPrice.vest = discountPrice.vest;

  // Update harga dan badge untuk Gelang
  const gelangCard = document.querySelector('img[alt="Gelang"]').closest('.product-card');
  if (gelangCard) {
    gelangCard.querySelector('p').innerHTML = `<span class="line-through text-gray-400">Rp ${originalPrice.gelang.toLocaleString()}</span> <span class="text-green-700 font-bold">Rp ${discountPrice.gelang.toLocaleString()}</span>`;
    gelangCard.querySelector('h3').innerHTML += ` <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">Flash Sale 🔥</span>`;
    gelangCard.querySelector('button').setAttribute('onclick', `addToCart('Gelang', ${discountPrice.gelang}, 'gmb 5.jpg')`);
  }

  // Update harga dan badge untuk Vest
  const vestCard = document.querySelector('img[alt="Vest"]').closest('.product-card');
  if (vestCard) {
    vestCard.querySelector('p').innerHTML = `<span class="line-through text-gray-400">Rp ${originalPrice.vest.toLocaleString()}</span> <span class="text-green-700 font-bold">Rp ${discountPrice.vest.toLocaleString()}</span>`;
    vestCard.querySelector('h3').innerHTML += ` <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">Flash Sale 🔥</span>`;
    vestCard.querySelector('button').setAttribute('onclick', `addToCart('Vest', ${discountPrice.vest}, 'gmb 6.jpg')`);
  }
}

// Jalankan fungsi flash sale saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', activateFlashSaleTodayOnly);

// Keranjang Belanja
const cart = [];

function addToCart(name, price, image) {
  cart.push({ name, price, image });
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountElement = document.getElementById("cart-count");
  const cartTotalElement = document.getElementById("cart-total");

  cartItemsContainer.innerHTML = ""; // Bersihkan daftar item sebelum diperbarui
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 italic">Keranjang belanja kosong.</p>';
  } else {
    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "flex items-center justify-between space-x-4 border-b pb-4 last:border-b-0 last:pb-0"; // Tambahkan kelas untuk item terakhir
      itemDiv.innerHTML = `
        <div class="flex items-center space-x-4">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
          <div>
            <p class="font-semibold text-purple-700">${item.name}</p>
            <p class="text-gray-500">Rp ${item.price.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <button onclick="removeItem(${index})" class="text-red-500 hover:text-red-700 transition-colors duration-200">Hapus</button>
      `;
      cartItemsContainer.appendChild(itemDiv);
      total += item.price;
    });
  }

  cartCountElement.textContent = cart.length;
  cartTotalElement.textContent = total.toLocaleString('id-ID');
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// Logika Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Keranjang Anda masih kosong. Silakan tambahkan produk terlebih dahulu!");
    return;
  }

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const note = document.getElementById("note").value.trim();
  let bankInfo = "";

  if (paymentMethod === "Transfer") {
    const selectedBank = document.getElementById("bank-select").value;
    if (!selectedBank) {
      alert("Untuk metode pembayaran Transfer Bank/ATM, silakan pilih bank.");
      return;
    }
    bankInfo = `Transfer ke: ${selectedBank}`;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0).toLocaleString('id-ID');

  let checkoutMessage = `Checkout Berhasil!\n\n`;
  checkoutMessage += `Total Pembelian: Rp ${totalAmount}\n`;
  checkoutMessage += `Metode Pembayaran: ${paymentMethod}\n`;
  if (bankInfo) {
    checkoutMessage += `${bankInfo}\n`;
  }
  checkoutMessage += `Catatan: ${note || 'Tidak ada catatan'}\n\n`;
  checkoutMessage += `Terima kasih atas pesanan Anda!`;

  alert(checkoutMessage);

  // Reset keranjang setelah checkout
  cart.length = 0;
  updateCart();
  document.getElementById("note").value = '';
  document.getElementById("bank-select").value = '';
  document.getElementById("transfer-options").classList.add('hidden');
  document.querySelector('input[value="COD"]').checked = true; // Kembali ke COD sebagai default
}

// Event Listeners

// Tampilkan/sembunyikan opsi transfer bank
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', (event) => {
    const transferOptions = document.getElementById('transfer-options');
    if (event.target.value === 'Transfer') {
      transferOptions.classList.remove('hidden');
    } else {
      transferOptions.classList.add('hidden');
    }
  });
});

// Ubah warna background cart
const bgColorSelect = document.getElementById('bg-color');
const cartSection = document.getElementById('cart');
let currentBgClass = 'bg-white'; // Inisialisasi dengan kelas background default

bgColorSelect.addEventListener('change', (event) => {
  cartSection.classList.remove(currentBgClass);
  currentBgClass = event.target.value;
  cartSection.classList.add(currentBgClass);
});

// Inisialisasi tampilan keranjang saat halaman dimuat
document.addEventListener('DOMContentLoaded', updateCart);