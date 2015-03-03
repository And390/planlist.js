(function(){

    var planlist = this.planlist = {};

    planlist.process = function process(element)
    {
        if (element==undefined)  element = document.body;
        else  element = planlist.getElement(element);

        element.innerHTML = planlist.processText(element.innerHTML);
    };

    var MARKER_CHARS_STRING = "!\"#$%&\'()*+,-./0123456789:;<=>?@[\\]^_`{|}~";
    var MARKERS = [];
    for (var i=0; i<255; i++)  MARKERS[i] = undefined;
    for (i=0; i<MARKER_CHARS_STRING.length; i++)  MARKERS[MARKER_CHARS_STRING.charCodeAt(i)] = null;

    // получает на вход текст (плана в формате утилиты, возможно с вставками html) и выдает html списка
    planlist.processText = function processText(content)
    {
        var result = [];
        var spaces = [];  // пробелы для каждого уровня списка
        var i = 0;
        //    обработать план
        while (true)
        {
            //    найти конец строки
            var i0 = i;
            i = content.indexOf('\n', i);
            if (i==-1)  i = content.length;
            //    найти пробелы в начале
            var i1 = i0;
            while (i1<i && content.charCodeAt(i1)<=32)  i1++;
            //    проверить символ определяющий элемент списка и следующий пробел
            var c = content.charCodeAt(i1);  //может быть NaN или 10 ('\n'), если достингут конец строки
            var marker = MARKERS[c];
            //    обработать строку
            if (marker!==undefined && content.charCodeAt(i1+1)<=32)
            {
                //    маркер распознан - это новый элемент списка
                var space = content.substring(i0, i1);
                while (true)
                {
                    if (spaces.length==0 || space.length>spaces[spaces.length-1].length)  {
                        //    элемент нового дочернего или корневого списка
                        spaces.push(space);
                        result.push("<ul>\n");
                        break;
                    }
                    else if (space.length==spaces[spaces.length-1].length)  {
                        //    элемент текущего списка
                        result.push("</li>\n");  //закрыть предыдущий элемент списка
                        break;
                    }
                    else  {
                        //    элемент родительского или соседнего списка
                        spaces.pop();
                        result.push("</li>\n");  //закрыть предыдущий элемент списка
                        if (spaces.length)  result.push(spaces[spaces.length-1]);
                        result.push("</ul>");    //закрыть предыдущий список
                    }
                }
                //    пропустить пробелы после маркера
                for (i1++; i1<i && content.charCodeAt(i1)<=32; i1++)  ;
                //    добавить элемент (текущий элемент списка остается открытый)
                result.push(space);
                if (marker)  result.push("<li class='", marker, "'>");  else  result.push("<li>");
                result.push(content.substring(i1, i));
            }
            //TODO продолжения родительских элементов списка
            else if (spaces.length && (i==i1 && i!=content.length || i1-i0>=spaces[spaces.length-1].length))
            {
                //    для того же элемента списка продолжение на другой строке или пустая строка (!но не последняя, которая используется для полного закрытия списков)
                if (i!=i1)  result.push("<br>");
                result.push("\n");
                result.push(spaces[spaces.length-1]);
                result.push("    ");  //4 пробела длиной в "<li>"
                if (i!=i1)  result.push(content.substring(i1, i));
            }
            else
            {
                //    внесписковый комментарий
                if (spaces.length)  {
                    //    закрыть старые списки
                    result.push("</li>\n");
                    for (var s=spaces.length-2; s>=0; s--)  {
                        result.push(spaces[s]);
                        result.push("</ul></li>\n");
                    }
                    result.push("</ul>\n");
                    spaces = [];
                }
                //    добавить строку в result
                result.push(content.substring(i0, i+1));
            }
            //    next string
            if (i!=content.length)  i++;
            if (i0==i)  break;  //последняя итерация цикла должна быть по пустой строке, чтобы закрыть списки
        }
        //    done
        return result.join('');
    };

    // принимает id элемента или сам элемент и возвращает его
    planlist.getElement = function getElement(element)  {
        if (Object.prototype.toString.call(element).slice(8, -1)=="String")  {
            var elementId=element;  element = document.getElementById(elementId);
            if (element===null)  throw "Element not found: "+elementId;
        }
        else if (!planlist.isElement(element))  throw "Element or ElementID expected but found: "+element;
        return element;
    };

    // returns true if it is a DOM element (from http://stackoverflow.com/a/384380)
    planlist.isElement = function isElement(o)  {
        return  typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string";
    };

})();