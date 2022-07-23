/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
// class Rectangle {
//   constructor(width, height) {
//     this.width = width;
//     this.height = height;
//   }

//   getArea() {
//     return this.width * this.height;
//   }
// }
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}
Rectangle.prototype.getArea = function getArea() {
  return this.width * this.height;
};

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const parsedObj = JSON.parse(json);
  Object.setPrototypeOf(parsedObj, proto);
  return parsedObj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor() {
    this.state = {
      element: '',
      id: '',
      classes: [],
      attributes: [],
      pseudoClasses: [],
      pseudoElement: '',
      lastAddedItemIdx: null,
    };
  }

  // ERR:
  // Selector parts should be arranged in the following order:
  // element, id, class, attribute, pseudo-class, pseudo-element
  // 1        2   3      4          5             6 - Last Added El Order ?

  element(value) {
    const { element, lastAddedItemIdx } = this.state;
    if (element) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (lastAddedItemIdx) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.state.element = value;
    this.state.lastAddedItemIdx = 1;

    return this;
  }

  id(value) {
    const { id, lastAddedItemIdx } = this.state;
    if (id) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (lastAddedItemIdx && lastAddedItemIdx > 2) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.state.id = `#${value}`;
    this.state.lastAddedItemIdx = 2;

    return this;
  }

  class(value) {
    const { lastAddedItemIdx } = this.state;
    if (lastAddedItemIdx && lastAddedItemIdx > 3) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.state.classes.push(`.${value}`);
    this.state.lastAddedItemIdx = 3;

    return this;
  }

  attr(value) {
    const { lastAddedItemIdx } = this.state;
    if (lastAddedItemIdx && lastAddedItemIdx > 4) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.state.attributes.push(`[${value}]`);
    this.state.lastAddedItemIdx = 4;

    return this;
  }

  pseudoClass(value) {
    const { lastAddedItemIdx } = this.state;
    if (lastAddedItemIdx && lastAddedItemIdx > 5) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.state.pseudoClasses.push(`:${value}`);
    this.state.lastAddedItemIdx = 5;

    return this;
  }

  pseudoElement(value) {
    const { pseudoElement } = this.state;
    if (pseudoElement) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.state.pseudoElement = `::${value}`;
    this.state.lastAddedItemIdx = 6;

    return this;
  }

  stringify() {
    const { element, id, pseudoElement } = this.state;
    let { classes, attributes, pseudoClasses } = this.state;
    classes = classes.join('');
    attributes = attributes.join('');
    pseudoClasses = pseudoClasses.join('');

    return `${element}${id}${classes}${attributes}${pseudoClasses}${pseudoElement}`;
  }
}

const cssSelectorBuilder = {

  element(value) {
    const builder = new Builder();
    builder.element(value);
    return builder;
  },

  id(value) {
    const builder = new Builder();
    builder.id(value);
    return builder;
  },

  class(value) {
    const builder = new Builder();
    builder.class(value);
    return builder;
  },

  attr(value) {
    const builder = new Builder();
    builder.attr(value);
    return builder;
  },

  pseudoClass(value) {
    const builder = new Builder();
    builder.pseudoClass(value);
    return builder;
  },

  pseudoElement(value) {
    const builder = new Builder();
    builder.pseudoElement(value);
    return builder;
  },

  combine(selector1, combinator, selector2) {
    return {
      string: `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
      stringify() { return this.string; },
    };
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
