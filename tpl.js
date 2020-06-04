function TplClass()
 {

  this.LoadScript = function(script_name,script_url,oInitFunc)
   {
    if (thisClass.isset(script_name))
     {
      if (oInitFunc) oInitFunc();
     }
    else
     {
      oScript = document.createElement("SCRIPT");
      document.body.appendChild(oScript);
      oScript.src = script_url;

      oScript.onload = function()
       {
        __load(script_name,"");

        if (oInitFunc) oInitFunc();
       }

      oScript.onreadystatechange = function()
       {
        if(oScript.readyState=="complete")
         {
          __load(script_name,"");

          if (oInitFunc) oInitFunc();
         }
       }
     }
   }

  this.insertAJAX = function(obj,tpl_name,tpl_url)
   {
    function insert(data)
     {
      thisClass.insert(obj,tpl_name,data);
     }

    function Listener_load(tpl_text)
     {
      __load(tpl_name,tpl_text);

      if (data_flag == 2)
       {
        insert(insert_data);
       }
      else if (data_flag == 3)
       {
        thisClass.timer.insert(obj);
        new AJAX_Request(url_data,"POST",Listener_data,req_data);
       }
      else
       {
        insert({});
       }
     }

    function Listener_data(oResponseVars)
     {
      insert(oResponseVars);

      if (typeof(oInitFunc) == "function") oInitFunc();
     }

    var data_flag = 1; // 3 args, load tpl only
    var oInitFunc = false;

    if (this.insertAJAX.arguments.length == 4) // 4 arg - data object
     {
      data_flag = 2;
      var insert_data = this.insertAJAX.arguments[3];
     }
    else if (this.insertAJAX.arguments.length > 4)   // 4 arg - URL for AJAX request
     {                                                // 5 arg - oReq for AJAX
      data_flag = 3;
      var url_data = this.insertAJAX.arguments[3];
      var req_data = this.insertAJAX.arguments[4];

      if (this.insertAJAX.arguments[5])              //6 arg - function after all request
       {
        oInitFunc = this.insertAJAX.arguments[5];
       }
     }

    if (thisClass.isset(tpl_name))
     {
      Listener_load(Cashe[tpl_name]);
     }
    else
     {
      thisClass.timer.insert(obj);
      new AJAX_Request(tpl_url,"POST",Listener_load,false,false,"text");
     }
   }

  this.load = function(tpl_name,tpl_text)
   {
    __load(tpl_name,tpl_text);
   }

  function __load(tpl_name,tpl_text)
   {
    thisClass[tpl_name] = {};

    thisClass[tpl_name]['append'] = function(obj)
     {
      if (this.append.arguments.length>1)
       {
        thisClass.append(obj,tpl_name,this.append.arguments[1]);
       }
      else
       {
        thisClass.append(obj,tpl_name);
       }
     }

    thisClass[tpl_name]['insert'] = function(obj)
     {
      if (this.insert.arguments.length>1)
       {
        thisClass.insert(obj,tpl_name,this.insert.arguments[1]);
       }
      else
       {
        thisClass.insert(obj,tpl_name);
       }
     }

    Cashe[tpl_name] = tpl_text;
   }

  this.setVars = function(data)
   {
    for(var i in data)
     {
      Data[i] = data[i];
     }
   }

  this.setVar = function(name,value){Data[name] = value;}

  this.appendListData = function(obj, tpl_name, ListData)
   {
    for(var i in ListData)
     {
      this.append(obj, tpl_name, ListData[i]);
     }
   }

  function getFuncText(tpl_name)
   {
    if (Cashe[tpl_name])
     {
      return "var p=[],print=function(){p.push.apply(p,arguments);};" +
                 "with(obj){p.push('" +
                 Cashe[tpl_name].replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');";
     }
    return false;
   }

  this.append = function(obj, tpl_name)
   {
    if (Cashe[tpl_name])
     {
      fn = new Function("obj",getFuncText(tpl_name));

      obj.innerHTML = obj.innerHTML+fn((arguments.length>2 && arguments[2])?arguments[2]:Data);
     }
   }

  this.insert = function(obj, tpl_name)
   {
    if (Cashe[tpl_name])
     {
      fn = new Function("obj",getFuncText(tpl_name));

      obj.innerHTML = fn((arguments.length>2 && arguments[2])?arguments[2]:Data);
     }
   }

  this.isset = function(name)
   {
    return Cashe[name]?true:false;
   }

  this.issetVar = function(name)
   {
    return Data[name]?true:false;
   }

  var Cashe = {};
  var Data  = {};
  var thisClass = this;
  __load("timer","<img src=\"images/timer.gif\">");
 }
