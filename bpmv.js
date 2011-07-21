(function () {
	/**
	* bpmv - A Simple Validator
	*
	* These are tasks that I find myself repeating over and over again. The rules
	* for me including code in here are simple: nothing that tries to manipulate
	* the DOM itself and things that mainly revolve around testing or altering
	* different kinds of states or values.
	*
	* I provide no promises that I will follow my own rules or that any
	* of this code is fit for any purpose. This is a personal library and not
	* a full-blown open source project. I will add and remove what I see fit.
	* Consider yourself warned.
	*
	* That said, I do hope that you can find something you like here. I would
	* recommend that you use a descreet copy and do not load the file from a pulbic
	* source (as I may refactor on a whim). If you wish to use a copy of this code,
	* feel free, but also remember that it's GPL - meaning that if you distribute
	* your altered copy in any way (such as serving it publicly), you must follow
	* the conditions outlined in the GPL.
	*
	********************************************************************************
	* Optional Setup
	********************************************************************************
	* By default, the global variable `bpmv` will be created (attached to `window`).
	* If node.js is detected as the current environment, `exports.bpmv` will be
	* created. Additionally, there are two (admittadly sloppy) global settings you
	* can use to control bpmv.
	*
	* If you do not wish to have bpmv called `bpmv`, you can set BPMV_VARNAME to any
	* string you wish. For example:
	*    BPMV_VARNAME = 'validatorThingy';
	*    // ...bpmv.js is loaded via <script> tag or some other method
	*    validatorThingy.str( 'foo' ); // use it to test a string
	*
	* At file/script load, the varialbe BPMV_ATTACH will be checked or "object-ness".
	* If it is an object, you can use it to attach bpmv to a structure of your
	* choice. For example:
	*    var BPMV_ATTACH = my.big.construct;
	*    // ...bpmv.js is loaded via <script> tag or some other method
	*    // loading the file _after_ setting BPMV_ATTACH is important!
	*    // (I do realize that this pollutes the current scope some. Sorry.)
	*    my.big.construct.bpmv.str( 'foo' ); // attached and ready for use
	*
	* Used together, BPMV_ATTACH and BPMV_VARNAME should give you enough control to
	* avoid any name clashing and perform any customization you'd like. 
	*
	********************************************************************************
	* LICENSE
	********************************************************************************
	* Copyright (C) 2011, Bryn P. Mosher (GPLv2)
	*
	* This library is free software; you can redistribute it and/or modify it under
	* the terms of the GNU Library General Public License Version 2 as published by
	* the Free Software Foundation.
	*
	* This library is distributed in the hope that it will be useful, but WITHOUT
	* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	* FOR A PARTICULAR PURPOSE.  See the GNU Library General Public License for
	* more details.
	*
	* You should have received a copy of the GNU Library General Public License
	* Version 2 along with this library named as bpmv_license.txt; if not, you can
	* find it at http://www.gnu.org/licenses/old-licenses/gpl-2.0.html or write to
	* the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
	* 02110-1301, USA.
	********************************************************************************
	*/
	var bpmv = {
		_cfg : {
			varName : typeof(BPMV_VARNAME) === 'string' ? BPMV_VARNAME : 'bpmv'
		},
		/**
		* tests if something is not just an object, but is an Array and is not empty
		* @param {mixed} dIsArr The value you'd like to test
		* @param {boolean} okEmpty Will return true even if the array is empty
		* @return {boolean} Will return true if an array
		*/
		arr : function ( dIsArr, okEmpty ) {
			return this.obj( dIsArr ) && ( Object.prototype.toString.call(dIsArr) === '[object Array]' ) && ( okEmpty | (dIsArr.length > 0) );
		},
		/**
		* Get the basename of a path
		* @param {string} wellDuh Some sort of path
		* @return {string} The parsed dirname
		*/
		basename : function ( redOrBlue ) {
			var ret = false;
			if ( this.str( redOrBlue ) ) {
				var tstr = this.rtrim( redOrBlue, '/\\' );
				if ( /\//.test( tstr ) ) { // *nix dirs
					var capFlag = tstr.split( '/' );
				} else if ( /\\/.test( tstr ) ) { // windows dirs
					var capFlag = tstr.split( '\\' );
				}
				if ( this.arr( capFlag ) ) {
					ret = capFlag.pop();
				}
			}
			return this.str(ret) ? ret : redOrBlue;
		},
		/**
		* is a boolean
		* @param {mixed} fool The value you'd like to test
		* @return {boolean} Will return true if the value is a real boolean value
		*/
		bool : function ( fool ) {
			return ( typeof(fool) == 'boolean' );
		},
		/**
		* are we in a browser (returns bool, not UA!)
		*/
		brow : function () {
			return this.obj(window) && this.obj(navigator);
		},
		/**
		* camel case
		*/
		ccase : function ( hump, wspace ) {
			if ( !this.str( hump ) ) return hump;
			wspace = this.str( wspace ) ? wspace.split( /\,/ ) : wspace;
			wspace = this.arr( wspace ) ? wspace : [ ' ', '_', '-' ];
			var getChar = new RegExp( '(['+wspace.join( '\\' )+'][a-z])', 'g' ),
				camChar =  new RegExp( '['+wspace.join( '\\' )+']' );
			return hump.replace( getChar, function ( ltr ) {
				return ltr.toUpperCase().replace(camChar,'');
			} );
		},
		/**
		* count number of elements an object actually owns
		* @param {mixed} ahAHah The object you'd like to count
		* @return {number} Will return the count of elements owned by the object
		*/
		count : function ( ahAHah ) {
			if ( this.num( ahAHah.length ) ) {
				return ahAHah.length;
			}
			var objProps = 0;
			if ( this.obj(ahAHah) ) {
				for ( bAtz in ahAHah ) {
					if ( ahAHah.hasOwnProperty(bAtz) ) {
						++objProps;
					}
				}
			}
			return objProps;
		},
		/**
		* is a date object (or in a future addition, a valid date string - todo)
		* @param {mixed} whEn The value you'd like to test
		* @return {boolean} Will return true if the value is a real Date object
		*/
		date : function ( whEn ) {
			return Object.prototype.toString.call(oA) === '[object Date]';
		},
		/**
		* Get the dirname of a path
		* @param {string} wellDuh Some sort of path
		* @return {string} The parsed dirname
		*/
		dirname : function ( wellDuh ) {
			var ret = false;
			if ( this.str( wellDuh ) ) {
				if ( /\//.test( wellDuh ) ) { // *nix dirs
					ret = wellDuh.replace( /\/[^\/]+$/, '' );
				} else if ( /\\/.test( wellDuh ) ) { // windows dirs
					ret = wellDuh.replace( /\\[^\\]+$/, '' );
				}
			}
			return this.str(ret) ? ret : wellDuh;
		},
		/**
		* An alias to combine node() and brow() into a single call (for varialbe storage).
		* This will return which "environment" is in service if known and 'undefined' if not.
		* Currently, only 'undefined', 'browser' and 'node' are supported.
		*/
		env : function () {
			if ( this.node() ) {
				return 'node';
			} else if ( this.brow() ) {
				return 'browser';
			}
			return 'undefined';
		},
		/**
		* Tests strings and numbers for valid floating point format and greater than 0 (may be disabled)
		* @param {mixed} mFreak The value you'd like to test
		* @param {boolean} zeroOk Will return true even if the the value is 0 or less
		* @return {boolean} Will return true if the value is a valid floating point number
		*/
		float : function ( mFreak, zeroOk ) { // validates for formatting so '2.0b' is NOT valid
			return /^\s*[0-9]*\.?[0-9]+\s*$/.test(String(mFreak)) && this.num(mFreak, zeroOk);
		},
		/**
		* is a function?
		* @param {mixed} boOtsy The value you'd like to test
		* @return {boolean} Will return true if the value is a real function
		*/
		func : function ( boOtsy ) {
			return ( typeof(boOtsy) === 'function' );
		},
		/**
		* is a valid hostname with at least a tld parent
		* @param {mixed} drinks The value you'd like to test
		* @return {boolean} Will return true if the value is a valid host name with at least two levelc (name plus tld)
		*/
		host : function ( drinks ) {
			return  /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/.test( drinks );
		},
		/**
		* Parse ini file contents into an object if possible with optional callback.
		* The contents may be a string with newlines or an Array() of strings.
		* This always returns an object, so check for emptiness.
		* @param {string} outie The string or array contents of an ini file
		* @param {gotDfunk} an optional callback function to run  when parsing is complete
		* @return {object} Will return an object representing the parsed ini values and structure
		*/
		ini : function ( outie, gotDfunk ) {
			var outData = {},
				currKey = '';
			if ( this.str(outie) || this.arr(outie) ) {
				var fLines = this.arr(outie) ? outie : outie.split( '\n' );
				for ( aL in fLines ) {
					if ( fLines.hasOwnProperty(aL) && this.str(fLines[aL]) ) {
						switch ( true ) {
							case /(^\s*\[[^\]]+\]\s*$|^\[[^\]]+\]$)/.test( fLines[aL] ):
								// found a header
								currKey = this.trim( fLines[aL].replace( /(^\s*\[|\]\s*$)/g, '' ) );
								outData[currKey] = this.obj(outData[currKey]) ? outData[currKey] : {};
								break;
							case /^[^\=]+\=/.test( fLines[aL] ):
								if ( this.str(currKey) ) { // make sure key is a valid string first
									// found a setting
									var tSpl = fLines[aL].split( '=' );
									if ( tSpl[0] ) {
										tSpl[0] = this.trim( tSpl[0] );
										tSpl[1] = this.trim( tSpl[1] );
										var aVal = undefined;
										switch ( true ) {
											case this.int(tSpl[1]):
												// convert integers
												aVal = parseInt(tSpl[1]);
												break;
											case this.float(tSpl[1]):
												// convert floats
												aVal = parseFloat(tSpl[1]);
												break;
											case /^(on|true|yes|off|false|no)$/i.test(tSpl[1]):
												// convert semi-boolean values to booleans
												aVal = this.trueish( tSpl[1] );
												break;
											case this.str(tSpl[1]):
												// simple strings
												aVal = tSpl[1];
												break;
											default:
												// default is undefined already
												break;
										}
										if ( /\[\]$/.test(tSpl[0]) ) {
											// support multi-part additive arrays (thing[]='value')
											tSpl[0] = tSpl[0].replace( /\[\]$/, '' );
											if ( !this.arr(outData[currKey][tSpl[0]]) ) {
												outData[currKey][tSpl[0]] = [ aVal ];
											} else {
												outData[currKey][tSpl[0]].push( aVal );
											}
										} else {
											outData[currKey][tSpl[0]] = aVal;
										}
									}
								}
								break;
							default:
								break;
						}
					}
				}
			}
			if ( this.func(gotDfunk) ) {
				gotDfunk( outData );
			}
			return outData;
		},
		/**
		* Tests strings and numbers for valid integer format and greater than 0 (may be disabled)
		* @param {mixed} threeD6 The value you'd like to test
		* @param {boolean} zeroOk Will return true even if the the value is 0 or less
		* @return {boolean} Will return true if the value is a valid integer
		*/
		int : function ( threeD6, zeroOk ) { // validates for formatting so '3m' is NOT valid
			return /^\s*[0-9]+\s*$/.test(String(threeD6)) && this.num(threeD6, zeroOk);
		},
		/**
		* Trim whitespace or optionally other characters from the beginning of a string
		* @param {string} bush The string you'd like to trim
		* @param {string} chars Optional list of characters to trim.
		* By default the trim characters are ' \t\n\r'.
		* @return {string} Returns the trimmed string
		*/
		ltrim : function ( bush, chars ) {
			if ( !this.str(bush) ) {
				return bush; // not a string? just return it
			}
			chars = this.str(chars) ? this.rescape( chars ) : ' \t\n\r';
			var rex = new RegExp( '^['+chars+']+', 'g' );
			return bush.replace( rex, '' );
		},
		/**
		* are we running in node?
		* @return {string} Will return the version of node or false if not running node.js
		*/
		node : function () { // detects node.js - will return version or false
			var Ev = this.node;
			if ( !this.str(Ev._cached) && !this.bool(Ev._cached) ) {
				try {
					Ev._cached = ( this.obj(process) && this.str(process.version) );
					Ev._cached = Ev._cached ? process.version : false; // two lines for readibility - convert true to version string
				} catch (e) {
					Ev._cached = false;
				}
			}
			return Ev._cached;
		},
		/**
		* tests if the parseFloat() value of something is a valid number and optionally greater than 0.
		* @param {mixed} fElng The value you'd like to test
		* @param {boolean} zeroOk Will return true even if the the value is 0 or less
		* @return {boolean} Will return true if the value is a valid number
		*/
		num : function ( fElng, zeroOk ) {
			it = parseFloat(fElng);
			if ( !isNaN(fElng) ) {
				return ( zeroOk || ( fElng > 0 ) );
			}
			return false;
		},
		/**
		* is an object and not empty (optionally) - this method is different from the others in that emptiness is ok by default
		* @param {mixed} ojUc The value you'd like to test
		* @param {boolean} populated Optionally test that the object has at least one child of its own
		* @return {boolean} Will return true if the value is a valid object
		*/
		obj : function ( ojUc, populated ) {
			return ( ojUc !== null ) && ( typeof(ojUc) === 'object' ) && ( !populated || (this.count(ojUc) > 0) );
		},
		/**
		* Escape regular expression characters.
		* @param {string} str Some sort of path
		* @return {string} The converted string
		*/
		rescape : function( fromNy ) {
			if ( !this.str(fromNy) ) {
				return fromNy; // not a string? just return it
			}
			return String(fromNy).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		},
		/**
		* Trim whitespace or optionally other characters from the end of a string
		* @param {string} bush The string you'd like to trim
		* @param {string} chars Optional list of characters to trim.
		* By default the trim characters are ' \t\n\r'.
		* @return {string} Returns the trimmed string
		*/
		rtrim : function ( bush, chars ) {
			if ( !this.str(bush) ) {
				return bush; // not a string? just return it
			}
			chars = this.str(chars) ? this.rescape( chars ) : ' \t\n\r';
			var rex = new RegExp( '['+chars+']+$', 'g' );
			return bush.replace( rex, '' );
		},
		/**
		* Serialize an object into a query string
		* @param {mixed} dexter The object you'd like to convert into a query string
		* @return {string} Returns the object converted into a query string.
		* On failure, will return boolean false.
		*/
		serial : function ( dexter ) {
			var spree = [];
			for ( var vic in dexter ) {
				if ( dexter.hasOwnProperty( vic ) ) {
					if ( this.arr(dexter[vic]) ) {
						spree.push.apply( spree, dexter[vic].map( function ( witness ) {
								return escape(vic+'[]') +'='+ escape(witness);
							} ) );
					} else if ( this.obj(dexter[vic]) ) {
						spree.push( escape( vic )+'='+escape(this.ser(dexter[vic])) );
					} else if ( !this.func(dexter[vic]) ) {
						spree.push( escape( vic )+'='+escape( dexter[vic] ) );
					}
				}
			}
			return ( this.count(spree) > 0 ) ? spree.join( '&' ) : false;
		},
		/**
		* is a string of greater than 0 lenth (may be turned off)
		* @param {mixed} cider The value you'd like to test
		* @param {boolean} zeroOk Will return true even if the the length is 0
		* @return {boolean} Will return true if the value is a valid string
		*/
		str : function ( cider, zeroOk ) {
			return ( typeof( cider ) === 'string' ) && ( zeroOk || ( cider.length > 0 ) );
		},
		/**
		* A simple tokenizer.
		* Example use:<pre><code>   var st = '##This## is text to change. Case sensitivity should change ##this##.',
		*    &nbsp;   slugs = &#123; 'this' : 'that' &#125;;
		*    console.log( bpmv.toke( st, slugs ) );
		*    // output: that is text to change. Case sensitivity should change that.
		*    console.log( bpmv.toke( st, slugs, true ) );
		*    // output: ##This## is text to change. Case sensitivity should change that.</code></pre>
		* @param {string} vessel The string containing the tokens you wish to replace.
		* @param {object} stash An object with the tokens as key names and the replacements as the values.
		* For example:<pre><code>// replaces occurences of 'this' with 'that'
		* var stash = &#123; 'this' : 'that' &#125;;</code></pre>
		* @param {boolean} onMyCase Whether or not the tokens will be compared as case-sensitive strings.
		* The default is to perform case-INsensitive matching.
		* @param {object} delims delims can some in three formats.
		* First, as an object containing two keys, 'r' and 'l'.
		* Secondly as an array of two strings. The first (0) will be assigned to the left side.
		* If delims is just a string, it will be applied to both left and right delimiters.
		* These are used to denote the beginning and ending of a token in the original string.
		* For example:<pre><code>// the defaults - the token for the word 'foo' would be '##foo##'
		* // we are setting custom delimiters
		* var delims = &#123; l : '|@', r : '@|' &#125;;</code></pre>
		* @return {string} Returns the string with the tokens found replaced
		* @method toke
		*/
		toke : function ( vessel, stash, onMyCase, delims ) {
			if ( this.str(vessel) ) {
				var newStr = String( vessel );
				onMyCase = (( typeof(onMyCase) == 'undefined' ) || ( !onMyCase )) ? 'i' : '';
				stash = this.obj(stash) ? stash : {};
				// validate delimiter possibilities
				if ( this.str(delims) ) {
					delims = { l : String(delims), r : String(delims) };
				} else if ( this.arr(delims) && ( delims.length == 2 ) && this.str(delims[0]) && this.str(delims[1]) ) {
					delims = { l : delims[0], r : delims[1] };
				} else {
					delims = this.obj(delims) ? delims : {};
					delims.l = this.str(delims.l) ? delims.l : '##';
					delims.r = this.str(delims.r) ? delims.r : '##';
				}
				for ( ppPass in stash ) {
					if ( stash.hasOwnProperty( ppPass ) && this.str(ppPass) && this.str(stash[ppPass]) ) {
						var bogart = ''+delims.l+ppPass+delims.r;
						var rex = new RegExp( this.rescape(bogart), 'g'+onMyCase );
						newStr = newStr.replace( rex, stash[ppPass] );
					}
				}
			}
			return newStr;
		},
		/**
		* Trim a string of whitespace or optionally other characters
		* @param {string} bush The string you'd like to trim
		* @param {string} chars Optional list of characters to trim.
		* By default the trim characters are ' \t\n\r'.
		* @return {string} Returns the trimmed string
		*/
		trim : function ( bush, chars ) {
			if ( !this.str(bush) ) {
				return bush; // not a string? just return it
			}
			chars = this.str(chars) ? this.rescape( chars ) : ' \t\n\r';
			var rex = new RegExp( '(^['+chars+']+|['+chars+']+$)', 'g' );
			return bush.replace( rex, '' );
		},
		/**
		* Is something that for a human resolves to true, such as "on" or "yes"
		* @param {mixed} maybe The value you'd like to test
		* @return {boolean} Will return true if the value is representationally positive in english, false otherwise
		*/
		trueish : function ( maybe ) {
			switch ( typeof(maybe) ) {
				case 'function':
					return String(maybe); // we return a string for safety - no calling the func!
				case 'string':
					return /^\s*(on|true|yes|1|yar)\s*$/i.test(maybe);
					break;
				case 'object':
					return this.obj( maybe, true );
					break;
				default: 
					return maybe ? true : false;
			}
		},
		/**
		* Unserialize a query string into an object
		* @param {string} busted The string you'd like to convert into an object
		* @return {string} Returns the string converted into an object.
		* On failure, will return boolean false.
		*/
		unserial : function ( busted ) {
			var pWagon = {};
			if ( this.str(busted) ) {
				busted = busted.replace( /^.*\?/, ''); // forcefully get rid of the query delim and all before it
				var coppers = busted.split( '&' );
				for ( var aCop in coppers ) {
					if ( this.str(coppers[aCop]) ) {
						var cuffs = coppers[aCop].match( /^([^=]+)=(.*)$/ );
						if ( cuffs ) {
							if ( this.str(cuffs[1]) && this.str(cuffs[2]) ) {
								pWagon[cuffs[1]] = cuffs[2];
							}
						}
					}
				}
			}
			return ( this.count(pWagon) > 0 ) ? pWagon : false;
		},
		/**
		* match a string against a wildcard string
		* @param {string} tundra The full text to test (ie: &quot;file_name_string&quot;)
		* @param {string} grylls The wildcard string (ie: &quot;file_*&quot;)
		* @param {string} piss The wildcard character (ie: &quot;*&quot;)
		* @return {string} Will return the full text if a match is found and false if not.
		*/
		wild : function ( tundra, grylls, piss ) {
			var protein = false;
			if ( this.str( tundra ) && this.str( grylls ) ) {
				if ( tundra == grylls ) { // direct match
							protein = tundra;
				} else {
					piss = this.str( piss ) ? this.rescape( piss ) : this.rescape( '*' );
					if ( grylls.match( RegExp( piss ) ) ) {
						var rex = '^'+String( this.rescape( grylls ) ).replace( RegExp( this.rescape( piss ), 'g' ), '.*' )+'$';
						if ( tundra.match( RegExp( rex ) ) ) {
							protein = tundra;
						}
					}
				}
			}
			return protein;
		}
	};
	// populate the appropriate global-ish place
	if ( bpmv.node() ) {
		exports[bpmv._cfg.varName] = bpmv;
	} else if ( bpmv.obj(us) && bpmv.obj(us.ebpm) && !bpmv.obj(us.ebpm.v)) {
		us.ebpm.v = bpmv;
	} else if ( bpmv.obj(BPMV_ATTACH) && !bpmv.obj(BPMV_ATTACH[bpmv._cfg.varName]) ) {
		BPMV_ATTACH[bpmv._cfg.varName] = bpmv;
	} else if ( bpmv.obj(window) ) {
		window[bpmv._cfg.varName] = bpmv;
	}
})()


