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
        //this.transitionEndListener = function () {
        //    this.container.removeEventListener(transitionEndEventName(), this.transitionEndListener);
        //    this.onEnd();
        //}
        this.one.className += ' one';
        this.two.className += ' two';
        this.container.addEventListener(transitionEndEventName(), function () {
            this.isAnimating = false;
            this.onEnd();
        }.bind(this), false);
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
        setTimeout(function () {
            this.onStart();
            this.container.className += ' start';
        }.bind(this), 1);
    };

    Animation.prototype.reset = function () {
        this.container.className = this.originalClassNames.container;
        this.one.className = this.originalClassNames.one;
        this.two.className = this.originalClassNames.two;
    };

    function animate(containerEl, oneEl, twoEl, animationName, onEnd) {
        if (!animationName || animationName === 'none') {
            return onEnd();
        }
        var className = animationName;
        var arr = animationName.split('-');
        if (arr.length > 1) {
            className += " " + arr[0];
        }
        var transitionEnd = transitionEndEventName();
        var containerClassName = containerEl.className;
        var oneClassName = oneEl.className;
        var twoClassName = twoEl.className;
        containerEl.addEventListener(transitionEnd, function () {
            containerEl.className = containerClassName;
            oneEl.className = oneClassName;
            twoEl.className = twoClassName;
            onEnd()
        }, false);
        containerEl.className += " " + className;
        oneEl.className += " one";
        twoEl.className += " two";
    }

    window.Animation = Animation;
}(window));
