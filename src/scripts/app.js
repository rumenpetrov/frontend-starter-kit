// Uncomment if you need jQuery
// const { $ } = window;
// console.log($.fn.jquery);

const ready = () => {
  console.log('DOM fully loaded and parsed');

  /**
   * Inline external svg sprite to all pages
   *
   * plugin: svg4everybody
   * https://github.com/jonathantneal/svg4everybody
   */
  // eslint-disable-next-line no-undef
  svg4everybody();

  /**
   * All notifications configuration
   *
   * plugin: toastr
   * https://github.com/CodeSeven/toastr
   */
  // eslint-disable-next-line no-undef
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: 'toast-top-full-width',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '10000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };
};

window.addEventListener('DOMContentLoaded', ready);
