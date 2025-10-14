// Prevent right-click on the entire document
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    // Show custom context menu
    showCustomContextMenu(e.pageX, e.pageY);
    return false;
});

// Prevent keyboard shortcuts for saving images
document.addEventListener('keydown', function(e) {
    // Ctrl+S, Command+S, Ctrl+U
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});

// Custom context menu
function showCustomContextMenu(x, y) {
    let menu = document.querySelector('.custom-context-menu');
    
    if (!menu) {
        menu = document.createElement('div');
        menu.className = 'custom-context-menu';
        menu.innerHTML = '<p>Images are for preview only</p>';
        document.body.appendChild(menu);
    }
    
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.add('active');
    
    setTimeout(() => {
        menu.classList.remove('active');
    }, 2000);
}

// Hide custom context menu when clicking elsewhere
document.addEventListener('click', function() {
    const menu = document.querySelector('.custom-context-menu');
    if (menu) menu.classList.remove('active');
});

// Theme management
function getThemePreference() {
    // Check if user previously selected a theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        return storedTheme;
    }
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Page loader
document.addEventListener('DOMContentLoaded', function() {
    // Set initial theme
    const initialTheme = getThemePreference();
    setTheme(initialTheme);
    
    // Set CSS RGB variables for better styling in dark mode
    updateCssColorVariables();
    
    // Add temporary banner
    const banner = document.createElement('div');
    banner.className = 'temp-banner';
    banner.textContent = 'Main website coming soon. This is a temporary preview.';
    document.body.appendChild(banner);
    
    // Add theme toggle button
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.setAttribute('role', 'button');
    themeToggle.setAttribute('tabindex', '0');
    document.body.appendChild(themeToggle);
    
    // Add theme toggle event listeners
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });
    
    // Handle loader - shorter on mobile
    const isMobile = window.innerWidth < 768;
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }, isMobile ? 1500 : 3000); // Shorter loading time on mobile
    
    // Initialize gallery if on gallery page
    if (document.getElementById('gallery')) {
        initGallery();
        
        // Check for URL parameters (for direct category links)
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam) {
            // Find and click the corresponding category button
            const categoryBtn = document.querySelector(`.category-btn[data-category="${categoryParam}"]`);
            if (categoryBtn) {
                setTimeout(() => {
                    categoryBtn.click();
                    
                    // Scroll the button into view on mobile
                    if (window.innerWidth <= 768) {
                        categoryBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }, 500); // Small delay to ensure gallery is initialized
            }
        }
        
        // Add scroll hint for mobile users
        if (window.innerWidth <= 768) {
            // Add scroll behavior to category filter on mobile
            const categoryFilter = document.querySelector('.category-filter');
            if (categoryFilter) {
                categoryFilter.addEventListener('scroll', debounce(() => {
                    // Hide indicator when user scrolls
                    const indicator = document.querySelector('.filter-indicator');
                    if (indicator) {
                        indicator.style.opacity = '0';
                        setTimeout(() => {
                            indicator.style.display = 'none';
                        }, 500);
                    }
                }, 100));
            }
        }
    }
    
    // Initialize testimonial slider if on home page
    if (document.querySelector('.testimonial-slider')) {
        initTestimonialSlider();
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Animate hamburger to X - use transition values based on screen size
        this.classList.toggle('active');
        const offset = window.innerWidth < 480 ? 5 : 7; // Smaller offset on very small screens
        
        if (this.classList.contains('active')) {
            this.children[0].style.transform = `translateY(${offset}px) rotate(45deg)`;
            this.children[1].style.transform = `translateY(-${offset}px) rotate(-45deg)`;
        } else {
            this.children[0].style.transform = 'none';
            this.children[1].style.transform = 'none';
        }
        
        // Prevent scrolling when menu is open
        if (this.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close the mobile menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle.classList.contains('active')) {
                menuToggle.click(); // Close the menu
            }
        });
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Handle resize events
    window.addEventListener('resize', debounce(() => {
        // Update any size-dependent elements
        if (document.querySelector('.mobile-hero-image')) {
            adjustMobileHero();
        }
    }, 150));
    
    // Initial adjustment for mobile hero
    if (document.querySelector('.mobile-hero-image')) {
        adjustMobileHero();
    }
});

