/**
 * Flight Tickets Booking System
 * Handles ticket display, search, and news functionality
 */

// Global variables
let grid = null;
let allTickets = [];
let searchButton = null;
let menuToggle = null;
let navLinks = null;
let navItems = [];

/**
 * DOM Elements
 */
const DOM = {
    get grid() { return document.getElementById('grid'); },
    get searchButton() { return document.getElementById('rus'); },
    get menuToggle() { return document.getElementById('menuToggle'); },
    get navLinks() { return document.querySelector('.nav-links'); },
    get navItems() { return document.querySelectorAll('.navbar'); }
};

/**
 * Initialize the application
 */
function initializeApp() {
    // Initialize DOM elements
    grid = DOM.grid;
    searchButton = DOM.searchButton;
    menuToggle = DOM.menuToggle;
    navLinks = DOM.navLinks;
    navItems = Array.from(DOM.navItems);

    // Initialize features based on current page
    if (document.querySelector('.news-list')) {
        loadNews().catch(console.error);
    }
    
    if (grid) {
        loadTickets().catch(console.error);
    }

    if (menuToggle && navLinks) {
        setupMobileMenu();
    }
}

/**
 * Display tickets in the grid
 * @param {Array} tickets - Array of ticket objects to display
 */
function displayTickets(tickets = []) {
    if (!grid) return;

    // Clear the grid
    grid.innerHTML = '';

    if (!tickets.length) {
        grid.innerHTML = '<p class="no-results">لا توجد نتائج مطابقة للبحث</p>';
        return;
    }

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();

    tickets.forEach(ticket => {
        const ticketElement = createTicketElement(ticket);
        fragment.appendChild(ticketElement);
    });

    grid.appendChild(fragment);
}

/**
 * Create a ticket element
 * @param {Object} ticket - Ticket data
 * @returns {HTMLElement} - Created ticket element
 */
function createTicketElement(ticket) {
    const ticketElement = document.createElement('div');
    ticketElement.className = 'ticket';
    ticketElement.innerHTML = `
        <div class="ticket-header">
            <img src="/img/${ticket.img}" alt="صورة الرحلة" class="ticket-image" loading="lazy">
        </div>
        <div class="airline-info">
            <img src="/logo/${ticket.logo}" alt="شعار الطيران" class="airline-logo" loading="lazy">
            <h3 class="airline-name">${escapeHtml(ticket.arlinename || 'شركة الطيران')}</h3>
        </div>
        <div class="ticket-details">
            <div class="route">
                <div class="city from">
                    <span class="city-name">${escapeHtml(ticket.namecity || 'المدينة')}</span>
                    <span class="city-code">${escapeHtml(ticket.citycodename || '---')}</span>
                </div>
                <div class="flight-direction">
                    <span class="to-text">إلى</span>
                    <div class="flight-icon">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                </div>
                <div class="city to">
                    <span class="city-name">${escapeHtml(ticket.direction || 'الوجهة')}</span>
                    <span class="city-code">${escapeHtml(ticket.directioncode || '---')}</span>
                </div>
            </div>
            <div class="flight-details">
                <div class="detail">
                    <span class="label">الدرجة:</span>
                    <span class="value business">${escapeHtml(ticket.daraga || 'اقتصادية')}</span>
                </div>
                <div class="detail">
                    <span class="label">أيام الرحلات:</span>
                    <span class="value">${escapeHtml(ticket.daysfly || 'يوميًا')}</span>
                </div>
            </div>
            <div class="prices">
                <div class="price-option">
                    <span class="price">${escapeHtml(ticket.pricego || '---')}$</span>
                    <span class="type">ذهاب فقط</span>
                    <button class="book-btn">احجز الآن</button>
                </div>
                <div class="price-option highlight">
                    <span class="price">${escapeHtml(ticket.priceback || '---')}$</span>
                    <span class="type">ذهاب وعودة</span>
                    <button class="book-btn primary">احجز الآن</button>
                </div>
            </div>
        </div>`;
    
    return ticketElement;
}

/**
 * Set destination input value
 * @param {string} value - Value to set
 */
function setDestination(value) {
    const destinationInput = document.getElementById('destinationInput');
    if (destinationInput) {
        destinationInput.value = value;
    }
}

/**
 * Filter tickets based on search criteria
 */
function filterTickets() {
    if (!grid) return;

    const departure = (document.getElementById('locationInputnow')?.value || '').toLowerCase().trim();
    const destination = (document.getElementById('destinationInput')?.value || '').toLowerCase().trim();
    const airline = (document.getElementById('airlineInput')?.value || '').toLowerCase().trim();

    const filteredTickets = allTickets.filter(ticket => {
        const matchesDeparture = !departure || 
            (ticket.namecity?.toLowerCase().includes(departure) || 
             ticket.citycodename?.toLowerCase().includes(departure));
        
        const matchesDestination = !destination || 
            (ticket.direction?.toLowerCase().includes(destination) ||
             ticket.directioncode?.toLowerCase().includes(destination));
        
        const matchesAirline = !airline || 
            ticket.arlinename?.toLowerCase().includes(airline);
        
        return matchesDeparture && matchesDestination && matchesAirline;
    });

    displayTickets(filteredTickets);
}

/**
 * Load tickets from the server
 */
async function loadTickets() {
    if (!grid) return;

    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allTickets = Array.isArray(data.data) ? data.data : [];
        
        if (searchButton) {
            searchButton.addEventListener('click', filterTickets);
        }
        
        displayTickets(allTickets);
    } catch (error) {
        console.error('Error loading tickets:', error);
        if (grid) {
            grid.innerHTML = '<p class="error">حدث خطأ في تحميل بيانات التذاكر. يرجى المحاولة مرة أخرى لاحقًا.</p>';
        }
    }
}

