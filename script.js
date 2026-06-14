document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // 1. DIALOG MODAL TRIGGERS
  // =========================================================================
  const dialogButtons = document.querySelectorAll('[data-dialog-target]');
  
  dialogButtons.forEach(button => {
    button.addEventListener('click', () => {
      const dialogId = button.getAttribute('data-dialog-target');
      const dialog = document.getElementById(dialogId);
      
      if (dialog) {
        dialog.showModal();
        
        // Pause the main Bénévolat video if it's playing
        const mainBenevolatVideo = document.querySelector('.benevolat-video');
        if (mainBenevolatVideo) {
          mainBenevolatVideo.pause();
        }
        
        // Auto-play video inside the opened dialog
        const activeVideo = dialog.querySelector('.video-tab-panel.active video, .dialog-media-container:not(.dual-video-container) video');
        if (activeVideo) {
          activeVideo.play().catch(err => {
            console.log('Autoplay prevented by browser: ', err);
          });
        }
      }
    });
  });

  // Helper to pause and rewind all videos inside a container
  const stopAllVideos = (container) => {
    if (!container) return;
    const videos = container.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
  };

  // Close buttons inside dialogs
  const closeButtons = document.querySelectorAll('.dialog-close-btn');
  closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const dialog = e.target.closest('dialog');
      if (dialog) {
        stopAllVideos(dialog);
        dialog.close();
      }
    });
  });

  // =========================================================================
  // 2. VIDEO CONTROL ON DIALOG STATE CHANGES & ENDED REWIND
  // =========================================================================
  const dialogs = document.querySelectorAll('.project-dialog');
  dialogs.forEach(dialog => {
    dialog.addEventListener('close', () => {
      stopAllVideos(dialog);
    });
  });

  // Attach ended listeners to all videos on the page to prevent looping
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(video => {
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.pause();
    });
  });

  // =========================================================================
  // 3. LIGHT-DISMISS FALLBACK (For Safari & older browsers)
  // =========================================================================
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialogs.forEach(dialog => {
      dialog.addEventListener('click', (event) => {
        // Only trigger if click is directly on the dialog overlay backdrop itself
        if (event.target !== dialog) return;

        // Verify click is outside the content wrapper
        const rect = dialog.getBoundingClientRect();
        const isWithinDialog = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );

        if (!isWithinDialog) {
          stopAllVideos(dialog);
          dialog.close();
        }
      });
    });
  }

  // =========================================================================
  // 4. DUAL-VIDEO TAB SWITCHER (Smart Traffic System)
  // =========================================================================
  const trafficDialog = document.getElementById('dialog-traffic');
  if (trafficDialog) {
    const tabButtons = trafficDialog.querySelectorAll('.video-tab-btn');
    const tabPanels = trafficDialog.querySelectorAll('.video-tab-panel');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-video-index');
        
        // 1. Update buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // 2. Update panels, pause current videos and play the selected one
        tabPanels.forEach((panel, idx) => {
          const video = panel.querySelector('video');
          
          if (idx == index) {
            panel.classList.add('active');
            if (video) {
              video.play().catch(err => console.log('Autoplay error on tab switch:', err));
            }
          } else {
            panel.classList.remove('active');
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          }
        });
      });
    });
  }

  // =========================================================================
  // 5. SCROLL SPY ACTIVE NAVBAR LINK
  // =========================================================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Trigger active change slightly before entering section
      if (window.scrollY >= sectionTop - 150) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === currentSection) {
        link.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 6. THEME TOGGLER (Default: Dark Theme)
  // =========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  // Set initial theme state
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
});
