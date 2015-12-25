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
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }

    /**
     * add class to an element
     * @param el
     * @param className
     */
    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!hasClass(el, className)) {
            el.className += " " + className;
        }
    }

    /**
     * remove class of an element
     * @param el
     * @param className
     */
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        }
        else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }

    var ANIMATION_START_CLASS_NAME = 'start';
    var TRANSITION_END_NAME = transitionEndEventName();

    function getClassNames(animateName) {
        var classNames = [animateName];
        var prefixClass = animateName.split('-').length > 0 ? animateName.split('-')[0] : '';
        if (prefixClass) {
            classNames.unshift(prefixClass);
        }
        return classNames;
    }

    function Animation(options) {
        this.container = options.container;
        this.onStart = options.onStart;
        this.onEnd = options.onEnd;
        this.addedClassNames = [];
        this.animating = false;
        this.onTransitionEnd = function () {
            this.animating = false;
            this.reset();
            this.onEnd();
        }.bind(this);
    }

    Animation.prototype.animate = function (animateName) {
        if (this.animating) {
            console.log('is animating');
            this.reset(); // if is animating, reset to initial state
        }
        this.onStart();
        this.animating = true;
        this.container.addEventListener(TRANSITION_END_NAME, this.onTransitionEnd);
        this.addedClassNames = getClassNames(animateName);
        for (var i = 0; i < this.addedClassNames.length; i++) {
            addClass(this.container, this.addedClassNames[i]);
        }
        window.requestAnimationFrame(function () {
            addClass(this.container, ANIMATION_START_CLASS_NAME);
        }.bind(this));
    };

    Animation.prototype.reset = function () {
        removeClass(this.container, ANIMATION_START_CLASS_NAME);
        this.container.removeEventListener(TRANSITION_END_NAME, this.onTransitionEnd);
        for (var i = 0; i < this.addedClassNames.length; i++) {
            removeClass(this.container, this.addedClassNames[i]);
        }
        removeClass(this.container, ANIMATION_START_CLASS_NAME);
    };

    if (global.require && global.module.exports) {
        global.module.exports = Animation;
    } else {
        global.Animation = Animation;
    }
}(this));