/**
 * Set up mobile menu functionality
 */
function setupMobileMenu() {
    if (!menuToggle || !navLinks) return;

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        navLinks.style.display = 'none';
    };

    // Toggle menu on button click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        navLinks.style.display = isOpen ? 'flex' : 'none';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !menuToggle.contains(e.target) && 
            !navLinks.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu when clicking on a nav item
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
            setActiveNav(item);
        });
    });

    // Handle window resize
    const handleResize = () => {
        if (window.innerWidth > 768) {
            // Desktop view
            closeMenu();
            navLinks.style.display = 'flex';
        } else {
            // Mobile view
            menuToggle.style.display = 'flex';
            if (!navLinks.classList.contains('active')) {
                navLinks.style.display = 'none';
            }
        }
    };

    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);
}

/**
 * Set active navigation item
 * @param {HTMLElement} activeItem - The active navigation item
 */
function setActiveNav(activeItem = null) {
    if (!navItems.length) return;

    navItems.forEach(item => {
        item.classList.remove('active-nav');
    });

    if (activeItem) {
        activeItem.classList.add('active-nav');
        return;
    }

    // Auto-detect active nav based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        if (currentPage === itemHref || 
            (currentPage === '' && itemHref === 'index.html') ||
            (currentPage.includes(itemHref) && itemHref !== 'index.html')) {
            item.classList.add('active-nav');
        }
    });
}

/**
 * Initialize read more functionality for news items
 */

function initReadMore() {
    const newsTexts = document.querySelectorAll('.news-text p');
    
    newsTexts.forEach(p => {
        // Save the full text
        const fullText = p.textContent.trim();
        p.setAttribute('data-fulltext', fullText);
        
        // Check if text is likely to be more than 2 lines
        const textLength = fullText.length;
        const lineLength = 60; // Approximate characters per line
        const estimatedLines = Math.ceil(textLength / lineLength);
        
        if (estimatedLines > 2) {
            // Create the read more button
            const readMoreBtn = document.createElement('button');
            readMoreBtn.textContent = 'المزيد';
            readMoreBtn.style.cssText = `
                margin-right: 5px;
                cursor: pointer;
                color: #1a73e8;
                font-weight: 600;
                background: none;
                border: none;
                padding: 0 4px;
                text-decoration: underline;
                font-family: inherit;
                font-size: inherit;
                display: block;
                margin-top: 5px;
            `;
            
            // Set initial state (collapsed)
            p.style.overflow = 'hidden';
            p.style.display = '-webkit-box';
            p.style.webkitLineClamp = '2';
            p.style.webkitBoxOrient = 'vertical';
            p.style.textOverflow = 'ellipsis';
            p.style.margin = '0';
            p.style.padding = '0';
            
            // Toggle function
            const toggleText = (isExpanded) => {
                if (isExpanded) {
                    p.style.webkitLineClamp = 'unset';
                    readMoreBtn.textContent = 'رجوع';
                } else {
                    p.style.webkitLineClamp = '2';
                    readMoreBtn.textContent = 'المزيد';
                }
            };
            // Click handler
            readMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = p.style.webkitLineClamp === 'unset';
                toggleText(!isExpanded);
            });
            // Add button after the paragraph
            p.parentNode.appendChild(readMoreBtn);
        }
    });
}

/**
 * Load news from the server
 */
async function loadNews() {
    const newsList = document.querySelector('.news-list');
    if (!newsList) return;

    try {
        const response = await fetch('news.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data.news)) {
            throw new Error('Invalid news data format');
        }

        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();

        data.news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <div class="news-header">
                    <img src="almithaq-logo-removebg-preview.webp" alt="Almithaq" class="news-avatar" loading="lazy">
                    <span class="news-company">Almithaq Travel
                        <p>الأخبار الرسمية</p>
                    </span>
                </div>
                <div class="news-content">
                    <img src="imgnews/${escapeHtml(item.img)}" alt="News Image" class="news-image" loading="lazy">
                    <h1>${escapeHtml(item.h1)}</h1>
                    <div class="news-text">
                        <p>${escapeHtml(item.p)}</p>
                    </div>
                </div>
            `;
            fragment.appendChild(newsItem);
        });

        newsList.innerHTML = '';
        newsList.appendChild(fragment);
        initReadMore();
    } catch (error) {
        console.error('Error loading news:', error);
        newsList.innerHTML = '<p class="error">حدث خطأ في تحميل الأخبار. يرجى المحاولة مرة أخرى لاحقاً.</p>';
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Initialize the application when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOMContentLoaded has already fired
    setTimeout(initializeApp, 0);
}

function sug(i){
document.getElementById('destinationInput').value = i;

    console.log(i)
}
/**
 * Set up mobile menu functionality
 */
function setupMobileMenu() {
    if (!menuToggle || !navLinks) return;

    // Toggle menu on button click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Toggle display property
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
        } else {
            navLinks.style.display = 'none';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            navLinks.style.display = 'none';
        }
    });
    
    // Close menu when clicking on a nav item
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                navLinks.style.display = 'none';
            }
            // Update active state
            document.querySelectorAll('.navbar').forEach(navItem => {
                navItem.classList.remove('active-nav');
            });
            this.classList.add('active-nav');
        });
    });
    
    // Set active nav on page load
    setActiveNav();
    
    // Handle window resize
    const handleResize = () => {
        if (window.innerWidth > 768) {
            // Desktop view
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            navLinks.style.display = 'flex';
        } else {
            // Mobile view
            menuToggle.style.display = 'flex';
            if (!navLinks.classList.contains('active')) {
                navLinks.style.display = 'none';
            }
        }
    };
    
    // Initial check
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
}