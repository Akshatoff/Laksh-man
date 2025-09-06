class ProductLoader {
    constructor() {
        this.products = [];
        this.categories = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const response = await fetch('https://api.jsonbin.io/v3/b/68a9b08143b1c97be9266c0d/latest');
            const data = await response.json();
            this.products = data.record.products.all;
            this.categories = data.record.categories;

            this.renderCategories();
            this.renderProducts();
            this.initTabNavigation();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderCategories() {
        const categoryContainer = document.querySelector('.category-carousel .swiper-wrapper');
        if (!categoryContainer) return;

        categoryContainer.innerHTML = '';

        this.categories.forEach(category => {
            const categoryHTML = `
                <a href="${category.link}" class="nav-link category-item swiper-slide">
                    <img src="${category.image}" alt="Category Thumbnail">
                    <h3 class="category-title">${category.name}</h3>
                </a>
            `;
            categoryContainer.insertAdjacentHTML('beforeend', categoryHTML);
        });
    }

    renderProducts(filter = 'all') {
        // filter logic unchanged
        this.renderProductsInTab('nav-all', this.products);
        this.renderProductsInTab('nav-fruits', this.products.filter(p => p.isNew));
        this.renderProductsInTab('nav-juices', this.products.filter(p => p.isBestseller));
    }

    renderProductsInTab(tabId, products) {
        const container = document.querySelector(`#${tabId} .product-grid`);
        if (!container) return;

        container.innerHTML = '';

        products.forEach(product => {
            const productHTML = this.generateProductHTML(product);
            container.insertAdjacentHTML('beforeend', productHTML);
        });

        this.addProductEventListeners(container);
    }

    generateProductHTML(product) {
        const discountBadge = product.discount
            ? `<span class="badge bg-success position-absolute m-3">-${product.discount}%</span>`
            : '';

        return `
        <div class="col">
          <div class="product-item"
               data-product-id="${product.id}"
               data-name="${product.name}"
               data-price="${product.price}"
               data-desc="${product.quantity}">
            ${discountBadge}
            <a href="#" class="btn-wishlist">
              <svg width="24" height="24"><use xlink:href="#heart"></use></svg>
            </a>
            <figure>
              <a href="index.html" title="${product.name}">
                <img src="${product.image}" class="tab-image" alt="${product.name}">
              </a>
            </figure>
            <h3>${product.name}</h3>
            <span class="qty">${product.quantity}</span>
            <span class="rating">
              <svg width="24" height="24" class="text-primary"><use xlink:href="#star-solid"></use></svg> ${product.rating}
            </span>
            <span class="price">₹${product.price.toLocaleString()}</span>
            <div class="d-flex align-items-center justify-content-between">
              <div class="input-group product-qty">
                <span class="input-group-btn">
                  <button type="button" class="quantity-left-minus btn btn-danger btn-number" data-type="minus">
                    <svg width="16" height="16"><use xlink:href="#minus"></use></svg>
                  </button>
                </span>
                <input type="text" class="form-control input-number quantity" value="1" min="1">
                <span class="input-group-btn">
                  <button type="button" class="quantity-right-plus btn btn-success btn-number" data-type="plus">
                    <svg width="16" height="16"><use xlink:href="#plus"></use></svg>
                  </button>
                </span>
              </div>
              <a href="#" class="nav-link add-to-cart">
                Add to Cart <iconify-icon icon="uil:shopping-cart"></iconify-icon>
              </a>
            </div>
          </div>
        </div>
        `;
    }

    addProductEventListeners(container) {
        const minusButtons = container.querySelectorAll('.quantity-left-minus');
        const plusButtons = container.querySelectorAll('.quantity-right-plus');
        const addToCartButtons = container.querySelectorAll('.add-to-cart');

        minusButtons.forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const input = button.closest('.product-qty').querySelector('.quantity');
                let value = parseInt(input.value);
                if (value > 1) input.value = value - 1;
            });
        });

        plusButtons.forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const input = button.closest('.product-qty').querySelector('.quantity');
                let value = parseInt(input.value);
                input.value = value + 1;
            });
        });

        addToCartButtons.forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const productItem = button.closest('.product-item');
                const productId = productItem.dataset.productId;
                const quantity = parseInt(productItem.querySelector('.quantity').value);
                this.addToCart(productId, quantity);
            });
        });
    }

    addToCart(productId, quantity) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${product.name} added to cart!`);
        }
    }

    initTabNavigation() {
        const tabButtons = document.querySelectorAll('.nav-tabs .nav-link');
        tabButtons.forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const tabPanes = document.querySelectorAll('.tab-pane');
                tabPanes.forEach(pane => pane.classList.remove('show', 'active'));

                const targetPane = document.querySelector(button.dataset.bsTarget);
                if (targetPane) targetPane.classList.add('show', 'active');
            });
        });
    }

    addProduct(productData) {
        this.products.push(productData);
        this.renderProducts();
    }

    updateProduct(productId, updatedData) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedData };
            this.renderProducts();
        }
    }

    deleteProduct(productId) {
        this.products = this.products.filter(p => p.id !== productId);
        this.renderProducts();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.productLoader = new ProductLoader();
});
