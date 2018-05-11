
; (function () {

    /*!
    * Initializes the enhanced user experience in clients that "cut the mustard".
    *
    * The enhanced user experience is enabled in browsers that support the HTML5
    * APIs document.addEventListener and document.querySelector. Compatible
    * browsers are IE 9+, IE Mobile 9+, Opera 10+, Firefox 3.5+, Safari 3.2+ for
    * Mac OS X and iOS, Android 2.1+, and Chrome 1+.
    *
    * This script must be included in the document's <head> section. Do not
    * defer loading or attempt to load it asynchronously. If you do, there will
    * be a delay in the loading of the enhanced user experience and users will
    * experience a flash of the baseline experience.
    *
    * Copyright (c) 2018 Kieran Potts
    * MIT License
    */

    if (!init) return

    if (!('addEventListener' in document && 'querySelector' in document)) {
        return
    }

    // Load CSS for the enhanced experience immediately. Dynamically-loaded
    // style sheets appear to be fetched asynchronously in Firefox, so you
    // may see occasional flashes of the baseline design in that browser.

    var link, media
    for (media in init.stylesheets.sync) {
        init.stylesheets.sync[media].forEach(function (href) {
            link = document.createElement('link')
            link.rel = 'stylesheet'
            link.media = media
            link.href = href
            document.head.appendChild(link)
        })
    }

    // Load print stylesheets asynchronously, ensuring they are fetched
    // without blocking rendering. This is achieved by temporarily setting
    // the link's media property to a non-applicable media query ('only x'),
    // then toggling it back after the request goes out. To prevent blocking
    // in IE11 we also need to wait until the document body is defined. This
    // technique is taken from loadCSS (github.com/filamentgroup/loadCSS/)
    // and is copyright 2015 Scott Jehl, Filament Group, Inc (MIT license).

    var ready = function (fn) {
        if (document.body) {
            fn()
        } else {
            setTimeout(function () {
                ready(fn)
            }, 50)
        }
    }

    for (var media in init.stylesheets.async) {
        init.stylesheets.async[media].forEach(function (href) {
            var link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = href
            link.media = 'only x'
            link.addEventListener('load', function () {
                link.media = media
            })
            ready(function () {
                document.head.appendChild(link)
            })
        })
    }

    // Loading of JavaScript is deferred to prevent blocking requests and to
    // allow progressive rendering. Scripts that are dynamically injected
    // into a document are loaded asynchronously by default. This can be a
    // problem if the execution order (which cannot be controlled with
    // asynchronous requests) is important for dependency management. So
    // async is explicitly set to false...

    // ... Unfortunately, IE9 (still one of our target browsers) does not
    // support the async property. But IE9 does start to fetch external
    // scripts as soon as we declare their source (src), even before the
    // <script> tags themselves are injected into the document. And IE has
    // an onreadystatechange function and readyState property that we can
    // use to check the status of requests for external data. We can use
    // these proprietary features to implement a workaround that ensures
    // that dynamically-loaded scripts are executed in IE9 in the order that
    // we specify.

    var pendingIE9 = []
    var stateChangeIE9 = function () {
        var next
        while (pendingIE9[0] && pendingIE9[0].readyState === 'loaded') {
            next = pendingIE9.shift()
            next.onreadystatechange = null
            document.head.appendChild(next)
        }
    }

    init.scripts.forEach(function (src) {
        var script = document.createElement('script')
        if ('async' in script) { // Not IE9
            script.src = src
            script.async = false
            script.defer = true
            document.head.appendChild(script)
        } else if (script.readyState) { // IE9
            pendingIE9.push(script)
            script.onreadystatechange = stateChangeIE9
            script.src = src
        }
    })

}());
