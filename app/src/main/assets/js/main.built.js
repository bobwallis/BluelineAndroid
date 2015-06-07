;(function() {
var jquery, PlaceNotation, Canvas, LocalStorage, MeasureCanvasText, Method, GridOptions, MeasureCanvasTextOffset, Grid, main;
jquery = function () {
  var $ = {
    extend: function () {
      var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, toString = Object.prototype.toString, hasOwn = Object.prototype.hasOwnProperty, push = Array.prototype.push, slice = Array.prototype.slice, trim = String.prototype.trim, indexOf = Array.prototype.indexOf, class2type = {
          '[object Boolean]': 'boolean',
          '[object Number]': 'number',
          '[object String]': 'string',
          '[object Function]': 'function',
          '[object Array]': 'array',
          '[object Date]': 'date',
          '[object RegExp]': 'regexp',
          '[object Object]': 'object'
        }, jQuery = {
          isFunction: function (obj) {
            return jQuery.type(obj) === 'function';
          },
          isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === 'array';
          },
          isWindow: function (obj) {
            return obj !== null && obj == obj.window;
          },
          isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
          },
          type: function (obj) {
            return obj === null ? String(obj) : class2type[toString.call(obj)] || 'object';
          },
          isPlainObject: function (obj) {
            if (!obj || jQuery.type(obj) !== 'object' || obj.nodeType) {
              return false;
            }
            try {
              if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
              }
            } catch (e) {
              return false;
            }
            var key;
            for (key in obj) {
            }
            return key === undefined || hasOwn.call(obj, key);
          }
        };
      if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (typeof target !== 'object' && !jQuery.isFunction(target)) {
        target = {};
      }
      if (length === i) {
        target = this;
        --i;
      }
      for (i; i < length; i++) {
        if ((options = arguments[i]) !== null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue;
            }
            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : [];
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              // WARNING: RECURSION
              target[name] = $.extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    }
  };
  return $;
}();
PlaceNotation = {
  bellToCharMap: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    'E',
    'T',
    'A',
    'B',
    'C',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L'
  ],
  bellToChar: function (bell) {
    return this.bellToCharMap[parseInt(bell, 10)];
  },
  charToBell: function (ch) {
    var bell = parseInt(ch, 10);
    if (isNaN(bell) || bell === 0) {
      switch (ch) {
      case '0':
        return 9;
      case 'E':
        return 10;
      case 'T':
        return 11;
      case 'A':
        return 12;
      case 'B':
        return 13;
      case 'C':
        return 14;
      case 'D':
        return 15;
      case 'F':
        return 16;
      case 'G':
        return 17;
      case 'H':
        return 18;
      case 'J':
        return 19;
      case 'K':
        return 20;
      case 'L':
        return 21;
      default:
        return null;
      }
    }
    return --bell;
  },
  parse: function (notation, stage) {
    var parsed = [], exploded = this.explode(notation), xPermutation = new Array(stage);
    // Construct the X permutation for stage
    for (var i = 0; i < stage; i += 2) {
      xPermutation[i] = i + 1;
      xPermutation[i + 1] = i;
    }
    if (i - 1 === stage) {
      xPermutation[i - 1] = i - 1;
    }
    // Then parse section by section
    for (i = 0; i < exploded.length; i++) {
      // For an x, push our pregenerated x permutation
      if (exploded[i] === 'x') {
        parsed.push(xPermutation);
      }  // Otherwise calculate the permutation
      else {
        var stationary = exploded[i].split('').map(this.charToBell), permutation = new Array(stage), j;
        // First put in any stationary bells
        for (j = 0; j < stationary.length; j++) {
          permutation[stationary[j]] = stationary[j];
        }
        // Then 'x' what's left
        for (j = 0; j < stage; j++) {
          if (typeof permutation[j] === 'undefined') {
            if (typeof permutation[j + 1] === 'undefined' && j + 1 < stage) {
              permutation[j] = j + 1;
              permutation[j + 1] = j;
              j++;
            } else {
              permutation[j] = j;
            }
          }
        }
        parsed.push(permutation);
      }
    }
    return parsed;
  },
  implode: function (notationArray) {
    return typeof notationArray.join === 'function' ? notationArray.join('.').replace(/\.?x\.?/g, 'x') : notationArray;
  },
  explode: function (notation) {
    return typeof notation === 'string' ? notation.replace(/x/gi, '.x.').split('.').filter(function (e) {
      return e !== '';
    }) : notation;
  },
  rounds: function (stage) {
    var row = new Array(stage), i = stage;
    while (i--) {
      row[i] = i;
    }
    return row;
  },
  rowsEqual: function (row1, row2) {
    var i = row1.length;
    if (i !== row2.length) {
      return false;
    }
    while (i--) {
      if (row1[i] !== row2[i]) {
        return false;
      }
    }
    return true;
  },
  allRows: function (notation, startRow) {
    var rows = [startRow], i = 0, iLim = notation.length;
    while (i < iLim) {
      rows.push(this.apply(notation[i], rows[i]));
      ++i;
    }
    return rows;
  },
  apply: function (permutation, row) {
    var permuted;
    if (typeof permutation[0].forEach === 'function') {
      permuted = row;
      permutation.forEach(function (p) {
        permuted = this.apply(p, permuted);
      }, this);
      return permuted;
    }
    var i = permutation.length, j = row.length;
    permuted = new Array(j);
    while (j-- > i) {
      permuted[j] = row[j];
    }
    do {
      permuted[j] = row[permutation[j]];
    } while (j--);
    return permuted;
  },
  cycles: function (permutation) {
    var cycles = [], i = permutation.length, rounds = this.rounds(i), cycle, calcRow;
    while (i--) {
      if (rounds[i] === -1) {
        continue;
      }
      cycle = [rounds[i]];
      for (calcRow = permutation; calcRow[i] !== rounds[i]; calcRow = this.apply(permutation, calcRow)) {
        cycle.push(calcRow[i]);
        rounds[calcRow[i]] = -1;
      }
      rounds[i] = -1;
      cycles.push(cycle);
    }
    return cycles;
  },
  huntBells: function (notation, stage) {
    var start = this.rounds(stage), end = this.apply(notation, start), hunts = [];
    for (var i = 0; i < stage; ++i) {
      if (start[i] === end[i]) {
        hunts.push(i);
      }
    }
    return hunts;
  }
};
Canvas = function () {
  var Canvas = function (options) {
    // Create canvas element
    var queryString = location.href.replace(/^.*?(\?|$)/, ''), pixelRatio = typeof options.scale === 'number' ? options.scale : queryString.indexOf('scale=') !== -1 ? parseInt(queryString.replace(/^.*scale=(.*?)(&.*$|$)/, '$1')) : typeof window.devicePixelRatio === 'number' ? window.devicePixelRatio : 1, canvas = document.createElement('canvas');
    canvas.setAttribute('id', options.id);
    canvas.setAttribute('width', options.width * pixelRatio);
    canvas.setAttribute('height', options.height * pixelRatio);
    canvas.style.width = options.width + 'px';
    canvas.style.height = options.height + 'px';
    // Move variables onto object
    this.element = canvas;
    this.context = canvas.getContext('2d');
    this.scale = pixelRatio;
    // Scale for high pixel ratios
    if (pixelRatio !== 1) {
      this.context.scale(pixelRatio, pixelRatio);
    }
    // Add placeholder functions for browsers that lack support
    if (!this.context.setLineDash) {
      this.context.setLineDash = function () {
      };
    }
    if (!this.context.fillText) {
      this.context.fillText = function () {
      };
    }
    return this;
  };
  Canvas.prototype = { type: 'canvas' };
  return Canvas;
}();
LocalStorage = function () {
  var prefix = 'blueline_', dataAge = document.getElementsByTagName('html')[0].getAttribute('data-age'), LocalStorage = { age: dataAge == 'dev' ? 'dev' : parseInt(dataAge) };
  LocalStorage.getItem = function (key) {
    return JSON.parse(localStorage.getItem(prefix + key));
  };
  LocalStorage.setItem = function (key, value) {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  };
  LocalStorage.removeItem = function (key) {
    localStorage.removeItem(prefix + key);
  };
  LocalStorage.clear = function () {
    localStorage.clear();
  };
  // Clear out the cache if the app's age has changed
  var cacheAge = LocalStorage.getItem('cacheAge');
  if (cacheAge == null) {
    cacheAge = 0;
  }
  if (LocalStorage.age === 'dev' || cacheAge < LocalStorage.age) {
    LocalStorage.clear();
  }
  LocalStorage.setItem('cacheAge', LocalStorage.age);
  return LocalStorage;
}();
MeasureCanvasText = function (Canvas, LocalStorage) {
  var measureText = function (text, font) {
    var width = LocalStorage.getItem('Width.' + font + text);
    if (width === null) {
      var canvas = new Canvas({
        id: 'metric',
        width: 50,
        height: 200,
        scale: 1
      });
      canvas.context.font = font;
      width = canvas.context.measureText(text).width;
      LocalStorage.setItem('Width.' + font + text, width);
    }
    return width;
  };
  return measureText;
}(Canvas, LocalStorage);
Method = function ($, PlaceNotation, MeasureCanvasText) {
  // Helps generate options for Grid.js to display full plain courses and calls for a particular method
  var Method = function (options) {
    var i, j, k, l;
    // Calculate various attributes of the method
    this.stage = parseInt(options.stage, 10);
    var rounds = PlaceNotation.rounds(this.stage);
    this.notation = {
      text: options.notation,
      exploded: PlaceNotation.explode(options.notation),
      parsed: PlaceNotation.parse(options.notation, this.stage)
    };
    this.ruleOffs = typeof options.ruleOffs == 'object' ? options.ruleOffs : {
      from: 0,
      every: this.notation.exploded.length
    };
    this.callingPositions = typeof options.callingPositions === 'object' ? options.callingPositions : false;
    this.huntBells = PlaceNotation.huntBells(this.notation.parsed, this.stage);
    this.leadHead = PlaceNotation.apply(this.notation.parsed, rounds);
    this.leadHeads = [
      rounds,
      this.leadHead
    ];
    for (i = 1; !PlaceNotation.rowsEqual(this.leadHeads[i], rounds); ++i) {
      this.leadHeads.push(PlaceNotation.apply(this.leadHead, this.leadHeads[i]));
    }
    this.leadHeads.pop();
    this.numberOfLeads = this.leadHeads.length;
    this.workGroups = PlaceNotation.cycles(this.leadHead);
    // For the plain course image, we'll draw a line through the heaviest working bell of each type and the hunt bells
    var toFollow = this.workGroups.map(function (g) {
        return Math.max.apply(Math, g);
      }), placeStarts = toFollow.filter(function (b) {
        return this.huntBells.indexOf(b) === -1;
      }, this);
    // Calculate some sizing to help with creating default grid options objects
    var fontSize = typeof options.fontSize == 'number' ? options.fontSize : 14, font = fontSize + 'px ' + (navigator.userAgent.toLowerCase().indexOf('android') > -1 ? '' : 'Blueline, "Andale Mono", Consolas, ') + 'monospace', columnPadding = fontSize, rowHeight = Math.floor(fontSize * 1.1), rowWidth = Math.floor(1.1 * MeasureCanvasText(Array(this.stage + 1).join('0'), font));
    // Default line colors and widths
    var workingBellColor = [
        '#11D',
        '#1D1',
        '#D1D',
        '#DD1',
        '#1DD',
        '#306754',
        '#AF7817',
        '#F75D59',
        '#736AFF'
      ], huntBellColor = '#D11', workingBellWidth = fontSize / 6, huntBellWidth = workingBellWidth * 0.6;
    // Set up options objects
    this.gridOptions = {
      plainCourse: {},
      calls: {}
    };
    // Plain course
    var sharedPlainCourseGridOptions = {
      id: 'plainCourse_' + options.id,
      notation: $.extend(true, {}, this.notation),
      stage: this.stage,
      ruleOffs: $.extend({}, this.ruleOffs),
      callingPositions: this.callingPositions === false ? false : $.extend({ show: true }, this.callingPositions),
      dimensions: {
        row: {
          height: rowHeight,
          width: rowWidth,
          columnPadding: columnPadding
        }
      },
      layout: {
        numberOfLeads: this.numberOfLeads,
        numberOfColumns: this.numberOfLeads
      },
      lines: {
        show: true,
        bells: []
      },
      placeStarts: {
        show: true,
        bells: placeStarts
      }
    };
    // Calls
    var sharedCallsGridOptions = [];
    if (typeof options.calls === 'object') {
      for (var callTitle in options.calls) {
        if (Object.prototype.hasOwnProperty.call(options.calls, callTitle)) {
          var call = options.calls[callTitle];
          // If call.from is negative, add to it so we use the second calling position (this stops us from having to mess around with adding notation to the start (Erin))
          if (call.from < 0) {
            call.from += call.every;
          }
          // Create a block of notation big enough to play with
          var notationExploded = PlaceNotation.explode(options.notation), callNotationExploded = PlaceNotation.explode(call.notation);
          while (notationExploded.length < 2 * call.every + call.from) {
            notationExploded = notationExploded.concat(notationExploded);
          }
          // Insert the call's notation
          for (i = 0; i < callNotationExploded.length; ++i) {
            notationExploded[i + call.from + call.every - 1] = callNotationExploded[i];
          }
          // Calculte a good amount of padding to display on either side of the call's notation
          var padding = Math.max(2, Math.floor((this.notation.exploded.length - 7) / 4)), start = Math.max(0, call.from + call.every - 1 - padding), end = Math.min(notationExploded.length, call.from + call.every + callNotationExploded.length - 1 + padding);
          // Parse notation
          var notationParsed = PlaceNotation.parse(PlaceNotation.implode(notationExploded), this.stage);
          // Slice out the notation we want
          call.notation = {
            text: PlaceNotation.implode(notationExploded.slice(start, end)),
            exploded: notationExploded.slice(start, end),
            parsed: notationParsed.slice(start, end)
          };
          // Calculate what the start row of the part we chopped out is (used to match up colours with the plain lead, and to display meaningful numbers relative to the plain course)
          call.startRow = start === 0 ? PlaceNotation.rounds(this.stage) : PlaceNotation.apply(notationParsed.slice(0, start), PlaceNotation.rounds(this.stage));
          // Adjust rule offs to compensate for the fact we just sliced off some of the start of the method
          call.ruleOffs = $.extend({}, this.ruleOffs);
          call.ruleOffs.from -= start;
          // Calculate which bells are affected by the call
          var plainLeadNotation = this.notation.parsed;
          for (i = 1; i * this.notation.parsed.length < end; ++i) {
            plainLeadNotation = plainLeadNotation.concat(this.notation.parsed);
          }
          var plainLeadRow = PlaceNotation.apply(plainLeadNotation.slice(0, end), PlaceNotation.rounds(this.stage)), callLeadRow = PlaceNotation.apply(notationParsed.slice(0, end), PlaceNotation.rounds(this.stage)), affectedBells = [];
          plainLeadRow.forEach(function (b, i) {
            if (b !== callLeadRow[i]) {
              affectedBells.push(b);
            }
          });
          // Create an options object for the call
          sharedCallsGridOptions.push({
            id: callTitle.replace(' ', '_').replace(/[^A-Za-z0-9_]/, '').toLowerCase() + '_' + options.id,
            notation: call.notation,
            stage: this.stage,
            startRow: call.startRow,
            title: { text: callTitle + ':' },
            ruleOffs: call.ruleOffs,
            placeStarts: false,
            callingPositions: false,
            affected: affectedBells,
            dimensions: {
              row: {
                height: rowHeight,
                width: rowWidth
              }
            },
            layout: {
              numberOfLeads: 1,
              numberOfColumns: 1
            },
            lines: {
              show: true,
              bells: []
            }
          });
        }
      }
    }
    // Create seperate objects for the numbers, line and grid styles
    this.gridOptions.plainCourse.numbers = $.extend(true, {}, sharedPlainCourseGridOptions, {
      id: sharedPlainCourseGridOptions.id + '_numbers',
      numbers: {
        show: true,
        font: font,
        bells: rounds.map(function (b) {
          return { color: toFollow.indexOf(b) !== -1 ? 'transparent' : '#000' };
        }, this)
      }
    });
    this.gridOptions.calls.numbers = $.extend(true, [], sharedCallsGridOptions);
    this.gridOptions.plainCourse.lines = $.extend(true, {}, sharedPlainCourseGridOptions, {
      id: sharedPlainCourseGridOptions.id + '_lines',
      numbers: false,
      verticalGuides: { shading: { show: true } }
    });
    this.gridOptions.calls.lines = $.extend(true, [], sharedCallsGridOptions);
    this.gridOptions.plainCourse.grid = $.extend(true, {}, sharedPlainCourseGridOptions, {
      id: sharedPlainCourseGridOptions.id + '_grid',
      title: { text: 'Plain Lead:' },
      numberOfLeadsmbers: false,
      numbers: false,
      placeStarts: false,
      callingPositions: false,
      sideNotation: { show: true },
      layout: {
        numberOfLeads: 1,
        numberOfColumns: 1
      }
    });
    this.gridOptions.calls.grid = $.extend(true, [], sharedCallsGridOptions);
    // Set the colors and stroke widths of the lines in plain courses
    var isHuntBell, isWorkingBell, isAffected;
    for (i = 0, j = 0, k = 0, l = 0; i < this.stage; ++i) {
      isHuntBell = this.huntBells.indexOf(i) !== -1;
      isWorkingBell = toFollow.indexOf(i) !== -1;
      this.gridOptions.plainCourse.numbers.lines.bells.push({
        width: isHuntBell ? huntBellWidth : workingBellWidth,
        stroke: isHuntBell ? huntBellColor : isWorkingBell ? workingBellColor[j++] || workingBellColor[j = 0, j++] : 'transparent'
      });
      this.gridOptions.plainCourse.lines.lines.bells.push({
        width: isHuntBell || !isWorkingBell ? huntBellWidth : workingBellWidth,
        stroke: isHuntBell ? huntBellColor : isWorkingBell ? workingBellColor[k++] || workingBellColor[k = 0, k++] : 'rgba(0,0,0,0.1)'
      });
      this.gridOptions.plainCourse.grid.lines.bells.push({
        width: isHuntBell ? huntBellWidth : workingBellWidth,
        stroke: isHuntBell ? huntBellColor : workingBellColor[l++] || workingBellColor[l = 0, l++]
      });
    }
    // and for calls
    sharedCallsGridOptions.forEach(function (call, callIndex) {
      // Set IDs and other options
      this.gridOptions.calls.numbers[callIndex].id += '_numbers';
      this.gridOptions.calls.lines[callIndex].id += '_lines';
      this.gridOptions.calls.grid[callIndex].id += '_grid';
      this.gridOptions.calls.numbers[callIndex].numbers = {
        show: true,
        font: font,
        bells: rounds.map(function (b) {
          return { color: this.gridOptions.calls.numbers[callIndex].affected.indexOf(b) !== -1 || this.huntBells.indexOf(b) !== -1 ? 'transparent' : '#000' };
        }, this)
      };
      this.gridOptions.calls.lines[callIndex].numbers = this.gridOptions.calls.grid[callIndex].numbers = false;
      this.gridOptions.calls.lines[callIndex].verticalGuides = { shading: { show: true } };
      this.gridOptions.calls.grid[callIndex].sideNotation = { show: true };
      // Set line colors
      for (i = 0, j = 0, k = 0, l = 0; i < this.stage; ++i) {
        isHuntBell = this.huntBells.indexOf(i) !== -1;
        isAffected = call.affected.indexOf(i) !== -1;
        this.gridOptions.calls.numbers[callIndex].lines.bells.push({
          width: isHuntBell ? huntBellWidth : workingBellWidth,
          stroke: isHuntBell ? huntBellColor : isAffected ? workingBellColor[j++] || workingBellColor[j = 0, j++] : 'transparent'
        });
        this.gridOptions.calls.lines[callIndex].lines.bells.push({
          width: isAffected ? workingBellWidth : huntBellWidth,
          stroke: isHuntBell ? huntBellColor : isAffected ? workingBellColor[k++] || workingBellColor[k = 0, k++] : 'rgba(0,0,0,0.1)'
        });
        this.gridOptions.calls.grid[callIndex].lines.bells.push({
          width: isHuntBell ? huntBellWidth : workingBellWidth,
          stroke: isHuntBell ? huntBellColor : workingBellColor[l++] || workingBellColor[l = 0, l++]
        });
      }
    }, this);
    return this;
  };
  return Method;
}(jquery, PlaceNotation, MeasureCanvasText);
GridOptions = function ($, PlaceNotation, MeasureCanvasText) {
  // Default options (note runtime defaults are set later)
  var defaultOptions = {
    layout: {
      numberOfLeads: 1,
      numberOfColumns: 1
    },
    dimensions: {
      bell: {
        width: 10,
        height: 13
      },
      row: { padding: {} },
      column: { padding: {} },
      canvas: { padding: {} }
    },
    background: { color: '#FFF' },
    title: {
      show: false,
      text: null,
      font: '12px "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
      color: '#000'
    },
    sideNotation: {
      show: false,
      font: '10px "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
      color: '#000'
    },
    verticalGuides: {
      shading: {
        show: false,
        fullHeight: false,
        color: '#F3F3F3'
      },
      lines: {
        show: false,
        fullHeight: false,
        stroke: '#999',
        dash: [
          3,
          1
        ],
        width: 1,
        cap: 'butt'
      }
    },
    placeStarts: {
      show: false,
      font: '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
      color: '#000'
    },
    callingPositions: {
      show: false,
      font: '10px sans-serif',
      color: '#000'
    },
    ruleOffs: {
      show: true,
      stroke: '#999',
      dash: [
        3,
        1
      ],
      width: 1,
      cap: 'butt'
    },
    numbers: {
      show: true,
      font: '12px ' + (navigator.userAgent.toLowerCase().indexOf('android') > -1 ? '' : 'Blueline, "Andale Mono", Consolas, ') + 'monospace'
    },
    lines: { show: true }
  };
  var counter = 1;
  return function (passedOptions) {
    var options = {};
    // Make runtime adjustments to the default options object
    var defaultRuntimeOptions = {
      id: 'grid_' + ++counter,
      sideNotation: { text: passedOptions.notation.exploded },
      startRow: PlaceNotation.rounds(passedOptions.stage),
      layout: { leadLength: passedOptions.notation.exploded.length },
      lines: {
        bells: function (stage) {
          var bells = [], i = 0;
          for (; i < stage; ++i) {
            bells.push({
              lineWidth: 1,
              stroke: 'transparent',
              cap: 'round',
              join: 'round',
              dash: []
            });
          }
          return bells;
        }(passedOptions.stage)
      },
      numbers: {
        bells: function (stage) {
          var bells = [], i = 0;
          for (; i < stage; ++i) {
            bells.push({ color: '#000' });
          }
          return bells;
        }(passedOptions.stage)
      }
    };
    // Allow entire attributes to be set to true or false
    Object.keys(defaultOptions).forEach(function (e) {
      if (typeof passedOptions[e] === 'boolean') {
        passedOptions[e] = { show: passedOptions[e] };
      }
    });
    // Merge options object with the defaults
    options = $.extend(true, {}, defaultOptions, defaultRuntimeOptions, passedOptions);
    // Allow title to be shown by just setting title.text
    if (options.title.text !== null) {
      options.title.show = true;
    }
    // Calculate what the 'layout' option object should look like using the passed options to guide
    if (options.layout.numberOfColumns > options.layout.numberOfLeads) {
      options.layout.numberOfColumns = options.layout.numberOfLeads;
    }
    options.layout.leadsPerColumn = Math.ceil(options.layout.numberOfLeads / options.layout.numberOfColumns);
    options.layout.changesPerColumn = options.layout.leadsPerColumn * options.layout.leadLength;
    // Calculation what the 'dimensions' object should look like
    // Bell width and row width come from each other, rowWidth overrides bellWidth
    if (typeof options.dimensions.row.width === 'number') {
      options.dimensions.bell.width = options.dimensions.row.width / options.stage;
    } else if (typeof options.dimensions.bell.width === 'number') {
      options.dimensions.row.width = Math.ceil(options.dimensions.bell.width * options.stage);
    }
    if (typeof options.dimensions.row.height !== 'number') {
      options.dimensions.row.height = options.dimensions.bell.height;
    }
    // Padding
    options.dimensions.canvas.padding = {
      top: 0,
      left: 0
    };
    options.dimensions.column.padding = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      between: typeof options.dimensions.column.padding.between === 'number' ? options.dimensions.column.padding.between : options.layout.numberOfColumns > 1 ? 10 : 0
    };
    options.dimensions.canvas.padding.top += options.title.show ? Math.floor(parseInt(options.title.font) * 1.2) : 0;
    options.dimensions.canvas.padding.left += options.sideNotation.show ? function () {
      var longest = 0, text = '', i, width;
      for (i = 0; i < options.sideNotation.text.length; ++i) {
        if (options.sideNotation.text[i].length > longest) {
          longest = options.sideNotation.text[i].length;
          text = options.sideNotation.text[i];
        }
      }
      return MeasureCanvasText(new Array(text.length + 1).join('0'), options.sideNotation.font) + 4;
    }() : 0;
    if (options.placeStarts.show) {
      options.dimensions.column.padding.right = Math.max(options.dimensions.column.padding.right, 10 + options.placeStarts.bells.length * 12);
      options.dimensions.canvas.padding.top = Math.max(options.dimensions.canvas.padding.top, 15 - options.dimensions.row.height);
    }
    if (options.callingPositions.show) {
      options.dimensions.column.padding.right = Math.max(options.dimensions.column.padding.right, 15);
    }
    // Canvas dimensions
    options.dimensions.canvas = {
      width: Math.max(options.dimensions.canvas.padding.left + (options.dimensions.row.width + options.dimensions.column.padding.left + options.dimensions.column.padding.right) * options.layout.numberOfColumns + options.dimensions.column.padding.between * (options.layout.numberOfColumns - 1), options.title.show ? MeasureCanvasText(options.title.text, options.title.font) : 0),
      height: options.dimensions.canvas.padding.top + options.dimensions.row.height * (options.layout.leadsPerColumn * options.layout.leadLength + 1),
      padding: options.dimensions.canvas.padding
    };
    return options;
  };
}(jquery, PlaceNotation, MeasureCanvasText);
MeasureCanvasTextOffset = function (Canvas, LocalStorage) {
  /*
  	 * Text positioning on a <canvas> is inconsistent across browsers and platforms.
  	 * This is a problem when trying to get pixel perfect alignments of text and lines.
  	 *
  	 * This function, given a font and size, will return the offset needed to be applied
  	 * to x and y to centre a single character of the font in a sizexsize box when drawing
  	 * with textAlign=center and baseLine=middle
  	 * It caches the result when used in production.
  	*/
  var measureXAndYTextPadding = function (size, font, text) {
    if (typeof text == 'undefined') {
      text = '0';
    }
    var padding = LocalStorage.getItem('Metrics.' + font + text);
    if (padding === null) {
      var canvas = new Canvas({
        id: 'metric',
        width: size * 3,
        height: size * 3,
        scale: typeof window.devicePixelRatio === 'number' ? Math.round(window.devicePixelRatio * 8) : 8
      });
      if (canvas !== false) {
        try {
          var context = canvas.context;
          context.font = font;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillStyle = '#F00';
          context.fillText(text, size * 1.5, size * 1.5);
          var dim = size * 3 * canvas.scale, imageData = context.getImageData(0, 0, dim, dim), bottomOfText = false, topOfText = false, leftOfText = false, rightOfText = false, row, column;
          // Find top
          for (row = 0; topOfText === false && row < dim; ++row) {
            for (column = 0; column < dim; ++column) {
              if (imageData.data[row * (dim * 4) + column * 4] > 0) {
                topOfText = row;
                break;
              }
            }
          }
          // Find bottom
          for (row = dim; bottomOfText === false && row > 0; --row) {
            for (column = 0; column < dim; ++column) {
              if (imageData.data[row * (dim * 4) + column * 4] > 0) {
                bottomOfText = row + 1;
                break;
              }
            }
          }
          // Find left
          for (column = 0; leftOfText === false && column < dim; ++column) {
            for (row = 0; row < dim; ++row) {
              if (imageData.data[row * (dim * 4) + column * 4] > 0) {
                leftOfText = column;
                break;
              }
            }
          }
          // Find right
          for (column = dim; rightOfText === false && column > 0; --column) {
            for (row = 0; row < dim; ++row) {
              if (imageData.data[row * (dim * 4) + column * 4] > 0) {
                rightOfText = column + 1;
                break;
              }
            }
          }
          padding = {
            x: (dim - rightOfText - leftOfText) / (canvas.scale * 2),
            y: (dim - bottomOfText - topOfText) / (canvas.scale * 2)
          };
          LocalStorage.setItem('Metrics.' + font + text, padding);
        } catch (e) {
          padding.x = padding.y = 0;
        }
      }
      canvas = null;
    }
    return padding;
  };
  return measureXAndYTextPadding;
}(Canvas, LocalStorage);
Grid = function (require, $, GridOptions, PlaceNotation, Canvas, MeasureCanvasTextOffset) {
  var MethodGrid = function (passedOptions) {
    var options = {};
    this.setOptions = function (passedOptions) {
      options = GridOptions($.extend(true, options, passedOptions));
    };
    this.measure = function () {
      return options.dimensions;
    };
    this.draw = function (returnImage) {
      returnImage = typeof returnImage !== 'boolean' ? false : returnImage;
      // Set up canvas
      var canvas = new Canvas({
        id: options.id,
        width: options.dimensions.canvas.width,
        height: options.dimensions.canvas.height
      });
      // Create some shortcut variables for later use
      var i, j, k, h, w, x, y, context = canvas.context, numberOfLeads = options.layout.numberOfLeads, numberOfColumns = options.layout.numberOfColumns, leadsPerColumn = options.layout.leadsPerColumn, changesPerColumn = options.layout.changesPerColumn, leadLength = options.layout.leadLength, rowHeight = options.dimensions.row.height, rowWidth = options.dimensions.row.width, bellHeight = options.dimensions.bell.height, bellWidth = options.dimensions.bell.width, canvasTopPadding = options.dimensions.canvas.padding.top, canvasLeftPadding = options.dimensions.canvas.padding.left, columnRightPadding = options.dimensions.column.padding.right, interColumnPadding = options.dimensions.column.padding.between, rowWidthWithPadding = options.dimensions.column.padding.between + options.dimensions.column.padding.left + options.dimensions.column.padding.right + options.dimensions.row.width, textMetrics;
      // If we're displaying multiple leads, pre-calculate the lead heads for later use
      var leadHeads = [options.startRow];
      if (numberOfLeads > 1) {
        for (i = 1; i < numberOfLeads; ++i) {
          leadHeads.push(PlaceNotation.apply(options.notation.parsed, leadHeads[i - 1]));
        }
      }
      // Set the background color
      context.fillStyle = options.background.color;
      context.fillRect(0, 0, options.dimensions.canvas.width, options.dimensions.canvas.height);
      // Draw title
      if (options.title.show) {
        context.fillStyle = options.title.color;
        context.font = options.title.font;
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText(options.title.text, 0, 0);
      }
      // Draw notation down side
      if (options.sideNotation.show) {
        textMetrics = MeasureCanvasTextOffset(parseInt(options.sideNotation.font), options.sideNotation.font, '0');
        context.fillStyle = options.sideNotation.color;
        context.font = options.sideNotation.font;
        context.textAlign = 'right';
        context.textBaseline = 'middle';
        y = canvasTopPadding + rowHeight + textMetrics.y;
        for (i = 0; i < options.sideNotation.text.length; ++i) {
          context.fillText(options.sideNotation.text[i], canvasLeftPadding - 4, i * rowHeight + y);
        }
      }
      // Draw vertical guides - shading
      if (options.verticalGuides.shading.show) {
        context.fillStyle = options.verticalGuides.shading.color;
        for (i = 0; i < numberOfColumns; ++i) {
          if (options.verticalGuides.shading.fullHeight) {
            h = rowHeight * (1 + leadLength * (i + 1 == numberOfColumns ? Math.max(1, numberOfLeads % leadsPerColumn) : leadsPerColumn));
            y = canvasTopPadding;
          } else {
            if (i + 1 == numberOfColumns) {
              h = rowHeight * leadLength * (numberOfLeads % leadsPerColumn === 0 ? leadsPerColumn : numberOfLeads % leadsPerColumn);
            } else {
              h = rowHeight * (0.25 + leadLength * leadsPerColumn);
            }
            y = canvasTopPadding + bellHeight / 2;
          }
          for (k = 1; k < options.stage; k += 2) {
            context.fillRect(canvasLeftPadding + i * rowWidthWithPadding + (k - 0.5) * bellWidth, y, bellWidth, h);
          }
        }
      }
      // Draw vertical guides - lines
      if (options.verticalGuides.lines.show) {
        context.lineWidth = options.verticalGuides.lines.width;
        context.lineCap = options.verticalGuides.lines.cap;
        context.strokeStyle = options.verticalGuides.lines.stroke;
        context.setLineDash(options.verticalGuides.lines.dash);
        context.beginPath();
        for (i = 0; i < numberOfColumns; ++i) {
          if (options.verticalGuides.shading.fullHeight) {
            h = rowHeight * (1 + leadLength * (i + 1 == numberOfColumns ? Math.max(1, numberOfLeads % leadsPerColumn) : leadsPerColumn));
            y = canvasTopPadding;
          } else {
            if (i + 1 == numberOfColumns) {
              h = rowHeight * leadLength * Math.max(1, numberOfLeads % leadsPerColumn);
            } else {
              h = rowHeight * (0.25 + leadLength * leadsPerColumn);
            }
            y = canvasTopPadding + bellHeight / 2;
          }
          for (k = 0; k < options.stage; ++k) {
            x = canvasLeftPadding + i * rowWidthWithPadding + (0.5 + k) * bellWidth;
            context.moveTo(x, y);
            context.lineTo(x, y + h);
          }
        }
        context.stroke();
      }
      // Draw numbers
      if (options.numbers.show) {
        // Calculate reused offsets
        var textMetrics = MeasureCanvasTextOffset(Math.max(bellWidth, rowHeight), options.numbers.font, '0'), columnSidePadding = interColumnPadding + columnRightPadding, sidePadding = canvasLeftPadding + bellWidth / 2 + textMetrics.x, topPadding = canvasTopPadding + rowHeight / 2 + textMetrics.y;
        // Set up the context
        context.font = options.numbers.font;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        options.numbers.bells.forEach(function (bellOptions, bell) {
          // For each number
          if (bellOptions.color !== 'transparent') {
            // Only bother drawing at all if not transparent
            context.fillStyle = bellOptions.color;
            var char = PlaceNotation.bellToChar(bell), row = options.startRow;
            for (i = 0; i < numberOfColumns; ++i) {
              for (j = 0; j < leadsPerColumn && i * leadsPerColumn + j < numberOfLeads; ++j) {
                if (j === 0) {
                  context.fillText(char, sidePadding + row.indexOf(bell) * bellWidth + i * (rowWidth + columnSidePadding), topPadding);
                }
                for (k = 0; k < leadLength;) {
                  row = PlaceNotation.apply(options.notation.parsed[k], row);
                  context.fillText(char, sidePadding + row.indexOf(bell) * bellWidth + i * (rowWidth + columnSidePadding), topPadding + j * leadLength * rowHeight + ++k * rowHeight);
                }
              }
            }
          }
        });
      }
      // Draw lines
      if (options.lines.show) {
        i = options.stage;
        while (i--) {
          j = options.startRow[i];
          if (typeof options.lines.bells[j] === 'object' && options.lines.bells[j].stroke !== 'transparent') {
            context.beginPath();
            for (k = 0; k < numberOfColumns; ++k) {
              var columnNotation = options.notation.parsed;
              for (l = 1; l < leadsPerColumn && k * leadsPerColumn + l < numberOfLeads; ++l) {
                columnNotation = columnNotation.concat(options.notation.parsed);
              }
              var bell = leadHeads[k * leadsPerColumn].indexOf(j), position = bell, newPosition;
              x = canvasLeftPadding + k * rowWidthWithPadding + bell * bellWidth + bellWidth / 2;
              y = canvasTopPadding + rowHeight / 2;
              context.moveTo(x, y);
              for (m = 0; m < columnNotation.length; ++m) {
                newPosition = columnNotation[m].indexOf(position);
                x += (newPosition - position) * bellWidth;
                y += rowHeight;
                context.lineTo(x, y);
                position = newPosition;
              }
              if (k * leadsPerColumn + l < numberOfLeads) {
                newPosition = columnNotation[0].indexOf(position);
                context.lineTo(x + (newPosition - position) * bellWidth / 4, y + rowHeight / 4);
              }
            }
            context.strokeStyle = options.lines.bells[j].stroke;
            context.lineWidth = options.lines.bells[j].width;
            context.lineCap = options.lines.bells[j].cap;
            context.lineJoin = options.lines.bells[j].join;
            context.setLineDash(options.lines.bells[j].dash);
            context.stroke();
          }
        }
      }
      // Draw rule offs
      if (options.ruleOffs.show) {
        context.lineWidth = options.ruleOffs.width;
        context.lineCap = options.ruleOffs.cap;
        context.strokeStyle = options.ruleOffs.stroke;
        context.setLineDash(options.ruleOffs.dash);
        context.beginPath();
        for (i = 0; i < numberOfColumns; ++i) {
          for (j = 0; j < leadsPerColumn && i * leadsPerColumn + j < numberOfLeads; ++j) {
            for (k = options.ruleOffs.from; k <= leadLength; k += options.ruleOffs.every) {
              if (k > 0) {
                x = canvasLeftPadding + i * rowWidthWithPadding;
                y = canvasTopPadding + (j * leadLength + k) * rowHeight;
                context.moveTo(x, y);
                context.lineTo(x + rowWidth, y);
              }
            }
          }
        }
        context.stroke();
      }
      // Draw place starts
      if (options.placeStarts.show) {
        options.placeStarts.bells.sort(function (a, b) {
          return a - b;
        });
        context.lineWidth = 1;
        context.setLineDash([]);
        options.placeStarts.bells.forEach(function (i, pos) {
          var j = typeof options.startRow === 'object' ? options.startRow[i] : i, k, l;
          for (k = 0; k < numberOfColumns; ++k) {
            for (l = 0; l < leadsPerColumn && k * leadsPerColumn + l < numberOfLeads; ++l) {
              var positionInLeadHead = leadHeads[k * leadsPerColumn + l].indexOf(j);
              // The little circle
              var x = canvasLeftPadding + k * rowWidthWithPadding + (positionInLeadHead + 0.5) * bellWidth, y = canvasTopPadding + l * rowHeight * leadLength + Math.max(3.25 * 2, rowHeight / 2);
              context.fillStyle = options.lines.bells[j].stroke;
              context.beginPath();
              context.arc(x, y, 2, 0, Math.PI * 2, true);
              context.closePath();
              context.fill();
              // The big circle
              x = canvasLeftPadding + k * rowWidthWithPadding + rowWidth + 12 * pos + 10;
              context.strokeStyle = options.lines.bells[j].stroke;
              context.beginPath();
              context.arc(x, y, 6.5, 0, Math.PI * 2, true);
              context.closePath();
              context.stroke();
              // The text inside the big circle
              var placeStartFontSize = positionInLeadHead < 9 ? 10 : 8, textMetrics = MeasureCanvasTextOffset(13, placeStartFontSize + 'px ' + options.placeStarts.font, (positionInLeadHead + 1).toString());
              context.fillStyle = options.placeStarts.color;
              context.font = placeStartFontSize + 'px ' + options.placeStarts.font;
              context.textAlign = 'center';
              context.textBaseline = 'middle';
              context.fillText((positionInLeadHead + 1).toString(), x + textMetrics.x, y + textMetrics.y);
            }
          }
        }, this);
      }
      // Draw calling positions
      if (options.callingPositions.show && typeof options.callingPositions.title == 'object') {
        context.fillStyle = options.callingPositions.color;
        context.font = options.callingPositions.font;
        context.textAlign = 'left';
        context.textBaseline = 'bottom';
        for (i = 0; i < options.callingPositions.titles.length; ++i) {
          if (options.callingPositions.titles[i] !== null) {
            var rowInMethod = options.callingPositions.from + options.callingPositions.every * (i + 1) - 2;
            x = canvasLeftPadding + Math.floor(rowInMethod / changesPerColumn) * rowWidthWithPadding + rowWidth + 4;
            y = canvasTopPadding + (rowInMethod % changesPerColumn + 1) * rowHeight;
            context.fillText('-' + options.callingPositions.titles[i], x, y);
          }
        }
      }
      // Return the image
      if (returnImage) {
        var i = new Image();
        i.width = options.dimensions.canvas.width;
        i.height = options.dimensions.canvas.height;
        i.src = canvas.element.toDataURL();
        return i;
      } else {
        return canvas.element;
      }
    };
    // Do an initial set up and return
    if (passedOptions) {
      this.setOptions(passedOptions);
    }
    return this;
  };
  return MethodGrid;
}({}, jquery, GridOptions, PlaceNotation, Canvas, MeasureCanvasTextOffset);
(function ($, Method, Grid) {
  var r = function () {
    var fns = [], listener, doc = document, hack = doc.documentElement.doScroll, domContentLoaded = 'DOMContentLoaded', loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
    if (!loaded) {
      doc.addEventListener(domContentLoaded, listener = function () {
        var fn;
        doc.removeEventListener(domContentLoaded, listener);
        loaded = 1;
        while (fn = fns.shift()) {
          fn();
        }
      });
    }
    return function (fn) {
      loaded ? setTimeout(fn, 0) : fns.push(fn);
    };
  }();
  r(function () {
    var qs = function (a) {
      if (a === '')
        return {};
      var b = {};
      for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
          b[p[0]] = '';
        else
          b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
      }
      return b;
    }(window.location.search.substr(1).split('&'));
    qs.id = 'blueline';
    qs.type = typeof qs.type == 'string' && (qs.type == 'lines' || qs.type == 'grid') ? qs.type : 'numbers';
    qs.size = typeof qs.size == 'string' && (qs.size == 'tiny' || qs.size == 'small' || qs.size == 'large' || qs.size == 'xlarge') ? qs.size : 'medium';
    qs.layout = typeof qs.layout == 'string' && qs.layout == 'oneRow' ? 'oneRow' : 'oneColumn';
    qs.calls = typeof qs.calls == 'string' ? JSON.parse(qs.calls) : {};
    qs.ruleOffs = typeof qs.ruleOffs == 'string' ? JSON.parse(qs.ruleOffs) : {};
    qs.callingPositions = typeof qs.callingPositions == 'string' ? JSON.parse(qs.callingPositions) : {};
    document.body.className = qs.layout + ' ' + qs.size;
    switch (qs.size) {
    case 'tiny':
      qs.fontSize = 10;
      break;
    case 'small':
      qs.fontSize = 12;
      break;
    case 'medium':
      qs.fontSize = 14;
      break;
    case 'large':
      qs.fontSize = 18;
      break;
    case 'xlarge':
      qs.fontSize = 24;
      break;
    }
    var container = document.getElementById('container'), method = new Method(qs);
    // Plain course
    var plainCourseGrid = new Grid($.extend(true, method.gridOptions.plainCourse[qs.type], {
        title: false,
        sideNotation: {
          show: true,
          color: '#999',
          font: qs.fontSize * 0.75 + 'px sans-serif'
        },
        layout: {
          numberOfColumns: qs.layout == 'oneRow' ? method.numberOfLeads : 1,
          numberOfLeads: qs.type == 'grid' ? 1 : method.numberOfLeads
        }
      })), plainCourseGridImage = plainCourseGrid.draw(true);
    plainCourseContainer = document.createElement('div');
    plainCourseContainer.appendChild(plainCourseGridImage);
    container.appendChild(plainCourseContainer);
    var plainCourseSideNotationPadding = (plainCourseGrid.measure().column.padding.right || 0) - (plainCourseGrid.measure().canvas.padding.left || 0);
    plainCourseGridImage.style.marginLeft = plainCourseSideNotationPadding + 'px';
    if (qs.layout == 'oneRow') {
      plainCourseContainer.style.marginLeft = -plainCourseSideNotationPadding + 'px';
    }
    // Calls
    method.gridOptions.calls[qs.type].map(function (e) {
      var callContainer = document.createElement('div'), title = document.createElement('h1'), titleText = document.createTextNode(e.title.text.replace(':', '')), callGrid = new Grid($.extend(e, {
          sideNotation: {
            show: true,
            color: '#999',
            font: qs.fontSize * 0.75 + 'px sans-serif'
          },
          title: false
        })), callGridImage = callGrid.draw(true);
      title.appendChild(titleText);
      callContainer.appendChild(title);
      callContainer.appendChild(callGridImage);
      container.appendChild(callContainer);
      var callSideNotationPadding = (callGrid.measure().column.padding.right || 0) - (callGrid.measure().canvas.padding.left || 0);
      callGridImage.style.marginLeft = callSideNotationPadding + 'px';
      if (qs.layout == 'oneRow') {
        callContainer.style.marginLeft = -callSideNotationPadding + 'px';
      }
    });
  });
}(jquery, Method, Grid));
main = undefined;
}());