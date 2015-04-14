/*
 * spa-application.js
 *
 * The parent SPA (Single Page Application) Application object hosts utility
 * and global functions that can be used by the rest of the app.
 */
var spaApplication = (function(window,document,undefined){

    // if the application singleton is already in the browser, kick it back.
    if(window.spaApplication) return window.spaApplication;

    // these globals simply define some 'state'
    var STATUS_INFO = 'info',
        STATUS_ERROR = 'error';

    /*
     * Constructor function for application objects.
     */
    var ApplicationKlass = function(){

        // a global feedback div for 'nags' on the page
        this.feedbackDiv = document.getElementById("feedback");
    }

    /*
     * displayFeedback
     *
     * Display the given feedback on the page with optional status modifier
     * for coloring/effect.
     *
     * TODO - update the css for 'status'
     */
    ApplicationKlass.prototype.displayFeedback = function(strText, status){
        if(typeof strText !== 'string' || strText.length <= 0) return;
        this.feedbackDiv.innerHTML = strText;
        switch(status){
            case STATUS_ERROR:
                this.feedbackDiv.style.border = "1px solid red";
                break;
            case STATUS_INFO:
                this.feedbackDiv.style.border = "1px solid green";
                break;
            default:
                this.feedbackDiv.style.border = "1px solid blue";
                break;
        }

        this.feedbackDiv.style.display = "block";
    }

    /*
     * displayError
     *
     * Helper for displaying the given error text at the top of the page.
     */
    ApplicationKlass.prototype.displayError = function(strText){
        this.displayFeedback(strText, STATUS_ERROR);
    }

    /*
     * displayInfo
     *
     * Helper for displaying the given informational text at the top of the page.
     */
    ApplicationKlass.prototype.displayInfo = function(strText){
        this.displayFeedback(strText, STATUS_INFO);
    }

    /*
     * clearFeedback
     *
     * Helper that will clear any/all global feedback currently displayed on the page.
     */
    ApplicationKlass.prototype.clearFeedback = function(){
        this.feedbackDiv.innerHTML = '';
        this.feedbackDiv.style.display = "none";
    }

    return new ApplicationKlass();

})(window,document);
