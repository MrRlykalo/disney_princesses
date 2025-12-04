"use strict";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Королевский Архив загружен!");
    
    // =========================================
    // 1. УПРАВЛЕНИЕ БУРГЕР-МЕНЮ (ИСПРАВЛЕНО)
    // =========================================
    const burgerBtn = document.querySelector(".burger-btn");
    const mainNav = document.querySelector(".main-nav");
    
    if (burgerBtn && mainNav) {
        // Функция открытия/закрытия
        const toggleMenu = () => {
            mainNav.classList.toggle('open');    // Открывает меню
            burgerBtn.classList.toggle('active'); // Превращает бургер в крестик
        };

        // Функция принудительного закрытия
        const closeMenu = () => {
            mainNav.classList.remove('open');
            burgerBtn.classList.remove('active');
        };

        // 1. Клик по бургеру
        burgerBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Чтобы клик не ушел на document
            toggleMenu();
        });
        
        // 2. Закрытие при клике вне меню
        document.addEventListener("click", (e) => {
            // Если клик НЕ по меню И НЕ по кнопке -> закрываем
            if (!mainNav.contains(e.target) && !burgerBtn.contains(e.target)) {
                closeMenu();
            }
        });
        
        // 3. Закрытие при клике на ссылку внутри меню
        const navLinks = mainNav.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 900) { 
                    closeMenu();
                }
            });
        });
        
        // 4. Предотвращение закрытия при клике ВНУТРИ самого меню
        mainNav.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }
    
    // =========================================
    // 2. СИСТЕМА УВЕДОМЛЕНИЙ
    // =========================================
    const notifWrapper = document.querySelector(".notif-wrapper");
    const notifBtn = document.querySelector(".notif-btn");
    const notifCount = document.querySelector(".notif-count");
    const notifList = document.getElementById("notification-list");

    // 🔧 FIX: Функция для принудительного скрытия уведомлений
    function forceCloseNotifications() {
        if (notifList) {
            notifList.classList.remove('notif-list--open');
            notifList.style.display = 'none';
        }
    }

    // 🔧 FIX: Гарантированно скрываем уведомления при загрузке
    function initializeNotifications() {
        if (notifList) {
            // Принудительно скрываем
            forceCloseNotifications();
            
            // Очищаем возможные старые уведомления
            notifList.innerHTML = '';
            
            // Добавляем начальные уведомления
            const initialNotifications = [
                { text: "✨ В галерее новые портреты!", href: "gallery.html" },
                { text: "🎵 Сегодня живой джаз во Дворце", href: "booking.html" }
            ];
            
            initialNotifications.forEach(notif => {
                const li = document.createElement("li");
                li.innerHTML = notif.text;
                li.setAttribute('data-href', notif.href);
                notifList.appendChild(li);
            });
        }
    }

    const randomNotifications = [
        { text: "🎵 Сегодня живой джаз во Дворце Тианы!", href: "booking.html" },
        { text: "✨ В Галерее появился портрет Рапунцель!", href: "gallery.html" },
        { text: "🏰 Новая локация: Королевство Корона!", href: "locations.html" },
        { text: "👑 Тиана обновила меню в ресторане!", href: "tiana.html" },
        { text: "💫 Начался сезон фонариков в Короне!", href: "locations.html" },
        { text: "🎭 Бал принцесс начнется в 19:00!", href: "booking.html" }
    ];

    let notificationInterval;
    let notificationCounter = 2;
    const NOTIFICATION_LIMIT = 6;

    // Функция добавления уведомления
    function addNotification() {
        if (!notifList || !notifCount) return;

        if (notifList.children.length >= NOTIFICATION_LIMIT) {
            notifList.removeChild(notifList.lastElementChild);
        }
        
        const randomIndex = Math.floor(Math.random() * randomNotifications.length);
        const notifData = randomNotifications[randomIndex];
        
        const newLi = document.createElement("li");
        newLi.innerHTML = notifData.text;
        newLi.setAttribute('data-href', notifData.href);
        notifList.insertBefore(newLi, notifList.firstChild);
        
        notificationCounter++;
        updateNotificationCounter();
    }

    // Обновление счетчика уведомлений
    function updateNotificationCounter() {
        if (notifCount) {
            notifCount.textContent = notificationCounter;
            notifCount.style.display = notificationCounter > 0 ? "block" : "none";
        }
    }

    // Запуск системы уведомлений
    function startNotifications() {
        if (notificationInterval) clearInterval(notificationInterval);
        notificationInterval = setInterval(addNotification, 15000);
    }

    // Функция переключения видимости уведомлений
    function toggleNotifications() {
        if (!notifList) return;
        
        const isOpen = notifList.classList.contains('notif-list--open');
        
        if (isOpen) {
            // Закрываем
            forceCloseNotifications();
        } else {
            // Открываем
            notifList.classList.add('notif-list--open');
            notifList.style.display = 'block';
            
            // Сбрасываем счетчик только при открытии
            notificationCounter = 0;
            updateNotificationCounter();
            delayedStop();
        }
    }

    const delayedStop = createDelayedStop(30000);

    function createDelayedStop(delay) {
        return function() {
            clearInterval(notificationInterval);
            setTimeout(startNotifications, delay);
        };
    }

    // Инициализация системы уведомлений
    function initNotificationSystem() {
        if (!notifList) return;
        
        // 🔧 FIX: Принудительно инициализируем и скрываем
        initializeNotifications();
        
        // 🔧 FIX: Добавляем небольшую задержку для гарантии
        setTimeout(() => {
            forceCloseNotifications();
        }, 100);
        
        // Обработчик клика по колокольчику
        if (notifBtn) {
            notifBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleNotifications();
            });
        }
        
        // 🔧 FIX: Улучшенное закрытие при клике вне области
        document.addEventListener("click", (e) => {
            if (notifList && notifList.classList.contains('notif-list--open') &&
                !notifList.contains(e.target) && 
                notifBtn && !notifBtn.contains(e.target)) {
                forceCloseNotifications();
            }
        });
        
        // Обработчик клика по уведомлениям
        notifList.addEventListener("click", function(e) {
            const li = e.target.closest("li");
            if (li && li.getAttribute('data-href')) {
                if (notificationCounter > 0) {
                    notificationCounter--;
                    updateNotificationCounter();
                }
                
                forceCloseNotifications();
                window.location.href = li.getAttribute('data-href');
                delayedStop();
            }
        });

        // Запускаем систему уведомлений
        startNotifications();
    }

    // Вызываем инициализацию
    initNotificationSystem();

    // =========================================
    // 3. КНОПКА "НАВЕРХ"
    // =========================================
    const toTopBtn = document.querySelector(".fixed-btn");
    
    if (toTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 500) {
                toTopBtn.classList.add("show");
            } else {
                toTopBtn.classList.remove("show");
            }
        });
        
        toTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
    
    // =========================================
    // 4. ФОРМА РАССЫЛКИ
    // =========================================
    const newsletterForm = document.getElementById("newsletter-form");
    const successMsg = document.getElementById("newsletter-success");
    
    if (newsletterForm && successMsg) {
        newsletterForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Анимация отправки
            const submitBtn = this.querySelector(".submit-btn");
            const originalText = submitBtn.querySelector(".btn-text").textContent;
            
            submitBtn.querySelector(".btn-text").textContent = "Отправка...";
            submitBtn.disabled = true;
            
            // Имитация отправки
            setTimeout(() => {
                // Показываем успешное сообщение
                successMsg.style.display = "block";
                newsletterForm.style.display = "none";
                
                // Сбрасываем форму
                newsletterForm.reset();
                
                // Восстанавливаем кнопку
                submitBtn.querySelector(".btn-text").textContent = originalText;
                submitBtn.disabled = false;
                
                // Автоматическое скрытие сообщения через 5 секунд
                setTimeout(() => {
                    successMsg.style.display = "none";
                    newsletterForm.style.display = "block";
                }, 5000);
                
            }, 1500);
        });
    }
    
    // =========================================
    // 5. АНИМАЦИИ ПРИ SCROLL
    // =========================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.magic-btn-container, .castle-map-container, .glass-form');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Инициализация анимаций
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // =========================================
    // 6. ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ
    // =========================================
    
    // Анимация карточек мозаики
    const mosaicItems = document.querySelectorAll('.mosaic-item');
    mosaicItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
            setTimeout(() => {
                item.style.zIndex = '1';
            }, 300);
        });
        
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
    
    // Плавное появление элементов при загрузке
    const fadeInElements = document.querySelectorAll('section');
    fadeInElements.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100 + index * 200);
    });
    
    // =========================================
    // 8. ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ
    // =========================================
    function preloadImages() {
        const images = [
            'https://placehold.co/800x400/1abc9c/FFF?text=ROYAL+CASTLE+MAP',
            'https://placehold.co/400x300/6c5ce7/FFF?text=Magic+Castle',
            'https://placehold.co/400x300/gold/FFF?text=Бальный+Зал',
            'https://placehold.co/200x200/27ae60/FFF?text=Сад',
            'https://placehold.co/200x200/9b59b6/FFF?text=Артефакты',
            'https://placehold.co/400x200/e67e22/FFF?text=Карта+Мира'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // =========================================
    // 9. ФИЛЬТРАЦИЯ И ПОИСК НА СТРАНИЦАХ
    // =========================================
    
    function initSearchAndFilter() {
        const searchInput = document.querySelector('.search-input');
        const filterSelect = document.querySelector('.filter-select');
        
        if (!searchInput && !filterSelect) return;
        
        // Находим контейнер с карточками (ищем в разных местах)
        const container = document.querySelector('.locations-grid') || 
                         document.querySelector('.booking-grid') || 
                         document.querySelector('.cards-container') ||
                         document.querySelector('main .container');
        
        if (!container) return;
        
        // Находим все карточки в контейнере
        const cards = container.querySelectorAll('.location-card, .booking-card, .card, .event-card');
        
        if (!cards.length) return;
        
        function filterCards() {
            const searchText = searchInput ? searchInput.value.toLowerCase() : '';
            const filterValue = filterSelect ? filterSelect.value : 'all';
            
            cards.forEach(card => {
                // Получаем текст из карточки для поиска
                const cardText = card.textContent.toLowerCase();
                const title = card.querySelector('h3, h4')?.textContent.toLowerCase() || '';
                const description = card.querySelector('p')?.textContent.toLowerCase() || '';
                const fullText = cardText + ' ' + title + ' ' + description;
                
                // Получаем категорию карточки
                let cardCategory = card.dataset.category || 'all';
                
                // Если нет data-category, пытаемся определить по содержимому
                if (cardCategory === 'all' && card.classList.contains('location-card')) {
                    const cardContent = card.textContent;
                    if (cardContent.includes('Новый Орлеан')) cardCategory = 'americas';
                    else if (cardContent.includes('Аграба')) cardCategory = 'asia';
                    else if (cardContent.includes('Корона')) cardCategory = 'europe';
                    else if (cardContent.includes('Атлантика')) cardCategory = 'fantasy';
                    else if (cardContent.includes('Китай')) cardCategory = 'asia';
                    else if (cardContent.includes('Мотунуи')) cardCategory = 'asia';
                }
                
                // Проверяем условия
                const matchesSearch = !searchText || fullText.includes(searchText);
                const matchesFilter = filterValue === 'all' || cardCategory === filterValue;
                
                // Показываем/скрываем карточку
                if (matchesSearch && matchesFilter) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        // Вешаем обработчики
        if (searchInput) {
            searchInput.addEventListener('input', filterCards);
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', filterCards);
        }
        
        // Запускаем при загрузке
        filterCards();
    }
    
    // Инициализируем поиск и фильтр
    initSearchAndFilter();
    
    // Запускаем предзагрузку
    preloadImages();
    
    console.log("Все системы Королевского Архива инициализированы! 🏰");
});

// Глобальные функции для демонстрации
window.demoAlert = function(message) {
    alert(`✨ ${message}`);
};

// ==========================================
// 10. АВТОРИЗАЦИЯ (ФИНАЛЬНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ)
// ==========================================

// --- ГЛОБАЛЬНЫЕ ФУНКЦИИ ---

// Единая функция для успешного входа
function finalizeLogin(username) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    window.location.href = 'profile.html';
}

// ПЕРЕОПРЕДЕЛЯЕМ ФУНКЦИЮ ДЕМО-ВХОДА (для кнопки на login.html)
window.handleLoginPrompt = function() {
    const user = prompt("Желаете войти в Королевский Архив? Введите имя пользователя:");
    if (user && user.trim() !== "") {
        // Если пользователь ввел имя, считаем вход успешным
        finalizeLogin(user.trim());
    } else {
        alert("Вход отменен.");
    }
};

// ПЕРЕОПРЕДЕЛЯЕМ ФУНКЦИЮ ВЫХОДА (для кнопок "Выйти" в шапке и профиле)
window.logout = function() {
    if(confirm('Вы уверены, что хотите выйти из системы?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        // Перекидываем на страницу входа
        window.location.href = 'login.html'; 
    }
};


document.addEventListener("DOMContentLoaded", () => {
    // Получаем текущее состояние
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('currentUser') || "Пользователь";
    const currentPath = window.location.pathname;

    // --- ЛОГИКА ВХОДА ДЛЯ ФОРМЫ (только на login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            // Получаем имя из email для отображения в шапке
            const emailInput = document.getElementById('login-email').value;
            let user = emailInput.split('@')[0];
            user = user.charAt(0).toUpperCase() + user.slice(1);
            
            finalizeLogin(user); // Вызываем единую функцию входа
        });
    }
    
    // --- ОБЩАЯ ЛОГИКА ДЛЯ ВСЕХ СТРАНИЦ ---

    // 1. ЗАЩИТА ПРОФИЛЯ: Если мы на profile.html и не залогинены -> редирект на вход
    if (currentPath.includes('profile.html') && !isLogged) {
        window.location.href = 'login.html';
        return; 
    }
    
    // 2. ОБНОВЛЕНИЕ ШАПКИ (Header): меняем "Войти/Регистрация" на "Профиль/Выйти"
    const desktopAuthBlock = document.querySelector('.account-links');
    if (desktopAuthBlock && isLogged) {
        desktopAuthBlock.innerHTML = `
            <a href="profile.html" class="btn-register" style="background: var(--accent-purple); color: white; margin-right: 10px;">👤 ${username}</a>
            <a href="#" onclick="logout()" class="btn-register">Выйти</a>
        `;
    }
    
    // 3. ОБНОВЛЕНИЕ МОБИЛЬНОГО МЕНЮ
    const mobileAuthBlock = document.querySelector('.account-mobile-links');
    if (mobileAuthBlock && isLogged) {
        mobileAuthBlock.innerHTML = `
            <a href="profile.html" class="btn-register" style="background: var(--accent-purple); color: white;">👤 Мой профиль</a>
            <a href="#" onclick="logout()" class="btn-register">Выйти</a>
        `;
    }

    // 4. ОТОБРАЖЕНИЕ ИМЕНИ НА profile.html
    if (currentPath.includes('profile.html') && isLogged) {
        const subtitle = document.querySelector('.profile-subtitle');
        const profileName = document.querySelector('.profile-card h2');
        const infoName = document.querySelector('.info-item span'); 
        
        if (subtitle) {
            subtitle.innerHTML = `Добро пожаловать в ваш личный архив, <strong>${username}</strong>!`;
        }
        if (profileName) {
            profileName.textContent = username;
        }
        // Заменяем имя в таблице информации (предполагаем, что это первый span в info-item)
        if (infoName && infoName.closest('.info-item').querySelector('h4').textContent.includes('Имя')) {
            infoName.textContent = username;
        }
    }
});