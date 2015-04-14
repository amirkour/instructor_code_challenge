/*
 * spa-view.js
 *
 * Defines a generic view that can be used to easily bind UI elements
 * and events in a single-page app.
 */
var SPAViewKlass = (function(window,document,undefined){

    if(window.SPAViewKlass) return window.SPAViewKlass;

    /*
     * Constructor function for generic views.
     */
    var SPAViewKlass = function(options){
        var self = this;

        // the html that will render for your view - should be a plain-old string of html
        this.html = options.html || '';

        // the dom element on the page that your view will render into.
        // this element should already exist on the page when you render your view.
        this.viewAnchor = options.viewAnchor;

        // the 'ui' hash you pass in is expected to be of the form
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

    /*
     * render
     *
     * Call this to render your view.
     *
     * Example:
     * var myView = new SPAViewKlass({ ... });
     * myView.render();
     */
    SPAViewKlass.prototype.render = function(){

        // TODO - cleanup old events here before blowing them out of the DOM
        this.viewAnchor.innerHTML = this.html;
        this._bindUIElements();
        this._bindEvents();
        if(typeof this.onRenderComplete === 'function') this.onRenderComplete();
    }

    /*
     * _bindUIElements
     *
     * Internal helper - will be called automatically after
     * a view instance if rendered, and will bind all elements of the 'ui' hash
     * passed in at initalization to a view instance.
     */
    SPAViewKlass.prototype._bindUIElements = function(){
        if(!this.ui) return;
        for(var strName in this.ui){
            var strSelector = this.ui[strName];
            if(typeof strSelector !== 'string' || strSelector.length <= 0 || strSelector[0] !== '#') throw "UI selectors must be a string of the form #foo";

            // TOOD - querySelectorAll comes w/ a price ...
            this[strName] = this.viewAnchor.querySelectorAll(strSelector)[0];
        }
    }

    /*
     * _bindUIEvents
     *
     * Internal helper - will be called automatically after a view is rendered,
     * and will bind events passed in the 'events' list at initialization time.
     */
    SPAViewKlass.prototype._bindEvents = function(){
        if(!this.events || this.events.length <= 0) return;

        for(var i = 0, iLen = this.events.length; i < iLen; i++){
            var nextEventData = this.events[i];
            this._bind(nextEventData.element, nextEventData.event, nextEventData.handler);
        }
    }

    /*
     * _bind
     *
     * Internal helper - bind the given element to the given event, and invoke the given
     * callback handler.
     */
    SPAViewKlass.prototype._bind = function(strElementName, strEventName, strHandlerName){
        var self = this;
        this[strElementName].addEventListener(strEventName, function(){
            self[strHandlerName].apply(self,arguments);
        });
    }

    return SPAViewKlass;

})(window,document);