// Helper function to update CSS RGB variables
function updateCssColorVariables() {
    const root = document.documentElement;
    const theme = root.getAttribute('data-theme') || 'light';
    
    // Set the background-rgb variable for gradient transitions
    const backgroundColor = getComputedStyle(root).getPropertyValue('--background').trim();
    
    // Make sure we have the RGB values
    let r, g, b;
    if (backgroundColor.startsWith('#')) {
        const hex = backgroundColor.replace('#', '');
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
    } else if (backgroundColor.startsWith('rgb')) {
        const rgb = backgroundColor.match(/\d+/g);
        r = parseInt(rgb[0]);
        g = parseInt(rgb[1]);
        b = parseInt(rgb[2]);
    } else {
        // Default fallback if parsing fails
        r = theme === 'dark' ? 18 : 255;
        g = theme === 'dark' ? 18 : 255;
        b = theme === 'dark' ? 18 : 255;
    }
    
    root.style.setProperty('--background-rgb', `${r}, ${g}, ${b}`);
}

// Helper function to adjust mobile hero size
function adjustMobileHero() {
    const mobileHero = document.querySelector('.mobile-hero-image');
    if (!mobileHero) return;
    
    if (window.innerWidth <= 768) {
        mobileHero.style.display = 'flex';
        // Adjust height based on screen size
        if (window.innerWidth <= 480) {
            mobileHero.style.height = '40vh';
        } else {
            mobileHero.style.height = '50vh';
        }
    } else {
        mobileHero.style.display = 'none';
    }
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Initialize testimonial slider
function initTestimonialSlider() {
    const dots = document.querySelectorAll('.testimonial-dot');
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;
    let slideInterval;
    
    // Set up dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Show a specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
        
        // Reset the interval
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // Start automatic sliding
    function startSlideInterval() {
        slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            showSlide(nextSlide);
        }, 5000); // Change slide every 5 seconds
    }
    
    // Start the slider
    startSlideInterval();
}

