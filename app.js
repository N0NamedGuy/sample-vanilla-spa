(function () {
    'use strict';

    // Here we define the routes the page has.
    // The path property is the path we want to match with
    // The exact property tells us if we want to match EXACLY with the specified path, instead of using startsWith
    // The content property can be an HTML string. We !ASSUME! that it is safe, non-malicious HTML.
    //   If using HTML fetched from the server ENSURE that no user inputs can cause code injections, by escaping
    //   any user input
    // The content property can also be a function. See how it is used in the /dynamic route.
    const routes = [{
        path: '/',
        exact: true,
        title: 'Home',
        content: '<main><h1>Home page</h1>Hello, welcome to my website!</main>',
    }, {
        path: '/contacts',
        title: 'Contacts',
        content:
            '<main><h1>Contacts</h1>You can reach us at <a href="mailto:mail@example.com">mail@example.com</a></main>',
    }, {
        path: '/about',
        title: 'About us',
        content: '<main><h1>About us</h1>This is a sample site showing a sample Single Page Application</main>',
    }, {
        path: '/dynamic',
        title: 'Dynamic page',
        content: () => {
            // Here we mantain our "component" state,
            // that shall disappear when we navigate away to other page
            let count = 0;

            // It is expected to return a function, that should handle
            // its dynamic rendering
            return (el) => {
                // Creating the heading, an increment button, and span to display the current count
                const heading = document.createElement('h1');
                const myBtn = document.createElement('button');
                const countSpan = document.createElement('span');

                heading.innerHTML = 'Dynamic page';

                myBtn.innerText = 'Incrementar';
                countSpan.innerText = count;

                myBtn.addEventListener('click', () => {
                    count = count + 1;
                    // Do not forget to update the text!
                    // We do not have change tracking or reactivity,
                    // so we need to it on our own...
                    countSpan.innerText = count;
                });

                // Append our elements to the target rendering element
                el.appendChild(heading);
                el.appendChild(myBtn);
                el.appendChild(countSpan);
            }
        },
    }];

    // Path-less route to display a not found message.
    // Note that this is NOT a 404...
    const routeNotFound = {
        title: 'Page not found',
        content: '<main><h1>This page does not exist</h1>Please check if the path you are trying to reach is correct</main>'
    };


    document.addEventListener('DOMContentLoaded', () => {
        // Now that the browser loaded everything, LET'S DO STUFF!

        const appElem = document.getElementById('app');
        const menuEl = document.getElementById('menu');

        // In this function, we render the route's content
        // and set the page's title.

        // It is left as an exercice on how to properly notify
        // the current page that it is about to go away (or be unmounted)
        function handlePageRender(route) {

            // Is the route's content a function?
            if (typeof route.content === 'function') {
                // Then render it!

                // But first, clear whatever was in the rendering target (which is our appElem).
                appElem.innerHTML = '';

                // And render it! We do it this way, so the content function can keep its scope,
                // to have a semblance of state...
                route.content()(appElem);
            } else {

                // Just splash the HTML there...
                // Remember, no unmount notification is done...
                // Left as an exercise to the reader
                appElem.innerHTML = route.content;
            }

            // Set the window title if the route has one
            // If the route does not have a title, the document title will be unchanged.
            if (route.title) {
                document.title = route.title;
            }
        }


        // In this function, we handle the routing to a new route, or "page".
        function handleRouteChange() {
            // Find the route that matches the current location
            // In the address bar
            const route = routes.find((r) => {
                // The pathname in the address bar.
                // The pathname property always starts with a /
                const pathname = document.location.pathname;

                // Check if the route requires an exact match
                // Or just a simple a startsWith check
                if (r.exact) {
                    return pathname === r.path;
                } else {
                    return pathname.startsWith(r.path);
                }
            });

            if (route) {
                // We have a route that matches the location pathname! Render it!
                handlePageRender(route);
            } else {
                // We do not have a route, tell the user the sad news...
                handlePageRender(routeNotFound);
            }
        }

        // This function generates the navigation menu
        // based on the existing routes...

        // It is also left as an exercice how to omit some routes
        // from appearing in this menu... Should be trivial to implement :)
        function generateMenu(routes, menuEl) {
            routes.forEach((route) => {
                // Create an <li> tag and an <a> tag that will go inside the <li>
                const wrapperLi = document.createElement('li');
                const anchorEl = document.createElement('a');

                // The links href, which maps to the route's path
                const href = route.path;
                anchorEl.href = href;
                anchorEl.innerText = route.title;

                anchorEl.addEventListener('click', (e) => {
                    // The following line is ABSOLUTELY needed, to prevent the browser
                    // from refreshing the page again... Try commenting this line out
                    // and see what happens...
                    e.preventDefault();

                    // Navigate away!
                    history.pushState(null, null, href);

                    // And render it!
                    handlePageRender(route);
                });

                // Wrap the <a> inside the <li> and add the <li> to the menu
                wrapperLi.appendChild(anchorEl);
                menuEl.appendChild(wrapperLi);
            });
        }

        // Listen when the user navigates back and foward,
        // as well as when history.pushState gets called...
        window.addEventListener('popstate', () => {
            handleRouteChange();
        });

        generateMenu(routes, menuEl);

        // Trigger the initial route change
        handleRouteChange();
    });
})();
