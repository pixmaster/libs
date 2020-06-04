// Based on http://ejohn.org/blog/javascript-micro-templating/
// Free permission to use granted under BSD licence

// name     : string, REQUIRE, DOM element ID with TPL text & tpl name in storage
// url      : string, if need load tpl text from url
// data     : mixed,  default={}, for TPL data
// done     : function, when tpl will inserted
// pos      : string, default=down, top | down, for only tpl_append

(function($) {

  var Cache = {};

  $.fn.tpl_insert = function(param)
   {
    applyTpl(param, this, 'insert');
    return this;
   };

  $.fn.tpl_append = function(param)
   {
    applyTpl(param, this, 'append');
    return this;
   };

  function applyTpl(param, context_element, type)
   {
    tpl_text = '';

    if ('name' in param)
     {
      if (param.name in Cache)
       {
        tpl_text = Cache[param.name];
       }
      else if ('url' in param)
       {
        var ajax_param = {};

        if ('url_param' in param)
         {
          ajax_param.data = param.url_param;
         }

        ajax_param.url       = param.url;
        ajax_param.dataType  = 'html';
        ajax_param.success   = function(data, textStatus, jqXHR)
         {
          Cache[param.name] = data;
          param.url         = null;

          applyTpl(param, context_element, type);
         };

        $.ajax(ajax_param);

        return;
       }
      else
       {
        Cache[param.name] = $('#'+param.name).html();

        tpl_text = Cache[param.name];
       }

      param.data = ('data' in param?param.data:{});

      if (type == 'append')
       {
        if ('pos' in param && param.pos == 'top')
         {
          context_element.append(getGeneratedText(tpl_text, param.data));
         }
        else
         {
          context_element.prepend(getGeneratedText(tpl_text, param.data));
         }
       }
      else
       {
        context_element.html(getGeneratedText(tpl_text, param.data));
       }

      if ('done' in param && typeof(param.done) == 'function')
       {
        param.done(context_element);
       }
     }
   }

  function getGeneratedText(tpl_text, data)
   {
    var fn_text = "var p=[];data=obj;p.push('" +
                    tpl_text.trim()
                    .replace(/[\r\t\n]/g, " ")
                    .replace(/'(?=[^%]*%>)/g,"\t")
                    .split("'").join("\\'")
                    .split("\t").join("'")
                    .replace(/<%=(.+?)%>/g, "',$1,'")
                    .split("<%").join("');")
                    .split("%>").join("p.push('")
                    + "');return p.join('');";

    var fn = new Function('obj', fn_text);
    return fn(data);
   }
})(jQuery);