// Gallery initialization
function initGallery() {
    const gallery = document.getElementById('gallery');
    const images = [
        // Portrait Sessions - Updated with new jpg images
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_105.jpg', caption: 'Fall Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_108.jpg', caption: 'Fall Collection', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_109.jpg', caption: 'Autumn Vibes', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_111.jpg', caption: 'Fall Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_114.jpg', caption: 'Autumn Collection', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_119.jpg', caption: 'Fall Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_121.jpg', caption: 'Fall Portrait Series', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_133.jpg', caption: 'Fall Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_138.jpg', caption: 'Fall Collection', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_155.jpg', caption: 'Autumn Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_168.jpg', caption: 'Fall Fashion', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_171.jpg', caption: 'Autumn Collection', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_173.jpg', caption: 'Fall Portrait Series', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_174.jpg', caption: 'Autumn Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_177.jpg', caption: 'Fall Fashion', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_184.jpg', caption: 'Autumn Collection', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_185.jpg', caption: 'Fall Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_202.jpg', caption: 'Autumn Vibes', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_203.jpg', caption: 'Fall Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_208.jpg', caption: 'Autumn Collection', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_238.jpg', caption: 'Fall Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_26.jpg', caption: 'Fall Portrait Series', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_28.jpg', caption: 'Autumn Collection', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_41.jpg', caption: 'Fall Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_42.jpg', caption: 'Fall Fashion', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Ananya_Fall_Shoot_79.jpg', caption: 'Autumn Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA02861.jpg', caption: 'Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA03304.jpg', caption: 'Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA03409.jpg', caption: 'Portrait Series', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA03430.jpg', caption: 'Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_112.jpg', caption: 'Portrait Series', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_117.jpg', caption: 'Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_38.jpg', caption: 'Portrait Series', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_46.jpg', caption: 'Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_95.jpg', caption: 'Portrait Series', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Thandava-Photoshoot-002.jpg', caption: 'Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Thandava-Photoshoot-018.jpg', caption: 'Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Thandava-Photoshoot-044.jpg', caption: 'Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Thandava-Photoshoot-065.jpg', caption: 'Portrait Session', category: ['portrait'] },
        
        // Themed Photoshoots
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-124.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-132.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-144.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-163.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-186.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-188.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-202.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-206.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-230.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-257.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-262.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-266.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-270.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-284.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-290.jpg', caption: 'Themed Shoot', category: ['themed'] },
        { path: 'Gallery Pictures/Themed Photoshoot/Thandava-Photoshoot-294.jpg', caption: 'Themed Shoot', category: ['themed'] },
        
        // Event Photography - Holi Festival
        { path: 'Gallery Pictures/Event Photography/Holi-002.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-003.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-004.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-006.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-007.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-011.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-018.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-020.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-022.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-023.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-024.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-026.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-027.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-033.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-036.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-045.jpg', caption: 'Color Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-048.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-053.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-057.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-058.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-059.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-088.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-090.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-105.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-106.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-115.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-120.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-128.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-139.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-148.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-151.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-158.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-164.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-170.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-172.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-179.jpg', caption: 'Color Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-181.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-183.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-187.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-194.jpg', caption: 'Color Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-201.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-206.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-215.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-222.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-228.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-234.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-254.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-264.jpg', caption: 'Festival of Colors', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-281.jpg', caption: 'Holi Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-291.jpg', caption: 'Color Festival', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-298.jpg', caption: 'Holi Celebration', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Holi-299.jpg', caption: 'Color Celebration', category: ['event'] },
        
        // FRO Fashion Show Event Photography
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-1.jpg', caption: 'FRO Fashion Show', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-2.jpg', caption: 'Fashion Show Coverage', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-3.jpg', caption: 'Runway Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-4.jpg', caption: 'Fashion Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-5.jpg', caption: 'FRO Fashion Show', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-6.jpg', caption: 'Fashion Show Coverage', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-7.jpg', caption: 'Runway Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-8.jpg', caption: 'Fashion Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-9.jpg', caption: 'FRO Fashion Show', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-10.jpg', caption: 'Fashion Show Coverage', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-11.jpg', caption: 'Runway Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-12.jpg', caption: 'Fashion Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-13.jpg', caption: 'FRO Fashion Show', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-14.jpg', caption: 'Fashion Show Coverage', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-15.jpg', caption: 'Runway Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-16.jpg', caption: 'Fashion Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-17.jpg', caption: 'FRO Fashion Show', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-18.jpg', caption: 'Fashion Show Coverage', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-19.jpg', caption: 'Runway Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-20.jpg', caption: 'Fashion Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/FRO-FashionShow-21.jpg', caption: 'FRO Fashion Show Finale', category: ['event'] },
        
        // Sigma Kappa Event Photography
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-89.jpg', caption: 'Sigma Kappa Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-97.jpg', caption: 'Greek Life Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-102.jpg', caption: 'Sigma Kappa Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-112.jpg', caption: 'Greek Life Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-126.jpg', caption: 'Sigma Kappa Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-174.jpg', caption: 'Greek Life Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-178.jpg', caption: 'Sigma Kappa Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-189.jpg', caption: 'Greek Life Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-202.jpg', caption: 'Sigma Kappa Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-204.jpg', caption: 'Greek Life Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-234.jpg', caption: 'Sigma Kappa Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-241.jpg', caption: 'Greek Life Photography', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-245.jpg', caption: 'Sigma Kappa Event', category: ['event'] },
        { path: 'Gallery Pictures/Event Photography/Sigma-Kappa_thesora.io-249.jpg', caption: 'Greek Life Photography', category: ['event'] },
        
        // Dhruva Merch Portrait Sessions
        { path: 'Gallery Pictures/Portrait Sessions/Dhruva_Merch_Edited_Uncompressed-109.jpg', caption: 'Dhruva Merch Shoot', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Dhruva_Merch_Edited_Uncompressed-110.jpg', caption: 'Merchandise Photography', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Dhruva_Merch_Edited_Uncompressed-111.jpg', caption: 'Dhruva Merch Shoot', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Dhruva_Merch_Edited_Uncompressed-112.jpg', caption: 'Merchandise Photography', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Dhruva_Merch_Edited_Uncompressed-113.jpg', caption: 'Dhruva Merch Shoot', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Dhruva_Merch_Edited_Uncompressed-114.jpg', caption: 'Merchandise Photography', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Dhruva_Merch_Edited_Uncompressed-115.jpg', caption: 'Dhruva Merch Shoot', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Dhruva_Merch_Edited_Uncompressed-116.jpg', caption: 'Merchandise Photography', category: ['portrait'] },
        
        // Shabad Portrait Sessions
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-001.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-006.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-015.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-017.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-024.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-025.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-030.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-036.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-039.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-048.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-053.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-056.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-063.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-066.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-068.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-072.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-075.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-082.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-097.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad-Photoshoot-thesora.io-100.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad Photoshoot 201.jpg', caption: 'Shabad Portrait Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/Shabad Photoshoot 230.jpg', caption: 'Professional Headshots', category: ['portrait'] },
        
        // Additional Portrait Sessions
        { path: 'Gallery Pictures/Portrait Sessions/UVA03378.jpg', caption: 'Creative Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA02098.jpg', caption: 'Portrait Series', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_5.jpg', caption: 'Studio Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA02907.jpg', caption: 'Outdoor Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA03192.jpg', caption: 'Lifestyle Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_130.jpg', caption: 'Fashion Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_14.jpg', caption: 'Creative Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA02145.jpg', caption: 'Natural Light Portrait', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/VANI_EDIT_69.jpg', caption: 'Studio Session', category: ['portrait'] },
        { path: 'Gallery Pictures/Portrait Sessions/UVA03271.jpg', caption: 'Portrait Series', category: ['portrait'] }
    ];
    
    // Preload first few images for faster initial rendering
    const preloadCount = Math.min(6, images.length);
    for (let i = 0; i < preloadCount; i++) {
        const preloadImg = new Image();
        preloadImg.src = images[i].path;
    }
    
    // Current active category filter
    let activeCategory = 'all';
    
    // Filter images by category
    const filterImages = (category) => {
        activeCategory = category;
        
        // Clear gallery
        gallery.innerHTML = '';
        
        // Filter images by category
        const filteredImages = category === 'all' 
            ? images 
            : images.filter(image => image.category && image.category.includes(category));
            
        // Render the filtered images
        renderImages(filteredImages);
        
        // Update active button
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };
    
    // Set up category button event listeners
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterImages(category);
        });
    });
    
    // Create gallery items with virtualization
    const renderImages = (imagesToRender) => {
        // Clear existing items to avoid duplicates during re-render
        gallery.innerHTML = '';

        // Limit number of images to render at once on mobile to prevent crashes
        const isMobile = window.innerWidth <= 768;
        // On mobile, be very conservative (15 images)
        // On tablet, show more (30 images)
        // On desktop, show all or up to 60 at a time
        const initialRenderCount = 
            isMobile ? 15 : 
            window.innerWidth <= 1024 ? 30 : 
            Math.min(60, imagesToRender.length);
        const imagesToRenderInitially = imagesToRender.slice(0, initialRenderCount);
        
        // Determine a subset of images to render
        imagesToRenderInitially.forEach((image, index) => {
            // Create new item
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-index', index);
            
            // Create blur-up loading effect
            const placeholderBg = document.createElement('div');
            placeholderBg.className = 'placeholder-bg';
            item.appendChild(placeholderBg);
            
            // Create image with lazy loading and progressive enhancement
            const img = new Image();
            img.alt = image.caption;
            img.loading = 'lazy'; 
            img.className = 'gallery-image';
            img.dataset.src = image.path;
            img.style.opacity = '0';
            
            // Create loading spinner
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            item.appendChild(spinner);
            
            // Add to DOM
            item.appendChild(img);
            gallery.appendChild(item);
            
            // Open lightbox on click
            item.addEventListener('click', function() {
                if (!item.classList.contains('loading')) {
                    openLightbox(index);
                }
            });
            
            // Add staggered animation with reduced delay
            setTimeout(() => {
                item.classList.add('visible');
                
                // Start loading the image if it should be loaded
                if (isInLoadingRange(item, index)) {
                    loadImage(img, spinner, item);
                }
            }, 50 * Math.min(index, 10)); // Faster staggering, capped at 500ms
        });
        
        // If we have more images to load on mobile, add a "Load More" button
        if (isMobile && imagesToRender.length > initialRenderCount) {
            const loadMoreContainer = document.createElement('div');
            loadMoreContainer.className = 'load-more-container';
            
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'load-more-btn';
            const remainingImages = imagesToRender.length - initialRenderCount;
            loadMoreBtn.textContent = `Load More (${remainingImages} images)`;
            loadMoreBtn.addEventListener('click', function() {
                // Remove the load more button
                loadMoreContainer.remove();
                
                // Load the next batch of images
                const nextBatch = imagesToRender.slice(initialRenderCount);
                let batchCount = 0;
                
                // Load images in smaller batches to prevent crashing
                function loadNextBatchPart() {
                    const start = batchCount * 10;
                    const end = Math.min(start + 10, nextBatch.length);
                    const batchPart = nextBatch.slice(start, end);
                    
                    // Add this batch of images
                    batchPart.forEach((image, batchIndex) => {
                        const globalIndex = initialRenderCount + start + batchIndex;
                        
                        // Create new item
                        const item = document.createElement('div');
                        item.className = 'gallery-item';
                        item.setAttribute('data-index', globalIndex);
                        
                        // Create blur-up loading effect
                        const placeholderBg = document.createElement('div');
                        placeholderBg.className = 'placeholder-bg';
                        item.appendChild(placeholderBg);
                        
                        // Create image with lazy loading
                        const img = new Image();
                        img.alt = image.caption;
                        img.loading = 'lazy'; 
                        img.className = 'gallery-image';
                        img.dataset.src = image.path;
                        img.style.opacity = '0';
                        
                        // Create loading spinner
                        const spinner = document.createElement('div');
                        spinner.className = 'spinner';
                        item.appendChild(spinner);
                        
                        // Add to DOM
                        item.appendChild(img);
                        gallery.appendChild(item);
                        
                        // Open lightbox on click
                        item.addEventListener('click', function() {
                            if (!item.classList.contains('loading')) {
                                openLightbox(globalIndex);
                            }
                        });
                        
                        // Add animation and load image
                        setTimeout(() => {
                            item.classList.add('visible');
                            if (isInLoadingRange(item, batchIndex)) {
                                loadImage(img, spinner, item);
                            }
                        }, 50 * batchIndex);
                    });
                    
                    // If there are more images to load, schedule the next batch
                    batchCount++;
                    if (end < nextBatch.length) {
                        setTimeout(loadNextBatchPart, 500); // Add delay between batches
                    } else {
                        // Re-observe all gallery items when done
                        observeGalleryItems();
                    }
                }
                
                // Start loading the first batch
                loadNextBatchPart();
            });
            
            loadMoreContainer.appendChild(loadMoreBtn);
            gallery.appendChild(loadMoreContainer);
        }
        
        // Re-observe gallery items for infinite scroll
        observeGalleryItems();
    };
    
    // Initialize the gallery with all images
    renderImages(images);
    
    // Check if element should load (viewport or priority)
    // More conservative loading strategy on mobile to prevent crashes
    function isInLoadingRange(el, index) {
        const isMobile = window.innerWidth <= 768;
        
        // On mobile, be very conservative with what loads automatically
        if (isMobile) {
            return isElementInViewport(el) || 
                   index < 6; // Only eagerly load first 6 images on mobile
        }
        
        // On desktop, we can be more aggressive
        return isElementInViewport(el) || 
               index < 12 || // Load first 12 images
               index < 20 && Math.random() > 0.5; // Randomly load some more
    }
    
    // Observe gallery items for infinite scroll effect
    observeGalleryItems();
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Load image with progressive loading and fade-in effect
function loadImage(img, spinner, container) {
    // Skip if already loaded or loading
    if (img.dataset.loaded || img.dataset.loading) return;
    
    img.dataset.loading = 'true';
    container.classList.add('loading');
    const src = img.dataset.src;
    
    // Create performance tracker for debugging
    const startTime = performance.now();
    
    // Mobile detection for performance optimizations
    const isMobile = window.innerWidth <= 768;
    
    // Add progressive loading with blur transition
    const applyProgressiveLoading = () => {
        // Image has loaded, fade it in with a nice blur transition
        container.style.setProperty('--loading-progress', '100%');
        
        // First make it visible with blur (less blur on mobile for better performance)
        img.style.opacity = '1';
        img.style.filter = isMobile ? 'blur(10px)' : 'blur(20px)';
        
        // Then animate to sharp (faster transition on mobile)
        setTimeout(() => {
            img.style.transition = `filter ${isMobile ? '0.3s' : '0.5s'} ease-out`;
            img.style.filter = 'blur(0px)';
            
            setTimeout(() => {
                // Once animation complete, clean up
                spinner.style.opacity = '0';
                container.classList.remove('loading');
                img.dataset.loaded = 'true';
                delete img.dataset.loading;
                spinner.style.display = 'none';
                
                // Mobile memory optimization: 
                // On mobile, remove the original source from dataset to free memory
                if (isMobile) {
                    delete img.dataset.src;
                }
                
                const loadTime = performance.now() - startTime;
                
                // Preload for lightbox if this is a priority image (fewer on mobile)
                const index = parseInt(container.getAttribute('data-index'));
                if (!isMobile && index < 8) {
                    preloadForLightbox(src);
                } else if (isMobile && index < 3) {
                    // On mobile, only preload the first few images for lightbox
                    preloadForLightbox(src);
                }
            }, isMobile ? 300 : 500);
        }, 10);
    };
    
    // Start loading the image
    img.onload = applyProgressiveLoading;
    
    img.onerror = function() {
        container.classList.remove('loading');
        spinner.style.display = 'none';
        container.classList.add('error');
        delete img.dataset.loading;
        console.log('Error loading image:', src);
    };
    
    // Set src to start loading
    img.src = src;
    
    // Fallback if image is cached and onload doesn't fire
    if (img.complete) {
        applyProgressiveLoading();
    }
}

