window.LIST_FUNC     = {};
window.RESPONSE_VARS = {};
window.AJAX_SETTING  = {};

window.AJAX_SETTING['ALERT_MESSAGE'] = function(msg)
 {
  alert(msg);
 }

var escape_translate_table = [];
for (var i = 0x410; i <= 0x44F; i++)
  escape_translate_table[i] = i - 0x350; // А-Яа-я
escape_translate_table[0x401] = 0xA8;    // Ё
escape_translate_table[0x451] = 0xB8;    // ё

var escapeOrig = window.escape;

// Переопределяем функцию escape()
window.escape = function(str)
 {
  var ret = [];
  // Составляем массив кодов символов, попутно переводим кириллицу
  for (var i = 0; i < str.length; i++)
   {
    var n = str.charCodeAt(i);
    if (typeof escape_translate_table[n] != 'undefined')
      n = escape_translate_table[n];
    if (n <= 0xFF)
      ret.push(n);
   }

  return escapeOrig(String.fromCharCode.apply(null, ret));
 }

function AJAX_Request(url,method,oFunc)
 {
  function RESPONSE_VARS_listener()
   {
    if (window.RESPONSE_VARS.load_script)
     {
      LoadModule(window.RESPONSE_VARS.load_script,true);
     }

    if (window.RESPONSE_VARS.message)
     {
      window.AJAX_SETTING.ALERT_MESSAGE(window.RESPONSE_VARS.message);
     }

    if (window.RESPONSE_VARS.func)
     {
      func_name = window.RESPONSE_VARS.func;
      oFunc = window.LIST_FUNC[func_name];

      if (typeof(oFunc) == "function")
       {
        oFunc();
       }
     }
   }

  function ParseResponse(text)
   {
    window.RESPONSE_VARS = {};
    returnObj = {};
    listData = text.split("\t");

    for(i=0;i<listData.length;i++)
     {
      var_val = listData[i].split("=");

      if (var_val[0] && var_val[1])
       {
        if (var_val[1].match(/^[\{\[]/))
         {
          tmp_f = new Function("return "+var_val[1]+";");
          returnObj[var_val[0]] = tmp_f();
         }
        else
         {
          returnObj[var_val[0]] = var_val[1];
         }

        window.RESPONSE_VARS[var_val[0]] = returnObj[var_val[0]];
       }
     }

    RESPONSE_VARS_listener();

    return returnObj;
   }

  function EventReply()
   {
    if (req.readyState == 4)
     {
      if (req.status == 200)
       {
        if (sResponseType == "text")
         {
          window.RESPONSE_VARS = {};
          window.RESPONSE_VARS['text'] = req.responseText;
          oFunc(req.responseText);
         }
        else if (sResponseType == "xml")
         {
          window.RESPONSE_VARS['text'] = req.responseText;
          window.RESPONSE_VARS['oXML'] = req.responseXML;
          oFunc(req.responseXML);
         }
        else if (sResponseType == "streem")
         {
          window.RESPONSE_VARS['streem'] = req.responseStream;
          oFunc(req.responseStream);
         }
        else
         {
          oFunc(ParseResponse(req.responseText));
         }
       }
      else alert("Ошибка в ответе сервера:\n" + req.statusText+"\n\nКод:"+req.status);
     }
    else if (req.readyState == 3)
     {
     }
    else if (req.readyState == 2)
     {
     }
    else if (req.readyState == 1)
     {
     }
   }

  function createRequestObject()
   {
    var request = false;

    if(!request)
     {
      try { request = new ActiveXObject('Msxml2.XMLHTTP'); }
      catch (e){}
     }

    if(!request)
     {
      try { request = new ActiveXObject('Microsoft.XMLHTTP'); }
      catch (e){}
     }

    if(!request)
     {
      try { request = new XMLHttpRequest(); }
      catch (e){}
     }

    return request;
   }

  function GetQueryStr(aList)
   {
    aTmp = [];

    for(i in aList)
     {
      aList[i] = aList[i]+"";
      if (!isEmpty(aList[i]))
       {
        aTmp[aTmp.length] = i+"="+escape(aList[i]);
       }
     }

    return aTmp.join("&");
   }

  var req = false;
  var sResponseType = "var"; //text xml streem

  if ((req = createRequestObject()))
   {
    QueryStr = "";

    req.onreadystatechange = EventReply;

    req.open(method, url, true);

    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

    if (AJAX_Request.arguments.length > 3)
     {
      if ((aReqVar = AJAX_Request.arguments[3]))
       {
        QueryStr = GetQueryStr(aReqVar);
       }

      if (AJAX_Request.arguments.length > 4)
       {
        if ((aReqHeader = AJAX_Request.arguments[4]))
         {
          for(i in aReqHeader)
           {
            req.setRequestHeader(i,aReqHeader[i]);
           }
         }
       }

      if (AJAX_Request.arguments.length > 5)
       {
        if (AJAX_Request.arguments[5])
         {
          sResponseType = AJAX_Request.arguments[5];
         }
       }
     }

    req.setRequestHeader('Content-Length',QueryStr.length);
    req.send(QueryStr);
   }
  else
   {
    alert("не создается объект XMLHttpRequest");
   }
 }