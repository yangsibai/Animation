;(function (global) {
    'use strict';
    var AnimationConfig = {
        'slide-left': {
            pre: {two: {'z-index': 2, x: '100%'}},
            trans: {two: {x: 0}}
        },
        'slide-right': {
            pre: {two: {'z-index': 2, x: '-100%'}},
            trans: {two: {x: 0}}
        },
        'slide-up': {
            pre: {two: {'z-index': 2, y: '100%'}},
            trans: {two: {y: 0}}
        },
        'slide-down': {
            pre: {two: {'z-index': 2, y: '-100%'}},
            trans: {two: {y: 0}}
        },
        'push-left': {
            pre: {two: {x: '100%'}},
            trans: {stage: {x: '-100%'}}
        },
        'push-right': {
            pre: {two: {x: '-100%'}},
            trans: {stage: {x: '100%'}}
        },
        'push-up': {
            pre: {two: {y: '100%'}},
            trans: {stage: {y: '-100%'}}
        },
        'push-down': {
            pre: {two: {y: '-100%'}},
            trans: {stage: {y: '100%'}}
        },
        'flip-left': {
            pre: {
                stage: {'transform-style': 'preserve-3d'},
                one: {'backface-visibility': 'hidden'},
                two: {'backface-visibility': 'hidden', rotateY: '180deg'}
            },
            trans: {
                perspective: 800,
                stage: {rotateY: '-180deg'}
            }
        },
        'flip-right': {
            pre: {
                stage: {'transform-style': 'preserve-3d'},
                one: {'backface-visibility': 'hidden'},
                two: {'backface-visibility': 'hidden', rotateY: '180deg'}
            },
            trans: {
                stage: {'perspective': 800, rotateY: '180deg'}
            }
        },
        'flip-up': {
            pre: {
                stage: {'transform-style': 'preserve-3d'},
                one: {'backface-visibility': 'hidden'},
                two: {'backface-visibility': 'hidden', rotateX: '180deg'}
            },
            trans: {
                stage: {'perspective': 800, rotateX: '180deg'}
            }
        },
        'flip-down': {
            pre: {
                stage: {'transform-style': 'preserve-3d'},
                one: {'backface-visibility': 'hidden'},
                two: {'backface-visibility': 'hidden', rotateX: '180deg'}
            },
            trans: {
                stage: {'perspective': 800, rotateX: '-180deg'}
            }
        },
        'zoom-out': {
            pre: {two: {opacity: 0}},
            trans: {
                one: {width: 0, height: 0, opacity: 0, left: '50%', top: '50%'},
                two: {opacity: 1}
            }
        },
        'zoom-in': {
            pre: {
                two: {width: 0, height: 0, left: '50%', top: '50%'}
            },
            trans: {
                one: {duration: 500, opacity: 0},
                two: {width: '100%', height: '100%', left: 0, top: 0}
            }
        },
        'fade': {
            pre: {
                one: {opacity: 1},
                two: {opacity: 0}
            },
            trans: {
                one: {opacity: 0},
                two: {opacity: 1}
            }
        },
        'none': {
            pre: {two: {opacity: 0.8, 'z-index': 2}},
            trans: {two: {opacity: 1}}
        }
    };

    function Animation(options) {
        this.container = options.container;
        this.onStart = options.onStart;
        this.onEnd = options.onEnd;
        this.animating = false;

        this.cachedStyle = {};
        var $container = $(this.container);
        this.$stage = $container.find('.stage');
        this.$one = $container.find('.one');
        this.$two = $container.find('.two');
    }

    Animation.prototype.animate = function (animateName, durationMs) {
        if (this.animating) {
            return;
        }
        var $stage, $one, $two,
            config, preSettings, trans,
            createOnComplete, self, calledTimes,
            duration, timing;

        $stage = this.$stage;
        $one = this.$one;
        $two = this.$two;

        config = AnimationConfig[animateName];

        duration = durationMs || 500;
        timing = 'ease';

        this.cachedStyle = {
            stage: $stage.attr('style') || '',
            one: $one.attr('style') || '',
            two: $two.attr('style') || ''
        };

        self = this;
        calledTimes = 0;
        createOnComplete = function () {
            calledTimes++;
            return function () {
                calledTimes--;
                if (calledTimes === 0) {
                    self.reset();
                    self.onEnd();
                }
            }
        };

        if (config) {
            this.onStart();
            this.animating = true;
            preSettings = config.pre;
            trans = config.trans;
            if (preSettings) {
                preSettings.stage && $stage.css(preSettings.stage);
                preSettings.one && $one.css(preSettings.one);
                preSettings.two && $two.css(preSettings.two);
            }
            trans.stage && $stage.transition(trans.stage, duration, timing, createOnComplete());
            trans.one && $one.transition(trans.one, duration, timing, createOnComplete());
            trans.two && $two.transition(trans.two, duration, timing, createOnComplete());
        }
    };

    Animation.prototype.reset = function () {
        this.animating = false;
        var $stage, $one, $two, styleCached;

        styleCached = this.cachedStyle;

        $stage = this.$stage;
        $one = this.$one;
        $two = this.$two;

        // there is a bug in transit, must reset these properties, should make an issue
        var resetCssProperties = {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0
        };
        $one.css(resetCssProperties);
        $two.css(resetCssProperties);
        $stage.css(resetCssProperties);

        styleCached.stage ? $stage.attr('style', styleCached.stage) : $stage.removeAttr('style');
        styleCached.one ? $one.attr('style', styleCached.one) : $one.removeAttr('style');
        styleCached.two ? $two.attr('style', styleCached.two) : $two.removeAttr('style');
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Animation;
    } else {
        global.Animation = Animation;
    }
}(this));