// Preload images for lightbox
function preloadForLightbox(src) {
    // Already preloaded full-size images
    if (window.preloadedLightboxImages && window.preloadedLightboxImages[src]) {
        return;
    }
    
    // Initialize preloaded images cache if not exists
    if (!window.preloadedLightboxImages) {
        window.preloadedLightboxImages = {};
    }
    
    // Preload image
    const img = new Image();
    img.src = src;
    window.preloadedLightboxImages[src] = true;
}

// Intersection Observer for scroll animations and lazy loading
function observeGalleryItems() {
    const isMobile = window.innerWidth <= 768;
    
    // Create an intersection observer with settings optimized for device
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                
                // Load image if not already loaded
                const img = item.querySelector('.gallery-image');
                const spinner = item.querySelector('.spinner');
                
                if (img && !img.dataset.loaded) {
                    loadImage(img, spinner, item);
                }
                
                imageObserver.unobserve(item);
            }
        });
    }, {
        threshold: 0.01, // Trigger with just 1% visibility
        // Use a smaller margin on mobile to reduce memory pressure
        rootMargin: isMobile ? '100px 0px 100px 0px' : '200px 0px 200px 0px'
    });
    
    // Add scroll handler with mobile optimization
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollThrottleTime = isMobile ? 300 : 200; // More throttling on mobile
    
    window.addEventListener('scroll', function() {
        const now = Date.now();
        
        // Skip handler if we're scrolling too frequently on mobile
        if (isMobile && now - lastScrollTime < 100) {
            return;
        }
        
        lastScrollTime = now;
        
        // Clear the timeout if it's been set
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Set a timeout to check for new items to load
        // Use a longer delay on mobile
        scrollTimeout = setTimeout(function() {
            // On mobile, only check visible items to reduce DOM operations
            const itemsToCheck = isMobile 
                ? Array.from(document.querySelectorAll('.gallery-item')).slice(0, 20)
                : document.querySelectorAll('.gallery-item');
                
            itemsToCheck.forEach(item => {
                const img = item.querySelector('.gallery-image');
                const spinner = item.querySelector('.spinner');
                
                if (img && !img.dataset.loaded && isElementInViewport(item)) {
                    loadImage(img, spinner, item);
                }
            });
        }, scrollThrottleTime);
    });
    
    // Observe all gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        // Make sure item is visible for animation
        if (!item.classList.contains('visible')) {
            item.classList.add('visible');
        }
        
        // Observe for image loading
        imageObserver.observe(item);
    });
    
    // Optimize resize handler for mobile
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Skip excessive resize events
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(function() {
            // On mobile, limit the number of items to check
            const itemsToCheck = isMobile
                ? Array.from(document.querySelectorAll('.gallery-item')).slice(0, 15)
                : document.querySelectorAll('.gallery-item');
                
            itemsToCheck.forEach(item => {
                const img = item.querySelector('.gallery-image');
                const spinner = item.querySelector('.spinner');
                
                if (img && !img.dataset.loaded && isElementInViewport(item)) {
                    loadImage(img, spinner, item);
                }
            });
        }, isMobile ? 300 : 150);
    });
}

