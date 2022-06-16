require('gatsby-plugin-breadcrumb/gatsby-plugin-breadcrumb.css');
/** The SideBarBtns class */
class SideBarBtns {

  /** Used to register the scroll event handler */
  Initialize() {
    /** When the user scrolls down 300px from the top of the document, show the buttons */
    window.addEventListener("scroll", this.ToggleButtons)
    /** Event handler for scroll to top button */
    document.getElementById("scroll-btn").addEventListener("click", this.ScrollToTop);
  }

  /** Displays/Hides the buttons */
  ToggleButtons() {
    var scrollBtn = document.getElementById("scroll-btn");
    /** If the current current scroll is 300px or more */
    if (scrollBtn) {
      var hasScrolledDown = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300);
      scrollBtn.style.display = hasScrolledDown ? 'block' : 'none';
    }
  }

  /** When the user clicks on the button, scroll to the top of the document */
  ScrollToTop() {
    /** The user is scrolled to the top of the page */
    document.body.scrollTo({top: 0, behavior: 'smooth'});
    document.documentElement.scrollTo({top: 0, behavior: 'smooth'});
  }
}


exports.onRouteUpdate = () => {
  /** The SideBarBtns object is created */
  let sidebarbtns = new SideBarBtns();
  /** If the current page is an article page */
  if (document.getElementById("scroll-btn")) {
    /** The SideBarBtns object is initialized */
    sidebarbtns.Initialize();
  }
  /* Add smooth scroll to anchors on the page */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}
