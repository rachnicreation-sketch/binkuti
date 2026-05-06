// Global BINKUTI JS - Version 2.1 (General Fashion with Side Drawer)

let cart = JSON.parse(localStorage.getItem('binkuti_cart')) || [];

const PRODUCTS_DB = [
    { id: 1, name: "Robe de Gala 'Éclat'", price: 125000, cat: "Femme", type: "Robe", fabric: "Satin", sizes: ["S", "M", "L", "XL"], desc: "Une robe somptueuse en satin de soie, conçue pour les soirées les plus prestigieuses. Sa coupe sirène souligne parfaitement la silhouette.", imgs: ["assets/images/women_dress.png", "assets/images/product-1-alt.jpg"] },
    { id: 2, name: "Blazer Slim Fit", price: 85000, cat: "Homme", type: "Veste", fabric: "Luxe", sizes: ["48", "50", "52", "54"], desc: "Blazer cintré de haute qualité, idéal pour un look business élégant ou une sortie décontractée chic.", imgs: ["assets/images/product-2.jpg", "assets/images/product-2-alt.jpg"] },
    { id: 3, name: "Ensemble Satin Rose", price: 65000, cat: "Femme", type: "Ensemble", fabric: "Satin", sizes: ["S", "M", "L"], desc: "Ensemble deux pièces en satin fluide. Confortable et ultra-tendance pour la saison estivale.", imgs: ["assets/images/product-3.jpg", "assets/images/product-3-alt.jpg"] },
    { id: 4, name: "Costume de Soirée Luxe", price: 180000, cat: "Homme", type: "Costume", fabric: "Luxe", sizes: ["48", "50", "52", "54", "56"], desc: "Le summum de l'élégance masculine. Costume trois pièces réalisé dans une laine vierge d'exception.", imgs: ["assets/images/product-4.jpg", "assets/images/product-4-alt.jpg"] },
    { id: 5, name: "Robe d'Été Fleurie", price: 45000, cat: "Femme", type: "Robe", fabric: "Lin", sizes: ["XS", "S", "M", "L"], desc: "Robe légère en lin avec motifs floraux délicats. Parfaite pour vos journées ensoleillées.", imgs: ["assets/images/product-5.jpg"] },
    { id: 6, name: "Sac à Main Signature", price: 55000, cat: "Accessoires", type: "Sac", fabric: "Cuir", sizes: ["Unique"], desc: "Sac à main en cuir grainé avec finitions dorées. Un accessoire indispensable pour parfaire votre tenue.", imgs: ["assets/images/product-6.jpg"] },
    { id: 7, name: "Veste en Jean Stylée", price: 35000, cat: "Femme", type: "Veste", fabric: "Coton", sizes: ["S", "M", "L"], desc: "Veste en jean classique avec une touche moderne.", imgs: ["assets/images/product-7.jpg"] },
    { id: 8, name: "Chemise Casual Lin", price: 28000, cat: "Homme", type: "Chemise", fabric: "Lin", sizes: ["M", "L", "XL"], desc: "Chemise en lin respirante pour un style décontracté.", imgs: ["assets/images/product-8.jpg"] },
    { id: 9, name: "Robe Cocktail Noire", price: 95000, cat: "Femme", type: "Robe", fabric: "Satin", sizes: ["S", "M", "L"], desc: "Petite robe noire indispensable pour toutes les occasions.", imgs: ["assets/images/product-9.jpg"] },
    { id: 10, name: "Costume Business Gris", price: 150000, cat: "Homme", type: "Costume", fabric: "Luxe", sizes: ["48", "50", "52"], desc: "Costume professionnel à la coupe impeccable.", imgs: ["assets/images/product-10.jpg"] }
];