// Lightbox functionality
let currentIndex = 0;
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const closeBtn = document.querySelector('.close-btn');

function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

function updateLightboxContent() {
    const items = document.querySelectorAll('.gallery-item');
    
    // Make sure we have valid items and index
    if (items.length === 0 || currentIndex >= items.length) {
        lightbox.classList.remove('loading');
        closeLightbox();
        return;
    }
    
    const currentItem = items[currentIndex];
    const img = currentItem.querySelector('.gallery-image');
    
    // Show loading indicator in lightbox
    lightbox.classList.add('loading');
    
    // Use original image path
    const imgSrc = img.dataset.src || img.src;
    
    // Only update if we need to
    if (lightboxImg.src !== imgSrc) {
        // Set up onload handler before changing src
        lightboxImg.onload = function() {
            // Once loaded, remove loading state
            lightbox.classList.remove('loading');
            // Preload next and previous images
            preloadAdjacentImages();
        };
        
        lightboxImg.src = imgSrc;
    } else {
        // Image is already loaded/same as current
        lightbox.classList.remove('loading');
    }
    
    lightboxCaption.textContent = img.alt;
}

// Preload adjacent images for smoother lightbox navigation
function preloadAdjacentImages() {
    const items = document.querySelectorAll('.gallery-item');
    const totalItems = items.length;
    
    // Preload next image
    const nextIndex = (currentIndex + 1) % totalItems;
    const nextImg = items[nextIndex].querySelector('.gallery-image');
    if (nextImg) {
        preloadForLightbox(nextImg.dataset.src || nextImg.src);
    }
    
    // Preload previous image
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    const prevImg = items[prevIndex].querySelector('.gallery-image');
    if (prevImg) {
        preloadForLightbox(prevImg.dataset.src || prevImg.src);
    }
}

function nextImage() {
    const items = document.querySelectorAll('.gallery-item');
    currentIndex = (currentIndex + 1) % items.length;
    updateLightboxContent();
}

function prevImage() {
    const items = document.querySelectorAll('.gallery-item');
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightboxContent();
}

// Lightbox event listeners
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    }
});

// Additional click outside to close
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});