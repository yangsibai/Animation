;(function () {
    function transitionEndEventName() {
        var i,
            undefined,
            el = document.createElement('div'),
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'otransitionend',  // oTransitionEnd in very old Opera
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

        for (i in transitions) {
            if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
                return transitions[i];
            }
        }

        //TODO: throw 'TransitionEnd event is not supported in this browser';
    }

    function animate(containerEl, oneEl, twoEl, animationName, onEnd) {
        var className = animationName;
        var arr = animationName.split('-');
        if (arr.length > 1) {
            className += " " + arr.join(' ');
        }
        var transitionEnd = transitionEndEventName();
        containerEl.addEventListener(transitionEnd, function () {
            onEnd()
        }, false);
        containerEl.className += " " + className;
        oneEl.className += " one";
        twoEl.className += " two";
    }

    window.animation = {
        animate: animate
    };
}(window));
