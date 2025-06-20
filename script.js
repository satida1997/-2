document.addEventListener('DOMContentLoaded', () => {
    const menuItems = [
        { id: 1, name: 'กระเพราหมูกรอบ', price: 60, image: 'https://i.postimg.cc/rFzmgKrT/image.jpg', type: 'food' },
        { id: 2, name: 'ผัดไทยกุ้งสด', price: 50, image: 'https://i.postimg.cc/qMXTsrmr/image.jpg', type: 'food' },
        { id: 3, name: 'ข้าวหมูทอด', price: 55, image: 'https://i.postimg.cc/NG2GrWqG/image.jpg', type: 'food' },
        { id: 4, name: 'ข้าวผัดกุ้ง', price: 65, image: 'https://i.postimg.cc/k4tCKmbQ/image.jpg', type: 'food' },
        { id: 5, name: 'สุกี้ทะเล', price: 70, image: 'https://i.postimg.cc/0yWhnyDT/image.jpg', type: 'food' },
        { id: 6, name: 'ชาเขียวเย็น', price: 30, image: 'https://i.postimg.cc/nhPw7wtZ/image.jpg', type: 'drink' },
        { id: 7, name: 'โค้ก', price: 25, image: 'https://i.postimg.cc/C5SvY3bC/coke.webp', type: 'drink' },
        { id: 8, name: 'น้ำเปล่า', price: 15, image: 'https://i.postimg.cc/RF6RmM3n/crystal.jpg', type: 'drink' }
    ];

    const menuGrid = document.getElementById('menuGrid');
    const orderSummary = document.getElementById('orderSummary');
    const totalPriceSpan = document.getElementById('totalPrice');
    const orderForm = document.getElementById('orderForm');

    let customerOrder = []; // Stores selected items: { id, name, price, quantity }

    // --- Render Menu Items ---
    function renderMenuItems() {
        menuGrid.innerHTML = '';
        menuItems.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="menu-item-details">
                    <p class="menu-item-name">${item.name}</p>
                    <p class="menu-item-price">${item.price} บาท</p>
                    <button class="add-button" data-id="${item.id}">เพิ่ม</button>
                </div>
            `;
            menuGrid.appendChild(menuItemDiv);
        });

        // Add event listeners to "Add" buttons
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.id);
                addItemToOrder(itemId);
            });
        });
    }

    // --- Add Item to Order ---
    function addItemToOrder(id) {
        const existingItemIndex = customerOrder.findIndex(item => item.id === id);
        const selectedMenuItem = menuItems.find(item => item.id === id);

        if (selectedMenuItem) {
            if (existingItemIndex > -1) {
                // If item already in cart, increment quantity
                customerOrder[existingItemIndex].quantity++;
            } else {
                // Add new item to cart
                customerOrder.push({
                    id: selectedMenuItem.id,
                    name: selectedMenuItem.name,
                    price: selectedMenuItem.price,
                    quantity: 1
                });
            }
            renderOrderSummary();
        }
    }

    // --- Update Item Quantity ---
    function updateItemQuantity(id, change) {
        const itemIndex = customerOrder.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            customerOrder[itemIndex].quantity += change;
            if (customerOrder[itemIndex].quantity <= 0) {
                // Remove item if quantity drops to 0 or less
                customerOrder.splice(itemIndex, 1);
            }
            renderOrderSummary();
        }
    }

    // --- Render Order Summary ---
    function renderOrderSummary() {
        orderSummary.innerHTML = '';
        if (customerOrder.length === 0) {
            orderSummary.innerHTML = '<p class="empty-cart-message">ยังไม่มีรายการสั่งซื้อ</p>';
        } else {
            customerOrder.forEach(item => {
                const orderItemDiv = document.createElement('div');
                orderItemDiv.classList.add('order-item');
                orderItemDiv.innerHTML = `
                    <span class="order-item-name">${item.name}</span>
                    <div class="quantity-control">
                        <button class="quantity-button decrease" data-id="${item.id}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-button increase" data-id="${item.id}">+</button>
                    </div>
                    <span class="item-price">${item.price * item.quantity} บาท</span>
                `;
                orderSummary.appendChild(orderItemDiv);
            });
        }

        // Add event listeners for quantity buttons
        document.querySelectorAll('.quantity-button.decrease').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.id);
                updateItemQuantity(itemId, -1);
            });
        });
        document.querySelectorAll('.quantity-button.increase').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.id);
                updateItemQuantity(itemId, 1);
            });
        });

        calculateTotalPrice();
    }

    // --- Calculate Total Price ---
    function calculateTotalPrice() {
        const total = customerOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceSpan.textContent = total;
    }

    // --- Handle Form Submission ---
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const total = totalPriceSpan.textContent;

        if (customerOrder.length === 0) {
            alert('กรุณาเลือกเมนูอาหารก่อนส่งข้อมูล!');
            return;
        }

        const orderedItemsNames = customerOrder.map(item => `${item.name} (x${item.quantity})`).join(', ');
        const orderedItemsPrices = customerOrder.map(item => `${item.price * item.quantity}`).join(', ');

        const formData = new FormData();
        formData.append('ชื่อ', firstName);
        formData.append('นามสกุล', lastName);
        formData.append('เบอร์โทร', phoneNumber);
        formData.append('เมนูที่ลูกค้าสั่ง', orderedItemsNames);
        formData.append('ราคา', orderedItemsPrices);
        formData.append('ราคารวม', total);

        const scriptUrl = 'https://script.google.com/macros/s/AKfycbx5SFNIfZraVXxVaVRuDdKaKUy0dfA39nbku7kGEIc57Db4uPEGA1u7aoc99Lt9EKzZ/exec'; // Your Google Apps Script Web App URL

        try {
            const response = await fetch(scriptUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Use 'no-cors' for Google Apps Script Web App
            });

            // Note: With 'no-cors', you won't be able to read the response from the script.
            // The success is assumed if no network error occurs.
            alert('บันทึกข้อมูลการสั่งซื้อเรียบร้อยแล้ว!');
            orderForm.reset(); // Clear form
            customerOrder = []; // Clear order
            renderOrderSummary(); // Update UI
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
        }
    });

    // Initial render
    renderMenuItems();
    renderOrderSummary();
});