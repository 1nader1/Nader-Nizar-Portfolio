document.addEventListener('DOMContentLoaded', function() {

    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    const moonIcon = darkModeToggle.querySelector('.fa-moon');
    const sunIcon = darkModeToggle.querySelector('.fa-sun');


    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');


    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        enableDarkMode();
    }

    function enableDarkMode() {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }

    function disableDarkMode() {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });


    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate nav items
        navItems.forEach((item, index) => {
            if (navLinks.classList.contains('active')) {
                item.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1 + 0.3}s`;
            } else {
                item.style.animation = '';
            }
        });
    });


    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                navItems.forEach(item => {
                    item.style.animation = '';
                });
            }
        });
    });


    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillBoxes = document.querySelectorAll('.skill-box');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            skillBoxes.forEach(box => box.classList.remove('active'));
            
            document.querySelector(`.skill-box.${tabName}`).classList.add('active');
        });
    });


    const projectTabs = document.querySelectorAll('.project-tab');
    const projectCarousels = document.querySelectorAll('.project-carousel');
    let currentSlideIndexes = {};


    function initCarousels() {
        projectCarousels.forEach(carousel => {
            const carouselType = carousel.classList[1];
            currentSlideIndexes[carouselType] = 0;
            
            const slides = carousel.querySelectorAll('.project-slide');
            slides.forEach((slide, index) => {
                slide.style.display = 'none';
                if (index === 0) {
                    slide.style.display = 'block';
                }
            });
        });
    }


    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            

            projectTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            

            projectCarousels.forEach(carousel => {
                carousel.classList.remove('active');
                if (carousel.classList.contains(targetTab)) {
                    carousel.classList.add('active');
                }
            });
        });
    });


    function setupNavigation() {
        document.querySelectorAll('.project-prev, .project-next').forEach(button => {
            button.addEventListener('click', function() {
                const carousel = this.closest('.project-carousel');
                const carouselType = carousel.classList[1];
                const slides = carousel.querySelectorAll('.project-slide');
                const isNext = this.classList.contains('project-next');
                

                slides[currentSlideIndexes[carouselType]].style.display = 'none';
                

                if (isNext) {
                    currentSlideIndexes[carouselType] = 
                        (currentSlideIndexes[carouselType] + 1) % slides.length;
                } else {
                    currentSlideIndexes[carouselType] = 
                        (currentSlideIndexes[carouselType] - 1 + slides.length) % slides.length;
                }
                

                slides[currentSlideIndexes[carouselType]].style.display = 'block';
            });
        });
    }


    function startAutoRotation() {
        setInterval(() => {
            projectCarousels.forEach(carousel => {
                if (carousel.classList.contains('active')) {
                    const carouselType = carousel.classList[1];
                    const slides = carousel.querySelectorAll('.project-slide');
                    const nextBtn = carousel.querySelector('.project-next');
                    

                    if (nextBtn) {
                        nextBtn.click();
                    }
                }
            });
        }, 10000); 
    }

    initCarousels();
    setupNavigation();
    startAutoRotation();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });


    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink(); 


    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});


const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(e.target.action, {
      method: e.target.method,
      body: new FormData(e.target),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      alert("Message sent successfully!");
      e.target.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    alert("Error sending message. Please try again.");
  }
});


document.addEventListener('DOMContentLoaded', function() {


    const projectTabs = document.querySelectorAll('.project-tab');
    const projectCarousels = document.querySelectorAll('.project-carousel');
    let currentSlideIndexes = {};

    const savedTab = localStorage.getItem('activeProjectTab');
    if (savedTab) {
        projectTabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === savedTab) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        projectCarousels.forEach(carousel => {
            if (carousel.classList.contains(savedTab)) {
                carousel.classList.add('active');
            } else {
                carousel.classList.remove('active');
            }
        });
    } else {
        if (projectTabs.length > 0) projectTabs[0].classList.add('active');
        if (projectCarousels.length > 0) projectCarousels[0].classList.add('active');
    }

    function initCarousels() {
        projectCarousels.forEach(carousel => {
            const carouselType = carousel.classList[1];
            currentSlideIndexes[carouselType] = 0;

            const slides = carousel.querySelectorAll('.project-slide');
            slides.forEach((slide, index) => {
                slide.style.display = 'none';
                if (index === 0) {
                    slide.style.display = 'block';
                }
            });
        });
    }

    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            localStorage.setItem('activeProjectTab', targetTab);

            projectTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            projectCarousels.forEach(carousel => {
                carousel.classList.remove('active');
                if (carousel.classList.contains(targetTab)) {
                    carousel.classList.add('active');
                }
            });
        });
    });

    function setupNavigation() {
        document.querySelectorAll('.project-prev, .project-next').forEach(button => {
            button.addEventListener('click', function() {
                const carousel = this.closest('.project-carousel');
                const carouselType = carousel.classList[1];
                const slides = carousel.querySelectorAll('.project-slide');
                const isNext = this.classList.contains('project-next');

                slides[currentSlideIndexes[carouselType]].style.display = 'none';

                if (isNext) {
                    currentSlideIndexes[carouselType] =
                        (currentSlideIndexes[carouselType] + 1) % slides.length;
                } else {
                    currentSlideIndexes[carouselType] =
                        (currentSlideIndexes[carouselType] - 1 + slides.length) % slides.length;
                }

                slides[currentSlideIndexes[carouselType]].style.display = 'block';
            });
        });
    }

    function startAutoRotation() {
        setInterval(() => {
            projectCarousels.forEach(carousel => {
                if (carousel.classList.contains('active')) {
                    const carouselType = carousel.classList[1];
                    const slides = carousel.querySelectorAll('.project-slide');
                    const nextBtn = carousel.querySelector('.project-next');

                    if (nextBtn) {
                        nextBtn.click();
                    }
                }
            });
        }, 10000);
    }

    initCarousels();
    setupNavigation();
    startAutoRotation();

     function handleNavigation() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth <= 768) {

            hamburger.addEventListener('click', toggleMobileMenu);
        } else if (windowWidth <= 1024) {

            hamburger.removeEventListener('click', toggleMobileMenu);
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        } else {

            hamburger.removeEventListener('click', toggleMobileMenu);
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
    
    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        navItems.forEach((item, index) => {
            if (navLinks.classList.contains('active')) {
                item.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1 + 0.3}s`;
            } else {
                item.style.animation = '';
            }
        });
    }
    
    handleNavigation();
    
    window.addEventListener('resize', handleNavigation);

    

});

document.querySelector('.download-cv').addEventListener('click', function() {
  console.log('CV download clicked');
});


function setupTabletNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 992;
    
    if (isTablet) {

        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        };
        

        hamburger.addEventListener('click', toggleMenu);
        

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
        

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
        

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    } else {

        hamburger.removeEventListener('click', toggleMenu);
    }
}

document.addEventListener('DOMContentLoaded', setupTabletNavigation);
window.addEventListener('resize', setupTabletNavigation);

