(function(){

    var planlist = this.planlist = {};

    // обрабатывает указанный элемент
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
        //    обработать план
        for (var end=0; end<content.length; end++)  // end++ means skip '\n'
        {
            //    найти конец строки
            var i0 = end;
            end = content.indexOf('\n', end);
            if (end==-1)  end = content.length;
            //    найти пробелы в начале
            var i1 = skipSpaces(content, i0, end);
            //    проверить символ определяющий элемент списка и следующий пробел
            var c = content.charCodeAt(i1);  //может быть NaN или 10 ('\n'), если достингут конец строки
            var marker = MARKERS[c];
            //    если маркер распознан - это новый элемент списка
            if (marker!==undefined && content.charCodeAt(i1+1)<=32)
            {
                var space = content.substring(i0, i1);
                var listClosed = false;
                while (true)
                {
                    if (spaces.length==0 || space.length>spaces[spaces.length-1].length)  {
                        //    элемент нового дочернего или корневого списка
                        if (result.length)  result.push(listClosed ? "\n" : "<br>\n");  //перед самым первым элементом не нужна новая строка, после </ul> не нужен <br>
                        if (spaces.length)  result.push(space);  //перед корневыми <ul> не ставить пробелы
                        result.push("<ul>\n");
                        spaces.push(space);
                        break;
                    }
                    else if (space.length==spaces[spaces.length-1].length)  {
                        //    элемент текущего списка
                        if (listClosed)  result.push("\n", space);
                        result.push("</li>\n");  //закрыть предыдущий элемент списка
                        break;
                    }
                    else  {
                        //    элемент родительского или соседнего списка
                        closeList(listClosed);
                        listClosed = true;
                    }
                }
                //    пропустить пробелы после маркера
                i1 = skipSpaces(content, i1+1, end);
                //    добавить элемент (текущий элемент списка остается открытый)
                result.push(space);
                if (marker)  result.push("<li class='", marker, "'>");
                else  result.push("<li>");
                result.push(content.substring(i1, end));
            }
            //    иначе строка текста
            else
            {
                //    закрыть предыдущие списки на нужное количество уровней
                listClosed = false;
                while (spaces.length && (i1==i0 || i1-i0<spaces[spaces.length-1].length))  {  // самый первый список может иметь нулевой отступ и надо отдельно проверить, что при пустой оступе загруваются все списки, включая корневой
                    closeList(listClosed);
                    listClosed = true;
                }
                //    добавить строку в result
                if (result.length)  result.push(listClosed ? "\n" : "<br>\n");  //перед самым первым элементом не нужна новая строка, после </ul> не нужен <br>
                if (spaces.length)  result.push(spaces[spaces.length-1], "    ");  // + 4 пробела длиной в "<li>"
                result.push(content.substring(i1, end));
            }
        }
        //    закрыть открытые списки
        for (listClosed=false; spaces.length; listClosed=true)  closeList(listClosed);
        //    done
        return result.join('');

        //    вспомогательные функции
        // возвращает индекс первого непробельного символа в string начиная с index и до end (возвращает end, если нету)
        function skipSpaces(string, index, end)  {
            while (index<end && content.charCodeAt(index)<=32)  index++;
            return index;
        }
        // закрывает список
        function closeList(addSpaces)  {
            var ulSpace = spaces.pop();
            if (addSpaces)  result.push("\n", ulSpace);
            result.push("</li>\n");  //закрыть предыдущий элемент списка
            if (spaces.length)  result.push(ulSpace);  //перед корневыми </ul> не ставить пробелы
            result.push("</ul>");    //закрыть предыдущий список
            //if (spaces.length)  result.push(spaces[spaces.length-1]);  //открытый элемент родительского списка
        }
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