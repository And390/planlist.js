(function(){

    var planlist = this.planlist = {};

    // при загрузке страницы обработка всех элементов с указанными стилями
    planlist.load = function load()
    {
        //    обработать все элементы со стилем make_list
        var elements = document.getElementsByClassName("make_list");
        for (var i=0; i<elements.length; i++)  elements[i].innerHTML = planlist.processText(elements[i].innerHTML, false);

        //    обработать все элементы со стилем make_plan
        var elements = document.getElementsByClassName("make_plan");
        for (var i=0; i<elements.length; i++)  elements[i].innerHTML = planlist.processText(elements[i].innerHTML, true);

        //    добавить стили на страницу
        planlist.addStyles();
    };
    planlist.addStyles = function addStyles()  {
        this.addCSS(
            ".make_plan ul  {  margin: 0;  padding: 0 0 0 16px;  } " +
            ".make_plan .mark  {  list-style: none;  } " +
            ".make_plan .mark:before  {   content: '';  display: inline-block;  width: 16px;  height: 16px;  position: relative; top: 2px;  margin-left: -16px;  background-repeat: no-repeat;  } " +
            ".make_plan .mark.minus:before  {   background-color: #FF9090;  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQffAwQVHAbyh3AuAAAAG0lEQVQoz2NgGBGAkYGB4T8+eSaGUcDAwMAAACo8AQSER9qvAAAAAElFTkSuQmCC');  } " +
            ".make_plan .mark.plus:before  {   background-color: #A0FFC0;  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQffAwQVHA1lVammAAAAJElEQVQoz2NgIBH8Z/iPKsBESMdgUMDIwIDublR5ppERDgQBAKG/BRQm83CfAAAAAElFTkSuQmCC');  } " +
            ".make_plan .mark.inwork:before  {   background-color: #F8F860;  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQffAwQVAS44XrTIAAAA1ElEQVQoz63RsUrDcBDH8U/VoD6BiIhj1RARwdHBoeDo4Cp08VH0BXwJBxVcHMTN0clNQTpJGiNIcBFM0r+DkdJ27U33vd9x/O6OaUbXapOtOR4XE2eCV0tY1jNwamMotzwLgitziNwIgqdhw4mBoLLV8I5aUIj+cN6L4Faqr41YLnUv2P2fsOJcZF0mdehdX9uCu0mrsVyQNfYW7TEz0lCpUSvBt4fxVVOZI7k38eSZDnz5tIlEodAZlbdVfuw31FEqJTDblDItF64b6vnw6HI6H/wFAME+1pz8fiUAAAAASUVORK5CYII=');  } " +
            ".make_plan .mark.question:before  {   background-color: #C0C0C0;  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQffAwQVATtVg1AjAAAAeUlEQVQoz2NgoCPgZGhieMTwk+Eew0wGKWwKVjE8YnBk4GLQYzjJcJGBDV1ajeE/QxCUbc3wn8EeJsECpV8zODMch7K/MzAw/MftFlaGLQy3MK2AAWWGMwznGBRwSYswPGdYhls3A0M2wxcGdooCawrDF3QhJtpHEQA1cBaJ3f93QQAAAABJRU5ErkJggg==');  } " +
            ".make_plan .mark.discard  {  text-decoration: line-through;  color: #808080;  } " +
            ".make_plan .mark.discard:before  {   background-color: #C0C0C0;  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQffAwQVCAbcKad7AAAAyElEQVQoz53RMUoDYRDF8R8YE5TwmU4QK620du+xheANUnoSe7tle4uAwU48w14h2ihfExESUXCsZHdjl5lu3p+Z4T22rsP/o0Ity2qFC0s3XXGgEp1eC3ODFqiERilJrn0LC7vd5aExAefehKVQtEAtlODMq3DvUqhbIAsJp16EuaEk5E3gxLPwYMQmUAtTC+HRHij7JwrhU3iyDyaa/pNH3oUPV5Kk1AhVK481Qu4ZVf2ZtIMvB8YKM0PHVu5M3frp5zDaOtRf/3JQ8/kYFewAAAAASUVORK5CYII=');  } " +
            ""
        );
    };
    window.addEventListener("load", planlist.load, false);

    // обрабатывает указанный элемент
    planlist.process = function process(element, addClasses)
    {
        if (element==undefined)  element = document.body;
        else  element = this.getElement(element);

        element.innerHTML = this.processText(element.innerHTML, addClasses);
    };

    var MARKER_CHARS_STRING = "!\"#$%&\'()*+,-./0123456789:;<=>?@[\\]^_`{|}~";
    var MARKERS = planlist.MARKERS = [];
    for (var i=0; i<255; i++)  MARKERS[i] = undefined;
    for (i=0; i<MARKER_CHARS_STRING.length; i++)  MARKERS[MARKER_CHARS_STRING.charCodeAt(i)] = null;
    MARKERS['-'.charCodeAt(0)] = "minus";
    MARKERS['+'.charCodeAt(0)] = "plus";
    MARKERS['|'.charCodeAt(0)] = "inwork";
    MARKERS['?'.charCodeAt(0)] = "question";
    MARKERS['/'.charCodeAt(0)] = "discard";

    planlist.useBR = true;

    // получает на вход текст (плана в формате утилиты, возможно с вставками html) и выдает html списка
    planlist.processText = function processText(content, addClasses)
    {
        var result = [];
        var spaces = [];  // пробелы для каждого уровня списка
        var noBR = !this.useBR;
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
                        if (result.length)  result.push(listClosed || noBR  ? "\n" : "<br>\n");  //перед самым первым элементом не нужна новая строка, после </ul> не нужен <br>
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
                if (addClasses && marker)  result.push("<li class='mark ", marker, "'>");
                else  result.push("<li>");
                result.push(content.substring(i1, end));
            }
            //    иначе строка текста
            else
            {
                //    закрыть предыдущие списки на нужное количество уровней
                // самый первый список может иметь нулевой отступ и надо отдельно проверить, что при пустой оступе загруваются все списки, включая корневой
                for (listClosed=false; spaces.length && (i1==i0 || i1-i0<spaces[spaces.length-1].length); listClosed=true)  {
                    closeList(listClosed);
                }
                //    добавить строку в result
                if (result.length)  result.push(listClosed || noBR ? "\n" : "<br>\n");  //перед самым первым элементом не нужна новая строка, после </ul> не нужен <br>
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
        else if (!this.isElement(element))  throw "Element or ElementID expected but found: "+element;
        return element;
    };

    // returns true if it is a DOM element (from http://stackoverflow.com/a/384380)
    planlist.isElement = function isElement(o)  {
        return  typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string";
    };

    // like http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
    planlist.addCSS = function addCSS(css)  {
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet)  style.styleSheet.cssText = css;
        else  style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

})();