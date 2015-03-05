planlist.js
===========
Planlist.js is a simple script that allows you to easily make a plan lists in html. Like this:
![Plan](https://cloud.githubusercontent.com/assets/10376308/6495952/7bd321d4-c2df-11e4-8705-bd1e30dbbf14.png)
It displays from this HTML:
```html
<div class="make_plan">
    + think over the idea
    | step 1: client javascript
        + write javascript for html transformation
            + write tests
            + write examples
        | make icons and styles for markers
            + basic simple markers
            - more markers
            - make images better
            ? unicode characters instead of images
        + write readme and put project on GitHub
        - write more documentation
    ? step 2: plan service
</div>
```
To make it work you only need to link `planlist.js`:
```html
<script type="text/javascript" src="locate.js"></script>
```
#### Details
After been linked it processes all elements with `make_plan` style and replaces its content with plan list HTML. Syntax rules:

- first space characters of each line determine a nesting level (
compared to the previous line spaces count)
- list item starts with marker character (it's all ASCII punctuation and number characters, i.e. `!"#$%&'()*+,-./0123456789:;<=>?@[\\]^_``{|}~`) followed by one or more space characters
- neighbor list items groups to the lists and sub lists depending on nesting level (line with the same indentation as a previous is a sibling, line with a greater indentation is a child, otherwise it is a sibling of a parent)
- all other lines is a text lines; depending on its indentation, it can belong to the previous list item (if it has the same or greater indentation) or to the parent list items or it can be out of list text
- line separators are saves (`<br>` tags added to the result markup; this behavior can be disabled if you add `planlist.useBR=false`)
- inner HTML is also possible

Some marker characters add a style that displays the corresponding image:

| char | style |
|---|----------|
| - | absent |
| + | done |
| &#124; | inwork |
| ? | question |
| / | discard |

(this list will be extended in the future)
Planlist.js adds CSS rules for this styles on page load.
If you want a simple list without images you can you other marker chars or use `make_list` style, for example:
```html
<div class='make_list'>
    - item 1
    - item 2
    - item 3
</div>
```
produce:
<ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
</ul>
To directly call processing for some element, use javascript:
```javascript
    planlist.process(element_or_id, true);  //second parameter determines, use image marker styles or not
    // or another variant with more control
    element.innerHTML = planlist.processText(element.innerHTML, true);
```