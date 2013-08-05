/*TK JavaScript Library v1.0.1*/
(function(win, undefined) {
	
	"use strict";
	
	Object.extend || (Object.prototype.extend = function(options) {
		
		var target = this,src,copy;
		if (options) {
			for (name in options) {
				src = target[name];
				copy = options[name];
				//console.log(name);
				if (target === copy) {
					continue;
				}
				
				if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	});
	
	String.hasString || (String.prototype.hasString = function(a) {
		if ("object" == typeof a) {
			for ( var b = 0, e = a.length; b < e; b++)
				if (!this.hasString(a[b]))
					return !1;
			return !0
		}
		if (-1 != this.indexOf(a))
			return !0
	});
	
	var loc = win.location, /**/
	doc = win.document, /**/
	nav = win.navigator,
	docElem = doc.documentElement, 
	$doc,
	g = {},
	readyFuns,
	removeReadyListener,
	readyList, /**/
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, /**/
	TK = function(selector, context) {
		return new TK.fn.init(selector, context, $doc);
	},
	core = {
		version : "1.0.1",
		class2type : {},
		deletedIds : []
	},
	completed = function(event) {
		if (doc.addEventListener || event.type === "load" || doc.readyState === "complete") {
			detach();
			TK.ready();
		}
	},
	detach = function() {
		if (doc.addEventListener) {
			doc.removeEventListener("DOMContentLoaded", completed, false);
			win.removeEventListener("load", completed, false);
		} else {
			doc.detachEvent("onreadystatechange", completed);
			win.detachEvent("onload", completed);
		}
	},
	_TK = window.TK;
	TK.core = core;
	core.extend({
		concat : core.deletedIds.concat,
		push : core.deletedIds.push,
		pop : core.deletedIds.pop,
		slice : core.deletedIds.slice,
		sort : core.deletedIds.sort,
		splice : core.deletedIds.splice,
		indexOf : core.deletedIds.indexOf || function( elem ) {
			var i = 0,
			len = this.length;
			for ( ; i < len; i++ ) {
				if ( this[i] === elem ) {
					return i;
				}
			}
			return -1;
		},
		toString : core.class2type.toString,
		hasOwn : core.class2type.hasOwnProperty,
		trim : core.version.trim,
	});
	
	TK.fn = {
		version : core.version,
		constructor : TK,
		selector : "",
		push : core.push,
		sort : core.sort,
		splice : core.splice,
		toArray : function() {
			return core.slice.call(this);
		},	
		get : function(num) {
			return num == null ?
			this.toArray() :
			(num < 0 ? (num %= this.length,this[this.length + num] ): this[num]);
		},
		each : function(obj, callback, args) {
			var value, i = 0, length = obj.length, isArray = isArraylike(obj);

			if (args) {
				if (isArray) {
					for (; i < length; i++) {
						value = callback.apply(obj[i], args);
						if (value === false) {
							break;
						}
					}
				} else {
					for (i in obj) {
						value = callback.apply(obj[i], args);
						if (value === false) {
							break;
						}
					}
				}

				// A special, fast, case for the most common use of each
			} else {
				if (isArray) {
					for (; i < length; i++) {
						value = callback.call(obj[i], i, obj[i]);

						if (value === false) {
							break;
						}
					}
				} else {
					for (i in obj) {
						value = callback.call(obj[i], i, obj[i]);

						if (value === false) {
							break;
						}
					}
				}
			}

			return obj;
		},

		init : function(selector, context, $doc) {
			var match,elem;
			if (!selector) {
				return this;
			} else if(selector === "body" && doc.body){
				this.context=doc;
				this[0]=doc.body;
				this.selector=selector;
				this.length=1;
				return this;
			} else if (typeof selector === "string") {
				if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
				} else {
					match = rquickExpr.exec( selector );
				}
				
				if ( match && (match[1] || !context) ) {
					console.log(match);
					if ( match[1] ) {
						
					}else{
						elem = document.getElementById( match[2] );
						if ( elem && elem.parentNode ) {
							if ( elem.id !== match[2] ) {
								return $doc.find( selector );
							}
							this.length = 1;
							this[0] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}
					
				}else if(!context || context.version){
					return ( context || $doc ).find( selector );
				}else{
					return this.constructor( context ).find( selector );
				}
				
			} else if (selector.nodeType) {
				this.context =  this[0] = selector;
				this.length = 1;
				return this;
			} else if (TK.isFunction(selector)) {
				return $doc.ready(selector);
			}

			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}			
			
			return TK.makeArray( selector, this );
			
		},

		pushStack:function(name,b,c){
			var self=this.constructor();
			
			if(TK.isArray(name)){
				Array.prototype.push.apply(self,name);
			}else{
				TK.merge(self,name);
			}
			
			self.prevObject = this;
			self.context = this.context;
			
			if(b === "find"){
				self.selector = this.selector + (this.selector ? " " : "" ) + c;
			}else if(b){
				self.selector = this.selector + "." + b + "(" + c +")" ;
			}
			
			return self;
		},

		noConflict: function( deep ) {
			if ( window.TK === TK ) {
				window.TK = _TK;
			}
			return TK;
		},


		error : function(msg) {
			throw new Error(msg);
		},

		nodeName : function(elem, name) {
			return elem.nodeName
					&& elem.nodeName.toLowerCase() === name.toLowerCase();
		},
		
		
		trim : core.trim && !core.trim.call("\uFEFF\xA0") ? function(text) {
			return text == null ? "" : core.trim.call(text);
		} : function(text) {
			return text == null ? "" : (text + "").replace(rtrim, "");
		},
		
		makeArray : function(arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArraylike(Object(arr))) {
					TK.merge(ret, typeof arr === "string" ? [ arr ] : arr);
				} else {
					core.push.call(ret, arr);
				}
			}

			return ret;
		},
		inArray : function(elem, arr, i) {
			var len;

			if (arr) {
				if (core.indexOf) {
					return core.indexOf.call(arr, elem, i);
				}

				len = arr.length;
				i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

				for (; i < len; i++) {
					// Skip accessing in sparse arrays
					if (i in arr && arr[i] === elem) {
						return i;
					}
				}
			}

			return -1;
		},
		merge : function(first, second) {
			var l = second.length, i = first.length, j = 0;

			if (typeof l === "number") {
				for (; j < l; j++) {
					first[i++] = second[j];
				}
			} else {
				while (second[j] !== undefined) {
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		},
		grep : function(elems, callback, inv) {
			var retVal, ret = [], i = 0, length = elems.length;
			inv = !!inv;
			for (; i < length; i++) {
				retVal = !!callback(elems[i], i);
				if (inv !== retVal) {
					ret.push(elems[i]);
				}
			}

			return ret;
		},
		now : function() {
			return (new Date()).getTime();
		},
		EA : function(a,b,e,g){
			if(a){
				if(TK.isString(e)){
					var i=e,e=function(){eval(i);};
				}
				return a.addEventListener?("mousewheel"==b&&TK.B.firefox&&(b="DOMMouseScroll"),
						a.addEventListener(b,e,g),!0):a.attachEvent?a.attachEvent("on"+b,e):!1;
			}
		},
		readyDo:[],
		readyDone : false,
		isReadyDone : false,
		onReady:function(){
			
			if(!TK.fn.readyDone){
				
				TK.fn.readyDone=!0;
				for(var a=0,b=TK.fn.readyDo.length;a<b;a++){
					TK.fn.readyDo[a]();
				}
				TK.fn.readyDo = null
			}
		},
		isReady:function(){
			if(!TK.fn.isReadyDone){
				TK.fn.isReadyDone=!0;
				
				if("complete"==document.readyState){
					TK.fn.onReady();
					
				}else if(document.addEventListener){
					var arg = arguments;
					if("interactive"==document.readyState&&!TK.B.ie9){
						TK.fn.onReady();
					}else {
//						console.log(Date());
						document.addEventListener("DOMContentLoaded",function(arg){document.removeEventListener("DOMContentLoaded",arg.callee,!1);TK.fn.onReady();},!1);
					}	
				} else if(document.attachEvent){
					var a=top!=self;
					if(a){
						document.attachEvent("onreadystatechange",function(){
							"complete"===document.readyState&&(document.detachEvent("onreadystatechange",arguments.callee),TK.fn.onReady())
						});
					}else{
						if(document.documentElement.doScroll){
							(function(){
								if(!TK.fn.readyDone){
									try{
										document.documentElement.doScroll("left");
									}catch(a){
										setTimeout(arguments.callee,0);
										return;
									}
									TK.fn.onReady();
								}
							})();
						}
					}
					
				}
				TK.fn.EA(window,"load",TK.fn.onReady)
			}
		},
		ready:function(a){
//			console.log(Date());
			if(TK.fn.readyDone){
				a();
			}else{
				TK.fn.isreadyDone?TK.fn.readyDo.push(a):(TK.fn.readyDo=[a],TK.fn.isReady());
			}
			return TK;
		}

	};

	TK.prototype = TK.fn.init.prototype = TK.fn;
	
	TK.extend({

		isFunction : function(obj) {
			return TK.type(obj) === "function";
		},

		isArray : Array.isArray || function(obj) {
			return TK.type(obj) === "array";
		},

		isWindow : function(obj) {
			return obj != null && obj == obj.win;
		},

		isNumeric : function(obj) {
			return !isNaN(parseFloat(obj)) && isFinite(obj);
		},

		type : function(obj) {
			if (obj == null) {
				return String(obj);
			}
			return typeof obj === "object" || typeof obj === "function" ? core["class2type"][core["toString"]
					.call(obj)]
					|| "object"
					: typeof obj;
		},
		isEmptyObject : function(obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},	
		isUndefined:function(a){
			return"undefined"==typeof a;
		},
		each:function(a,b){
			if(a){
				if(TK.isUndefined(a[0])&&!TK.isArray(a)){
					for(var e in a){
						if(b(a[e],e)){
							break
						}
					}
				}else{
					e=0;
					for(var g=a.length;e<g&&!b(a[e],e);e++);
				}
					
			}

		}
	});

	 

	$doc=TK(doc);

	
	(function( win, undefined ) {
		var strundefined = typeof undefined,
			MAX_NEGATIVE = 1 << 31,
			arr = [],
			hasOwn = core.hasOwn,
			push = core.push,
			push_native = core.push,
			slice = core.slice,
			indexOf = core.indexOf,
			pop = core.pop,
			push = core.push,
			preferredDoc = win.document,
			setDocument,
			document,
			docElem,
			documentIsHTML,
			isXML,
			support,
			Expr,
			strundefined = typeof undefined,
			booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
			whitespace = "[\\x20\\t\\r\\n\\f]",
			characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
			identifier = characterEncoding.replace( "w", "w#" ),
			attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
			"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
			runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
			funescape = function( _, escaped, escapedWhitespace ) {
				var high = "0x" + escaped - 0x10000;
				return high !== high || escapedWhitespace ?
					escaped :
					high < 0 ?
						String.fromCharCode( high + 0x10000 ) :
						String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
			},
			pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",
			matchExpr = {
					"ID": new RegExp( "^#(" + characterEncoding + ")" ),
					"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
					"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
					"ATTR": new RegExp( "^" + attributes ),
					"PSEUDO": new RegExp( "^" + pseudos ),
					"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
						"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
						"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
					"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
					// For use in libraries implementing .is()
					// We use this for POS matching in `select`
					"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
						whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
				},
			expando = "sizzle" + -(new Date()),
			rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
			classCache = createCache(),
			tokenCache = createCache(),
			rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
			compile,
			rsibling = new RegExp( whitespace + "*[+~]" )
			;
		
		try {
			push.apply(
				(arr = slice.call( preferredDoc.childNodes )),
				preferredDoc.childNodes
			);
			arr[ preferredDoc.childNodes.length ].nodeType;
			
		} catch ( e ) {
			push = { apply: arr.length ?
				function( target, els ) {
					push_native.apply( target, slice.call(els) );
				} :
				function( target, els ) {
					var j = target.length,
						i = 0;
					// Can't trust NodeList.length
					while ( (target[j++] = els[i++]) ) {}
					target.length = j - 1;
				}
			};
		}
		
		function Sizzle( selector, context, results, seed ) {
			var nodeType;
			setDocument( context );
			context = context || document;
			results = results || [];
			
			if ( !selector || typeof selector !== "string" ) {
				return results;
			}
			
			if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
				return [];
			}
			
			
			return select( selector.replace( rtrim, "$1" ), context, results, seed );
			
		}
		
		function createCache() {
			var keys = [];
			function cache( key, value ) {
				if ( keys.push( key += " " ) > Expr.cacheLength ) {
					delete cache[ keys.shift() ];
				}
				return (cache[ key ] = value);
			}
			return cache;
		}
		
		function markFunction( fn ) {
			fn[ expando ] = true;
			return fn;
		}
		function assert( fn ) {
			var div = document.createElement("div");

			try {
				return !!fn( div );
			} catch (e) {
				return false;
			} finally {
				if ( div.parentNode ) {
					div.parentNode.removeChild( div );
				}
				div = null;
			}
		}		
		
		function addHandle( attrs, handler ) {
			var arr = attrs.split("|"),
				i = attrs.length;

			while ( i-- ) {
				Expr.attrHandle[ arr[i] ] = handler;
			}
		}
		function createPositionalPseudo( fn ) {
			return markFunction(function( argument ) {
				argument = +argument;
				return markFunction(function( seed, matches ) {
					var j,
						matchIndexes = fn( [], seed.length, argument ),
						i = matchIndexes.length;

					// Match elements found at the specified indexes
					while ( i-- ) {
						if ( seed[ (j = matchIndexes[i]) ] ) {
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}
		
		isXML = Sizzle.isXML = function( elem ) {
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};
		
		support = Sizzle.support = {};
		
		setDocument = Sizzle.setDocument = function( node ) {
			var doc = node ? node.ownerDocument || node : preferredDoc,
					parent = doc.defaultView;
			if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
				return document;
			}
			
			document = doc;
			docElem = doc.documentElement;
			
			documentIsHTML = !isXML( doc );
			
			if ( parent && parent.attachEvent && parent !== parent.top ) {
				parent.attachEvent( "onbeforeunload", function() {
					setDocument();
				});
			}
			
			support.attributes = assert(function( div ) {
				div.className = "i";
				return !div.getAttribute("className");
			});
			
			support.getElementsByTagName = assert(function( div ) {
				div.appendChild( doc.createComment("") );
				return !div.getElementsByTagName("*").length;
			});
			
			support.getElementsByClassName = assert(function( div ) {
				div.innerHTML = "<div class='a'></div><div class='a i'></div>";
				div.firstChild.className = "i";
				return div.getElementsByClassName("i").length === 2;
			});

			support.getById = assert(function( div ) {
				docElem.appendChild( div ).id = expando;
				return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
			});
			
			if ( support.getById ) {
				Expr.find["ID"] = function( id, context ) {
					if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
						var m = context.getElementById( id );
						return m && m.parentNode ? [m] : [];
					}
				};
				Expr.filter["ID"] = function( id ) {
					var attrId = id.replace( runescape, funescape );
					return function( elem ) {
						return elem.getAttribute("id") === attrId;
					};
				};
			} else {
				delete Expr.find["ID"];
				Expr.filter["ID"] =  function( id ) {
					var attrId = id.replace( runescape, funescape );
					return function( elem ) {
						var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
						return node && node.value === attrId;
					};
				};
			}
			
			Expr.find["TAG"] = support.getElementsByTagName ?
					function( tag, context ) {
						if ( typeof context.getElementsByTagName !== strundefined ) {
							return context.getElementsByTagName( tag );
						}
					} :
					function( tag, context ) {
						var elem,
							tmp = [],
							i = 0,
							results = context.getElementsByTagName( tag );

						if ( tag === "*" ) {
							while ( (elem = results[i++]) ) {
								if ( elem.nodeType === 1 ) {
									tmp.push( elem );
								}
							}

							return tmp;
						}
						return results;
					};
			
			Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
				if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
					return context.getElementsByClassName( className );
				}
			};	
			
			return doc;					
		};
		
		Expr = Sizzle.selectors = {

				// Can be adjusted by the user
				cacheLength : 50,

				createPseudo : markFunction,

				match : matchExpr,

				attrHandle : {},

				find : {},

				relative : {
					">" : {
						dir : "parentNode",
						first : true
					},
					" " : {
						dir : "parentNode"
					},
					"+" : {
						dir : "previousSibling",
						first : true
					},
					"~" : {
						dir : "previousSibling"
					}
				},

				preFilter : {
					"ATTR" : function(match) {
						match[1] = match[1].replace(runescape, funescape);

						// Move the given value to match[3] whether quoted or
						// unquoted
						match[3] = (match[4] || match[5] || "").replace(runescape,
								funescape);

						if (match[2] === "~=") {
							match[3] = " " + match[3] + " ";
						}

						return match.slice(0, 4);
					},

					"CHILD" : function(match) {
						/*
						 * matches from matchExpr["CHILD"] 1 type (only|nth|...)
						 * 2 what (child|of-type) 3 argument
						 * (even|odd|\d*|\d*n([+-]\d+)?|...) 4 xn-component of
						 * xn+y argument ([+-]?\d*n|) 5 sign of xn-component 6 x
						 * of xn-component 7 sign of y-component 8 y of
						 * y-component
						 */
						match[1] = match[1].toLowerCase();

						if (match[1].slice(0, 3) === "nth") {
							// nth-* requires argument
							if (!match[3]) {
								Sizzle.error(match[0]);
							}

							// numeric x and y parameters for Expr.filter.CHILD
							// remember that false/true cast respectively to 0/1
							match[4] = +(match[4] ? match[5] + (match[6] || 1)
									: 2 * (match[3] === "even" || match[3] === "odd"));
							match[5] = +((match[7] + match[8]) || match[3] === "odd");

							// other types prohibit arguments
						} else if (match[3]) {
							Sizzle.error(match[0]);
						}

						return match;
					},

					"PSEUDO" : function(match) {
						var excess, unquoted = !match[5] && match[2];

						if (matchExpr["CHILD"].test(match[0])) {
							return null;
						}

						// Accept quoted arguments as-is
						if (match[3] && match[4] !== undefined) {
							match[2] = match[4];

							// Strip excess characters from unquoted arguments
						} else if (unquoted
								&& rpseudo.test(unquoted)
								&&
								// Get excess from tokenize (recursively)
								(excess = tokenize(unquoted, true))
								&&
								// advance to the next closing parenthesis
								(excess = unquoted.indexOf(")", unquoted.length - excess)
										- unquoted.length)) {

							// excess is a negative index
							match[0] = match[0].slice(0, excess);
							match[2] = unquoted.slice(0, excess);
						}

						// Return only captures needed by the pseudo filter
						// method (type and
						// argument)
						return match.slice(0, 3);
					}
				},

				filter : {

					"TAG" : function(nodeNameSelector) {
						var nodeName = nodeNameSelector.replace(runescape, funescape)
								.toLowerCase();
						return nodeNameSelector === "*" ? function() {
							return true;
						} : function(elem) {
							return elem.nodeName
									&& elem.nodeName.toLowerCase() === nodeName;
						};
					},

					"CLASS" : function(className) {
						var pattern = classCache[className + " "];

						return pattern
								|| (pattern = new RegExp("(^|" + whitespace + ")"
										+ className + "(" + whitespace + "|$)"))
								&& classCache(className, function(elem) {
									return pattern.test(typeof elem.className === "string"
											&& elem.className
											|| typeof elem.getAttribute !== strundefined
											&& elem.getAttribute("class") || "");
								});
					},

					"ATTR" : function(name, operator, check) {
						return function(elem) {
							var result = Sizzle.attr(elem, name);

							if (result == null) {
								return operator === "!=";
							}
							if (!operator) {
								return true;
							}

							result += "";

							return operator === "=" ? result === check
									: operator === "!=" ? result !== check
											: operator === "^=" ? check
													&& result.indexOf(check) === 0
													: operator === "*=" ? check
															&& result.indexOf(check) > -1
															: operator === "$=" ? check
																	&& result
																			.slice(-check.length) === check
																	: operator === "~=" ? (" "
																			+ result + " ")
																			.indexOf(check) > -1
																			: operator === "|=" ? result === check
																					|| result
																							.slice(
																									0,
																									check.length + 1) === check
																							+ "-"
																					: false;
						};
					},

					"CHILD" : function(type, what, argument, first, last) {
						var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";

						return first === 1 && last === 0 ?

						// Shortcut for :nth-*(n)
						function(elem) {
							return !!elem.parentNode;
						}
								:

								function(elem, context, xml) {
									var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling"
											: "previousSibling", parent = elem.parentNode, name = ofType
											&& elem.nodeName.toLowerCase(), useCache = !xml
											&& !ofType;

									if (parent) {

										// :(first|last|only)-(child|of-type)
										if (simple) {
											while (dir) {
												node = elem;
												while ((node = node[dir])) {
													if (ofType ? node.nodeName
															.toLowerCase() === name
															: node.nodeType === 1) {
														return false;
													}
												}
												// Reverse direction for :only-*
												// (if we
												// haven't yet done so)
												start = dir = type === "only" && !start
														&& "nextSibling";
											}
											return true;
										}

										start = [ forward ? parent.firstChild
												: parent.lastChild ];

										if (forward && useCache) {
											outerCache = parent[expando]
													|| (parent[expando] = {});
											cache = outerCache[type] || [];
											nodeIndex = cache[0] === dirruns && cache[1];
											diff = cache[0] === dirruns && cache[2];
											node = nodeIndex
													&& parent.childNodes[nodeIndex];

											while ((node = ++nodeIndex && node && node[dir]
													||

													(diff = nodeIndex = 0) || start.pop())) {
												if (node.nodeType === 1 && ++diff
														&& node === elem) {
													outerCache[type] = [ dirruns,
															nodeIndex, diff ];
													break;
												}
											}
										} else if (useCache
												&& (cache = (elem[expando] || (elem[expando] = {}))[type])
												&& cache[0] === dirruns) {
											diff = cache[1];
										} else {
											while ((node = ++nodeIndex && node && node[dir]
													|| (diff = nodeIndex = 0)
													|| start.pop())) {

												if ((ofType ? node.nodeName.toLowerCase() === name
														: node.nodeType === 1)
														&& ++diff) {
													if (useCache) {
														(node[expando] || (node[expando] = {}))[type] = [
																dirruns, diff ];
													}

													if (node === elem) {
														break;
													}
												}
											}
										}

										// Incorporate the offset, then check
										// against cycle
										// size
										diff -= last;
										return diff === first
												|| (diff % first === 0 && diff / first >= 0);
									}
								};
					},

					"PSEUDO" : function(pseudo, argument) {
						var args, fn = Expr.pseudos[pseudo]
								|| Expr.setFilters[pseudo.toLowerCase()]
								|| Sizzle.error("unsupported pseudo: " + pseudo);

						if (fn[expando]) {
							return fn(argument);
						}

						// But maintain support for old signatures
						if (fn.length > 1) {
							args = [ pseudo, pseudo, "", argument ];
							return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(
									seed, matches) {
								var idx, matched = fn(seed, argument), i = matched.length;
								while (i--) {
									idx = indexOf.call(seed, matched[i]);
									seed[idx] = !(matches[idx] = matched[i]);
								}
							})
									: function(elem) {
										return fn(elem, 0, args);
									};
						}

						return fn;
					}
				},

				pseudos : {
					// Potentially complex pseudos
					"not" : markFunction(function(selector) {
						var input = [], results = [], matcher = compile(selector.replace(
								rtrim, "$1"));

						return matcher[expando] ? markFunction(function(seed, matches,
								context, xml) {
							var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;

							while (i--) {
								if ((elem = unmatched[i])) {
									seed[i] = !(matches[i] = elem);
								}
							}
						})
								: function(elem, context, xml) {
									input[0] = elem;
									matcher(input, null, xml, results);
									return !results.pop();
								};
					}),

					"has" : markFunction(function(selector) {
						return function(elem) {
							return Sizzle(selector, elem).length > 0;
						};
					}),

					"contains" : markFunction(function(text) {
						return function(elem) {
							return (elem.textContent || elem.innerText || getText(elem))
									.indexOf(text) > -1;
						};
					}),

					"lang" : markFunction(function(lang) {
						// lang value must be a valid identifier
						if (!ridentifier.test(lang || "")) {
							Sizzle.error("unsupported lang: " + lang);
						}
						lang = lang.replace(runescape, funescape).toLowerCase();
						return function(elem) {
							var elemLang;
							do {
								if ((elemLang = documentIsHTML ? elem.lang : elem
										.getAttribute("xml:lang")
										|| elem.getAttribute("lang"))) {

									elemLang = elemLang.toLowerCase();
									return elemLang === lang
											|| elemLang.indexOf(lang + "-") === 0;
								}
							} while ((elem = elem.parentNode) && elem.nodeType === 1);
							return false;
						};
					}),

					// Miscellaneous
					"target" : function(elem) {
						var hash = window.location && window.location.hash;
						return hash && hash.slice(1) === elem.id;
					},

					"root" : function(elem) {
						return elem === docElem;
					},

					"focus" : function(elem) {
						return elem === document.activeElement
								&& (!document.hasFocus || document.hasFocus())
								&& !!(elem.type || elem.href || ~elem.tabIndex);
					},

					// Boolean properties
					"enabled" : function(elem) {
						return elem.disabled === false;
					},

					"disabled" : function(elem) {
						return elem.disabled === true;
					},

					"checked" : function(elem) {
						var nodeName = elem.nodeName.toLowerCase();
						return (nodeName === "input" && !!elem.checked)
								|| (nodeName === "option" && !!elem.selected);
					},

					"selected" : function(elem) {
						if (elem.parentNode) {
							elem.parentNode.selectedIndex;
						}

						return elem.selected === true;
					},

					// Contents
					"empty" : function(elem) {
						for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
							if (elem.nodeName > "@" || elem.nodeType === 3
									|| elem.nodeType === 4) {
								return false;
							}
						}
						return true;
					},

					"parent" : function(elem) {
						return !Expr.pseudos["empty"](elem);
					},

					// Element/input types
					"header" : function(elem) {
						return rheader.test(elem.nodeName);
					},

					"input" : function(elem) {
						return rinputs.test(elem.nodeName);
					},

					"button" : function(elem) {
						var name = elem.nodeName.toLowerCase();
						return name === "input" && elem.type === "button"
								|| name === "button";
					},

					"text" : function(elem) {
						var attr;
						return elem.nodeName.toLowerCase() === "input"
								&& elem.type === "text"
								&& ((attr = elem.getAttribute("type")) == null || attr
										.toLowerCase() === elem.type);
					},

					"first" : createPositionalPseudo(function() {
						return [ 0 ];
					}),

					"last" : createPositionalPseudo(function(matchIndexes, length) {
						return [ length - 1 ];
					}),

					"eq" : createPositionalPseudo(function(matchIndexes, length, argument) {
						return [ argument < 0 ? argument + length : argument ];
					}),

					"even" : createPositionalPseudo(function(matchIndexes, length) {
						var i = 0;
						for (; i < length; i += 2) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"odd" : createPositionalPseudo(function(matchIndexes, length) {
						var i = 1;
						for (; i < length; i += 2) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"lt" : createPositionalPseudo(function(matchIndexes, length, argument) {
						var i = argument < 0 ? argument + length : argument;
						for (; --i >= 0;) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"gt" : createPositionalPseudo(function(matchIndexes, length, argument) {
						var i = argument < 0 ? argument + length : argument;
						for (; ++i < length;) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					})
				}
			};
		
		function tokenize( selector, parseOnly ) {
			
			var matched, match, tokens, type,
				soFar, groups, preFilters,
				cached = tokenCache[ selector + " " ];

			if ( cached ) {
				return parseOnly ? 0 : cached.slice( 0 );
			}

			soFar = selector;
			groups = [];
			preFilters = Expr.preFilter;
			
			while ( soFar ) {

				// Comma and first run
				if ( !matched || (match = rcomma.exec( soFar )) ) {
					if ( match ) {
						// Don't consume trailing commas as valid
						soFar = soFar.slice( match[0].length ) || soFar;
					}
					groups.push( tokens = [] );
				}

				matched = false;

				// Combinators
				if ( (match = rcombinators.exec( soFar )) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						// Cast descendant combinators to space
						type: match[0].replace( rtrim, " " )
					});
					soFar = soFar.slice( matched.length );
				}
				

				// Filters
				for ( type in Expr.filter ) {
					
					if ((type !== "extend") && (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
						(match = preFilters[ type ]( match ))) ) {
						matched = match.shift();
						tokens.push({
							value: matched,
							type: type,
							matches: match
						});
						soFar = soFar.slice( matched.length );
					}
				}
				
				
				if ( !matched ) {
					break;
				}
			}
			

			// Return the length of the invalid excess
			// if we're just parsing
			// Otherwise, throw an error or return tokens
			return parseOnly ?
				soFar.length :
				soFar ?
					Sizzle.error( selector ) :
					// Cache the tokens
					tokenCache( selector, groups ).slice( 0 );
		}
		
		function toSelector( tokens ) {
			var i = 0,
				len = tokens.length,
				selector = "";
			for ( ; i < len; i++ ) {
				selector += tokens[i].value;
			}
			return selector;
		}		
		
		compile = Sizzle.compile = function( selector, group ) {
			
			var i,
				setMatchers = [],
				elementMatchers = [],
				cached = compilerCache[ selector + " " ];

			if ( !cached ) {
				// Generate a function of recursive functions that can be used to check each element
				if ( !group ) {
					group = tokenize( selector );
				}
				i = group.length;
				while ( i-- ) {
					cached = matcherFromTokens( group[i] );
					if ( cached[ expando ] ) {
						setMatchers.push( cached );
					} else {
						elementMatchers.push( cached );
					}
				}

				// Cache the compiled function
				cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
			}
			return cached;
		};
		
		function select( selector, context, results, seed ) {
			
			var i, tokens, token, type, find,
				match = tokenize( selector );
			
			if ( !seed ) {
				if ( match.length === 1 ) {
					tokens = match[0] = match[0].slice( 0 );
					if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
							support.getById && context.nodeType === 9 && documentIsHTML &&
							Expr.relative[ tokens[1].type ] ) {

						context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
						if ( !context ) {
							return results;
						}
						selector = selector.slice( tokens.shift().value.length );
					}
					i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
					while ( i-- ) {
						token = tokens[i];
						if ( Expr.relative[ (type = token.type) ] ) {
							break;
						}
						if ( (find = Expr.find[ type ]) ) {
							if ( (seed = find(
								token.matches[0].replace( runescape, funescape ),
								rsibling.test( tokens[0].type ) && context.parentNode || context
							)) ) {
								tokens.splice( i, 1 );
								selector = seed.length && toSelector( tokens );
								if ( !selector ) {
									push.apply( results, seed );
									return results;
								}

								break;
							}
						}
					}
				}
			}
			
			compile( selector, match )(
				seed,
				context,
				!documentIsHTML,
				results,
				rsibling.test( selector )
			);
			
			return results;
		}
		TK.find = Sizzle;
	})(win);
	
	
	TK.Callbacks=function(){
		var funContainer = [];

		var addFun = function(obj){
			for(var i = 0, len = obj.length, value, _type; i < len; ++i){
				value = obj[i];
				_type = TK.type(value);
				
				if(_type === "array"){
					addFun(value);
				}else if(_type === "function"){
					funContainer.push(value);
				}
			}
		};
		
		var addFunsUI = {
			add : function(){
				
				if(funContainer){
					addFun(arguments);
				}
				return this;
			},
			empty : function(){
				funContainer = [];
				return this;
			},
			fireWith:function(){
			
				for(var i = 0, len = funContainer.length; i < len; ++i){
					funContainer[i]();
				}
				return this;
			}
		};
		
		return addFunsUI
	};
	
	TK.each("Boolean Number String Function Array Date RegExp Object Error"
			.split(" "), function(name, i) {
		core.class2type["[object " + name + "]"] = name.toLowerCase();
	});	
	
	function isArraylike(obj) {
		var length = obj.length, type = TK.type(obj);

		if (TK.isWindow(obj)) {
			return false;
		}

		if (obj.nodeType === 1 && length) {
			return true;
		}

		return type === "array"
				|| type !== "function"
				&& (length === 0 || typeof length === "number" && length > 0
						&& (length - 1) in obj);
	}
	
	TK.B = function(){
		var a={},b=navigator.userAgent;
		a.win=a.win||b.hasString("Win32");
		TK.each({win:"Windows",mac:"Mac",ie:"MSIE",ie6:"MSIE 6",ie7:"MSIE 7",ie8:"MSIE 8",ie9:"MSIE 9",safari:"WebKit",webkit:"WebKit",chrome:"Chrome",ipad:"iPad",iphone:"iPhone",os4:"OS 4",os5:"OS 5",os6:"OS 6",qq:"QQBrowser",firefox:"Firefox",tt:"TencentTraveler",opera:"Opera"},function(e,i){a[i]=b.hasString(e)});
		a.ie6=a.ie6&&!a.ie7&&!a.ie8;
		a.opera=window.opera||a.opera;
		try{
			a.maxthon=window.external&&window.external.max_version;
		}catch(e){}
		return a
	}();
	
	
	
	
	TK.extend({
		find: function( selector ) {
			var i,
				ret = [],
				self = this,
				len = self.length;

			if ( typeof selector !== "string" ) {
				return this.pushStack( TK( selector ).filter(function() {
					for ( i = 0; i < len; i++ ) {
						if ( TK.contains( self[ i ], this ) ) {
							return true;
						}
					}
				}) );
			}

			for ( i = 0; i < len; i++ ) {
				TK.find( selector, self[ i ], ret );
			}

			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? TK.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		_trim : function(str) {
			return str.replace(/^\s+|\s+$/g, "");
		},
		xmlHttp : function() {
			return new XMLHttpRequest();
		},
		windowWidth : function() {
			var a = doc.documentElement;
			return self.innerWidth || a && a.clientWidth
					|| doc.body.clientWidth;
		},
		windowHeight : function() {
			var a = doc.documentElement;
			return self.innerHeight || a && a.clientHeight
					|| doc.body.clientHeight;
		},
		width : function(obj) {
			return obj ? parseInt(obj.offsetWidth) : 0;
		},
		utfDecode : function(a) {
			var b = "";
			for ( var c = 0, g = 0, l = a.length; c < l;) {
				g = a.charCodeAt(c);
				if (128 > g) {
					b += String.fromCharCode(g);
					c++;
				} else if (191 < g && 224 > g) {
					b += String.fromCharCode((g & 31) << 6 | a.charCodeAt(c + 1)
							& 63);
					c += 2;
				} else {
					b += String.fromCharCode((g & 15) << 12
							| (a.charCodeAt(c + 1) & 63) << 6 | a.charCodeAt(c + 2)
							& 63);
					c += 3;
				}
			}
			return b;
		},
		utfEncode : function(a) {
			var b = "";
			a = a.replace(/\r\n/g, "\n");
			for ( var c = 0, g = 0, l = a.length; c < l; c++) {
				g = a.charCodeAt(c);
				if (128 > g) {
					b += String.fromCharCode(g);
				} else if (127 < g && 2048 > g) {
					b += String.fromCharCode(g >> 6 | 192);
					b += String.fromCharCode(g & 63 | 128);
				} else {
					b += String.fromCharCode(g >> 12 | 224);
					b += String.fromCharCode(g >> 6 & 63 | 128);
					b += String.fromCharCode(g & 63 | 128);
				}
			}
			return b;
		},
		append : function(child, parent) {
			parent.appendChild(child);
		}
	});

	
	TK.extend({
		random : function(a, b) {
			var u = void 0;
			u == a && (a = 0);
			u == b && (b = 9);
			return Math.floor(Math.random() * (b - a + 1) + a);
		},
		hasClass : function(a, b) {
			return !a || !a.className ? !1 : a.className != a.className.replace(
					RegExp("\\b" + b + "\\b"), "");
		},
		isUndefined : function(a) {
			return "undefined" == typeof a;
		},
		getType : function(a) {
			return Object.prototype.toString.call(a).slice(8, -1);
		},
		removeClass : function(a, b) {
			if (a) {
				var c = b.split(" ");
				if (l < c.length) {
					this.each(c, function(b) {
						this.removeClass(a, b);
					});
				} else if (this.hasClass(a, b)) {
					a.className = a.className
							.replace(RegExp("\\b" + b + "\\b"), "").replace(/\s$/,
									"");
				}
			}
		}
	});

	
	TK.extend({
		isElement : function(a) {
			return a && 1 == a.nodeType;
		},
		isDate : function(a) {
			return "Date" == this.getType(a);
		},
		isFunction : function(a) {
			return "Function" == this.getType(a);
		},
		isNumber : function(a) {
			return "Number" == this.getType(a);
		},
		isObject : function(a) {
			return "object" == typeof a;
		},
		isString : function(a) {
			return "String" == this.getType(a);
		}
		
	});
	win.TK = TK;
	
})(window);
