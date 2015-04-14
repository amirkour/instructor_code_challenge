var SPAViewKlass = (function(window,document,undefined){

    if(window.SPAViewKlass) return window.SPAViewKlass;

    var SPAViewKlass = function(options){
        var self = this;

        // the html that will render for your view - should be a plain-old string of html
        this.html = options.html || '';

        // the dom element on the page that your view will render into
        this.viewAnchor = options.viewAnchor;

        // the ui hash you pass in is expected to be of the form
        // { 'foo': '#selector' }
        //
        // where 'foo' is the name of that element for your view (ie: this.foo),
        // and the selector must be of the form
        // '#some-selector'
        //
        // where 'some-selector' is the id of the element that 'this.foo' should point to.
        // for now, this.ui only supports ID selectors, for simplicity of the demo.
        this.ui = options.ui;

        // pass in any functions to add to your view via the 'functions' option
        // which should be of the form
        // functions: { nameOfFunction: function(){ ... }, ... }
        for(var nextFunction in options.functions) this[nextFunction] = options.functions[nextFunction];

        // pass events you want to have bound after your view is rendered.
        // this is expected to be a list of the form:
        // [
        //    {event: 'name of event', element: 'foo', handler: 'nameOfFunction'},
        //    { ... }, ...
        // ]
        // where 'event' is the name of the event to bind (like 'click' or 'keyup'),
        //       'element' is the name of an element you specify in options.ui, and
        //       'handler' is a function you specify with options.functions
        this.events = options.events || [];

        if(!(this.viewAnchor instanceof HTMLElement)) throw "viewAnchor must be an html element";
    }

    // call this to render your view. for example:
    // var myCoolView = new SPAViewKlass({ ... });
    // myCoolView.render();
    SPAViewKlass.prototype.render = function(){
        this.viewAnchor.innerHTML = this.html;
        this._bindUIElements();
        this._bindEvents();
        if(typeof this.onRenderComplete === 'function') this.onRenderComplete();
    }

    // will be called automatically after your view has been rendered,
    // and will bind all of your 'ui' hash elements to the view.
    // this call MUST come after a call to render, as your view's html
    // will not exist in the DOM until then.
    SPAViewKlass.prototype._bindUIElements = function(){
        if(!this.ui) return;
        for(var strName in this.ui){
            var strSelector = this.ui[strName];
            if(typeof strSelector !== 'string' || strSelector.length <= 0 || strSelector[0] !== '#') throw "UI selectors must be a string of the form #foo";

            // TOOD - querySelectorAll comes w/ a price ...
            this[strName] = this.viewAnchor.querySelectorAll(strSelector)[0];
        }
    }

    // will get called automatically after you render your view, and will bind
    // any events you passed in during construction
    SPAViewKlass.prototype._bindEvents = function(){
        if(!this.events || this.events.length <= 0) return;

        for(var i = 0, iLen = this.events.length; i < iLen; i++){
            var nextEventData = this.events[i];
            this._bind(nextEventData.element, nextEventData.event, nextEventData.handler);
        }
    }

    // capture closure for binding the given element to the given event with the given
    // handler function.
    // this function assumes that the given element and handler are bound to 'this'
    // already
    SPAViewKlass.prototype._bind = function(strElementName, strEventName, strHandlerName){
        var self = this;
        this[strElementName].addEventListener(strEventName, function(){
            self[strHandlerName].apply(self,arguments);
        });
    }

    return SPAViewKlass;
    
})(window,document);