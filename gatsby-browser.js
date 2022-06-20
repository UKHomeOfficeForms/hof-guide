require('gatsby-plugin-breadcrumb/gatsby-plugin-breadcrumb.css');
/** The ContentScrollButton class */
class ContentScrollButton {

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

class SearchBar {
  constructor(inputElement) {
    this.inputElement = inputElement;
  }

  Initialize(inputElement) {
    this.inputElement.addEventListener('input', this.UpdateInputAriaExpanded);
    this.inputElement.addEventListener('keydown', this.UpdateAriaSelectForSearchResult);
  }

  UpdateInputAriaExpanded(e) {
    setTimeout(() => {
      if (document.getElementById('app-site-search__input__listbox').getElementsByTagName('li').length >= 1) {
        e.target.setAttribute('aria-expanded', 'true');
      } else {
        e.target.setAttribute('aria-expanded', 'false');
      }
    }, 0);
  }

  UpdateAriaSelectForSearchResult(e) {
    setTimeout(() => {
      var $listItems = Array.from(document.getElementById('app-site-search__input__listbox').getElementsByTagName('li'));
      var key = e.keyCode;
      var $selected = $listItems.find(item => item.ariaSelected === 'true');
      var $selectedIndex = $listItems.indexOf($selected);
      var $current;

      // Enter key
      if (key === 13) {
        return $selected.click();
      }

      if (![38, 40].includes(key)) return;

      if ($selected) {
        $selected.setAttribute('aria-selected', 'false');
      }

      if (key === 40) { // Down key
        if (!$selected) {
          $current = $listItems[0];
        } else if ($selectedIndex + 1 < $listItems.length) {
          $current = $listItems[$selectedIndex + 1];
        } else {
          $current = $selected;
        }
      } else if (key === 38) { // Up key
        if ($selectedIndex === 0) {
          $current = null;
        } else if ($selected && $selectedIndex - 1 >= 0) {
          $current = $listItems[$selectedIndex - 1];
        } else {
          $current = $selected;
        }
      }

      if ($current) {
        $current.setAttribute('aria-selected', 'true');
      }
    }, 0);
  }
}


exports.onRouteUpdate = () => {
  /** The ContentScrollButton object is created */
  document.documentElement.classList.remove('no-js');

  const searchbarInputElement = document.getElementById("app-site-search__input");
  const searchBar = new SearchBar(searchbarInputElement);
  const contentScrollButton = new ContentScrollButton();
  /** If the current page is an article page */
  if (document.getElementById("scroll-btn")) {
    /** The ContentScrollButton object is initialized */
    contentScrollButton.Initialize();
  }
  if (searchbarInputElement) {
    searchBar.Initialize();
  }
  /* Update visually hidden classes when JS enabled */
  if (document.getElementById('search-bar-wrapper')) {
    document.getElementById('search-bar-wrapper').classList.remove('govuk-visually-hidden');
  }
  if (document.getElementById('sitemap-header-link')) {
    document.getElementById('sitemap-header-link').classList.add('govuk-visually-hidden');
  }
  if (document.getElementById('sitemap-sidebar-link')) {
    document.getElementById('sitemap-sidebar-link').classList.add('govuk-visually-hidden');
  }
  Array.from(document.querySelectorAll('.gatsby-code-button-container')).map(e => e.classList.remove('govuk-visually-hidden'));
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