document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    injectCartDrawer();
    updateCartUI();
    startFlashSaleTimer();
    
    // Set up search listeners after injection
    setTimeout(() => {
        document.querySelectorAll('.search-bar input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = input.value.trim();
                    if (query) window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
                }
            });
        });
        
        document.querySelectorAll('.cart-icon').forEach(icon => {
            icon.onclick = (e) => { e.preventDefault(); toggleCartDrawer(true); };
        });
    }, 100);

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .category-card').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // Handle user icon click to open login modal
    document.querySelectorAll('.fa-user').forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.onclick = (e) => {
            e.preventDefault();
            const user = localStorage.getItem('binkuti_user');
            if (user) {
                window.location.href = 'profile.html';
            } else {
                toggleAuthModal(true);
            }
        };
    });

    injectAuthModal();
    
    // Newsletter popup delay
    if (!localStorage.getItem('binkuti_newsletter_closed')) {
        setTimeout(() => injectNewsletterPopup(), 5000);
    }
});

function injectNewsletterPopup() {
    if (document.getElementById('newsletter-modal')) return;

    const popupHTML = `
        <div class="modal-overlay active" id="newsletter-modal">
            <div class="modal-content" style="max-width: 600px; padding: 0; overflow: hidden; display: flex;">
                <div style="flex: 1; background: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600') center/cover; min-height: 400px; display: none; display: md-block;">
                </div>
                <div style="flex: 1.2; padding: 3rem; display: flex; flex-direction: column; justify-content: center; position: relative;">
                    <i class="fa-solid fa-xmark modal-close" onclick="closeNewsletter()"></i>
                    <h2 style="font-size: 2rem; margin-bottom: 1rem;">-15% sur votre première commande</h2>
                    <p style="opacity: 0.7; margin-bottom: 2rem;">Inscrivez-vous à notre newsletter et recevez les dernières tendances BINKUTI.</p>
                    <form onsubmit="event.preventDefault(); closeNewsletter(); showNotification('Merci pour votre inscription !');">
                        <div class="form-group">
                            <input type="email" placeholder="votre@email.com" required style="width: 100%; padding: 1rem; border: 1px solid #ddd; margin-bottom: 1rem;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">S'abonner maintenant</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function closeNewsletter() {
    document.getElementById('newsletter-modal').classList.remove('active');
    localStorage.setItem('binkuti_newsletter_closed', 'true');
}

function injectAuthModal() {
    if (document.getElementById('auth-modal')) return;

    const modalHTML = `
        <div class="modal-overlay" id="auth-modal">
            <div class="modal-content" style="max-width: 400px;">
                <i class="fa-solid fa-xmark modal-close" onclick="toggleAuthModal(false)"></i>
                <div class="auth-tabs">
                    <div class="auth-tab active" id="tab-login" onclick="switchAuthTab('login')">CONNEXION</div>
                    <div class="auth-tab" id="tab-signup" onclick="switchAuthTab('signup')">CRÉER UN COMPTE</div>
                </div>
                
                <form id="auth-form-login">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="login-email" placeholder="votre@email.com" required>
                    </div>
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" id="login-pass" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Se connecter</button>
                </form>

                <form id="auth-form-signup" style="display:none;">
                    <div class="form-group">
                        <label>Nom complet</label>
                        <input type="text" id="signup-name" placeholder="Jean Dupont" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="signup-email" placeholder="votre@email.com" required>
                    </div>
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" id="signup-pass" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Créer un compte</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add listeners
    document.getElementById('auth-form-login').onsubmit = (e) => {
        e.preventDefault();
        const user = { name: "Utilisateur", email: document.getElementById('login-email').value };
        localStorage.setItem('binkuti_user', JSON.stringify(user));
        alert("Connexion réussie !");
        window.location.reload();
    };

    document.getElementById('auth-form-signup').onsubmit = (e) => {
        e.preventDefault();
        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        localStorage.setItem('binkuti_user', JSON.stringify({name: name, email: email}));
        showNotification('Compte créé avec succès !');
        toggleAuthModal(false);
        setTimeout(() => window.location.href = 'profile.html', 1000);
    };
}

// Wishlist Logic
let wishlist = JSON.parse(localStorage.getItem('binkuti_wishlist')) || [];

