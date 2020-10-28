(function($, root) {
  "use strict";
  root.GOVUK = root.GOVUK || {};
  GOVUK.Modules = GOVUK.Modules || {};

  GOVUK.modules = {
    find: function(container) {
      var modules,
          moduleSelector = '[data-module]',
          container = container || $('body');

      modules = container.find(moduleSelector);

      // Container could be a module too
      if (container.is(moduleSelector)) {
        modules = modules.add(container);
      }

      return modules;
    },

    start: function(container) {
      var modules = this.find(container);

      for (var i = 0, l = modules.length; i < l; i++) {
        var module,
            element = $(modules[i]),
            type = camelCaseAndCapitalise(element.data('module')),
            started = element.data('module-started');


        if (typeof GOVUK.Modules[type] === "function" && !started) {
          module = new GOVUK.Modules[type]();
          module.start(element);
          element.data('module-started', true);
        }
      }

      // eg selectable-table to SelectableTable
      function camelCaseAndCapitalise(string) {
        return capitaliseFirstLetter(camelCase(string));
      }

      // http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
      function camelCase(string) {
        return string.replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
      }

      // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
      function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
  }
})(jQuery, window);
(function($, Modules) {
  'use strict';

  Modules.AnchoredHeadings = function() {
    this.start = function($element) {
      var headings = $element.find('h1, h2, h3, h4, h5, h6');
      headings.each(injectAnchor);
    };

    function injectAnchor() {
      var $this = $(this);
      $this.addClass('anchored-heading');
      $this.prepend(
        '<a href="#' + $this.attr('id') + '" class="anchored-heading__icon" aria-hidden="true"></a>'
      );
    };
  };
})(jQuery, window.GOVUK.Modules);
(function($, Modules) {
  'use strict';

  Modules.InPageNavigation = function InPageNavigation() {
    var $tocPane;
    var $contentPane;
    var $tocItems;
    var $targets;

    this.start = function start($element) {
      $tocPane = $element.find('.app-pane__toc');
      $contentPane = $element.find('.app-pane__content');
      $tocItems = $('.js-toc-list').find('a');
      $targets = $contentPane.find('[id]');

      $contentPane.on('scroll', _.debounce(handleScrollEvent, 100, { maxWait: 100 }));

      if (Modernizr.history) {
        // Popstate is triggered when using the back button to navigate 'within'
        // the page, i.e. changing the anchor part of the URL.
        $(window).on('popstate', function (event) {
          restoreScrollPosition(event.originalEvent.state);
        });

        if (history.state && history.state.scrollTop) {
          // Restore existing state when e.g. using the back button to return to
          // this page
          restoreScrollPosition(history.state);
        } else {
          // Store the initial position so that we can restore it even if we
          // never scroll.
          handleInitialLoadEvent();
        }
      }
    };

    function restoreScrollPosition(state) {
      if (state && typeof state.scrollTop !== 'undefined') {
        $contentPane.scrollTop(state.scrollTop);
      }
    }

    function handleInitialLoadEvent() {
      var fragment = fragmentForTargetElement();

      if (!fragment) {
        fragment = fragmentForFirstElementInView();
      }

      handleChangeInActiveItem(fragment);
    }

    function handleScrollEvent() {
      handleChangeInActiveItem(fragmentForFirstElementInView());
    }

    function handleChangeInActiveItem(fragment) {
      storeCurrentPositionInHistoryApi(fragment);
      highlightActiveItemInToc(fragment);
    }

    function storeCurrentPositionInHistoryApi(fragment) {
      if (Modernizr.history && fragment) {
        history.replaceState(
          { scrollTop: $contentPane.scrollTop() },
          "",
          fragment
        );
      }
    }

    function highlightActiveItemInToc(fragment) {
      var $activeTocItem = $tocItems.filter('[href="' + fragment + '"]');

      if ($activeTocItem.get(0)) {
        $tocItems.removeClass('toc-link--in-view');
        $activeTocItem.addClass('toc-link--in-view');
        scrollTocToActiveItem($activeTocItem);
      }
    }

    function scrollTocToActiveItem($activeTocItem) {
      var paneHeight = $tocPane.height();
      var linkTop = $activeTocItem.position().top;
      var linkBottom = linkTop + $activeTocItem.outerHeight();

      var offset = null;

      if (linkTop < 0) {
        offset = linkTop;
      } else if (linkBottom >= paneHeight) {
        offset = -(paneHeight - linkBottom);
      } else {
        return;
      }

      var newScrollTop = $tocPane.scrollTop() + offset;

      $tocPane.scrollTop(newScrollTop);
    }

    function fragmentForTargetElement() {
      return window.location.hash;
    }

    function fragmentForFirstElementInView() {
      var result = null;

      $($targets.get().reverse()).each(function checkIfInView(index) {
        if (result) {
          return;
        }

        var $this = $(this);

        if (Math.floor($this.position().top) <= 0) {
          result = $this;
        }
      });

      return result ? '#' + result.attr('id') : false;
    }
  };
})(jQuery, window.GOVUK.Modules);
(function($, Modules) {
  'use strict';

  Modules.Navigation = function () {
    var $html = $('html');

    var $navToggle;
    var $nav;

    this.start = function ($element) {
      $navToggle = $('.js-nav-toggle', $element);
      $nav = $('.js-nav', $element);

      updateAriaAttributes();

      $navToggle.on('click', toggleNavigation);
      $(window).on('resize', updateAriaAttributes);
    }

    function updateAriaAttributes() {
      var navIsVisible = $nav.is(':visible');

      $navToggle.attr('aria-expanded', navIsVisible ? 'true' : 'false');
      $nav.attr('aria-hidden', navIsVisible ? 'false' : 'true');
    }

    function toggleNavigation() {
      var navIsVisible = !$html.hasClass('nav-open');

      $html.toggleClass('nav-open', navIsVisible);
      updateAriaAttributes();
    }
  };
})(jQuery, window.GOVUK.Modules);
(function($, Modules) {
  'use strict';

  Modules.TableOfContents = function () {
    var $html = $('html');

    var $toc;
    var $tocList;

    var $openLink;
    var $closeLink;

    this.start = function ($element) {
      $toc = $element;
      $tocList = $toc.find('.js-toc-list');

      // Open link is not inside the module
      $openLink = $html.find('.js-toc-show');
      $closeLink = $toc.find('.js-toc-close');

      fixRubberBandingInIOS();
      updateAriaAttributes();

      // Need delegated handler for show link as sticky polyfill recreates element
      $openLink.on('click.toc', preventingScrolling(openNavigation));
      $closeLink.on('click.toc', preventingScrolling(closeNavigation));
      $tocList.on('click.toc', 'a', closeNavigation);

      // Allow aria hidden to be updated when resizing from mobile to desktop or
      // vice versa
      $(window).on('resize.toc', updateAriaAttributes)

      $(document).on('keydown.toc', function (event) {
        var ESC_KEY = 27;

        if (event.keyCode == ESC_KEY) {
          closeNavigation();
        }
      });
    };

    function fixRubberBandingInIOS() {
      // By default when the table of contents is at the top or bottom,
      // scrolling in that direction will scroll the body 'behind' the table of
      // contents. Fix this by preventing ever reaching the top or bottom of the
      // table of contents (by 1 pixel).
      // 
      // http://blog.christoffer.me/six-things-i-learnt-about-ios-safaris-rubber-band-scrolling/
      $toc.on("touchstart.toc", function () {
        var $this = $(this),
          top = $this.scrollTop(),
          totalScroll = $this.prop('scrollHeight'),
          currentScroll = top + $this.prop('offsetHeight');

        if (top === 0) {
          $this.scrollTop(1);
        } else if (currentScroll === totalScroll) {
          $this.scrollTop(top - 1);
        }
      });
    }

    function openNavigation() {
      $html.addClass('toc-open');
      
      toggleBackgroundVisiblity(false);
      updateAriaAttributes();

      focusFirstLinkInToc();
    }

    function closeNavigation() {
      $html.removeClass('toc-open');

      toggleBackgroundVisiblity(true);
      updateAriaAttributes();
    }

    function focusFirstLinkInToc() {
      $('a', $tocList).first().focus();
    }

    function toggleBackgroundVisiblity(visibility) {
      $('.toc-open-disabled').attr('aria-hidden', visibility ? '' : 'true');
    }

    function updateAriaAttributes() {
      var tocIsVisible = $toc.is(':visible');

      $($openLink).add($closeLink)
        .attr('aria-expanded', tocIsVisible ? 'true' : 'false');

      $toc.attr('aria-hidden', tocIsVisible ? 'false' : 'true');
    }

    function preventingScrolling(callback) {
      return function (event) {
        event.preventDefault();
        callback();
      }
    }
  };
})(jQuery, window.GOVUK.Modules);






$(document).ready(function() {
  GOVUK.modules.start();
});
