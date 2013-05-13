// Generated by CoffeeScript 1.5.0
(function() {
  var TemplateCompilationError, TemplateError, cache, coffee, coffeefilter, coffeescript_helpers, elements, embed_strings, fs, get_embed_strings, make_template_function, merge_elements, skeleton,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof window !== "undefined" && window !== null) {
    coffeefilter = window.CoffeeKup = {};
    coffee = typeof CoffeeScript !== "undefined" && CoffeeScript !== null ? CoffeeScript : null;
  } else {
    coffeefilter = exports;
    coffee = require('coffee-script');
    fs = require('fs');
  }

  coffeefilter.version = '0.3.1edge';

  TemplateError = (function(_super) {

    __extends(TemplateError, _super);

    function TemplateError(message) {
      this.message = message;
      Error.call(this, this.message);
      Error.captureStackTrace(this, arguments.callee);
      ({
        name: 'TemplateError'
      });
    }

    return TemplateError;

  })(Error);

  TemplateCompilationError = (function(_super) {

    __extends(TemplateCompilationError, _super);

    function TemplateCompilationError(message) {
      this.message = message;
      Error.call(this, this.message);
      Error.captureStackTrace(this, arguments.callee);
      ({
        name: 'TemplateCompilationError'
      });
    }

    return TemplateCompilationError;

  })(Error);

  coffeefilter.doctypes = {
    'default': '<!DOCTYPE html>',
    '5': '<!DOCTYPE html>',
    'xml': '<?xml version="1.0" encoding="utf-8" ?>',
    'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
    'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
    '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
    'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',
    'ce': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "ce-html-1.0-transitional.dtd">'
  };

  coffeescript_helpers = "var __slice = Array.prototype.slice;\nvar __hasProp = Object.prototype.hasOwnProperty;\nvar __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };\nvar __extends = function(child, parent) {\n  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }\n  function ctor() { this.constructor = child; }\n  ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype;\n  return child; };\nvar __indexOf = Array.prototype.indexOf || function(item) {\n  for (var i = 0, l = this.length; i < l; i++) {\n    if (this[i] === item) return i;\n  } return -1; };".replace(/\n/g, '').replace(/\t/g, ' ');

  elements = {
    regular: 'a abbr address article aside audio b bdi bdo blockquote body button\
 canvas caption cite code colgroup datalist dd del details dfn div dl dt em\
 fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup\
 html i iframe ins kbd label legend li map mark menu meter nav noscript object\
 ol optgroup option output p pre progress q rp rt ruby s samp script section\
 select small span strong style sub summary sup table tbody td textarea tfoot\
 th thead time title tr u ul video',
    "void": 'area base br col command embed hr img input keygen link meta param\
 source track wbr',
    obsolete: 'applet acronym bgsound dir frameset noframes isindex listing\
 nextid noembed plaintext rb strike xmp big blink center font marquee multicol\
 nobr spacer tt',
    obsolete_void: 'basefont frame'
  };

  merge_elements = function() {
    var a, args, element, result, _i, _j, _len, _len1, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    result = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      a = args[_i];
      _ref = elements[a].split(' ');
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        element = _ref[_j];
        if (__indexOf.call(result, element) < 0) {
          result.push(element);
        }
      }
    }
    return result;
  };

  coffeefilter.tags = merge_elements('regular', 'obsolete', 'void', 'obsolete_void');

  coffeefilter.self_closing = merge_elements('void', 'obsolete_void');

  skeleton = function(data) {
    var block, cede, coffeescript, comment, doctype, extend, h, ie, parse_date, parse_datetime, parse_time, render_date, render_datetime, render_time, tag, text, __cf, _date_function_helper, _ref, _ref1;
    if (data == null) {
      data = {};
    }
    if ((_ref = data.format) == null) {
      data.format = false;
    }
    if ((_ref1 = data.autoescape) == null) {
      data.autoescape = false;
    }
    __cf = {
      is_ceding: false,
      root_node: {
        id: '__root_node',
        buffer: [],
        children_pos: {},
        parent: null
      },
      current_node: null,
      nodes: null,
      base: null,
      tabs: 0,
      render: function() {
        if (this.base != null) {
          return this.render_with_base();
        } else {
          return this.render_without_base();
        }
      },
      render_without_base: function() {
        return this.render_node(this.root_node);
      },
      render_with_base: function() {
        this.update_node(this.root_node);
        return this.base.render();
      },
      update_node: function(node) {
        var child, child_id, same_node, _results;
        if (node.parent != null) {
          same_node = this.base.nodes[node.id];
          if (same_node != null) {
            node.parent = same_node.parent;
          }
          this.base.nodes[node.id] = node;
        }
        _results = [];
        for (child_id in node.children_pos) {
          child = this.nodes[child_id];
          _results.push(this.update_node(child));
        }
        return _results;
      },
      render_node: function(node) {
        var child, child_content, child_id;
        for (child_id in node.children_pos) {
          child = this.nodes[child_id];
          child_content = this.render_node(child);
          node.buffer[node.children_pos[child_id]] = child_content;
        }
        return node.buffer.join('');
      },
      tag: function(name, args) {
        var combo, i, _i, _len;
        combo = [name];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          i = args[_i];
          combo.push(i);
        }
        return tag.apply(data, combo);
      },
      repeat: function(string, count) {
        return Array(count + 1).join(string);
      },
      indent: function() {
        if (data.format) {
          return text(this.repeat('  ', this.tabs));
        }
      },
      esc: function(txt) {
        if (data.autoescape) {
          return h(txt);
        } else {
          return String(txt);
        }
      },
      write_idclass: function(str) {
        var c, classes, i, id, _i, _j, _len, _len1, _ref2;
        classes = [];
        _ref2 = str.split('.');
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          i = _ref2[_i];
          if (__indexOf.call(i, '#') >= 0) {
            id = i.replace('#', '');
          } else {
            if (i !== '') {
              classes.push(i);
            }
          }
        }
        if (id) {
          text(" id=\"" + id + "\"");
        }
        if (classes.length > 0) {
          text(" class=\"");
          for (_j = 0, _len1 = classes.length; _j < _len1; _j++) {
            c = classes[_j];
            if (c !== classes[0]) {
              text(' ');
            }
            text(c);
          }
          return text('"');
        }
      },
      write_attrs: function(obj, prefix) {
        var k, v, _results;
        if (prefix == null) {
          prefix = '';
        }
        _results = [];
        for (k in obj) {
          v = obj[k];
          if (typeof v === 'boolean' && v) {
            v = k;
          }
          if (typeof v === 'function') {
            v = "(" + v + ").call(this);";
          }
          if (typeof v === 'object' && !(v instanceof Array)) {
            _results.push(this.write_attrs(v, prefix + k + '-'));
          } else if (v) {
            _results.push(text(" " + (prefix + k) + "=\"" + (this.esc(v)) + "\""));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      write_contents: function(contents) {
        var result;
        switch (typeof contents) {
          case 'string':
          case 'number':
          case 'boolean':
            return text(this.esc(contents));
          case 'function':
            if (data.format) {
              text('\n');
            }
            this.tabs++;
            result = contents.call(data);
            if (typeof result === 'string') {
              this.indent();
              text(this.esc(result));
              if (data.format) {
                text('\n');
              }
            }
            this.tabs--;
            return this.indent();
        }
      },
      write_tag: function(name, idclass, attrs, contents) {
        this.indent();
        text("<" + name);
        if (idclass) {
          this.write_idclass(idclass);
        }
        if (attrs) {
          this.write_attrs(attrs);
        }
        if (__indexOf.call(this.self_closing, name) >= 0) {
          text(' />');
          if (data.format) {
            text('\n');
          }
        } else {
          text('>');
          this.write_contents(contents);
          text("</" + name + ">");
          if (data.format) {
            text('\n');
          }
        }
        return null;
      }
    };
    __cf.current_node = __cf.root_node;
    __cf.nodes = {
      '__root_node': __cf.root_node
    };
    tag = function() {
      var a, args, attrs, contents, idclass, name, _i, _len;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        a = args[_i];
        switch (typeof a) {
          case 'function':
            contents = a;
            break;
          case 'object':
            attrs = a;
            break;
          case 'number':
          case 'boolean':
            contents = a;
            break;
          case 'string':
            if (args.length === 1) {
              contents = a;
            } else {
              if (a === args[0]) {
                idclass = a;
              } else {
                contents = a;
              }
            }
        }
      }
      return __cf.write_tag(name, idclass, attrs, contents);
    };
    h = function(txt) {
      return String(txt).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    doctype = function(type) {
      if (type == null) {
        type = 'default';
      }
      text(__cf.doctypes[type]);
      if (data.format) {
        return text('\n');
      }
    };
    cede = function(f) {
      var old_buffer, temp_buffer;
      temp_buffer = [];
      __cf.is_ceding = true;
      old_buffer = __cf.current_node.buffer;
      __cf.current_node.buffer = temp_buffer;
      f();
      __cf.current_node.buffer = old_buffer;
      __cf.is_ceding = false;
      return temp_buffer.join('');
    };
    text = function(txt) {
      __cf.current_node.buffer.push(String(txt));
      return null;
    };
    comment = function(cmt) {
      text("<!--" + cmt + "-->");
      if (data.format) {
        return text('\n');
      }
    };
    coffeescript = function(param) {
      switch (typeof param) {
        case 'function':
          return script("" + __cf.coffeescript_helpers + "(" + param + ").call(this);");
        case 'string':
          return script({
            type: 'text/coffeescript'
          }, function() {
            return param;
          });
        case 'object':
          param.type = 'text/coffeescript';
          return script(param);
      }
    };
    ie = function(condition, contents) {
      __cf.indent();
      text("<!--[if " + condition + "]>");
      __cf.write_contents(contents);
      text("<![endif]-->");
      if (data.format) {
        return text('\n');
      }
    };
    extend = function(base) {
      var base_template;
      if (__cf.root_node.buffer.length !== 0) {
        throw new TemplateError("Calls to base need to be first in your template");
      }
      if (__cf.base != null) {
        throw new TemplateError("You can only inherit from one template");
      }
      if (typeof base === 'string') {
        base_template = data.__cf.compile(data.settings.views + "/" + base + ".coffee", data);
      } else {
        base_template = data.__cf.compile(base, data);
      }
      return __cf.base = base_template(data);
    };
    block = function(id, contents) {
      var node;
      node = {
        id: id,
        buffer: [],
        children_pos: {},
        parent: __cf.current_node
      };
      node.parent.children_pos[id] = node.parent.buffer.length;
      text("[Block: " + id + "]");
      __cf.nodes[id] = node;
      __cf.current_node = node;
      __cf.write_contents(contents);
      return __cf.current_node = node.parent;
    };
    _date_function_helper = function(d, format, type) {
      if (format == null) {
        format = data.__cf.settings["" + type + "_format"];
      }
      return data.__cf.settings.datetime_function(d, format, type);
    };
    parse_date = function(d, format) {
      if (format == null) {
        format = null;
      }
      return _date_function_helper(d, format, 'date');
    };
    parse_datetime = function(d, format) {
      if (format == null) {
        format = null;
      }
      return _date_function_helper(d, format, 'datetime');
    };
    parse_time = function(d, format) {
      if (format == null) {
        format = null;
      }
      return _date_function_helper(d, format, 'time');
    };
    render_date = function(d, format) {
      if (format == null) {
        format = null;
      }
      return text(parse_date(d, format));
    };
    render_datetime = function(d, format) {
      if (format == null) {
        format = null;
      }
      return text(parse_datetime(d, format));
    };
    render_time = function(d, format) {
      if (format == null) {
        format = null;
      }
      return text(parse_time(d, format));
    };
    return null;
  };

  cache = {};

  coffeefilter.compile = function(template, options) {
    var compiled_template, endswith, filename, use_cache, _base, _ref;
    if (options == null) {
      options = {};
    }
    use_cache = (_ref = (_base = coffeefilter.settings).cache) != null ? _ref : _base.cache = false;
    try {
      endswith = function(str, end) {
        return str.length >= end.length && str.substr(-end.length) === end;
      };
      if (typeof template === 'function') {
        filename = "[Some function]";
        use_cache = false;
        template = String(template);
      } else if (typeof template === 'string' && (coffee != null)) {
        if (endswith(template, '.coffee')) {
          filename = template;
          if (use_cache && (cache[filename] != null)) {
            return cache[filename];
          } else {
            template = fs.readFileSync(filename, 'utf8');
          }
        } else {
          filename = "[Inline template]";
          use_cache = false;
        }
        template = coffee.compile(template, {
          bare: true
        });
        template = "function(){" + template + "}";
      } else {
        throw new TemplateCompilationError("Unknown template, type: " + (typeof template) + ", template: " + template);
      }
      compiled_template = make_template_function(template, options);
      if (use_cache) {
        cache[filename] = compiled_template;
      }
    } catch (e) {
      throw e;
    }
    return compiled_template;
  };

  make_template_function = function(template, options) {
    var code, embeds, hardcoded_locals, k, t, tag_functions, tags_used, v, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    tag_functions = '';
    tags_used = [];
    _ref = coffeefilter.tags;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      if (template.indexOf(t) > -1) {
        tags_used.push(t);
      }
    }
    embeds = get_embed_strings();
    hardcoded_locals = '';
    if (options.hardcode) {
      _ref1 = options.hardcode;
      for (k in _ref1) {
        v = _ref1[k];
        if (typeof v === 'function') {
          hardcoded_locals += "var " + k + " = function(){return (" + v + ").apply(data, arguments);};";
        } else {
          hardcoded_locals += "var " + k + " = " + (JSON.stringify(v)) + ";";
        }
      }
    }
    _ref2 = coffeefilter.tags;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      t = _ref2[_j];
      if (hardcoded_locals.indexOf(t) > -1) {
        tags_used.push(t);
      }
    }
    code = embeds.get_active_tag_functions(tags_used) + hardcoded_locals + embeds.skeleton + ";\n";
    code += 'if(!data.locals){';
    code += "(" + template + ").call(data);";
    code += '}else{';
    code += 'with(data.locals){';
    code += "(" + template + ").call(data);";
    code += '}}';
    code += "return __cf;";
    return new Function('data', code);
  };

  embed_strings = null;

  get_embed_strings = function() {
    var s, t, tag_functions, unwrap_func, _i, _len, _ref;
    if (embed_strings != null) {
      return embed_strings;
    }
    unwrap_func = function(f) {
      var r;
      r = String(f).replace(/function\s*\(.*\)\s*\{/, '').replace(/return null;\s*\}$/, '');
      return r;
    };
    s = unwrap_func(skeleton);
    s = coffeescript_helpers + s;
    s += "__cf.doctypes = " + (JSON.stringify(coffeefilter.doctypes)) + ";";
    s += "__cf.coffeescript_helpers = " + (JSON.stringify(coffeescript_helpers)) + ";";
    s += "__cf.self_closing = " + (JSON.stringify(coffeefilter.self_closing)) + ";";
    tag_functions = {};
    _ref = coffeefilter.tags;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      tag_functions[t] = "" + t + " = function(){return __cf.tag('" + t + "', arguments);};";
    }
    embed_strings = {
      skeleton: s,
      tag_functions: tag_functions,
      get_active_tag_functions: function(used_tags) {
        var ts;
        ts = "var " + (used_tags.join(',')) + ";";
        ts += ((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = used_tags.length; _j < _len1; _j++) {
            t = used_tags[_j];
            _results.push(this.tag_functions[t]);
          }
          return _results;
        }).call(this)).join('');
        return ts;
      }
    };
    return embed_strings;
  };

  coffeefilter.render = function(filename, data) {
    var tpl;
    if (data == null) {
      data = {};
    }
    data.__cf = {
      compile: coffeefilter.compile,
      settings: coffeefilter.settings
    };
    tpl = coffeefilter.compile(filename, data);
    try {
      return (tpl(data)).render();
    } catch (e) {
      throw new TemplateError("Error rendering " + filename + ": " + e.message);
    }
  };

  coffeefilter.default_date_function = function(date, format, type) {
    return date;
  };

  coffeefilter.settings = {
    cache: false,
    datetime_function: coffeefilter.default_date_function,
    date_format: "YYYY-MM-DD",
    datetime_format: "YYYY-MM-DD HH:mm",
    time_format: "HH:mm"
  };

  coffeefilter.configure = function(new_settings) {
    var set;
    if (new_settings == null) {
      new_settings = {};
    }
    set = function(key) {
      return coffeefilter.settings[key] = new_settings[key] || coffeefilter.settings[key];
    };
    set("cache");
    set("datetime_function");
    set("date_format");
    set("datetime_format");
    return set("time_format");
  };

  if (typeof window === "undefined" || window === null) {
    coffeefilter.adapters = {
      simple: coffeefilter.render,
      meryl: coffeefilter.render,
      express: function(filename, data, callback) {
        var str, _ref;
        if (typeof data === 'function') {
          _ref = [data, callback], callback = _ref[0], data = _ref[1];
        }
        if (data === null) {
          data = {};
        }
        str = coffeefilter.render(filename, data);
        return callback(null, str);
      }
    };
  }

}).call(this);