function toggleWishlist(productId, btn) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        btn.style.color = '#111';
        showNotification('Retiré de la liste d\'envies');
    } else {
        wishlist.push(productId);
        btn.style.color = '#ff4d4d';
        showNotification('Ajouté à la liste d\'envies');
    }
    localStorage.setItem('binkuti_wishlist', JSON.stringify(wishlist));
}

function toggleAuthModal(open) {
    const modal = document.getElementById('auth-modal');
    if (open) modal.classList.add('active');
    else modal.classList.remove('active');
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('auth-form-login');
    const signupForm = document.getElementById('auth-form-signup');
    const loginTab = document.getElementById('tab-login');
    const signupTab = document.getElementById('tab-signup');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
}

function injectCartDrawer() {
    if (document.getElementById('cart-drawer')) return;

    const drawerHTML = `
        <div class="drawer-overlay" id="drawer-overlay" onclick="toggleCartDrawer(false)"></div>
        <div class="cart-drawer" id="cart-drawer">
            <div class="cart-drawer-header">
                <h3>VOTRE PANIER</h3>
                <i class="fa-solid fa-xmark" onclick="toggleCartDrawer(false)" style="cursor:pointer; font-size: 1.5rem;"></i>
            </div>
            <div class="cart-drawer-items" id="drawer-items-list">
                <!-- Items here -->
            </div>
            <div class="cart-drawer-footer">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 1rem;">
                    <span>TOTAL</span>
                    <span id="drawer-total">0 FCFA</span>
                </div>
                <a href="cart.html" class="btn" style="width: 100%; background: #eee; color: #111; margin-bottom: 0.5rem; text-align: center; display: block;">Voir le panier</a>
                <a href="checkout.html" class="btn btn-primary" style="width: 100%; text-align: center; display: block;">Paiement</a>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
}

function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (open) {
        renderDrawerItems();
        drawer.classList.add('active');
        overlay.classList.add('active');
    } else {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function renderDrawerItems() {
    const list = document.getElementById('drawer-items-list');
    const totalEl = document.getElementById('drawer-total');
    
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; margin-top: 2rem; opacity: 0.5;">Votre panier est vide.</p>';
        totalEl.innerText = '0 FCFA';
        return;
    }

    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="drawer-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="drawer-item-info">
                    <div style="font-weight: 600; font-size: 0.9rem;">${item.name}</div>
                    <div style="font-size: 0.8rem; opacity: 0.7;">Qte: ${item.qty}</div>
                    <div style="color: var(--primary); font-weight: 700; margin-top: 0.3rem;">${(item.price * item.qty).toLocaleString()} FCFA</div>
                </div>
                <i class="fa-solid fa-trash-can" onclick="removeItemFromDrawer(${index})" style="cursor:pointer; opacity: 0.3; font-size: 0.8rem;"></i>
            </div>
        `;
    }).join('');
    totalEl.innerText = total.toLocaleString() + ' FCFA';
}

function addToCart(productId, name, price, img) {
    const item = {
        id: productId,
        name: name || "Produit BINKUTI",
        price: price || 0,
        img: img || "",
        qty: 1
    };

    const existing = cart.find(i => i.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(item);
    }

    localStorage.setItem('binkuti_cart', JSON.stringify(cart));
    updateCartUI();
    toggleCartDrawer(true); // Automatically open drawer
}

function removeItemFromDrawer(index) {
    cart.splice(index, 1);
    localStorage.setItem('binkuti_cart', JSON.stringify(cart));
    updateCartUI();
    renderDrawerItems();
    if (typeof renderCart === 'function') renderCart(); // Update main cart page if open
}

