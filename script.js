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
    
    // Handle loader
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }, 2500);
    
    // Initialize gallery if on index page
    if (document.getElementById('gallery')) {
        initGallery();
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        // Animate hamburger to X
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.children[0].style.transform = 'translateY(7px) rotate(45deg)';
            this.children[1].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            this.children[0].style.transform = 'none';
            this.children[1].style.transform = 'none';
        }
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});

// Gallery initialization
function initGallery() {
    const gallery = document.getElementById('gallery');
    const images = [
        { path: 'Sample Pictures - Sora/Ananya_Fall_Shoot_133.jpg', caption: 'Fall Portrait' },
        { path: 'Sample Pictures - Sora/Ananya_Fall_Shoot_138.jpg', caption: 'Fall Collection' },
        { path: 'Sample Pictures - Sora/Ananya_Fall_Shoot_202.jpg', caption: 'Autumn Vibes' },
        { path: 'Sample Pictures - Sora/Ananya_Fall_Shoot_203.jpg', caption: 'Fall Portrait' },
        { path: 'Sample Pictures - Sora/Ananya_Fall_Shoot_208.jpg', caption: 'Autumn Collection' },
        { path: 'Sample Pictures - Sora/Ananya_Fall_Shoot_238.jpg', caption: 'Fall Portrait' },
        { path: 'Sample Pictures - Sora/Ananya_Fall_Shoot_257.jpg', caption: 'Autumn Mood' },
        { path: 'Sample Pictures - Sora/Ananya_Fall_Shoot_268.jpg', caption: 'Fall Portrait' },
        { path: 'Sample Pictures - Sora/UVA02861.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/UVA03304.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/UVA03409.jpg', caption: 'Portrait Series' },
        { path: 'Sample Pictures - Sora/UVA03434.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/UVA03441.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_112.jpg', caption: 'Portrait Series' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_117.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_119.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_122.jpg', caption: 'Portrait Series' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_19.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_2.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_38.jpg', caption: 'Portrait Series' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_46.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_59.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_6.jpg', caption: 'Portrait Series' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_81.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_94.jpg', caption: 'Portrait' },
        { path: 'Sample Pictures - Sora/VANI_EDIT_95.jpg', caption: 'Portrait Series' }
    ];
    
    // Preload first few images for faster initial rendering
    const preloadCount = Math.min(6, images.length);
    for (let i = 0; i < preloadCount; i++) {
        const preloadImg = new Image();
        preloadImg.src = images[i].path;
    }
    
    // Create gallery items with virtualization
    const renderVisibleItems = () => {
        // Clear existing items to avoid duplicates during re-render
        const existingItems = document.querySelectorAll('.gallery-item');
        existingItems.forEach(item => {
            const index = parseInt(item.getAttribute('data-index'));
            if (index >= images.length) {
                item.remove();
            }
        });

        // Determine a subset of images to render
        images.forEach((image, index) => {
            // Check if item already exists
            const existingItem = document.querySelector(`.gallery-item[data-index="${index}"]`);
            if (existingItem) {
                const img = existingItem.querySelector('.gallery-image');
                const spinner = existingItem.querySelector('.spinner');
                
                if (img && !img.dataset.loaded && isInLoadingRange(existingItem, index)) {
                    loadImage(img, spinner, existingItem);
                }
                return;
            }
            
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
    };
    
    // Initialize the gallery
    renderVisibleItems();
    
    // Check if element should load (viewport or priority)
    function isInLoadingRange(el, index) {
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
    
    // Add progressive loading with blur transition
    const applyProgressiveLoading = () => {
        // Image has loaded, fade it in with a nice blur transition
        container.style.setProperty('--loading-progress', '100%');
        
        // First make it visible with blur
        img.style.opacity = '1';
        img.style.filter = 'blur(20px)';
        
        // Then animate to sharp
        setTimeout(() => {
            img.style.transition = 'filter 0.5s ease-out';
            img.style.filter = 'blur(0px)';
            
            setTimeout(() => {
                // Once animation complete, clean up
                spinner.style.opacity = '0';
                container.classList.remove('loading');
                img.dataset.loaded = 'true';
                delete img.dataset.loading;
                spinner.style.display = 'none';
                
                const loadTime = performance.now() - startTime;
                
                // Preload for lightbox if this is a priority image
                const index = parseInt(container.getAttribute('data-index'));
                if (index < 8) {
                    preloadForLightbox(src);
                }
            }, 500);
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
    // Create a more aggressive intersection observer for images
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
        rootMargin: '200px 0px 200px 0px' // Load images further before they come into view
    });
    
    // Add scroll handler for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Clear the timeout if it's been set
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Set a timeout to check for new items to load
        scrollTimeout = setTimeout(function() {
            document.querySelectorAll('.gallery-item').forEach(item => {
                const img = item.querySelector('.gallery-image');
                const spinner = item.querySelector('.spinner');
                const index = parseInt(item.getAttribute('data-index'));
                
                if (img && !img.dataset.loaded && isElementInViewport(item)) {
                    loadImage(img, spinner, item);
                }
            });
        }, 200); // Check every 200ms during scroll
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
    
    // Resize handler
    window.addEventListener('resize', function() {
        // Check for new items to load after resize
        document.querySelectorAll('.gallery-item').forEach(item => {
            const img = item.querySelector('.gallery-image');
            const spinner = item.querySelector('.spinner');
            
            if (img && !img.dataset.loaded && isElementInViewport(item)) {
                loadImage(img, spinner, item);
            }
        });
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