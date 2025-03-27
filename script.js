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

// Page loader
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    initGallery();
    
    // Add temporary banner
    const banner = document.createElement('div');
    banner.className = 'temp-banner';
    banner.textContent = 'Main website coming soon. This is a temporary preview.';
    document.body.appendChild(banner);
    
    // Handle loader
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 2500);
    
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
    
    // Create gallery items
    images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-index', index);
        
        const img = document.createElement('img');
        img.src = image.path;
        img.alt = image.caption;
        img.loading = 'lazy'; // Lazy load images
        
        item.appendChild(img);
        gallery.appendChild(item);
        
        // Open lightbox on click
        item.addEventListener('click', function() {
            openLightbox(index);
        });
        
        // Add staggered animation
        setTimeout(() => {
            item.classList.add('visible');
        }, 100 * index);
    });
    
    // Observe gallery items for infinite scroll effect
    observeGalleryItems();
}

// Intersection Observer for scroll animations
function observeGalleryItems() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.gallery-item:not(.visible)').forEach(item => {
        observer.observe(item);
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
    const img = currentItem.querySelector('img');
    
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt;
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