function generateProductHTML(p) {
    const priceFormatted = p.price.toLocaleString();
    const oldPriceFormatted = (p.price * 1.2).toLocaleString();
    return `
        <div class="product-card" id="product-${p.id}">
            <div class="product-img">
                ${p.price > 100000 ? '<div class="product-badge">Premium</div>' : ''}
                <div class="wishlist-btn" onclick="toggleWishlist(${p.id}, this)"><i class="fa-regular fa-heart"></i></div>
                <a href="product.html?id=${p.id}"><img src="${p.imgs[0]}" id="img-${p.id}" alt="${p.name}"></a>
                <div class="product-arrows">
                    <button class="arrow-btn" onclick="changeImage(${p.id}, -1, ${JSON.stringify(p.imgs).replace(/"/g, '&quot;')})">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button class="arrow-btn" onclick="changeImage(${p.id}, 1, ${JSON.stringify(p.imgs).replace(/"/g, '&quot;')})">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-ratings">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <div class="product-cat">${p.cat}</div>
                <a href="product.html?id=${p.id}" style="text-decoration:none; color:inherit;"><h3 class="product-name">${p.name}</h3></a>
                <div class="product-price">${priceFormatted} FCFA <span style="font-size: 0.8rem; text-decoration: line-through; color: #999; margin-left: 0.5rem;">${oldPriceFormatted} FCFA</span></div>
                <button onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.imgs[0]}')" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Ajouter au panier</button>
            </div>
        </div>
    `;
}

function updateCartUI() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(count => {
        const totalQty = cart.reduce((acc, curr) => acc + curr.qty, 0);
        count.innerText = totalQty;
        count.style.display = totalQty > 0 ? 'flex' : 'none';
    });
}

// Product Slideshow Logic
let productImgsState = {};

function changeImage(productId, direction, images) {
    if (!productImgsState[productId]) productImgsState[productId] = 0;
    
    productImgsState[productId] += direction;
    
    if (productImgsState[productId] >= images.length) productImgsState[productId] = 0;
    if (productImgsState[productId] < 0) productImgsState[productId] = images.length - 1;
    
    const imgEl = document.getElementById(`img-${productId}`);
    if (imgEl) {
        imgEl.style.opacity = 0;
        setTimeout(() => {
            imgEl.src = images[productImgsState[productId]];
            imgEl.style.opacity = 1;
        }, 200);
    }
}

