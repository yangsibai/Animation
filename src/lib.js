;(function (global) {
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

    /**
     * detect if element has a class
     * @param el
     * @param className
     * @returns {boolean}
     */
    function hasClass(el, className) {
        if (el.classList)
            return el.classList.contains(className)
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }

    /**
     * add class to an element
     * @param el
     * @param className
     */
    function addClass(el, className) {
        if (el.classList)
            el.classList.add(className)
        else if (!hasClass(el, className)) el.className += " " + className
    }

    /**
     * remove class of an element
     * @param el
     * @param className
     */
    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className)
        else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className = el.className.replace(reg, ' ')
        }
    }

    var CONTAINER_CLASS_NAME = 'animation-stage-container';
    var ANIMATION_START_CLASS_NAME = 'animation-start';
    var CARD_ONE_CLASS_NAME = 'animation-card-one';
    var CARD_TWO_CLASS_NAME = 'animation-card-two';
    var TRANSITION_END_NAME = transitionEndEventName();

    /**
     * animate
     * @param options
     */
    function animate(options) {
        var container = options.container;
        var one = options.one;
        var two = options.two;
        var onStart = options.onStart;
        var onEnd = options.onEnd;
        var animateName = options.animate;
        addClass(container, CONTAINER_CLASS_NAME);
        addClass(one, CARD_ONE_CLASS_NAME);
        addClass(two, CARD_TWO_CLASS_NAME);
        var stageAnimationClassName = animateName.split('-').join(' ');
        addClass(container, stageAnimationClassName);

        var onTransitionEnd = function () {
            container.removeEventListener(TRANSITION_END_NAME, onTransitionEnd);
            removeClass(container, CONTAINER_CLASS_NAME);
            removeClass(one, CARD_ONE_CLASS_NAME);
            removeClass(two, CARD_TWO_CLASS_NAME);
            removeClass(container, stageAnimationClassName);
            removeClass(container, ANIMATION_START_CLASS_NAME);
            onEnd();
        };

        container.addEventListener(TRANSITION_END_NAME, onTransitionEnd, false);

        window.requestAnimationFrame(function () {
            onStart();
            addClass(container, ANIMATION_START_CLASS_NAME);
        });
    }

    if (global.require && global.module.exports) {
        global.module.exports.animate = animate;
    } else {
        global.animate = animate;
    }
}(this));
