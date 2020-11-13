var mbr = mbr || {};

(function () {
  var CONST = {
    DASH: '-',
    SEMICOLON: ';',
    AT: '@',
    EMPTY: '',
    SPACE: ' ',
    COLON: ':',
    COMMA_SPACE: ', ',
    LBRACE: '{',
    RBRACE: '}',
    STYLE: 'style'
  };
  var RE = {
    toCamel: /-([a-z])/g,
    fromCamel: /[A-Z]/g
  };

  function toCamel(full, letter) {
    return letter.toUpperCase();
  }
  function fromCamel(letter) {
    return CONST.DASH + letter.toLowerCase();
  }

  var camel = {
    to: function (string) {
      return string.replace(RE.toCamel, toCamel);
    },
    from: function(string) {
      return string.replace(RE.fromCamel, fromCamel);
    }
  }

  function toStyles(styleObject, parent) {
    var rules = [];
    var children = {};
    var styles = [];
    var key;
    parent = parent || CONST.EMPTY;

    for (key in styleObject) {
      if (styleObject[key] instanceof Object) {
        children[key] = styleObject[key];
      } else {
        if (key[0] === CONST.AT) {
          rules.push(camel.from(key) + CONST.SPACE + styleObject[key] + CONST.SEMICOLON)
        } else {
          rules.push(camel.from(key) + CONST.COLON + styleObject[key] + CONST.SEMICOLON);
        }
      }
    }

    (rules.length && parent) && styles.push({selector: parent, rules: rules});
    for (key in children) {
      if (key[0] === CONST.AT) {
        styles.push({selector: parent + key, group: toStyles(children[key])});
      } else {
        styles = styles.concat(toStyles(children[key], parent + key));
      }
    }

    return styles;
  }

  function renderAllStyles(styles) {
    var string = '';
    for (var i = 0, l = styles.length; i < l; i++) {
      string += styles[i].selector +
        (styles[i].types ? (CONST.SPACE + styles[i].types.join(CONST.COMMA_SPACE)) : CONST.EMPTY) +
        CONST.LBRACE +
        (styles[i].rules ? styles[i].rules.join(CONST.EMPTY) : CONST.EMPTY) +
        (styles[i].group ? renderAllStyles(styles[i].group) : CONST.EMPTY) +
        CONST.RBRACE;
    }
    return string;
  }

  mbr.stylesheet = function (model, parent) {
    this.model = model;
    this.styles = toStyles(model);
    this.element = (parent && parent.documentElement || window.document).createElement(CONST.STYLE);
    this.element.innerHTML = renderAllStyles(this.styles);
    parent && parent.appendChild(this.element);
  }
})()