function startFlashSaleTimer() {
    const timerEl = document.getElementById('flash-timer');
    if (!timerEl) return;

    let time = 3600 * 3 + 15 * 60 + 20;

    setInterval(() => {
        time--;
        const hours = Math.floor(time / 3600);
        const mins = Math.floor((time % 3600) / 60);
        const secs = time % 60;
        timerEl.innerText = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

function injectHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;
    header.innerHTML = `
        <div style="background: var(--secondary); color: white; text-align: center; padding: 0.5rem; font-size: 0.8rem; letter-spacing: 1px; font-weight: 600;">
            LIVRAISON GRATUITE DÈS 50.000 FCFA | -15% SUR VOTRE PREMIÈRE COMMANDE CODE: <strong>BINKUTI15</strong>
        </div>
        <nav class="nav-container">
            <a href="index.html" class="logo">BIN<span>KUTI</span></a>
            <ul class="nav-links">
                <li class="has-dropdown">
                    <a href="shop.html?cat=femme">Femme <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem;"></i></a>
                    <div class="mega-menu">
                        <div>
                            <h5>Prêt-à-porter</h5>
                            <ul>
                                <li><a href="robes.html">Robes</a></li>
                                <li><a href="tops.html">Tops & Chemisiers</a></li>
                                <li><a href="pantalons.html">Pantalons</a></li>
                                <li><a href="jupes.html">Jupes</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5>Occasions</h5>
                            <ul>
                                <li><a href="robes.html">Soirées & Gala</a></li>
                                <li><a href="robes.html">Mariages</a></li>
                                <li><a href="shop.html">Bureau</a></li>
                                <li><a href="shop.html">Casual</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5>Accessoires</h5>
                            <ul>
                                <li><a href="accessoires.html">Sacs</a></li>
                                <li><a href="accessoires.html">Bijoux</a></li>
                                <li><a href="accessoires.html">Chaussures</a></li>
                            </ul>
                        </div>
                        <div>
                            <img src="assets/images/women_dress.png" style="width: 100%; border-radius: 4px;">
                        </div>
                    </div>
                </li>
                <li class="has-dropdown">
                    <a href="shop.html?cat=homme">Homme <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem;"></i></a>
                    <div class="mega-menu">
                        <div>
                            <h5>Collection</h5>
                            <ul>
                                <li><a href="costumes.html">Costumes</a></li>
                                <li><a href="chemises.html">Chemises</a></li>
                                <li><a href="jeans.html">Pantalons & Jeans</a></li>
                            </ul>
                        </div>
                        <div>
                            <img src="assets/images/product-4.jpg" style="width: 100%; border-radius: 4px;">
                        </div>
                    </div>
                </li>
                <li><a href="shop.html?cat=enfant">Enfant</a></li>
                <li><a href="custom.html">Sur Mesure</a></li>
            </ul>

            <div class="nav-actions" style="flex: 1; justify-content: flex-end; gap: 2rem;">
                <div class="search-bar" style="position: relative; width: 100%; max-width: 300px;">
                    <input type="text" placeholder="Rechercher..." style="width: 100%; padding: 0.6rem 1rem; border: 1px solid #eee; border-radius: 4px; background: #f5f5f5; font-size: 0.85rem;">
                </div>
                <div style="display: flex; gap: 1.2rem; align-items: center;">
                    <a href="${localStorage.getItem('binkuti_user') ? 'profile.html' : '#'}" onclick="${localStorage.getItem('binkuti_user') ? '' : 'toggleAuthModal(true); return false;'}" style="color: inherit; text-decoration: none;">
                        <i class="fa-regular fa-user" style="cursor:pointer;"></i>
                    </a>
                    <div class="cart-icon" style="cursor:pointer;">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <span class="cart-count">0</span>
                    </div>
                </div>
            </div>
        </nav>
    `;
}

function injectFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    footer.innerHTML = `
        <div class="footer-grid">
            <div class="footer-col">
                <a href="index.html" class="logo" style="color: white; margin-bottom: 1.5rem; display: block;">BIN<span>KUTI</span></a>
                <p>L'excellence de la mode et du sur-mesure. Des créations uniques pour des moments d'exception.</p>
                <div class="social-links" style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <a href="#"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#"><i class="fa-brands fa-facebook"></i></a>
                    <a href="#"><i class="fa-brands fa-pinterest"></i></a>
                </div>
            </div>
            <div class="footer-col">
                <h4>Boutique</h4>
                <ul class="footer-links">
                    <li><a href="shop.html?cat=femme">Femme</a></li>
                    <li><a href="shop.html?cat=homme">Homme</a></li>
                    <li><a href="shop.html?cat=enfant">Enfant</a></li>
                    <li><a href="custom.html">Sur Mesure</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Service Client</h4>
                <ul class="footer-links">
                    <li><a href="#">Livraison & Retours</a></li>
                    <li><a href="#">Guide des tailles</a></li>
                    <li><a href="#">Contactez-nous</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Newsletter</h4>
                <p style="margin-bottom: 1rem;">Inscrivez-vous pour nos actualités exclusives.</p>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="email" placeholder="Email" style="padding: 0.8rem; border: none; border-radius: 2px; width: 100%; background: rgba(255,255,255,0.1); color: #fff;">
                    <button class="btn btn-primary" style="padding: 0.8rem 1.5rem; border-radius: 2px;">OK</button>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div>&copy; 2026 BINKUTI Fashion House. Tous droits réservés.</div>
            <div>Développé par <a href="https://www.rxservices-cg.com" target="_blank" class="rx-link">RX services</a></div>
        </div>
    `;
}

function showNotification(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; background: #000; color: #fff;
        padding: 1rem 2rem; border-radius: 4px; z-index: 9999; animation: slideIn 0.3s ease;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function removeItemFromDrawer(index) {
    cart.splice(index, 1);
    localStorage.setItem('binkuti_cart', JSON.stringify(cart));
    updateCartUI();
    renderDrawerItems();
}
