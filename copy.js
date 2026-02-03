// Toggle mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.navbar');
    
    // Initialize menu toggle if it exists
    if (menuToggle && navLinks) {
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
        function setActiveNav() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            navItems.forEach(item => {
                item.classList.remove('active-nav');
                const itemHref = item.getAttribute('href');
                
                // Check if this is the current page
                if (currentPage === itemHref || 
                    (currentPage === '' && itemHref === 'index.html') ||
                    (currentPage.includes(itemHref) && itemHref !== 'index.html')) {
                    item.classList.add('active-nav');
                }
            });
        }
        
        // Initial setup
        setActiveNav();
        
        // Handle window resize
        function handleResize() {
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
        }
        
        // Initial check
        handleResize();
        
        // Add resize listener
        window.addEventListener('resize', handleResize);
    }
});

//نهاية التنقل في الهيدر


//للتذاكر البحث والتصفية























document.addEventListener('DOMContentLoaded', function() {
    // إنشاء حقول البحث مع تحسينات واجهة المستخدم
    function createSearchInputs() {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer) return;
        
        searchContainer.innerHTML = `
            <div class="search-row">
                <!-- الموقع الحالي -->
                <div class="search-group current-location">
                    <label>الموقع الحالي</label>
                    <div class="search-input-container">
                        <i class="fas fa-map-marker-alt search-icon"></i>
                        <input type="text" id="current-location-input" class="search-input" placeholder="أدخل موقعك الحالي" value="" autocomplete="off">
                        <div class="suggestions suggestions-current"></div>
                    </div>
                </div>

                <!-- الوجهة -->
                <div class="search-group destination">
                    <label>إلى أين</label>
                    <div class="search-input-container">
                        <i class="fas fa-plane-arrival search-icon"></i>
                        <input type="text" id="destination-input" class="search-input destination" placeholder="ابحث عن وجهة...">
                        <div class="suggestions suggestions-destination"></div>
                    </div>
                </div>

                <!-- شركة الطيران -->
                <div class="search-group airline">
                    <label>شركة الطيران</label>
                    <div class="search-input-container">
                        <i class="fas fa-plane search-icon"></i>
                        <input type="text" id="airline-input" class="search-input airline" placeholder="ابحث عن شركة طيران...">
                        <div class="suggestions suggestions-airline"></div>
                    </div>
                </div>

                <!-- زر البحث -->
                <button class="search-button">
                    <i class="fas fa-search"></i>
                    بحث
                </button>
            </div>
            <div class="search-hints">
                <span>اقتراحات: </span>
                <span class="hint">دبي</span>
                <span class="hint">أبو ظبي</span>
                <span class="hint">جدة</span>
                <span class="hint">الدوحة</span>
            </div>
        `;
    }

    // تهيئة حقول البحث
    createSearchInputs();
    
    // كائن الاقتراحات
    const suggestions = {
        destination: [],
        departure: [],
        airline: []
    };

    // استخراج الاقتراحات من التذاكر
    function extractSuggestions() {
        const destinations = new Set();
        const departures = new Set();
        const airlines = new Set();
        
        document.querySelectorAll('.ticket').forEach(ticket => {
            const fromCity = ticket.querySelector('.city.from .city-name')?.textContent.trim();
            const toCity = ticket.querySelector('.city.to .city-name')?.textContent.trim();
            const airline = ticket.querySelector('.airline-name')?.textContent.trim();
            
            if (fromCity) departures.add(fromCity);
            if (toCity) destinations.add(toCity);
            if (airline) airlines.add(airline);
        });
        
        suggestions.destination = Array.from(destinations).filter(Boolean);
        suggestions.departure = Array.from(departures).filter(Boolean);
        suggestions.airline = Array.from(airlines).filter(Boolean);
        
        return suggestions;
    }
    // عرض اقتراحات البحث
    function showSuggestions(type, query = '') {
        let container;
        let inputField;
        
        // تحديد العناصر بناءً على النوع
        if (type === 'current-location' || type === 'location') {
            container = document.querySelector('.suggestions-current');
            inputField = document.getElementById('current-location-input');
        } else if (type === 'destination') {
            container = document.querySelector('.suggestions-destination');
            inputField = document.getElementById('destination-input');
        } else if (type === 'airline') {
            container = document.querySelector('.suggestions-airline');
            inputField = document.getElementById('airline-input');
        }
        
        if (!container || !inputField) return;
        
        const allSuggestions = extractSuggestions();
        const queryLower = (query || '').toLowerCase().trim();
        
        let filtered = [];
        
        // تحديد نوع الاقتراحات المطلوبة
        if (type === 'current-location' || type === 'location') {
            filtered = allSuggestions.departure.filter(item => 
                item && item.toLowerCase().includes(queryLower)
            );
        } else if (type === 'destination') {
            filtered = allSuggestions.destination.filter(item => 
                item && item.toLowerCase().includes(queryLower)
            );
        } else if (type === 'airline') {
            filtered = allSuggestions.airline.filter(item => 
                item && item.toLowerCase().includes(queryLower)
            );
        }

        // عرض الاقتراحات
        if (filtered.length > 0) {
            container.innerHTML = filtered.map(item => 
                `<div class="suggestion-item">${item}</div>`
            ).join('');
            // إظهار الاقتراحات بشكل صحيح
            container.style.display = 'block';
            container.style.opacity = '1';
            container.style.visibility = 'visible';
            container.style.transform = 'translateY(0)';
            container.classList.add('show');
        } else if (queryLower.length > 0) {
            container.innerHTML = '<div class="suggestion-item no-results">لا توجد نتائج</div>';
            container.style.display = 'block';
            container.style.opacity = '1';
            container.style.visibility = 'visible';
            container.style.transform = 'translateY(0)';
            container.classList.add('show');
        } else {
            container.innerHTML = '';
            container.style.display = 'none';
            container.style.opacity = '0';
            container.style.visibility = 'hidden';
            container.style.transform = 'translateY(10px)';
            container.classList.remove('show');
        }

        // إضافة مستمعات الأحداث للعناصر المقترحة
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                if (this.classList.contains('no-results')) return;
                
                inputField.value = this.textContent;
                container.innerHTML = '';
                container.style.display = 'none';
                container.style.opacity = '0';
                container.style.visibility = 'hidden';
                container.classList.remove('show');
                performSearch();
                inputField.blur();
            });
        });
    }

    // تنفيذ البحث
    function performSearch() {
        const currentLocationInput = document.getElementById('current-location-input');
        const destinationInput = document.getElementById('destination-input');
        const airlineInput = document.getElementById('airline-input');
        
        const currentLocation = currentLocationInput?.value.trim().toLowerCase() || '';
        const destinationQuery = destinationInput?.value.trim().toLowerCase() || '';
        const airlineQuery = airlineInput?.value.trim().toLowerCase() || '';
        
        // إذا كانت جميع الحقول فارغة، اعرض جميع التذاكر
        if (!currentLocation && !destinationQuery && !airlineQuery) {
            document.querySelectorAll('.ticket').forEach(ticket => {
                ticket.style.display = 'block';
            });
            return;
        }
        
        let hasMatchingTickets = false;
        
        document.querySelectorAll('.ticket').forEach(ticket => {
            const fromCity = ticket.querySelector('.city.from .city-name')?.textContent.trim().toLowerCase() || '';
            const destinationTo = ticket.querySelector('.city.to .city-name')?.textContent.trim().toLowerCase() || '';
            const airline = ticket.querySelector('.airline-name')?.textContent.trim().toLowerCase() || '';
            
            // تطابق الموقع الحالي مع مدينة المغادرة (مطابقة دقيقة أو جزئية)
            const currentLocationMatch = !currentLocation || 
                fromCity.includes(currentLocation) || 
                currentLocation.includes(fromCity) ||
                fromCity === currentLocation;
            
            // تطابق الوجهة (مطابقة دقيقة أو جزئية)
            const destinationMatch = !destinationQuery || 
                destinationTo.includes(destinationQuery) || 
                destinationQuery.includes(destinationTo) ||
                destinationTo === destinationQuery;
                
            // تطابق شركة الطيران (مطابقة دقيقة أو جزئية)
            const airlineMatch = !airlineQuery || 
                airline.includes(airlineQuery) || 
                airlineQuery.includes(airline) ||
                airline === airlineQuery;
            
            const shouldShow = currentLocationMatch && destinationMatch && airlineMatch;
            
            if (shouldShow) {
                hasMatchingTickets = true;
            }
            
            // إظهار/إخفاء التذكرة
            ticket.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // الحصول على الموقع الحالي
    function getCurrentLocation() {
        const locationInput = document.getElementById('current-location-input');
        const locationBtn = document.querySelector('.current-location-btn');
        
        if (!locationInput || !locationBtn) return;
        
        locationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                locationBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        // استخدام OpenStreetMap Nominatim للعكس الجغرافي
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`)
                            .then(response => response.json())
                            .then(data => {
                                const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state;
                                if (city) {
                                    locationInput.value = city;
                                    // تحديث البحث تلقائياً عند تحديد الموقع
                                    performSearch();
                                } else {
                                    locationInput.value = 'لم يتم التعرف على المدينة';
                                }
                            })
                            .catch(() => {
                                locationInput.value = 'حدث خطأ في جلب بيانات الموقع';
                            })
                            .finally(() => {
                                locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                                locationBtn.disabled = false;
                            });
                    },
                    (error) => {
                        console.error('خطأ في الحصول على الموقع:', error);
                        locationInput.value = 'تعذر الوصول إلى الموقع';
                        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                        locationBtn.disabled = false;
                    }
                );
            } else {
                locationInput.value = 'المتصفح لا يدعم خدمة تحديد الموقع';
            }
        });
    }

    // إضافة مستمعات الأحداث
    function setupEventListeners() {
        // تهيئة زر تحديد الموقع الحالي
        getCurrentLocation();
        
        // إضافة مستمعات لحقول البحث
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            const type = input.classList.contains('destination') ? 'destination' : 
                         input.classList.contains('airline') ? 'airline' : 'current-location';
            
            // عند الكتابة في حقل البحث
            input.addEventListener('input', function() {
                showSuggestions(type, this.value);
                performSearch();
            });
            
            // عند التركيز على حقل البحث
            input.addEventListener('focus', function() {
                const currentValue = this.value.trim();
                if (currentValue.length > 0) {
                    showSuggestions(type, currentValue);
                } else {
                    // إذا كان الحقل فارغًا، اعرض جميع الاقتراحات
                    const allSuggestions = extractSuggestions();
                    let suggestionsToShow = [];
                    if (type === 'current-location' || type === 'location') {
                        suggestionsToShow = allSuggestions.departure;
                    } else if (type === 'destination') {
                        suggestionsToShow = allSuggestions.destination;
                    } else if (type === 'airline') {
                        suggestionsToShow = allSuggestions.airline;
                    }
                    
                    if (suggestionsToShow.length > 0) {
                        let container;
                        if (type === 'current-location' || type === 'location') {
                            container = document.querySelector('.suggestions-current');
                        } else if (type === 'destination') {
                            container = document.querySelector('.suggestions-destination');
                        } else if (type === 'airline') {
                            container = document.querySelector('.suggestions-airline');
                        }
                        
                        if (container) {
                            container.innerHTML = suggestionsToShow.map(item => 
                                `<div class="suggestion-item">${item}</div>`
                            ).join('');
                            container.style.display = 'block';
                            container.style.opacity = '1';
                            container.style.visibility = 'visible';
                            container.style.transform = 'translateY(0)';
                            container.classList.add('show');
                            
                            // إضافة مستمعات الأحداث
                            container.querySelectorAll('.suggestion-item').forEach(item => {
                                item.addEventListener('click', function(e) {
                                    e.stopPropagation();
                                    input.value = this.textContent;
                                    container.innerHTML = '';
                                    container.style.display = 'none';
                                    container.style.opacity = '0';
                                    container.style.visibility = 'hidden';
                                    container.classList.remove('show');
                                    performSearch();
                                    input.blur();
                                });
                            });
                        }
                    }
                }
            });
            
            // إضافة زر مسح للحقول
            if (type !== 'current-location') {
                // التحقق من وجود زر مسح بالفعل
                let clearBtn = input.parentNode.querySelector('.clear-input');
                if (!clearBtn) {
                    clearBtn = document.createElement('span');
                    clearBtn.className = 'clear-input clear-btn';
                    clearBtn.innerHTML = '&times;';
                    clearBtn.style.cssText = 'position:absolute; left:12px; top:50%; transform:translateY(-50%); cursor:pointer; color:#cbd5e0; font-size:1.2rem; line-height:1; transition:all 0.2s ease; opacity:0; visibility:hidden; z-index:10;';
                    input.parentNode.insertBefore(clearBtn, input.nextSibling);
                }
                
                // تحديث ظهور زر المسح عند الكتابة
                input.addEventListener('input', function() {
                    if (this.value.trim()) {
                        clearBtn.style.opacity = '1';
                        clearBtn.style.visibility = 'visible';
                        clearBtn.style.display = 'block';
                    } else {
                        clearBtn.style.opacity = '0';
                        clearBtn.style.visibility = 'hidden';
                    }
                });
                
                // حدث النقر على زر المسح
                clearBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    input.value = '';
                    this.style.opacity = '0';
                    this.style.visibility = 'hidden';
                    showSuggestions(type, '');
                    performSearch();
                    input.focus();
                });
            }
        });
        
        // إغلاق الاقتراحات عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-input-container') && !e.target.closest('.suggestions')) {
                document.querySelectorAll('.suggestions').forEach(suggestion => {
                    suggestion.style.display = 'none';
                    suggestion.style.opacity = '0';
                    suggestion.style.visibility = 'hidden';
                    suggestion.style.transform = 'translateY(10px)';
                    suggestion.classList.remove('show');
                });
            }
        });
        
        // البحث عند الكتابة في حقل الوجهة
        const destinationInput = document.querySelector('.search-input.destination');
        if (destinationInput) {
            destinationInput.addEventListener('input', function() {
                showSuggestions('destination', this.value);
                performSearch();
            });
            
            destinationInput.addEventListener('focus', function() {
                const currentValue = this.value.trim();
                if (currentValue.length > 0) {
                    showSuggestions('destination', currentValue);
                } else {
                    const allSuggestions = extractSuggestions();
                    const container = document.querySelector('.suggestions-destination');
                    if (container && allSuggestions.destination.length > 0) {
                        container.innerHTML = allSuggestions.destination.map(item => 
                            `<div class="suggestion-item">${item}</div>`
                        ).join('');
                        container.style.display = 'block';
                        container.style.opacity = '1';
                        container.style.visibility = 'visible';
                        container.style.transform = 'translateY(0)';
                        container.classList.add('show');
                        
                        container.querySelectorAll('.suggestion-item').forEach(item => {
                            item.addEventListener('click', function(e) {
                                e.stopPropagation();
                                destinationInput.value = this.textContent;
                                container.innerHTML = '';
                                container.style.display = 'none';
                                container.style.opacity = '0';
                                container.style.visibility = 'hidden';
                                container.classList.remove('show');
                                performSearch();
                                destinationInput.blur();
                            });
                        });
                    }
                }
            });
            
            // إضافة زر مسح لحقل الوجهة
            const clearBtn = document.createElement('span');
            clearBtn.className = 'clear-input';
            clearBtn.innerHTML = '&times;';
            clearBtn.style.cssText = 'position:absolute; left:10px; top:50%; transform:translateY(-50%); cursor:pointer; color:#aaa; font-size:18px; display:none;';
            destinationInput.parentNode.insertBefore(clearBtn, destinationInput.nextSibling);
            
            destinationInput.addEventListener('input', function() {
                clearBtn.style.display = this.value ? 'block' : 'none';
            });
            
            clearBtn.addEventListener('click', function() {
                destinationInput.value = '';
                this.style.display = 'none';
                showSuggestions('destination', '');
                performSearch();
                destinationInput.focus();
            });
        }

        // البحث عند الكتابة في حقل شركة الطيران
        const airlineInput = document.querySelector('.search-input.airline');
        if (airlineInput) {
            airlineInput.addEventListener('input', function() {
                showSuggestions('airline', this.value);
                performSearch();
            });
            
            airlineInput.addEventListener('focus', function() {
                const currentValue = this.value.trim();
                if (currentValue.length > 0) {
                    showSuggestions('airline', currentValue);
                } else {
                    const allSuggestions = extractSuggestions();
                    const container = document.querySelector('.suggestions-airline');
                    if (container && allSuggestions.airline.length > 0) {
                        container.innerHTML = allSuggestions.airline.map(item => 
                            `<div class="suggestion-item">${item}</div>`
                        ).join('');
                        container.style.display = 'block';
                        container.style.opacity = '1';
                        container.style.visibility = 'visible';
                        container.style.transform = 'translateY(0)';
                        container.classList.add('show');
                        
                        container.querySelectorAll('.suggestion-item').forEach(item => {
                            item.addEventListener('click', function(e) {
                                e.stopPropagation();
                                airlineInput.value = this.textContent;
                                container.innerHTML = '';
                                container.style.display = 'none';
                                container.style.opacity = '0';
                                container.style.visibility = 'hidden';
                                container.classList.remove('show');
                                performSearch();
                                airlineInput.blur();
                            });
                        });
                    }
                }
            });
            
            // إضافة زر مسح لحقل شركة الطيران
            const clearBtn = document.createElement('span');
            clearBtn.className = 'clear-input';
            clearBtn.innerHTML = '&times;';
            clearBtn.style.cssText = 'position:absolute; left:10px; top:50%; transform:translateY(-50%); cursor:pointer; color:#aaa; font-size:18px; display:none;';
            airlineInput.parentNode.insertBefore(clearBtn, airlineInput.nextSibling);
            
            airlineInput.addEventListener('input', function() {
                clearBtn.style.display = this.value ? 'block' : 'none';
            });
            
            clearBtn.addEventListener('click', function() {
                airlineInput.value = '';
                this.style.display = 'none';
                showSuggestions('airline', '');
                performSearch();
                airlineInput.focus();
            });
        }

        // لا حاجة لهذا الكود المكرر - تم دمجها في المستمع السابق

        // زر البحث
        const searchButton = document.querySelector('.search-button');
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
        
        // إضافة تفاعل مع الاقتراحات المساعدة
        document.querySelectorAll('.hint').forEach(hint => {
            hint.addEventListener('click', function() {
                const text = this.textContent;
                const destinationInput = document.querySelector('.search-input.destination');
                const airlineInput = document.querySelector('.search-input.airline');
                
                if (text.includes('طيران') || text.includes('الخطوط')) {
                    airlineInput.value = text;
                    showSuggestions('airline', text);
                    performSearch();
                    airlineInput.focus();
                } else {
                    destinationInput.value = text;
                    showSuggestions('destination', text);
                    performSearch();
                    destinationInput.focus();
                }
            });
        });
        
        // البحث عند الضغط على زر Enter
        document.querySelectorAll('.search-input').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        });
    }

    // استخراج الاقتراحات الأولية
    extractSuggestions();
    
    // تهيئة الأحداث
    setupEventListeners();
    
    // CSS styles have been moved to style.css
});
