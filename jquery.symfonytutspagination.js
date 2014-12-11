(function($){
    
    /**
     * The json response should contain the html in the html attribute and the 
     * pagenumber in the pagenumber attribute
     * {
     *  'pagenumber' : 3,
     *  'html' : '<p>asdf</p>'
     * }
     */
    'use strict'; 
    
    $.symfonytutspagination = function(element, options) 
    {
        var plugin = this;

        var defaults =  
        {
            pagination_element_selector : '',//This is div for element that store pagination data and that are clicked
            pagaination_url_attr : '',//This is attribute that stores the url for pagination
            pagination_page_number_attr : '',
            alertmessage : 'There was an error please contact support.'
        };
        
        plugin.currentpage = 0;
        
        //This is the element that pagination replaces everything in.
        var $element = $(element), // reference to the jQuery version of DOM element
        element = element;    // reference to the actual DOM element
        plugin.settings = {};
        
        plugin.init = function()
        {
                plugin.settings = $.extend({}, defaults, options);
                if(
                        plugin.settings.pagination_element_selector === '' ||
                        plugin.settings.pagaination_url_attr === '' ||
                        plugin.settings.alertmessage === '' ||
                        plugin.settings.pagination_page_number_attr === ''
                  )
                {
                    throw "You don't have all of the options populated";
                } 
               
                
                $(document).on("click", plugin.settings.pagination_element_selector, function()
                {
                    changePagination($(this));
                });
                
                
        };
        
        /**
         * This function get the current page number
         * @returns {@this;.currentpage|Number|plugin.currentpage}
         */
        plugin.getPageNumber = function()
        {
            return plugin.currentpage;
        };
        
        /** 
         * This function makes the ajax call to change the page
         * @param {type} paginationelement
         * @returns {unresolved}
         */
        var changePagination = function(paginationelement)
        {
            var ajaxUrl =  paginationelement.attr(plugin.settings.pagaination_url_attr);
            
            //This mean it has no attribute
            if (typeof ajaxUrl ===  'undefined' || ajaxUrl === false) 
            {
                return null;
            }
            
            ajaxCallToChangePage(ajaxUrl);


        };
        
        var ajaxCallToChangePage = function(ajaxUrl)
        {
              $.ajax({
                url: ajaxUrl,
                datatype: 'json',
                success: function(data)
                {
                    if(data.success === true)
                    {
                        plugin.currentpage = data.pagenumber;
                        $element.html(data.html);  
                    }
                    else
                    {
                        alert(plugin.settings.alertmessage);
                    }
                },
                error: function(e)
                {
                    console.log(e);
                    alert(plugin.settings.alertmessage);                    
                }
            });
        };
        
        plugin.changePaginationManually = function(ajaxUrl)
        {
            ajaxCallToChangePage(ajaxUrl);
        };
        
        plugin.init();
        
        
    };
    
    $.fn.symfonytutspagination = function(options)
    {
        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function()
        {
           
            // if plugin has not already been attached to the element
            if (undefined === $(this).data('symfonytutspagination')) 
            {
                                
                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.symfonytutspagination(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('symfonytutspagination', plugin);

            }
        });
        

    };
    
    
}(jQuery));