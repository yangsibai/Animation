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

    function Animation(options) {
        this.container = options.container;
        this.one = options.one;
        this.two = options.two;
        this.onStart = options.onStart;
        this.onEnd = options.onEnd;
        this.originalClassNames = {
            container: this.container.className,
            one: this.one.className,
            two: this.two.className
        };
        this.isAnimating = false;
        this.one.className += ' one';
        this.two.className += ' two';
        this.onTransitionEnd = function () {
            this.isAnimating = false;
            this.onEnd();
        }.bind(this);
        this.container.addEventListener(transitionEndEventName(), this.onTransitionEnd, false);
    }

    Animation.prototype.start = function (animationName) {
        if (this.isAnimating) {
            console.warn('is animating');
            return;
        }
        if (!animationName) {
            this.isAnimating = false;
            this.onEnd();
            return;
        }
        var className = animationName;
        var arr = animationName.split('-');
        if (arr.length > 1) {
            className += " " + arr[0];
        }
        this.container.className += ' ' + className;
        this.isAnimating = true;
        window.requestAnimationFrame(function () {
            this.onStart();
            this.container.className += ' start';
        }.bind(this));
    };

    Animation.prototype.reset = function () {
        this.container.className = this.originalClassNames.container;
        this.one.className = this.originalClassNames.one;
        this.two.className = this.originalClassNames.two;
    };

    Animation.prototype.remove = function () {
        this.reset();
        this.container.removeEventListener(transitionEndEventName(), this.onTransitionEnd);
    };

    if (require && module.exports) {
        module.exports = Animation;
    } else {
        window.Animation = Animation;
    }
}(window));
