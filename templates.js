/* =============================================================
   templates.js
   Fetches _navbar.html and _footer.html and injects them into
   every page. Also marks the correct nav link as "active" and
   fills in the current year in the footer.

   HOW IT WORKS
   ------------
   Each HTML page has two placeholder elements:
     <div id="navbar-placeholder"></div>
     <div id="footer-placeholder"></div>

   This script fetches the fragment files, drops the HTML into
   those placeholders, then does two small post-inject tasks:
     1. Finds the nav link whose href matches the current page
        filename and adds the "active" class to it.
     2. Writes the current year into .footer-year.

   NO CHANGES ARE NEEDED IN THIS FILE when you add a new page.
   Just add the new <a> link to _navbar.html and _footer.html.
   ============================================================= */

(function () {

  /* -----------------------------------------------------------
     Inject an HTML fragment into a placeholder element.
     Returns a Promise that resolves when the fetch is complete.
  ----------------------------------------------------------- */
  function loadFragment(placeholderId, fragmentPath) {
    return fetch(fragmentPath)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Could not load ' + fragmentPath + ' (' + response.status + ')');
        }
        return response.text();
      })
      .then(function (html) {
        var placeholder = document.getElementById(placeholderId);
        if (placeholder) {
          placeholder.outerHTML = html;
        }
      })
      .catch(function (err) {
        console.error('[templates.js]', err);
      });
  }

  /* -----------------------------------------------------------
     After the navbar is injected, find the link that matches
     the current page and mark it active.
  ----------------------------------------------------------- */
  function setActiveNavLink() {
    // Get just the filename, e.g. "about.html" or "index.html"
    var path = window.location.pathname;
    var currentFile = path.substring(path.lastIndexOf('/') + 1);

    // Treat an empty filename (e.g. serving from root "/") as index.html
    if (currentFile === '' || currentFile === '/') {
      currentFile = 'index.html';
    }

    // Also treat article pages as belonging to the News section
    // so the "News" link stays highlighted when reading an article.
    // Add any other prefixes here if you create new article sections.
    var newsPattern = /^article-/;

    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(function (link) {
      var linkFile = link.getAttribute('href');
      var isMatch = (linkFile === currentFile) ||
                    (newsPattern.test(currentFile) && linkFile === 'news.html');
      link.classList.toggle('active', isMatch);
    });
  }

  /* -----------------------------------------------------------
     After the footer is injected, write the current year.
  ----------------------------------------------------------- */
  function setFooterYear() {
    var yearSpans = document.querySelectorAll('.footer-year');
    yearSpans.forEach(function (span) {
      span.textContent = new Date().getFullYear();
    });
  }

  /* -----------------------------------------------------------
     Run everything once the DOM is ready.
  ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    // Load navbar, then set the active link once it is in the DOM
    loadFragment('navbar-placeholder', '_navbar.html')
      .then(setActiveNavLink);

    // Load footer, then set the year once it is in the DOM
    loadFragment('footer-placeholder', '_footer.html')
      .then(setFooterYear);
  });

}());