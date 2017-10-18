/** Polyfill patches for non-compliant browsers for EMACS5
    Package: SuperGLU
    Author: Benjamin Nye
    License: APL 2.0
**/

/** Fix for IE8 and under, where arrays have no indexOf... **/
var indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;
            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle);
};

/** Fix for IE8 and under, where arrays have no indexOf... **/
Object.values = function(obj){
    return (Object.keys(obj)).map(function(key){return obj[key];});
};

/** Fill in toISOString if not defined (Thanks, IE8) **/
if ( !Date.prototype.toISOString ) {
  ( function() {

    function pad(number) {
      var r = String(number);
      if ( r.length === 1 ) {
        r = '0' + r;
      }
      return r;
    }

    Date.prototype.toISOString = function() {
      return (this.getUTCFullYear() + 
                '-' + pad( this.getUTCMonth() + 1 ) + 
                '-' + pad( this.getUTCDate() ) + 
                'T' + pad( this.getUTCHours() ) + 
                ':' + pad( this.getUTCMinutes() ) + 
                ':' + pad( this.getUTCSeconds() )  + 
                '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 ) + 
                'Z');
    };

  }() );
}

/** Object.create polyfill **/
if (!Object.create) {
    Object.create = (function(){
        function F(){}

        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F();
        };
    })();
}

/** Console-polyfill. MIT license.
    Attribution: Paul Miller
    https://github.com/paulmillr/console-polyfill
    Make it safe to do console.log() always.
**/
(function(con) {
  'use strict';
  var prop, method;
  var empty = {};
  var dummy = function() {};
  var properties = 'memory'.split(',');
  var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
     'table,time,timeEnd,timeStamp,trace,warn').split(',');
  while (prop = properties.pop()) con[prop] = con[prop] || empty;
  while (method = methods.pop()) con[method] = con[method] || dummy;
})(this.console = this.console || {}); // Using `this` for web workers.

/**
 * A Javascript object to encode and/or decode html characters using HTML or Numeric entities that handles double or partial encoding
 * Author: R Reid
 * source: http://www.strictly-software.com/htmlencode
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2011 Robert Reid - Strictly-Software.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2011-07-14, Jacques-Yves Bleau: 
 *       - fixed conversion error with capitalized accentuated characters
 *       + converted arr1 and arr2 to object property to remove redundancy
 *
 * Revision:
 *  2011-11-10, Ce-Yi Hio: 
 *       - fixed conversion error with a number of capitalized entity characters
 *
 * Revision:
 *  2011-11-10, Rob Reid: 
 *		 - changed array format
 *
 * Revision:
 *  2012-09-23, Alex Oss: 
 *		 - replaced string concatonation in numEncode with string builder, push and join for peformance with ammendments by Rob Reid
 */

Encoder = {

	// When encoding do we convert characters into html or numerical entities
	EncodeType : "entity",  // entity OR numerical

	isEmpty : function(val){
		if(val){
			return ((val===null) || val.length==0 || /^\s+$/.test(val));
		}else{
			return true;
		}
	},
	
	// arrays for conversion from HTML Entities to Numerical values
	arr1: ['&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&OElig;','&oelig;','&Scaron;','&scaron;','&Yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&Dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&Alpha;','&Beta;','&Gamma;','&Delta;','&Epsilon;','&Zeta;','&Eta;','&Theta;','&Iota;','&Kappa;','&Lambda;','&Mu;','&Nu;','&Xi;','&Omicron;','&Pi;','&Rho;','&Sigma;','&Tau;','&Upsilon;','&Phi;','&Chi;','&Psi;','&Omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&Prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&lArr;','&uArr;','&rArr;','&dArr;','&hArr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'],
	arr2: ['&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'],
		
	// Convert HTML entities into numerical entities
	HTML2Numerical : function(s){
		return this.swapArrayVals(s,this.arr1,this.arr2);
	},	

	// Convert Numerical entities into HTML entities
	NumericalToHTML : function(s){
		return this.swapArrayVals(s,this.arr2,this.arr1);
	},


	// Numerically encodes all unicode characters
	numEncode : function(s){ 
		if(this.isEmpty(s)) return ""; 

		var a = [],
			l = s.length; 
		
		for (var i=0;i<l;i++){ 
			var c = s.charAt(i); 
			if (c < " " || c > "~"){ 
				a.push("&#"); 
				a.push(c.charCodeAt()); //numeric value of code point 
				a.push(";"); 
			}else{ 
				a.push(c); 
			} 
		} 
		
		return a.join(""); 	
	}, 
	
	// HTML Decode numerical and HTML entities back to original values
	htmlDecode : function(s){

		var c,m,d = s;
		
		if(this.isEmpty(d)) return "";

		// convert HTML entites back to numerical entites first
		d = this.HTML2Numerical(d);
		
		// look for numerical entities &#34;
		arr=d.match(/&#[0-9]{1,5};/g);
		
		// if no matches found in string then skip
		if(arr!=null){
			for(var x=0;x<arr.length;x++){
				m = arr[x];
				c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
				// if its a valid number we can decode
				if(c >= -32768 && c <= 65535){
					// decode every single match within string
					d = d.replace(m, String.fromCharCode(c));
				}else{
					d = d.replace(m, ""); //invalid so replace with nada
				}
			}			
		}

		return d;
	},		

	// encode an input string into either numerical or HTML entities
	htmlEncode : function(s,dbl){
			
		if(this.isEmpty(s)) return "";

		// do we allow double encoding? E.g will &amp; be turned into &amp;amp;
		dbl = dbl || false; //default to prevent double encoding
		
		// if allowing double encoding we do ampersands first
		if(dbl){
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}
		}

		// convert the xss chars to numerical entities ' " < >
		s = this.XSSEncode(s,false);
		
		if(this.EncodeType=="numerical" || !dbl){
			// Now call function that will convert any HTML entities to numerical codes
			s = this.HTML2Numerical(s);
		}

		// Now encode all chars above 127 e.g unicode
		s = this.numEncode(s);

		// now we know anything that needs to be encoded has been converted to numerical entities we
		// can encode any ampersands & that are not part of encoded entities
		// to handle the fact that I need to do a negative check and handle multiple ampersands &&&
		// I am going to use a placeholder

		// if we don't want double encoded entities we ignore the & in existing entities
		if(!dbl){
			s = s.replace(/&#/g,"##AMPHASH##");
		
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}

			s = s.replace(/##AMPHASH##/g,"&#");
		}
		
		// replace any malformed entities
		s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

		if(!dbl){
			// safety check to correct any double encoded &amp;
			s = this.correctEncoding(s);
		}

		// now do we need to convert our numerical encoded string into entities
		if(this.EncodeType=="entity"){
			s = this.NumericalToHTML(s);
		}

		return s;					
	},

	// Encodes the basic 4 characters used to malform HTML in XSS hacks
	XSSEncode : function(s,en){
		if(!this.isEmpty(s)){
			en = en || true;
			// do we convert to numerical or html entity?
			if(en){
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&quot;");
				s = s.replace(/</g,"&lt;");
				s = s.replace(/>/g,"&gt;");
			}else{
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&#34;");
				s = s.replace(/</g,"&#60;");
				s = s.replace(/>/g,"&#62;");
			}
			return s;
		}else{
			return "";
		}
	},

	// returns true if a string contains html or numerical encoded entities
	hasEncoded : function(s){
		if(/&#[0-9]{1,5};/g.test(s)){
			return true;
		}else if(/&[A-Z]{2,6};/gi.test(s)){
			return true;
		}else{
			return false;
		}
	},

	// will remove any unicode characters
	stripUnicode : function(s){
		return s.replace(/[^\x20-\x7E]/g,"");
		
	},

	// corrects any double encoded &amp; entities e.g &amp;amp;
	correctEncoding : function(s){
		return s.replace(/(&amp;)(amp;)+/,"$1");
	},


	// Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
	swapArrayVals : function(s,arr1,arr2){
		if(this.isEmpty(s)) return "";
		var re;
		if(arr1 && arr2){
			//ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
			// array lengths must match
			if(arr1.length == arr2.length){
				for(var x=0,i=arr1.length;x<i;x++){
					re = new RegExp(arr1[x], 'g');
					s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2	
				}
			}
		}
		return s;
	},

	inArray : function( item, arr ) {
		for ( var i = 0, x = arr.length; i < x; i++ ){
			if ( arr[i] === item ){
				return i;
			}
		}
		return -1;
	}

}
/**
 * uuid.js: The RFC-compliant UUID generator for JavaScript.
 *
 * @fileOverview
 * @author  LiosK
 * @version 3.2
 * @license The MIT License: Copyright (c) 2010-2012 LiosK.
 */

/** @constructor */
var UUID;

UUID = (function(overwrittenUUID) {

// Core Component {{{

/** @lends UUID */
function UUID() {}

/**
 * The simplest function to get an UUID string.
 * @returns {string} A version 4 UUID string.
 */
UUID.generate = function() {
  var rand = UUID._getRandomInt, hex = UUID._hexAligner;
  return  hex(rand(32), 8)          // time_low
        + "-"
        + hex(rand(16), 4)          // time_mid
        + "-"
        + hex(0x4000 | rand(12), 4) // time_hi_and_version
        + "-"
        + hex(0x8000 | rand(14), 4) // clock_seq_hi_and_reserved clock_seq_low
        + "-"
        + hex(rand(48), 12);        // node
};

/**
 * Returns an unsigned x-bit random integer.
 * @param {int} x A positive integer ranging from 0 to 53, inclusive.
 * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
 */
UUID._getRandomInt = function(x) {
  if (x <   0) return NaN;
  if (x <= 30) return (0 | Math.random() * (1 <<      x));
  if (x <= 53) return (0 | Math.random() * (1 <<     30))
                    + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
  return NaN;
};

/**
 * Returns a function that converts an integer to a zero-filled string.
 * @param {int} radix
 * @returns {function(num&#44; length)}
 */
UUID._getIntAligner = function(radix) {
  return function(num, length) {
    var str = num.toString(radix), i = length - str.length, z = "0";
    for (; i > 0; i >>>= 1, z += z) { if (i & 1) { str = z + str; } }
    return str;
  };
};

UUID._hexAligner = UUID._getIntAligner(16);

// }}}

// UUID Object Component {{{

/**
 * Names of each UUID field.
 * @type string[]
 * @constant
 * @since 3.0
 */
UUID.FIELD_NAMES = ["timeLow", "timeMid", "timeHiAndVersion",
                    "clockSeqHiAndReserved", "clockSeqLow", "node"];

/**
 * Sizes of each UUID field.
 * @type int[]
 * @constant
 * @since 3.0
 */
UUID.FIELD_SIZES = [32, 16, 16, 8, 8, 48];

/**
 * Generates a version 4 {@link UUID}.
 * @returns {UUID} A version 4 {@link UUID} object.
 * @since 3.0
 */
UUID.genV4 = function() {
  var rand = UUID._getRandomInt;
  return new UUID()._init(rand(32), rand(16), // time_low time_mid
                          0x4000 | rand(12),  // time_hi_and_version
                          0x80   | rand(6),   // clock_seq_hi_and_reserved
                          rand(8), rand(48)); // clock_seq_low node
};

/**
 * Converts hexadecimal UUID string to an {@link UUID} object.
 * @param {string} strId UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
 * @returns {UUID} {@link UUID} object or null.
 * @since 3.0
 */
UUID.parse = function(strId) {
  var r, p = /^\s*(urn:uuid:|\{)?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{2})([0-9a-f]{2})-([0-9a-f]{12})(\})?\s*$/i;
  if (r = p.exec(strId)) {
    var l = r[1] || "", t = r[8] || "";
    if (((l + t) === "") ||
        (l === "{" && t === "}") ||
        (l.toLowerCase() === "urn:uuid:" && t === "")) {
      return new UUID()._init(parseInt(r[2], 16), parseInt(r[3], 16),
                              parseInt(r[4], 16), parseInt(r[5], 16),
                              parseInt(r[6], 16), parseInt(r[7], 16));
    }
  }
  return null;
};

/**
 * Initializes {@link UUID} object.
 * @param {uint32} [timeLow=0] time_low field (octet 0-3).
 * @param {uint16} [timeMid=0] time_mid field (octet 4-5).
 * @param {uint16} [timeHiAndVersion=0] time_hi_and_version field (octet 6-7).
 * @param {uint8} [clockSeqHiAndReserved=0] clock_seq_hi_and_reserved field (octet 8).
 * @param {uint8} [clockSeqLow=0] clock_seq_low field (octet 9).
 * @param {uint48} [node=0] node field (octet 10-15).
 * @returns {UUID} this.
 */
UUID.prototype._init = function() {
  var names = UUID.FIELD_NAMES, sizes = UUID.FIELD_SIZES;
  var bin = UUID._binAligner, hex = UUID._hexAligner;

  /**
   * List of UUID field values (as integer values).
   * @type int[]
   */
  this.intFields = new Array(6);

  /**
   * List of UUID field values (as binary bit string values).
   * @type string[]
   */
  this.bitFields = new Array(6);

  /**
   * List of UUID field values (as hexadecimal string values).
   * @type string[]
   */
  this.hexFields = new Array(6);

  for (var i = 0; i < 6; i++) {
    var intValue = parseInt(arguments[i] || 0);
    this.intFields[i] = this.intFields[names[i]] = intValue;
    this.bitFields[i] = this.bitFields[names[i]] = bin(intValue, sizes[i]);
    this.hexFields[i] = this.hexFields[names[i]] = hex(intValue, sizes[i] / 4);
  }

  /**
   * UUID version number defined in RFC 4122.
   * @type int
   */
  this.version = (this.intFields.timeHiAndVersion >> 12) & 0xF;

  /**
   * 128-bit binary bit string representation.
   * @type string
   */
  this.bitString = this.bitFields.join("");

  /**
   * UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
   * @type string
   */
  this.hexString = this.hexFields[0] + "-" + this.hexFields[1] + "-" + this.hexFields[2]
                 + "-" + this.hexFields[3] + this.hexFields[4] + "-" + this.hexFields[5];

  /**
   * UUID string representation as a URN ("urn:uuid:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
   * @type string
   */
  this.urn = "urn:uuid:" + this.hexString;

  return this;
};

UUID._binAligner = UUID._getIntAligner(2);

/**
 * Returns UUID string representation.
 * @returns {string} {@link UUID#hexString}.
 */
UUID.prototype.toString = function() { return this.hexString; };

/**
 * Tests if two {@link UUID} objects are equal.
 * @param {UUID} uuid
 * @returns {bool} True if two {@link UUID} objects are equal.
 */
UUID.prototype.equals = function(uuid) {
  if (!(uuid instanceof UUID)) { return false; }
  for (var i = 0; i < 6; i++) {
    if (this.intFields[i] !== uuid.intFields[i]) { return false; }
  }
  return true;
};

// }}}

// UUID Version 1 Component {{{

/**
 * Generates a version 1 {@link UUID}.
 * @returns {UUID} A version 1 {@link UUID} object.
 * @since 3.0
 */
UUID.genV1 = function() {
  var now = new Date().getTime(), st = UUID._state;
  if (now != st.timestamp) {
    if (now < st.timestamp) { st.sequence++; }
    st.timestamp = now;
    st.tick = UUID._getRandomInt(4);
  } else if (Math.random() < UUID._tsRatio && st.tick < 9984) {
    // advance the timestamp fraction at a probability
    // to compensate for the low timestamp resolution
    st.tick += 1 + UUID._getRandomInt(4);
  } else {
    st.sequence++;
  }

  // format time fields
  var tf = UUID._getTimeFieldValues(st.timestamp);
  var tl = tf.low + st.tick;
  var thav = (tf.hi & 0xFFF) | 0x1000;  // set version '0001'

  // format clock sequence
  st.sequence &= 0x3FFF;
  var cshar = (st.sequence >>> 8) | 0x80; // set variant '10'
  var csl = st.sequence & 0xFF;

  return new UUID()._init(tl, tf.mid, thav, cshar, csl, st.node);
};

/**
 * Re-initializes version 1 UUID state.
 * @since 3.0
 */
UUID.resetState = function() {
  UUID._state = new UUID._state.constructor();
};

/**
 * Probability to advance the timestamp fraction: the ratio of tick movements to sequence increments.
 * @type float
 */
UUID._tsRatio = 1 / 4;

/**
 * Persistent state for UUID version 1.
 * @type UUIDState
 */
UUID._state = new function UUIDState() {
  var rand = UUID._getRandomInt;
  this.timestamp = 0;
  this.sequence = rand(14);
  this.node = (rand(8) | 1) * 0x10000000000 + rand(40); // set multicast bit '1'
  this.tick = rand(4);  // timestamp fraction smaller than a millisecond
};

/**
 * @param {Date|int} time ECMAScript Date Object or milliseconds from 1970-01-01.
 * @returns {object}
 */
UUID._getTimeFieldValues = function(time) {
  var ts = time - Date.UTC(1582, 9, 15);
  var hm = ((ts / 0x100000000) * 10000) & 0xFFFFFFF;
  return  { low: ((ts & 0xFFFFFFF) * 10000) % 0x100000000,
            mid: hm & 0xFFFF, hi: hm >>> 16, timestamp: ts };
};

// }}}

// Misc. Component {{{

/**
 * Reinstalls {@link UUID.generate} method to emulate the interface of uuid.js version 2.x.
 * @since 3.1
 * @deprecated Version 2.x. compatible interface is not recommended.
 */
UUID.makeBackwardCompatible = function() {
  var f = UUID.generate;
  UUID.generate = function(o) {
    return (o && o.version == 1) ? UUID.genV1().hexString : f.call(UUID);
  };
  UUID.makeBackwardCompatible = function() {};
};

/**
 * Preserves the value of 'UUID' global variable set before the load of uuid.js.
 * @since 3.2
 * @type object
 */
UUID.overwrittenUUID = overwrittenUUID;

// }}}

return UUID;

})(UUID);

// vim: et ts=2 sw=2 fdm=marker fmr&
/** Zet.js Module from https://github.com/nemisj/Zet.js
	Handles inheritance and factory function registration/creation/type-checking
    This is a fork from the original, with updates and enhancements as noted.
    Revised by: Benjamin Nye
    Package: SuperGLU
    License: APL 2.0
    
    Notes: 
        - Fixes to update it to newer versions of JS (was outdated).
        - Added class factory function for automatically registering and creating Zet objects
        - Expanded isInstance functionality for type-checking of class
        - Fixed function inheritance functionality for newer JS versions
*/
if (typeof SuperGLU === "undefined"){
    var SuperGLU = {};
    if (typeof window === "undefined") {
        var window = this;
    }
    window.SuperGLU = SuperGLU;
}

(function(){
    // GLOBAL is the reference in nodejs implementation to the global scope
    // node.js supports Modules specs, so, Zet will go into separate scope
    var globalscope = (typeof(GLOBAL) == "undefined") ? window : GLOBAL;

    // Scope which is the entry point for Classes declaration;
    var declarescope = globalscope; 

    // support for CommonJS Modules 1.0 API
    // Zet.js can be include as CommonJS module, by calling
    // var Zet = require('Zet.js');
	var _c = (typeof(exports) != "undefined") ? exports : (globalscope.Zet = function Zet(){
        if(arguments.length == 1){
            var sub = arguments[0];
            return sub.instanceOf ? sub : {
                instanceOf : function(superclass){
                    return (typeof sub == "string") ? superclass == String : sub instanceof superclass; 
                }
            };
        }else if(arguments.length == 2){
            return Zet.declare(arguments[0], arguments[1]);
        }
    });

    // cache for undefined
    var undef;

    //logger provider
    var logger;

	
	// Factory Map (in form ClassId : Class Factory)
	var _FACTORY_MAP = {};
	
	// Utility Functions
	function prepareArgs(args){
        var i;
		var result = [];
		if(args && args.length){
			for(i=0;i < args.length;i++){
				result.push(args[i]); 
			}
		}  
		return result;
	}

	function mixin(obj, prop){
        var key;
		if(typeof(prop) == "object"){
			for(key in prop){
				if(prop.hasOwnProperty(key)){
					obj[key] = prop[key];	
				}
			}
		}

        return obj;
	}

    function inherited(currentFnc, args){
        var inheritedFnc = currentFnc.__chain;
        if(inheritedFnc && (typeof(inheritedFnc) == "function")){
            var a = prepareArgs(args);
            return inheritedFnc.apply(globalscope, a);
        }
    }
	
	function runConstruct(instance, params){
		var construct = instance.construct;
		if(construct && typeof(construct) == "function"){
			construct.apply(globalscope, params);
		}
		return instance;
	}
	
	_c.declare = function(className, kwArgs) {

        // className ommited for anonymous declaration
        if(arguments.length == 1){
            kwArgs    = className;
            className = null;
        }

		var superclass = kwArgs.superclass;
		var defineBody = kwArgs.defineBody;
		var CLASS_ID = kwArgs.CLASS_ID;
        if (CLASS_ID == null) { CLASS_ID = className; }

        if (superclass && typeof(superclass) != "function") {
            throw new Error("Zet.declare : Superclass of " + className + " is not a constructor.");
        } else if (defineBody !== undef && (typeof(defineBody) != "function")) {
            throw new Error("Zet.declare : defineBody of " + className + " is not a function.");
        } else if (CLASS_ID !== undef && (typeof(CLASS_ID) != 'string')) {
			throw new Error("Zet.declare : CLASS_ID of " + className + " is not a string.");
		}
        
        var instanceOf = function instanceOf(clazz){
			if(clazz == create){
				return true;
			}else if(superclass){
                //one level deep
                if (superclass.instanceOf){
                    return superclass.instanceOf(clazz);
                } else {
                    return superclass == clazz;
                }
			} else {
				return false;
			}
        };
		
		var isInstance = function isInstance(instance) {
            var constructor;
            if (instance == null){
                return false;
            }
            constructor = instance.constructor;
            if ((typeof constructor === "undefined") || 
				(!((constructor instanceof Function) || 
                  (constructor instanceof Object))) ||
                (instance.__zet__makeNew == null)){
                return false;
            // Exact Match
            } else if (instance.constructor == create){
                return true;
            } else if (instance.instanceOf instanceof Function) {
                return instance.instanceOf(create);
            } else {
                return false;
            }
		};

		// Function that makes a new (uninitialized) instance
		var __zet__makeNew = function __zet__makeNew(){
			var params = prepareArgs(arguments);

			var superStore  = null;
			var self        = null;        

			if(superclass){
                // protection against outside calls
				var superi = superclass.__zet__makeNew(create);
				if(superi === null){
					//throw or warning
                    throw new Error("Zet.declare : Superclass of " + className + " should return object.");
				}

				// mixin all functions into superStore, for inheritance
				superStore = mixin({}, superi);
				self = superi;
			}

			self  = self || {}; // testing if the object already exists;

            if(defineBody){
                var proto = null;
                try{
                    proto = defineBody(self);
                }catch(e){
                    if(e.__publicbody){
                        proto = e.__seeding;
                    }else{
                        throw e;	
                    }
                }

                if(proto){
                    //some extra arguments are here
                    mixin(self, proto);
                }
            }

            // doing inheritance stuff
            if(superStore){
                for(var i in superStore){
                    if((self[i] != superStore[i]) && (typeof(superStore[i]) == "function" && typeof(self[i]) == "function")){
                        //name collisions, apply __chain trick
                        self[i].__chain = superStore[i];
                    }
                }
            }   

            // adding helper functions
			mixin(self, {
                className   : className,
				CLASS_ID	: CLASS_ID,
				inherited   : inherited,
				instanceOf  : instanceOf,
				isInstance  : isInstance,
				__zet__makeNew : __zet__makeNew,
				public      : _c.public,
                constructor : create // for var self = bla.constructor();
			});
			return self;
		};
		
		// Factory function that creates initialized instances
		var create = function create(){
			var params = prepareArgs(arguments);
			var self = __zet__makeNew(params);
			self = runConstruct(self, params);
			return self;
		};

		// Data available on the Class Factory function
		create.instanceOf = instanceOf;
		create.isInstance = isInstance;
		create.__zet__makeNew = __zet__makeNew;
		create.className = className;
		create.CLASS_ID	= CLASS_ID;
        // If CLASS_ID given, add class to factory
		if (CLASS_ID){
			_c.setFactoryClass(CLASS_ID, create);
		}
		// in case for anonymous Classes declaration check for className
        return className ? _c.setClass(className, create) : create;
	};

	// Zet Public Module Functions
	_c.public = function(body){
		var error = new Error('');
		error.__seeding = body;
		error.__publicbody = true;
		throw error;
	};

    _c.profile = function(kwArgs){
        if(kwArgs.scope){
            declarescope = kwArgs.scope; 
        }

        if(kwArgs.logger){
           logger = kwArgs.logger; 
        }
    };

	// Zet Class Factory for Module-Based Access
    _c.getClass = function(className){
		var curr  = declarescope;

		var split = className.split(".");
		for(var i=0; i < split.length; i++){
            if(curr[split[i]]){
                curr =  curr[split[i]];
            } else {
                throw new Error("Zet.getClass: Can't find class: " + className);
            }
		}

        return curr;
    };

    _c.setClass = function(className, constructor){
		var curr  = declarescope;
		var split = className.split(".");
		for(var i=0;i<split.length-1;i++){
			curr = curr[split[i]] ? curr[split[i]] : (curr[split[i]] = {});
		}

		return (curr[split[split.length-1]] = constructor);
    };

    _c.hasFactoryClass = function(classId){
		return (classId in _FACTORY_MAP);
	};
    
	_c.getFactoryClass = function(classId){
		return _FACTORY_MAP[classId];
	};
	
	_c.setFactoryClass = function(classId, classRef){
		// print("ADD TO FACTORY: " + classId + " / " + classRef.className + " / "+ classRef);
		if (classId in _FACTORY_MAP){
			throw new Error("Error: Factory Map already contains class id: " + classId);
		}
		_FACTORY_MAP[classId] = classRef;
		// print("FACTORY MAP:" + Object.keys(_FACTORY_MAP));
	};
	
	//
	// Logging facilities
	//
	
    // default logger
    logger = {
        log : function(){
            if(globalscope.console && console.log){
                console.log.apply(console, arguments);
            }else if(window && window.document){
                var div= document.createElement("div");
                document.body.appendChild(div);
                var str = '';
                for(var i=0;i< arguments.length;i++){
                    str += (arguments[i] + ' ');	
                }
                div.innerHTML = str;
            }
        },

        error : function(){
            if(globalscope.console && console.error){
                console.error.apply(console, arguments);
            }else if(window && window.document){
                var div= document.createElement("div");
                document.body.appendChild(div);
                var str = '';
                for(var i=0;i< arguments.length;i++){
                    str += (arguments[i] + ' ');	
                }
                div.innerHTML = str;
                div.style.color = 'red';
            }
        }  
    };
	
    _c.level = function(lvl){
        if(logger && logger.level){
            logger.level(lvl);
        }
    };

	_c.log = function(){
        if(logger && logger.log){
            logger.log.apply(logger,arguments);
        }
	};

    _c.error = function(){
        if(logger && logger.error){
            logger.error.apply(logger,arguments);
        }
    };

})();
SuperGLU.Zet = Zet;
/** SuperGLU (Generalized Learning Utilities) Standard API
    This manages all versioning within the core libraries.
    
    Package: SuperGLU (Generalized Learning Utilities)
    Author: Benjamin Nye
    License: APL 2.0
    
    Requires:
        - Util\uuid.js 
        - Util\zet.js 
        - Util\serializable.js
        - Core\messaging.js
        - Core\messaging-gateways.js
**/

if (typeof window === "undefined") {
    var window = this;
}

(function(namespace, undefined) {
namespace.version = "0.1.9";

// Core API Modules
if ((namespace.Zet == null) && typeof Zet !== 'undefined'){ 
    namespace.Zet = Zet; 
}
if ((namespace.Serialization == null) && typeof Serialization !== 'undefined'){ 
    namespace.Serialization = Serialization; 
}
if ((namespace.Messaging == null) && typeof Messaging !== 'undefined'){ 
    namespace.Messaging = Messaging; 
}
if ((namespace.Messaging_Gateway == null) && typeof Messaging_Gateway !== 'undefined'){ 
    namespace.Messaging_Gateway = Messaging_Gateway; 
}

// Sets to monitor registered verbs and context keys in this context
if (namespace.VERBS == null){ namespace.VERBS = {}; }
if (namespace.CONTEXT_KEYS == null){ namespace.CONTEXT_KEYS = {}; }

})(window.SuperGLU = window.SuperGLU || {});
/** Serialization Package for recursively serializing objects in a canonical format
    intended for class factory instantiation across different languages and systems.
    Package: SuperGLU
    Authors: Benjamin Nye and Daqi Dong
    License: APL 2.0
    Requires:
        - uuid.js
        - zet.js

    Description: 
    -----------------------------------
    This package is intended to allow serializing and unserializing
    between JavaScript objects and various serial/string representations (e.g., JSON, XML).
    The following objects are included:
        * Serializable: Base class for serializable objects, needed for custom serialization
        * StorageToken: Intermediate representation of a serializable object
        * TokenRWFormats: Serializes and recovers storage tokens and primatives to specific formats (e.g., JSON)
**/

if (typeof SuperGLU === "undefined"){
    var SuperGLU = {};
    if (typeof window === "undefined") {
        var window = this;
    }
    window.SuperGLU = SuperGLU;
}

// Module Declaration
(function (namespace, undefined) {

    var MAP_STRING = "map",
        LIST_STRING = 'list';
    
    var NAME_KEY = 'name';

	// Format Constants
	var JSON_FORMAT = 'json',
		XML_FORMAT = 'xml',
		VALID_SERIAL_FORMATS = [JSON_FORMAT, XML_FORMAT];
	
    /** Utility function to merge two mappings 
        @param targetObj: Object to have key-value pairs added
        @param sourceObj: Object to take keys from
        @return: Modified version of the targetObj
    **/
	var updateObjProps = function(targetObj, sourceObj){
        var key;
		for (key in sourceObj){
			targetObj[key] = sourceObj[key];
		}
        return targetObj;
	};
    
    // Base classes for serializable objects
    //---------------------------------------------

    /** Class Serializable
        A serializable object, that can be saved to token and opened from token
    **/
    Zet.declare('Serializable', {
        superclass : null,
        defineBody : function(self){
			// Constructor Function
            
            /** Constructor for serializable
            *   @param id (optional): GUID for this object.  If none given, a V4 random GUID is used.
            **/
            self.construct = function construct(id){
                if (id == null) {
                    self._id = UUID.genV4().toString();
                } else {
                    self._id = id;
                }
            };
            
            // Public Functions 
            /** Equality operator **/
            self.eq = function eq(other){
				return ((self.getClassId() == other.getClassId()) && (self.getId() == other.getId()));
            };

            /** Not-equal operator **/
            self.ne = function ne(other){
                return !(self.eq(other));
            };

            /** Get the ID for the serializable. Ideally unique. **/
            self.getId = function getId(){
                return self._id;
            };
            
            /** Update the id, either by setting a new one or generating a new random UUID 
                @param id: The new id for the serializable.  If null/undefined, generates new random UUID
            **/
            self.updateId = function updateId(id){
                if (id === undefined) {
                    self._id = UUID.genV4().toString();
                } else {
                    self._id = id;
                }
            };

            /** Get the class name for this serializable **/
            self.getClassId = function getClassId(){
                return self.className;
            };

            /** Initialize serializable from token.
                @param token: The token form of the object.
                @param context (optional): Mutable context for the loading process. Defaults to null. 
            */
            self.initializeFromToken = function initializeFromToken(token, context){
				self._id = token.getId();
            };

            /** Create and return a token form of the object that is valid to serialize **/
            self.saveToToken = function saveToToken(){
				var token = StorageToken(self.getId(), self.getClassId());
                return token;
            };
            
            /** Create a serialized version of this object **/
            self.saveToSerialized = function saveToSerialized(){
                return makeSerialized(self.saveToToken());
            };

            /** Create a clone of the object 
                @param newId: Unless false or 0, give the new clone a different UUID
                @return: A new serializable object of the right class type.
            **/
            self.clone = function clone(newId){
                if (newId == null){ newId = true; }
                var s = makeSerialized(self.saveToToken());
                s = untokenizeObject(makeNative(s));
                if (newId){
                    s.updateId();
                }
                return s;
            };
        }
    });

    /** A Serializable with a given name that will be stored with it **/
    Zet.declare('NamedSerializable' , {
        superclass : Serializable,
        defineBody : function(self){
			// Constructor Function
            self.NAME_KEY = NAME_KEY;
            
            /** Constructor for named serializable
            *   @param id (optional): GUID for this object.  If none given, a V4 random GUID is used.
            *   @param name: The name for the object
            **/
            self.construct = function construct(id, name){
                if (name == null) { name=null;}
                self.inherited(construct, [id]);
                self._name = name;
            };
            
            /** Get the name for the object **/
            self.getName = function getName(){
                return self._name;
            };
            
            /** Set the name for the object **/
            self.setName = function setName(name){
                if (name == null){
                    name = null; 
                } else if (name instanceof String || typeof name === 'string'){
                    self._name = name;
                } else {
                    throw new Error("Set name failed, was not a string.");
                }
            };
            
            /** Equality operator **/
            self.eq = function eq(other){
                return (self.inherited(eq, [other]) && (self._name === other._name));
            };
            
            self.initializeFromToken = function initializeFromToken(token, context){
                self.inherited(initializeFromToken, [token, context]);
                self._name = untokenizeObject(token.getitem(self.NAME_KEY, true, null), context);
            };
            
            self.saveToToken = function saveToToken(){
                var token = self.inherited(saveToToken);
                if (self._name != null){
                    token.setitem(self.NAME_KEY, tokenizeObject(self._name));
                }
                return token;
            };
        }
    });
    
    /** Class StorageToken
        An object that stores data in a form that can be serialized
    **/
    Zet.declare('StorageToken', {
        superclass : null,
        defineBody : function(self){
            // -- Class fields
            self.ID_KEY = 'id';
            self.CLASS_ID_KEY = 'classId';
            
            /** Constructor for storage token
                @param id (optional): GUID for this object.  If none given, a V4 random GUID is used.
                @param classId: The name of the class, as known by the class factory
                @param data: Object of key-value pairs to store for this token
            **/
            self.construct = function construct(id, classId, data) {
            /** Create a storage token, which can be directly serialized into a string
                @param id (optional): A GUID for the storage token.  If none given, uses a V4 random GUID.
                @param classId (optional): Id for the class that this StorageToken should create.  Defaults to null.
                @param data (optional): Starting data for the token.  Either a map {} for an array of map pairs [[key, val]].
            */
                var i;
                self._data = {};
                if (data !== undefined) {
                    //we are assuming that the data will either already
                    //be in a dictionary form ({key: value, key2: value2, ...}) 
                    //or is in a sequence form ([[key, value], [key2, value2], ...])
                    if (data instanceof Array){ //[[key, value], [key2, value2], ...]
                        for (i in data){
                            if ((data[i] instanceof Array) && (data[i].length == 2)){
                                  self._data[data[i][0]] = data[i][1];
                            } else {
                                throw new TypeError("Input array doesn't follow the format of [[key, value], [key2, value2], ...]");
                            }
                        }
                    } else {// {key: value, key2: value2, ...}
                        self._data = data;
                    }
                }else {
                    self._data = {};
                }                
                if (id !== undefined){
                    self.setId(id);
                } else if ((self.getId() === undefined)){
                    self.setId(UUID.genV4().toString());
                }                
                if (classId !== undefined) {
                    self.setClassId(classId);
                }
            };
        
            // -- Instance methods
            
            /** Get the ID for the storage token **/
            self.getId = function getId(){
                return self._data[self.ID_KEY];
            };

            /** Set the ID for the storage token **/
            self.setId = function setId(value){
                self._data[self.ID_KEY] = value;
            };

            /** Get the class name for the storage token **/
            self.getClassId = function getClassId(){
                return self._data[self.CLASS_ID_KEY];
            };

            /** Set the class name for the storage token **/
            self.setClassId = function setClassId(value){
                self._data[self.CLASS_ID_KEY] = value;
            };
            
            // Convenience Accessor for Named Serializables
            
            /** Get the name for the storage token (might be null) **/
            self.getName = function getName(){
                if (NAME_KEY in self._data){
                    return self._data[NAME_KEY];
                } else {
                    return null;
                }
            };

            /** Set a name for the storage token **/
            self.setName = function setName(value){
                self._data[NAME_KEY] = value;
            };

            // -- ##Generic Accessors
            
            /** Get the number of data values in the storage token **/
            self.len = function len(){
                return self._data.length;
            };

            /** Check if a given key is contained in the storage token **/
            self.contains = function contains(key){
                return key in self._data;
            };

            /** Get an item from the data dictionary
                @param key: Key for the item
                @param hasDefault (optional): If True, give a default value.  Else, raise an error if key not found.
                @param defaults (optional): The optional value for this item.
            */
            self.getitem = function getitem(key, hasDefault, defaults){

                if (!(key in self._data) && (hasDefault)){
                    return defaults;
                }else {
                    return self._data[key];
                }
            };

            /** Set an item in the data dictionary **/
            self.setitem = function setitem(key, value){
                self._data[key] = value;
            };

            /** Delete an item in the data dictionary **/
            self.delitem = function delitem(key){
                delete self._data[key];
            };

            /** Return an iterator over the data keys **/
            self.__iterator__ = function __iterator__(){
                var keys = Object.keys(self._data).sort();
                var keys_pos = 0;
                return {
                    next: function(){
                        if (keys_pos >= keys.length){
                            throw StopIteration;
                        }
                        return keys[keys_pos++];
                    }
                };
            };

            /** Return the data keys **/
            self.keys = function keys(){
                var k, aKeys;
                aKeys = [];
                for (k in self._data){
                    aKeys.push(k);
                }
                return aKeys;
            };

            // -- ##Comparison
            /** Equality operator **/
            self.eq = function eq(other){
                return (typeof(self) == typeof(other)) && (self._data == other._data);
            };

            /** Not equal operator **/
            self.ne = function ne(other){
                return !(self.eq(other));
            };

            // -- ##Validation
            /** Check if a key would be a valid data key **/
            self.isValidKey = function isValidKey(key){
                return typeof(key) in self.VALID_KEY_TYPES;
            };

            /** Check if a value would be a valid data value **/
            self.isValidValue = function isValidValue(value){
                return typeof(value) in self.VALID_VALUE_TYPES;
            };

            /** Check that the ID, Class Name, and any Name are valid types **/
            self.isValid = function isValid(){
                var idKey;
                var classIdKey;
                
                //Check that ID is valid
                if ((self._data[self.ID_KEY] == null) ||
                    ((typeof(self._data[self.ID_KEY]) !== 'string') &&
                     (typeof(self._data[self.ID_KEY]) !== 'number'))) {
                  return false;
                }
                //Check that class name is valid
                if ((self._data[self.CLASS_ID_KEY] == null) ||
                    (typeof(self._data[self.CLASS_ID_KEY]) !== 'string')) {
                  return false;
                }
                // Check that the name (if it exists) is valid
                if ((self._data[NAME_KEY] != null) && 
                    (typeof(self._data[NAME_KEY]) !== 'string')) {
                  return false;
                }
                return true;      
            };
        }
    });

    //-------------------------------------------
    // Packing and Unpacking from Serial Formats
    //-------------------------------------------
    /** Base class for serializing or unserializing a token to a string **/
    Zet.declare('TokenRWFormat', {
        superclass : null,
        defineBody : function(self){
            // Public Class Properties
            
            // Valid Types in Storage Token
            self.VALID_KEY_TYPES = {'string': true};
            self.VALID_ATOMIC_VALUE_TYPES = {'number': true, 'string': true, 'boolean': true, 'undefined': true};
            self.VALID_SEQUENCE_VALUE_TYPES = {'list': true, 'tuple' : true};
            self.VALID_MAPPING_VALUE_TYPES = {'map': true};
            self.VALID_VALUE_TYPES = {};

            // Setup for Class Properties
            self.VALID_VALUE_TYPES = updateObjProps(self.VALID_VALUE_TYPES, self.VALID_ATOMIC_VALUE_TYPES);
            self.VALID_VALUE_TYPES = updateObjProps(self.VALID_VALUE_TYPES, self.VALID_SEQUENCE_VALUE_TYPES);
            self.VALID_VALUE_TYPES = updateObjProps(self.VALID_VALUE_TYPES, self.VALID_MAPPING_VALUE_TYPES);
            self.VALID_VALUE_TYPES.StorageToken = true;
            
            // Constructor method
            self.construct = function construct(){};
            
            // Public methods
            self.parse = function parse(string) {
                // Parse a string into javascript objects
                throw new Error("NotImplementedError");
            };

            self.serialize = function serialize(data) {
                // Serialize javascript objects into a string form
                throw new Error("NotImplementedError");
            };
        }
    });


    /** JSON Formatted String: Uses JSON.stringify/JSON.parse **/
    Zet.declare('JSONRWFormat', {
        superclass : TokenRWFormat,
        defineBody : function(self){
            
            // Constructor method
            self.construct = function construct(){};
            
            // Public methods
            
            /** Parse a JSON-formatted string into basic javascript objects 
                (e.g., strings, numeric, arrays, objects) 
            **/
            self.parse = function parse(String) {//Parse a JSON string into javascript objects
                var decoded = JSON.parse(String);
                return self.makeNative(decoded);
            };

            /** Turn basic javascript objects into a JSON string **/
            self.serialize = function serialize(data) {
                var serializable = self.makeSerializable(data);
                return JSON.stringify(serializable);
            };

            /** Recursively make all objects serializable into JSON, 
                turning any lists, dicts, or StorageTokens into canonical forms
            **/
            self.makeSerializable = function makeSerializable(x){
                var i, key, keys, rt, temp, xType;
                xType = typeof(x);
                rt = null;
                // Primitive variables
				if ((xType in self.VALID_ATOMIC_VALUE_TYPES) || (x === null)){
                    rt = x;
                // Array
                } else if (x instanceof Array){ 
                    rt = {};
                    temp = [];
                    for (i=0; i<x.length; i++) {
                        temp[i] = self.makeSerializable(x[i]);
                    }
                    rt[LIST_STRING] = temp;
                // Object
                } else if ((x instanceof Object) && 
                            !(StorageToken.isInstance(x))){ 
                    rt = {};
                    temp = {};
                    for (key in x){
						temp[key] = self.makeSerializable(x[key]);
                    }
                    rt[MAP_STRING] = temp;
                // StorageToken
                } else if (StorageToken.isInstance(x)){ 
                    rt = {};
                    temp = {};
                    keys = x.keys();
                    for (i=0; i<keys.length; i++) {
						temp[self.makeSerializable(keys[i])] = self.makeSerializable(x.getitem(keys[i]));
                    }
                    rt[x.getClassId()] = temp;
                //Error
                } else { 
                    throw new TypeError("Tried to serialize unserializable object of type (" + xType + "): " + x);
                }
                return rt;
            };

            /** Recursively turn raw javascript objects in a canonical format into
                primitives, arrays, mappings, and StorageTokens.
            **/
            self.makeNative = function makeNative(x){
                var i, key, rt, temp, xType, dataTypeName;
                xType = typeof(x);
                rt = null;
                // Primitive variables
                if ((self.VALID_ATOMIC_VALUE_TYPES[xType]) || (x == null)){
                  rt = x;
                  return rt;
                }
                for (dataTypeName in x){
                    break;
                }
                // Array
                if (dataTypeName in self.VALID_SEQUENCE_VALUE_TYPES){ 
                    rt = [];
                    for (i=0; i<x[dataTypeName].length; i++) {
                        rt[i] = self.makeNative(x[dataTypeName][i]);
                    }
                // Object
                } else if (dataTypeName in self.VALID_MAPPING_VALUE_TYPES) { 
                    rt = {};
                    for (key in x[dataTypeName]) {
                        rt[key] = self.makeNative(x[dataTypeName][key]);
                    }
                // StorageToken (by default)
                } else { 
                    rt = {};
                    rt[MAP_STRING] = x[dataTypeName];
                    rt = self.makeNative(rt);
                    rt = StorageToken(undefined, undefined, rt);
                }
                return rt;
            };
        }
    });
    
    var JSONRWFormatter = JSONRWFormat(),
		XMLRWFormat = null,
		XMLRWFormatter = null;
	
	/** Create a serializable instance from an arbitrary storage token
		@param token: Storage token
		@param context (optional): Mutable context for the loading process. Defaults to null. 
        @param onMissingClass (optional): Function to transform/error on token if class missing
	*/
	var createFromToken = function(token, context, onMissingClass){
        var classId, AClass;
		var id = token.getId();
		var instance = {};
		if ((context != null) && (id in context)){
			instance = context[id];
		} else {
			//Need to import the right class
			classId = token.getClassId();
			AClass = Zet.getFactoryClass(classId);
			if (typeof AClass !== "undefined"){
                instance = AClass();
                instance.initializeFromToken(token, context);
            } else {
                if (onMissingClass == null){
                    onMissingClass = defaultOnMissing;
                }
                instance = onMissingClass(token);
            }	
		}
		return instance;
	};
	
    /** What to do if a class is missing (error or console message) **/
    var defaultOnMissing = function(token, errorOnMissing){
        if (!(errorOnMissing)){
            console.log("ERROR: Couldn't make class from factory: " + token.getClassId());
            return token;
        } else {
            throw new Error("Class Factory failed to import " + token.getClassId());
        }
    };
    
    // Convenience Function to Serialize and Un-Serialize Objects
    //----------------------------------------------------------
    /** A function that will attempt to turn any valid object 
        (Serializable, StorageToken, map, list, atomic) into 
        its string serialized equivalent.
        @param obj: Any object that can be serialized, i.e., Serializable, StorageToken, TokenRWFormat.VALID_VALUE_TYPES
        @type obj: object
        @param sFormat: Serializable format to pack things as
        @type sFormat: string
        @return: Serialized object
        @rtype: string
    **/
    var serializeObject = function serializeObject(obj, sFormat){
        return makeSerialized(tokenizeObject(obj), sFormat);
    };
    
    /** A function that will attempt to turn any valid object 
        (Serializable, StorageToken, map, list, atomic) into 
        its highest native equivalent (Serializable > StorageToken > list/map > atomic).
        @param obj: Any object that can be serialized, i.e., Serializable, StorageToken, TokenRWFormat.VALID_VALUE_TYPES
        @type obj: object
        @param sFormat: Serializable format to unpack things as
        @type sFormat: string
        @return: Least serialized form of this object
        @rtype: string
    **/ 
    var nativizeObject = function nativizeObject(obj, context, sFormat){
        if (Serializable.isInstance(obj)){
            return obj;
        } else if (StorageToken.isInstance(obj)){
            return createFromToken(obj, context);
        } else if (typeof obj === "string" || obj instanceof String){
            obj = makeNative(obj, sFormat);
            return untokenizeObject(obj);
        } else {
            return obj;
        }
    };
    
    // Convenience Function to Tokenize and Un-Tokenize Objects
    //----------------------------------------------------------
    
    /** Generic function to tokenize an object, recursively **/
    var tokenizeObject = function (obj) {
        var i, key, rt;
        rt = null;
        if (Serializable.isInstance(obj)) {// Serializable
            rt = obj.saveToToken();  
        } else if (obj instanceof Array){ // Array
            rt = [];
            for (i=0; i<obj.length; i++) {
                rt[i] = tokenizeObject(obj[i]);  
            }
        } else if ((obj instanceof Object) &&
                  !(obj instanceof Array)){ // Object
            rt = {};
            for (key in obj) {
                rt[tokenizeObject(key)] = tokenizeObject(obj[key]);  
            }
        } else {
            rt = obj;
        }
        return rt;
    };
    
    /** Generic function to create an object from a token 
        @param obj: Object to turn from tokens into object
        @param context (optional): Mutable context for the loading process. Defaults to null. 
    */
    var untokenizeObject = function(obj, context){
        var i, key;
        var rt = null;
        if (StorageToken.isInstance(obj)) {// StorageToken
            rt = createFromToken(obj, context);
        } else if (obj instanceof Array) { // Array
            rt = [];
            for (i in obj) { 
                rt[i] = untokenizeObject(obj[i], context);
            }
        } else if ((obj instanceof Object) &&
                  !(obj instanceof Array)){ // Object
            rt = {};
            for (key in obj) {
                rt[untokenizeObject(key, context)] = untokenizeObject(obj[key], context);
            }
        } else {
            rt = obj;
        }
        return rt;
    };
    
    // Convenience functions to serialize and unserialize tokens and raw data
    //---------------------------------------------
    /** Generic function to turn a tokenized object into serialized form
        @param obj: Tokenized object
        @param sFormat (optional): Serialization format.  Defaults to JSON_FORMAT
    */
    var makeSerialized = function makeSerialized(obj, sFormat){
        if (sFormat === undefined){ // Default format is JSON_FORMAT
            sFormat = JSON_FORMAT;
        }
        if (sFormat == JSON_FORMAT){
            return JSONRWFormatter.serialize(obj);
        }else if (sFormat == XML_FORMAT){
            return XMLRWFormatter.serialize(obj);
        } else {
            throw new TypeError("No serialization format of type: " + sFormat);
        }
    };

    /** Generic function to turn a serialized string into a tokenized object
    *   @param String: Serialized object, as a string
    *   @param sFormat (optional): Serialization format.  Defaults to JSON_FORMAT
    */
    var makeNative = function makeNative(String, sFormat){
        if (sFormat === undefined){ // Default format is JSON_FORMAT
            sFormat = JSON_FORMAT;
        }
        if (sFormat == JSON_FORMAT){
            return JSONRWFormatter.parse(String);
        }else if (sFormat == XML_FORMAT){
            // Not currently implemented
            return XMLRWFormatter.parse(String);
        } else {
            throw new TypeError("No unserialization format of type: " + sFormat);
        }
    };
    
    // Expose Variables Publicly
    namespace.JSON_FORMAT = JSON_FORMAT;
    namespace.XML_FORMAT = XML_FORMAT;
    namespace.VALID_SERIAL_FORMATS = VALID_SERIAL_FORMATS;
    
    // Expose Functions Publicly
	namespace.createFromToken = createFromToken;
    namespace.serializeObject = serializeObject;
    namespace.nativizeObject = nativizeObject;
    namespace.makeSerialized = makeSerialized;
    namespace.makeNative = makeNative;
    namespace.tokenizeObject = tokenizeObject;
    namespace.untokenizeObject = untokenizeObject;
    
    // Expose Classes Publicly
    namespace.Serializable = Serializable;
    namespace.NamedSerializable = NamedSerializable;
    namespace.StorageToken = StorageToken;
    namespace.TokenRWFormat = TokenRWFormat;
    namespace.JSONRWFormat = JSONRWFormat;
	//namespace.XMLRWFormat = XMLRWFormat;
	
	// Expose Instances Publicly
	namespace.JSONRWFormatter = JSONRWFormatter;
	//namespace.XMLRWFormatter = XMLRWFormatter;
    
    SuperGLU.Serialization = namespace;
})(window.Serialization = window.Serialization || {});

/** Message format for recording events and for real-time service communication
    This message format primarily follows the xAPI format (https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md)
    but is much more relaxed in the requirements for parameters. It also includes elements
    of the FIPA messaging standard, most notably the Speech Act field (performative, http://www.fipa.org/specs/fipa00061/SC00061G.html)
    
    Package: SuperGLU (Generalized Learning Utilities)
    Author: Benjamin Nye
    License: APL 2.0
    Version: 1.0.0
    
    Requires:
        - zet.js 
        - serialization.js
**/
if (typeof SuperGLU === "undefined"){
    var SuperGLU = {};
    if (typeof window === "undefined") {
        var window = this;
    }
    window.SuperGLU = SuperGLU;
}

(function(namespace, undefined) {
var VERSION = "1.0.0",
    SUPERGLU_VERSION = SuperGLU.version,
    Zet = SuperGLU.Zet,
    Serialization = SuperGLU.Serialization;

var ACCEPT_PROPOSAL_ACT, AGREE_ACT, CANCEL_ACT, CALL_FOR_PROPOSAL_ACT,
    CONFIRM_ACT, DISCONFIRM_ACT, FAILURE_ACT, INFORM_ACT, INFORM_IF_ACT,
    INFORM_REF_ACT,  NOT_UNDERSTOOD_ACT, PROPAGATE_ACT, PROPOSE_ACT,
    PROXY_ACT, QUERY_IF_ACT, QUERY_REF_ACT, REFUSE_ACT, REJECT_PROPOSAL_ACT,
    REQUEST_ACT, REQUEST_WHEN_ACT, REQUEST_WHENEVER_ACT, SUBSCRIBE_ACT,
    
    ACTOR_KEY, VERB_KEY, OBJECT_KEY, RESULT_KEY, 
    SPEECH_ACT_KEY, TIMESTAMP_KEY, CONTEXT_KEY,
    CONTEXT_CONVERSATION_ID_KEY, CONTEXT_REPLY_WITH_KEY,
    CONTEXT_IN_REPLY_TO_KEY, CONTEXT_REPLY_BY_KEY,
    AUTHORIZATION_KEY, SESSION_ID_KEY, 
    CONTEXT_LANGUAGE_KEY, CONTEXT_ONTOLOGY_KEY,
    SUPERGLU_VERSION_KEY, MESSAGE_VERSION_KEY,
    SPEECH_ACT_SET, tokenizeObject, untokenizeObject;
    
// Core Speech Acts
INFORM_ACT = "Inform";                       // Asserting something
INFORM_REF_ACT = "Inform Ref";               // Assert the name of something
NOT_UNDERSTOOD_ACT = "Not Understood";       // Informing that you didn't understand an act
QUERY_REF_ACT = "Query Ref";                 // Asking the id of an object
REQUEST_ACT = "Request";                     // Requesting action (now)
REQUEST_WHEN_ACT = "Request When";           // Requesting action, conditional on X
REQUEST_WHENEVER_ACT = "Request Whenever";   // Requesting action, whenever X

// Information Speech Acts
CONFIRM_ACT = "Confirm";
DISCONFIRM_ACT = "Disconfirm";
INFORM_IF_ACT = "Inform If";
QUERY_IF_ACT = "Query If";

// Proposal Speech Acts
ACCEPT_PROPOSAL_ACT = "Accept Proposal";
CALL_FOR_PROPOSAL_ACT = "Call for Proposal";
PROPOSE_ACT = "Propose";
REJECT_PROPOSAL_ACT = "Reject Proposal";

// Action Negotiation Status
AGREE_ACT = "Agree";
CANCEL_ACT = "Cancel";
REFUSE_ACT = "Refuse";
FAILURE_ACT = "Failure";

// Relay Actions
PROPAGATE_ACT = "Propagate";
PROXY_ACT = "Proxy";
SUBSCRIBE_ACT = "Subscribe";

SPEECH_ACT_SET = {ACCEPT_PROPOSAL_ACT : true, AGREE_ACT : true, CANCEL_ACT : true, 
                  CALL_FOR_PROPOSAL_ACT : true, CONFIRM_ACT : true, DISCONFIRM_ACT : true,
                  FAILURE_ACT : true, INFORM_ACT : true, INFORM_IF_ACT : true,
                  INFORM_REF_ACT : true,  NOT_UNDERSTOOD_ACT : true, PROPAGATE_ACT : true, 
                  PROPOSE_ACT : true, PROXY_ACT : true, QUERY_IF_ACT : true, 
                  QUERY_REF_ACT : true, REFUSE_ACT : true, REJECT_PROPOSAL_ACT : true,
                  REQUEST_ACT : true, REQUEST_WHEN_ACT : true, REQUEST_WHENEVER_ACT : true, 
                  SUBSCRIBE_ACT : true};

ACTOR_KEY = "actor";
VERB_KEY = "verb";
OBJECT_KEY = "object";
RESULT_KEY = "result";
SPEECH_ACT_KEY = "speechAct";
TIMESTAMP_KEY = "timestamp";
CONTEXT_KEY = "context";

CONTEXT_CONVERSATION_ID_KEY = "conversation-id";
CONTEXT_IN_REPLY_TO_KEY = "in-reply-to";
CONTEXT_REPLY_WITH_KEY = "reply-with";
CONTEXT_REPLY_BY_KEY = "reply-by";

AUTHORIZATION_KEY = "authorization";
SESSION_ID_KEY = "session-id";
CONTEXT_LANGUAGE_KEY = 'language';
CONTEXT_ONTOLOGY_KEY = 'ontology';

SUPERGLU_VERSION_KEY = 'SuperGLU-version';
MESSAGE_VERSION_KEY = 'message-version';

tokenizeObject = Serialization.tokenizeObject;
untokenizeObject = Serialization.untokenizeObject;

/** Message format, for passing information between services
    This is serializable, and can be cast into JSON, along with
    any contained objects (including Messages) that are also serializable.
**/
Zet.declare('Message', {
    superclass : Serialization.Serializable,
    defineBody : function(self){
        // Private Properties

        // Public Properties
        
        /** Create a Message
            @param actor: The actor who did or would do the given action
            @param verb: Some action that was or would be done by the actor
            @param obj: An object or target for the action
            @param result: The outcome of the action 
            @param speechAct: A performative, stating why this message was sent
            @param context: A context object for the message, with additional data
            @param timestamp: A timestamp for when the message was created
            @param anId: A unique Id.  If none given, one will be assigned.
        **/
        self.construct = function construct(actor, verb, obj, result, speechAct, 
                                            context, timestamp, anId){
            self.inherited(construct, [anId]);
            if (typeof actor === "undefined") {actor = null;}
            if (typeof verb === "undefined") {verb = null;}
            if (typeof obj === "undefined") {obj = null;}
            if (typeof result === "undefined") {result = null;}
            if (typeof speechAct === "undefined") {speechAct = INFORM_ACT;}
            if (typeof context === "undefined") {context = {};}
            if (typeof timestamp === "undefined") {timestamp = null;}
            self._actor = actor;
            self._verb = verb;
            self._obj = obj;
            self._result = result;
            self._speechAct = speechAct;
            self._timestamp = timestamp;
            if (self._timestamp == null){
                self.updateTimestamp();
            }
            // Fill in version keys
            if (!(MESSAGE_VERSION_KEY in context)){
                context[MESSAGE_VERSION_KEY] = VERSION;
            }
            if (!(SUPERGLU_VERSION_KEY in context)){
                context[SUPERGLU_VERSION_KEY] = SUPERGLU_VERSION;
            }
            self._context = context;
		};
        
        /** Get the actor for the message **/
        self.getActor = function getActor(){
            return self._actor;
        };
        /** Set the actor for the message **/
        self.setActor = function setActor(value){
            self._actor = value;
        };
        
        /** Get the verb for the message **/
        self.getVerb = function getVerb(){
            return self._verb;
        };
        /** Set the verb for the message **/
        self.setVerb = function setVerb(value){
            self._verb = value;
        };
        
        /** Get the object for the message **/
        self.getObject = function getObject(){
            return self._obj;
        };
        /** Set the object for the message **/
        self.setObject = function setObject(value){
            self._obj = value;
        };
        
        /** Get the result for the message **/
        self.getResult = function getResult(){
            return self._result;
        };
        /** Set the result for the message **/
        self.setResult = function setResult(value){
            self._result = value;
        };
        
        /** Get the speech act for the message **/
        self.getSpeechAct = function getSpeechAct(){
            return self._speechAct;
        };
        /** Set the speech act for the message **/
        self.setSpeechAct = function setSpeechAct(value){
            self._speechAct = value;
        };
        
        /** Get the timestamp for the message (as an ISO-format string)**/
        self.getTimestamp = function getTimestamp(){
            return self._timestamp;
        };
        /** Set the timestamp for the message (as an ISO-format string) **/
        self.setTimestamp = function setTimestamp(value){
            self._timestamp = value;
        };
        /** Update the timestamp to the current time **/
        self.updateTimestamp = function updateTimestamp(){
            self._timestamp = new Date().toISOString();
        };
        
        /** Check if the context field has a given key **/
        self.hasContextValue = function hasContextValue(key){
            return (key in self._context) === true;
        };
        
        /** Get all the keys for the context object **/
        self.getContextKeys = function getContextKeys(){
            var key, keys;
            keys = [];
            for (key in self._context){
                keys.push(key);
            }
            return keys;
        };
        
        /** Get the context value with the given key. If missing, return the default. **/
        self.getContextValue = function getContextValue(key, aDefault){
            if (!(key in self._context)){
                return aDefault;
            }
            return self._context[key];
        };
        
        /** Set a context value with the given key-value pair **/
        self.setContextValue = function setContextValue(key, value){
            self._context[key] = value;
        };
        
        /** Delete the given key from the context **/
        self.delContextValue = function delContextValue(key){
            delete self._context[key];
        };
        
        /** Save the message to a storage token **/
        self.saveToToken = function saveToToken(){
            var key, token, newContext, hadKey;
            token = self.inherited(saveToToken);
            if (self._actor != null){
                token.setitem(ACTOR_KEY, tokenizeObject(self._actor));
            }
            if (self._verb != null){
                token.setitem(VERB_KEY, tokenizeObject(self._verb));
            }
            if (self._obj != null){
                token.setitem(OBJECT_KEY, tokenizeObject(self._obj));
            }
            if (self._result != null){
                token.setitem(RESULT_KEY, tokenizeObject(self._result));
            }
            if (self._speechAct != null){
                token.setitem(SPEECH_ACT_KEY, tokenizeObject(self._speechAct));
            }
            if (self._timestamp != null){
                token.setitem(TIMESTAMP_KEY, tokenizeObject(self._timestamp));
            }
            hadKey = false;
            newContext = {};
            for (key in self._context){
                hadKey = true;
                newContext[tokenizeObject(key)] = tokenizeObject(self._context[key]);
            }
            if (hadKey){
                token.setitem(CONTEXT_KEY, tokenizeObject(newContext));
            }
            return token;
        };

        /** Initialize the message from a storage token and some additional context (e.g., local objects) **/
        self.initializeFromToken = function initializeFromToken(token, context){
            self.inherited(initializeFromToken, [token, context]);
            self._actor = untokenizeObject(token.getitem(ACTOR_KEY, true, null), context);
            self._verb = untokenizeObject(token.getitem(VERB_KEY, true, null), context);
            self._obj = untokenizeObject(token.getitem(OBJECT_KEY, true, null), context);
            self._result = untokenizeObject(token.getitem(RESULT_KEY, true, null), context);
            self._speechAct = untokenizeObject(token.getitem(SPEECH_ACT_KEY, true, null), context);
            self._timestamp = untokenizeObject(token.getitem(TIMESTAMP_KEY, true, null), context);
            self._context = untokenizeObject(token.getitem(CONTEXT_KEY, true, {}), context);
        };
    }
});

namespace.version = VERSION;
namespace.Message = Message;

namespace.SPEECH_ACT_SET = SPEECH_ACT_SET;
namespace.ACCEPT_PROPOSAL_ACT = ACCEPT_PROPOSAL_ACT;
namespace.AGREE_ACT = AGREE_ACT;
namespace.CANCEL_ACT = CANCEL_ACT;
namespace.CALL_FOR_PROPOSAL_ACT = CALL_FOR_PROPOSAL_ACT;
namespace.CONFIRM_ACT = CONFIRM_ACT;
namespace.DISCONFIRM_ACT = DISCONFIRM_ACT;
namespace.FAILURE_ACT = FAILURE_ACT;
namespace.INFORM_ACT = INFORM_ACT;
namespace.INFORM_IF_ACT = INFORM_IF_ACT;
namespace.INFORM_REF_ACT = INFORM_REF_ACT;
namespace.NOT_UNDERSTOOD_ACT = NOT_UNDERSTOOD_ACT;
namespace.PROPAGATE_ACT = PROPAGATE_ACT;
namespace.PROPOSE_ACT = PROPOSE_ACT;
namespace.PROXY_ACT = PROXY_ACT;
namespace.QUERY_IF_ACT = QUERY_IF_ACT;
namespace.QUERY_REF_ACT = QUERY_REF_ACT;
namespace.REFUSE_ACT = REFUSE_ACT;
namespace.REJECT_PROPOSAL_ACT = REJECT_PROPOSAL_ACT;
namespace.REQUEST_ACT = REQUEST_ACT;
namespace.REQUEST_WHEN_ACT = REQUEST_WHEN_ACT;
namespace.REQUEST_WHENEVER_ACT = REQUEST_WHENEVER_ACT;
namespace.SUBSCRIBE_ACT = SUBSCRIBE_ACT;

namespace.ACTOR_KEY = ACTOR_KEY;
namespace.VERB_KEY = VERB_KEY;
namespace.OBJECT_KEY = OBJECT_KEY;
namespace.RESULT_KEY = RESULT_KEY;
namespace.SPEECH_ACT_KEY = SPEECH_ACT_KEY;
namespace.TIMESTAMP_KEY = TIMESTAMP_KEY;
namespace.CONTEXT_KEY = CONTEXT_KEY;

namespace.CONTEXT_CONVERSATION_ID_KEY = CONTEXT_CONVERSATION_ID_KEY;
namespace.CONTEXT_IN_REPLY_TO_KEY = CONTEXT_IN_REPLY_TO_KEY;
namespace.CONTEXT_REPLY_WITH_KEY = CONTEXT_REPLY_WITH_KEY;
namespace.CONTEXT_REPLY_BY_KEY = CONTEXT_REPLY_BY_KEY;

namespace.AUTHORIZATION_KEY = AUTHORIZATION_KEY;
namespace.SESSION_ID_KEY = SESSION_ID_KEY;
namespace.CONTEXT_LANGUAGE_KEY = CONTEXT_LANGUAGE_KEY;
namespace.CONTEXT_ONTOLOGY_KEY = CONTEXT_ONTOLOGY_KEY;

namespace.SUPERGLU_VERSION_KEY = SUPERGLU_VERSION_KEY;
namespace.MESSAGE_VERSION_KEY = MESSAGE_VERSION_KEY;

SuperGLU.Messaging = namespace;
})(window.Messaging = window.Messaging || {});
/** Messaging gateways and service base classes, which form
 a network of gateways for messages to propogate across.
 This module has two main types of classes:
 A. Gateways: These relay messages to their connected services (children)
 and also to other gateways that will also relay the message.
 Gateways exist to abstract away the network and iframe topology.
 Gateways send messages to their parent gateway and can also distribute
 messages downstream to child gateways and services.
 B. Services: Services that receive messages and may (or may not) respond.
 Services exist to process and transmit messages, while doing
 meaningful things to parts of systems that they control.
 Services only send and receive message with their parent gateway.

 As a general rule, every service should be able to act reasonably and
 sensibly, regardless of what messages it receives. In short, no service
 should hard fail. There may be conditions there the system as a whole may
 not be able to function, but all attempts should be made to soft-fail.

 Likewise, all services should be prepared to ignore any messages that it
 does not want to respond to, without any ill effects on the service (e.g.,
 silently ignore) or, alternatively, to send back a message indicating that
 the message was not understood. Typically, silently ignoring is usually best.

 Package: SuperGLU (Generalized Learning Utilities)
 Author: Benjamin Nye
 License: APL 2.0

 Requires:
 - Zet.js
 - Serializable.js
 - Messaging.js
 **/

if (typeof SuperGLU === "undefined") {
    var SuperGLU = {};
    if (typeof window === "undefined") {
        var window = this;
    }
    window.SuperGLU = SuperGLU;
}

(function (namespace, undefined) {
    var Zet = SuperGLU.Zet,
        Serialization = SuperGLU.Serialization,
        Messaging = SuperGLU.Messaging;

    var CATCH_BAD_MESSAGES = false,
        SESSION_ID_KEY = 'sessionId';

    /** The base class for a messaging node (either a Gateway or a Service) **/
    Zet.declare('BaseMessagingNode', {
        // Base class for messaging gateways
        superclass: Serialization.Serializable,
        defineBody: function (self) {
            // Public Properties

            /** Initialize a messaging node.  Should have a unique ID and (optionally)
             also have one or more gateways connected.
             @param id: A unique ID for the node. If none given, a random UUID will be used.
             @type id: str
             @param gateways: Gateway objects, which this node will register with.
             @type gateways: list of MessagingGateway object
             **/
            self.construct = function construct(id, nodes) {
                self.inherited(construct, [id]);
                if (nodes == null) {
                    nodes = [];
                }
                self._nodes = {};
                self._requests = {};
                self._uuid = UUID.genV4();
                self.addNodes(nodes);
            };

            /** Receive a message. When a message is received, two things should occur:
             1. Any service-specific processing
             2. A check for callbacks that should be triggered by receiving this message
             The callback check is done here, and can be used as inherited behavior.
             **/
            self.receiveMessage = function receiveMessage(msg) {
                // Processing to handle a received message
                //console.log(self._id + " received MSG: "+ self.messageToString(msg));
                self._triggerRequests(msg);
            };

            /** Send a message to connected nodes, which will dispatch it (if any gateways exist). **/
            self.sendMessage = function sendMessage(msg) {
                //console.log(self._id + " sent MSG: "+ self.messageToString(msg));
                self._distributeMessage(self._nodes, msg);
            };

            /** Handle an arriving message from some source.
             Services other than gateways should generally not need to change this.
             @param msg: The message arriving
             @param senderId: The id string for the sender of this message.
             **/
            self.handleMessage = function handleMessage(msg, senderId) {
                self.receiveMessage(msg);
            };

            /** Sends a message each of 'nodes', except excluded nodes (e.g., original sender) **/
            self._distributeMessage = function _distributeMessage(nodes, msg, excludeIds) {
                var nodeId, node, condition;
                if (excludeIds == null) {
                    excludeIds = [];
                }
                for (nodeId in nodes) {
                    condition = nodes[nodeId].condition;
                    node = nodes[nodeId].node;
                    if ((excludeIds.indexOf(nodeId) < 0) &&
                        (condition == null || condition(msg))) {
                        self._transmitMessage(node, msg, self.getId());
                    }
                }
            };

            /** Transmit the message to another node **/
            self._transmitMessage = function _transmitMessage(node, msg, senderId) {
                node.handleMessage(msg, senderId);
            };

            // Manage Connected Nodes

            /** Get all connected nodes for the gateway **/
            self.getNodes = function getNodes() {
                return Object.keys(self._nodes).map(function (key) {
                    return self._nodes[key].node;
                });
            };

            /** Connect nodes to this node **/
            self.addNodes = function addNodes(nodes) {
                var i;
                if (nodes == null) {
                    nodes = [];
                }
                for (i = 0; i < nodes.length; i++) {
                    nodes[i].onBindToNode(self);
                    self.onBindToNode(nodes[i]);
                }
            };

            /** Remove the given connected nodes. If nodes=null, remove all. **/
            self.removeNodes = function removeNodes(nodes) {
                var i;
                if (nodes == null) {
                    nodes = self.getNodes();
                }
                for (i = 0; i < nodes.length; i++) {
                    nodes[i].onUnbindToNode(self);
                    self.onUnbindToNode(nodes[i]);
                }
            };

            /** Register the node and signatures of messages that the node is interested in **/
            self.onBindToNode = function onBindToNode(node) {
                if (!(node.getId() in self._nodes)) {
                    self._nodes[node.getId()] = {
                        'node': node,
                        'conditions': node.getMessageConditions()
                    };
                }
            };

            /** This removes this node from a connected node (if any) **/
            self.onUnbindToNode = function onUnbindToNode(node) {
                if (node.getId() in self._nodes) {
                    delete self._nodes[node.getId()];
                }
            };

            /** Get a list of conditions functions that determine if a gateway should
             relay a message to this node (can be propagated across gateways to filter
             messages from reaching unnecessary parts of the gateway network).
             **/
            self.getMessageConditions = function getMessageConditions() {
                /** Function to check if this node is interested in this message type */
                return function () {
                    return true;
                };
            };

            /** Get the conditions for sending a message to a node **/
            self.getNodeMessageConditions = function getNodeMessageConditions(nodeId) {
                if (nodeId in self._nodes) {
                    return self._nodes[nodeId].conditions;
                } else {
                    return function () {
                        return true;
                    };
                }
            };

            /** Update the conditions for sending a message to a node **/
            self.updateNodeMessageConditions = function updateNodeMessageConditions(nodeId, conditions) {
                if (nodeId in self._nodes) {
                    self._nodes[nodeId] = [self._nodes[nodeId].node, conditions];
                }
            };

            // Request Management

            /** Internal function to get all pending request messages **/
            self._getRequests = function _getRequests() {
                var key, reqs;
                reqs = [];
                for (key in self._requests) {
                    reqs.push(self._requests[key][0]);
                }
                return reqs;
            };

            /** Add a request to the queue, to respond to at some point
             @param msg: The message that was sent that needs a reply.
             @param callback: A function to call when the message is received, as f(newMsg, requestMsg)
             @TODO: Add a timeout for requests, with a timeout callback (maxWait, timeoutCallback)
             **/
            self._addRequest = function _addRequest(msg, callback) {
                if (callback != null) {
                    self._requests[msg.getId()] = [msg.clone(), callback];
                }
            };

            /** Make a request, which is added to the queue and then sent off to connected services
             @param msg: The message that was sent that needs a reply.
             @param callback: A function to call when the message is received, as f(newMsg, requestMsg)
             **/
            self._makeRequest = function _makeRequest(msg, callback) {
                self._addRequest(msg, callback);
                self.sendMessage(msg);
                //console.log("SENT REQUEST:" + Serialization.makeSerialized(Serialization.tokenizeObject(msg)));
            };

            /** Trigger any requests that are waiting for a given message. A
             request is filled when the conversation ID on the message matches
             the one for the original request. When a request is filled, it is
             removed, unless the speech act was request whenever (e.g., always)
             @param msg: Received message to compare against requests.
             **/
            self._triggerRequests = function _triggerRequests(msg) {
                var key, convoId, oldMsg, callback;
                //console.log("Heard REPLY:" + Serialization.makeSerialized(Serialization.tokenizeObject(msg)));
                convoId = msg.getContextValue(Messaging.CONTEXT_CONVERSATION_ID_KEY, null);
                //console.log("CONVO ID: " + convoId);
                //console.log(self._requests);
                if (convoId != null) {
                    // @TODO: This is a dict, so can check directly?
                    for (key in self._requests) {
                        if (key === convoId) {
                            oldMsg = self._requests[key][0];
                            callback = self._requests[key][1];
                            callback(msg, oldMsg);
                            // Remove from the requests, unless asked for a permanent feed
                            if (oldMsg.getSpeechAct() !== Messaging.REQUEST_WHENEVER_ACT) {
                                delete self._requests[key];
                            }
                        }
                    }
                }
            };

            // Pack/Unpack Messages

            /** Convenience function to serialize a message **/
            self.messageToString = function messageToString(msg) {
                return Serialization.makeSerialized(Serialization.tokenizeObject(msg));
            };

            /** Convenience function to turn a serialized JSON message into a message
             If the message is invalid when unpacked, it is ignored.
             **/
            self.stringToMessage = function stringToMessage(msg) {
                if (CATCH_BAD_MESSAGES) {
                    try {
                        msg = Serialization.untokenizeObject(Serialization.makeNative(msg));
                    } catch (err) {
                        // console.log("ERROR: Could not process message data received.  Received:");
                        // console.log(msg);
                        msg = undefined;
                    }
                } else {
                    msg = Serialization.untokenizeObject(Serialization.makeNative(msg));
                }
                return msg;
            };
        }
    });

    /** A messaging gateway base class, for relaying messages **/
    Zet.declare('MessagingGateway', {
        // Base class for messaging gateways
        superclass: BaseMessagingNode,
        defineBody: function (self) {
            // Public Properties

            /** Initialize a Messaging Gateway.
             @param id: Unique ID for the gateway
             @param nodes: Connected nodes for this gateway
             @param scope: Extra context data to add to messages sent to this gateway, if those keys missing
             **/
            self.construct = function construct(id, nodes, scope) {
                // Should check for cycles at some point
                if (scope == null) {
                    scope = {};
                }
                self.inherited(construct, [id, nodes]);
                self._scope = scope;
            };

            // Handle Incoming Messages
            /** Receive a message from a connected node and propogate it. **/
            self.handleMessage = function handleMessage(msg, senderId) {
                self.receiveMessage(msg);
                self._distributeMessage(self._nodes, msg, [senderId]);
            };

            // Relay Messages

            /** Distribute the message, after adding some gateway context data. **/
            self._distributeMessage = function _distributeMessage(nodes, msg, excludeIds) {
                msg = self.addContextDataToMsg(msg);
                self.inherited(_distributeMessage, [nodes, msg, excludeIds]);
            };

            /** Add the additional context data in the Gateway scope, unless those
             keys already exist in the message's context object.
             **/
            self.addContextDataToMsg = function addContextDataToMsg(msg) {
                var key;
                for (key in self._scope) {
                    if (!(msg.hasContextValue(key))) {
                        msg.setContextValue(key, self._scope[key]);
                    }
                }
                return msg;
            };
        }
    });

    /** Messaging Gateway Node Stub for Cross-Domain Page Communication
     A stub gateway that is a placeholder for a PostMessage gateway in another frame.
     This should only be a child or parent of a PostMessageGateway, because other
     nodes will not know to send messages via HTML5 postMessage to the actual frame
     that this stub represents.
     **/
    Zet.declare('PostMessageGatewayStub', {
        //
        superclass: BaseMessagingNode,
        defineBody: function (self) {
            // Private Properties
            var ANY_ORIGIN = '*';

            // Public Properties

            /** Initialize a PostMessageGatewayStub
             @param id: Unique id for the gateway
             @param gateway: The parent gateway for this stub
             @param origin: The base URL expected for messages from this frame.
             @param element: The HTML element (e.g., frame/iframe) that the stub represents. By default parent window.
             **/
            self.construct = function construct(id, gateway, origin, element) {
                var nodes = null;
                if (gateway != null) {
                    nodes = [gateway];
                }
                self.inherited(construct, [id, nodes]);
                if (origin == null) {
                    origin = ANY_ORIGIN;
                }
                if (element == null) {
                    element = parent;
                }
                if (element === window) {
                    element = null;
                }
                self._origin = origin;
                self._element = element;
                self._queue = [];
            };

            /** Get the origin, which is the frame location that is expected **/
            self.getOrigin = function getOrigin() {
                return self._origin;
            };

            /** Get the HTML element where messages would be sent **/
            self.getElement = function getElement() {
                return self._element;
            };

            self.getQueue = function getQueue() {
                return self._queue;
            };
        }
    });


    /** Messaging Gateway for Cross-Domain Page Communication
     Note: This should not directly take other PostMessageGateways as nodes.
     PostMessageGatewayStub objects must be used instead. Only use ONE
     PostMessageGateway per frame.
     **/
    Zet.declare('PostMessageGateway', {
        superclass: MessagingGateway,
        defineBody: function (self) {
            // Private Properties
            var ANY_ORIGIN = '*';

            // Public Properties

            /** Initialize a PostMessageGateway
             @param id: The unique ID for this gateway.
             @param nodes: Child nodes for the gateway
             @param origin: The origin URL for the current window
             @param scope: Additional context parameters to add to messages sent by children.
             **/
            self.construct = function construct(id, nodes, origin, scope) {
                if (origin == null) {
                    origin = ANY_ORIGIN;
                }
                self._origin = origin;
                // Get these ready before adding nodes in base constructor
                self._postNodes = {};
                self._validOrigins = {};
                self._anyOriginValid = true;
                self._registrationInterval = 0;
                self._registry = {};
                // Construct
                self.inherited(construct, [id, nodes, scope]);
                self.validatePostingHierarchy();
                if (window) {
                    self.bindToWindow(window);
                }
                if (nodes && nodes.length) {
                    nodes.forEach(function (t) {
                        if (PostMessageGatewayStub.isInstance(t) && t.getElement() === window.parent) {
                            self.startRegistration(t);
                            t._isActive = false;        //stub is inactive unless registered
                        }
                    });
                }
            };

            self.startRegistration = function (node) {
                var senderId = self.getId();
                var msg = Message(senderId, 'REGISTER', null, true);
                var interval = setInterval(function () {
                    self._transmitPostMessage(node, msg, senderId);
                }, 2000);
                self._registrationInterval = interval
            };

            self.stopRegistration = function () {
                clearInterval(self._registrationInterval);
            };

            /** Get the origin for this window **/
            self.getOrigin = function getOrigin() {
                return self._origin;
            };

            /** Get a stub that is the equivalent to this gateway **/
            self.getStub = function getStub() {
                return PostMessageGatewayStub(self._id, self._gateway, self._origin);
            };

            /** Validates that no additional PostMessageGateway nodes are connected
             and in the same frame. Valid neighbors can have no PostMessageGateway nodes,
             and only the parent OR the children can be of the PostMessageGatewayStub class
             **/
            self.validatePostingHierarchy = function validatePostingHierarchy() {
                var key;
                for (key in self._nodes) {
                    if (PostMessageGateway.isInstance(self._nodes[key])) {
                        throw TypeError("Error: Cannot directly connect PostMessageGateways");
                    }
                }
                // @TODO: Check for cycles in the posting hierarchy
            };

            /** Register the node and signatures of messages that the node is interested in **/
            self.onBindToNode = function onBindToNode(node) {
                self.inherited(onBindToNode, [node]);
                self._onAttachNode(node);
            };

            /** This removes this node from a connected node (if any) **/
            self.onUnbindToNode = function onUnbindToNode(node) {
                self._onDetachNode(node);
                self.inherited(onUnbindToNode, [node]);
            };

            /** When attaching nodes, adds any origins of PostMessageGatewayStubs
             to an allowed list of valid origins for HTML5 postMessages.
             @param node: A child node to attach.
             @type node: BaseMessagingNode
             **/
            self._onAttachNode = function _onAttachNode(node) {
                // @TODO: Should check if already attached and raise error
                if (PostMessageGatewayStub.isInstance(node) &&
                    (!(node.getId() in self._postNodes))) {
                    if (self._validOrigins[node.getOrigin()] == null) {
                        self._validOrigins[node.getOrigin()] = 1;
                    } else {
                        self._validOrigins[node.getOrigin()] += 1;
                    }
                    if (node.getOrigin() === ANY_ORIGIN) {
                        self._anyOriginValid = true;
                    }
                    self._postNodes[node.getId()] = node;
                }
            };

            /** When detaching nodes, clears any origins of PostMessageGatewayStubs
             from an allowed list of valid origins for HTML5 postMessages.
             @param node: A child node to attach.
             @type node: BaseMessagingNode
             **/
            self._onDetachNode = function _onDetachNode(node) {
                if (PostMessageGatewayStub.isInstance(node) &&
                    (node.getId() in self._postNodes)) {
                    self._validOrigins[node.getOrigin()] += -1;
                    if (self._validOrigins[node.getOrigin()] === 0) {
                        delete self._validOrigins[node.getOrigin()];
                        if (!(ANY_ORIGIN in self._validOrigins)) {
                            self._anyOriginValid = false;
                        }
                    }
                    delete self._postNodes[node.getId()];
                }
            };

            /** Bind the HTML5 event listener for HTML5 postMessage **/
            self.bindToWindow = function bindToWindow(aWindow) {
                var eventMethod, eventer, messageEvent;
                eventMethod = aWindow.addEventListener ? "addEventListener" : "attachEvent";
                eventer = aWindow[eventMethod];
                messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
                eventer(messageEvent, function (event) {
                    self._receivePostMessage(event);
                });
            };

            // Messaging

            /** Send a message to parent. Send as normal, but send using sendPostMessage
             if sending to a PostMessage stub.
             **/
            /** Transmit the message to another node **/
            self._transmitMessage = function _transmitMessage(node, msg, senderId) {
                if (PostMessageGatewayStub.isInstance(node)) {
                    if (node._isActive) {
                        self._processPostMessageQueue(node);
                        self._transmitPostMessage(node, msg, senderId);
                    } else {
                        node.getQueue().push({
                            msg: msg,
                            senderId: senderId
                        });
                    }
                } else {
                    node.handleMessage(msg, senderId);
                }
            };

            self._processPostMessageQueue = function (stub) {
                stub.getQueue().forEach(function (o) {
                    self._transmitPostMessage(stub, o.msg, o.senderId);
                });
                stub.getQueue().splice(0, stub.getQueue().length);
            };

            // HTML5 PostMessage Commands
            self._transmitPostMessage = function _transmitPostMessage(node, msg, senderId) {
                if (node._stubId) {
                    msg.setObject(msg.getObject() == null ? {} : msg.getObject());
                    msg.getObject()["stubId"] = node._stubId;
                }

                var postMsg, element;
                postMsg = JSON.stringify({
                    'SuperGLU': true,
                    'msgType': 'SuperGLU',
                    'version': SuperGLU.version,
                    'senderId': senderId,
                    'targetId': node.getId(),
                    'msg': self.messageToString(msg)
                });
                element = node.getElement();
                if (element != null) {
                    // console.log(JSON.parse(postMsg).senderId + " POSTED UP " + self.messageToString(msg));
                    element.postMessage(postMsg, node.getOrigin());
                }
            };

            self._receivePostMessage = function _receivePostMessage(event) {
                var senderId, message, targetId;
                //console.log(self._id + " RECEIVED POST " + JSON.parse(event.data));
                if (self.isValidOrigin(event.origin)) {
                    try {
                        message = JSON.parse(event.data);
                    } catch (err) {
                        // console.log("Post Message Gateway did not understand: " + event.data);
                        return;
                    }
                    senderId = message.senderId;
                    targetId = message.targetId;
                    message = self.stringToMessage(message.msg);
                    console.log(message);
                    if (Messaging.Message.isInstance(message) &
                        (targetId === self.getId()) &&
                        message.getVerb() === 'REGISTER'
                    ) {
                        var obj = message.getObject() || {};
                        var node = null;
                        var verb = 'REGISTERED';
                        var stubId = UUID.genV4().toString();
                        if (obj.stubId) {
                            stubId = obj.stubId;
                            node = self._registry[stubId];
                        } else {
                            node = SuperGLU.Messaging_Gateway.PostMessageGatewayStub(senderId, null, null, event.source);
                            self._registry[stubId] = node;
                            self.addNodes([node]);
                        }
                        var msg = Message(self.getId(), verb, {stubId: stubId}, true);
                        self._transmitPostMessage(node, msg, self.getId());
                    } else if (Messaging.Message.isInstance(message) &
                        (targetId === self.getId()) &&
                        message.getVerb() === 'REGISTERED'
                    ) {
                        var nodes = self.getNodes();
                        nodes.forEach(function (node) {
                            if (PostMessageGatewayStub.isInstance(node) && node.getElement() === window.parent) {
                                self.stopRegistration();
                                node._isActive = true;        //stub is inactive unless registered
                                self._stubId = message.getObject().stubId;
                                self._processPostMessageQueue(node);
                            }
                        });
                    }
                    else if (Messaging.Message.isInstance(message) &
                        (targetId === self.getId()) &&
                        (senderId in self._postNodes)) {
                        self.handleMessage(message, senderId);
                    }
                }
            };

            self.isValidOrigin = function isValidOrigin(url) {
                if (self._anyOriginValid) {
                    return true;
                } else {
                    return url in self._validOrigins;
                }
            };
        }
    });


    Zet.declare('HTTPMessagingGateway', {
        // Base class for messaging gateways
        // This uses socket.io.js and uuid.js
        superclass: MessagingGateway,
        defineBody: function (self) {
            // Public Properties
            // Events: connecting, connect, disconnect, connect_failed, error,
            //         message, anything, reconnecting, reconnect, reconnect_failed
            // Listed At: github.com/LearnBoost/socket.io/wiki/Exposed-events
            var MESSAGING_NAMESPACE = '/messaging',
                TRANSPORT_SET = ['websocket',
                    'flashsocket',
                    'htmlfile',
                    'xhr-polling',
                    'jsonp-polling'];
            // Set Socket.IO Allowed Transports


            self.construct = function construct(id, nodes, url, sessionId, scope) {
                self.inherited(construct, [id, nodes, scope]);      // Classifier not used here, as messages are exact responses.
                if (url == null) {
                    url = null;
                }
                if (sessionId == null) {
                    sessionId = UUID.genV4().toString();
                }
                self._url = url;
                self._socket = io.connect(self._url + MESSAGING_NAMESPACE);
                self._isConnected = false;
                self._sessionId = sessionId;
                self._socket.on('message', self.receiveWebsocketMessage);
            };

            self.bindToConnectEvent = function bindToConnectEvent(funct) {
                self._socket.on('connect', funct);
            };

            self.bindToCloseEvent = function bindToCloseEvent(funct) {
                self._socket.on('disconnect', funct);
            };

            self.addSessionData = function addSessionData(msg) {
                msg.setContextValue(SESSION_ID_KEY, self._sessionId);
                return msg;
            };

            /** Distribute the message, after adding some gateway context data. **/
            self._distributeMessage = function _distributeMessage(nodes, msg, excludeIds, noSocket) {
                msg = self.addContextDataToMsg(msg);
                if (noSocket !== true && self._url != null) {
                    msg = self.addSessionData(msg);
                    self.sendWebsocketMessage(msg);
                }
                self.inherited(_distributeMessage, [nodes, msg, excludeIds]);
            };

            self.sendWebsocketMessage = function sendWebsocketMessage(msg) {
                msg = self.messageToString(msg);
                self._socket.emit('message', {data: msg, sessionId: self._sessionId});
            };

            self.receiveWebsocketMessage = function receiveWebsocketMessage(msg) {
                var sessionId;
                sessionId = msg.sessionId;
                msg = msg.data;
                msg = self.stringToMessage(msg);
                // console.log("GOT THIS:" + sessionId);
                // console.log("Real Sess: " + self._sessionId);
                if (Messaging.Message.isInstance(msg) &&
                    (sessionId == null || sessionId == self._sessionId)) {
                    self._distributeMessage(self._nodes, msg, [], true);
                }
            };
        }
    });


    Zet.declare('BaseService', {
        // Base class for messaging gateways
        superclass: BaseMessagingNode,
        defineBody: function (self) {
            // Public Properties

            self.construct = function construct(id, gateway) {
                var nodes = null;
                if (gateway != null) {
                    nodes = [gateway];
                }
                self.inherited(construct, [id, nodes]);
            };

            /** Connect nodes to this node.
             Only one node (a gateway) should be connected to a service.
             **/
            self.addNodes = function addNodes(nodes) {
                if (nodes.length + self.getNodes().length <= 1) {
                    self.inherited(addNodes, [nodes]);
                } else {
                    console.log("Error: Attempted to add more than one node to a service. Service must only take a single gateway node. Service was: " + self.getId());
                }
            };

            /** Bind nodes to this node.
             Only one node (a gateway) should be connected to a service.
             **/
            self.onBindToNode = function onBindToNode(node) {
                if (self.getNodes().length === 0) {
                    self.inherited(onBindToNode, [node]);
                } else {
                    console.log("Error: Attempted to bind more than one node to a service. Service must only take a single gateway node.");
                }
            };
        }
    });

    Zet.declare('TestService', {
        // Base class for messaging gateways
        superclass: BaseService,
        defineBody: function (self) {
            // Public Properties
            self.receiveMessage = function receiveMessage(msg) {
                console.log("TEST SERVICE " + self.getId() + " GOT: \n" + self.messageToString(msg));
                self.inherited(receiveMessage, [msg]);
            };

            self.sendTestString = function sendTestString(aStr) {
                console.log("Test Service is Sending: " + aStr);
                self.sendMessage(Messaging.Message("TestService", "Sent Test", "To Server", aStr));
            };

            self.sendTestMessage = function sendTestMessage(actor, verb, object, result, speechAct, context, addGatewayContext) {
                var msg;
                if (context == null) {
                    context = {};
                }
                if (addGatewayContext == null) {
                    addGatewayContext = true;
                }
                msg = Messaging.Message(actor, verb, object, result, speechAct, context);
                console.log(msg);
                if ((self._gateway != null) && (addGatewayContext)) {
                    msg = self._gateway.addContextDataToMsg(msg);
                }
                self.sendMessage(msg);
            };

            self.sendTestRequest = function sendTestRequest(callback, actor, verb, object, result, speechAct, context, addGatewayContext) {
                var msg;
                if (context == null) {
                    context = {};
                }
                if (addGatewayContext == null) {
                    addGatewayContext = true;
                }
                msg = Messaging.Message(actor, verb, object, result, speechAct, context);
                console.log(msg);
                if ((self._gateway != null) && (addGatewayContext)) {
                    msg = self._gateway.addContextDataToMsg(msg);
                }
                self._makeRequest(msg, callback);
            };
        }
    });

    namespace.SESSION_ID_KEY = SESSION_ID_KEY;
    namespace.BaseService = BaseService;
    namespace.MessagingGateway = MessagingGateway;
    namespace.PostMessageGatewayStub = PostMessageGatewayStub;
    namespace.PostMessageGateway = PostMessageGateway;
    namespace.HTTPMessagingGateway = HTTPMessagingGateway;
    namespace.TestService = TestService;

    SuperGLU.Messaging_Gateway = namespace;
})(window.Messaging_Gateway = window.Messaging_Gateway || {});

/** Services for determining if another service or gateway
    is functional (e.g., loaded properly, heartbeat functional)
    
    Package: SuperGLU (Generalized Learning Utilities)
    Author: Benjamin Nye
    License: APL 2.0
    
    Requires:
        - Util\zet.js 
        - Util\serializable.js
        - Core\messaging.js
        - Core\messaging-gateway.js
**/

if (typeof SuperGLU === "undefined"){
    var SuperGLU = {};
    if (typeof window === "undefined") {
        var window = this;
    }
    window.SuperGLU = SuperGLU;
}

(function(namespace, undefined) {
var Zet = SuperGLU.Zet,
    Serialization = SuperGLU.Serialization,
    Messaging = SuperGLU.Messaging,
    Messaging_Gateway = SuperGLU.Messaging_Gateway;

// Verbs and Context Keys
var HEARTBEAT_VERB = 'Heartbeat',
    ORIGIN_KEY = 'Origin';

/** Heartbeat service, which generates a regular message that
    is sent at some interval.
**/
Zet.declare('HeartbeatService', {
    superclass : Messaging_Gateway.BaseService,
    defineBody : function(self){
		// Public Properties
        var DEFAULT_HB = 'DefaultHeartbeat',
            DEFAULT_DELAY = 60;
        
        /** Initialize the heartbeat service 
            @param gateway: The parent gateway for this service
            @param heartbeatName: The name for the heartbeat
            @param delay: The interval for sending the heartbeat, in seconds.
            @param id: The UUID for this service
        **/
        self.construct = function construct(gateway, heartbeatName, delay, id){
            self.inherited(construct, [id, gateway]);
            if (heartbeatName == null) {heartbeatName = DEFAULT_HB;}
            if (delay == null) {delay = DEFAULT_DELAY;}
            self._heartbeatName = heartbeatName;
            self._delay = delay;
            self._isActive = false;
		};
        
        /** Send the heartbeat message **/
        self.sendHeartbeat = function sendHeartbeat(){
            var msg = Message(self.getId(), HEARTBEAT_VERB, self._heartbeatName, 
                              window.location.href);
            msg.setContextValue(ORIGIN_KEY, window.location.href);
            self.sendMessage(msg);
        };
        
        /** Start this service heartbeat, with a given delay.
            If already started, does nothing.
            @param delay: The interval for the heartbeat. If none 
                          given, uses the service default.
        **/
        self.start = function start(delay){
            if (delay != null){
                self._delay = delay;
            }
            var heartbeatFunct = function(){
                if (self._isActive){
                    self.sendHeartbeat();
                    setTimeout(heartbeatFunct, self._delay*1000);
                }
            };
            if (self._isActive !== true){
                self._isActive = true;
                heartbeatFunct();
            }
        };
        
        /** Change the rate of this heartbeat generated.
            @param delay: The interval for the heartbeat, in seconds.
        **/
        self.changeHeartrate = function changeHeartrate(delay){
            if (delay == null){ delay = DEFAULT_DELAY; }
            self._delay = delay;
        };
        
        /** Stop the heartbeat. **/
        self.stop = function stop(){
            self._isActive = false;
        };
    }
});

/** Heartbeat monitor service, which monitors one or more heartbeat messages. 
    This service determines that a beat is skipped if ANY heartbeat is missed.
    Each heartbeat has a value that stores the last time that any message matched
    that monitor. This value is updated every time a message is received, with the 
    time that the message was received.  If the monitor checks any monitor and its
    last message is too old, a function is called.
**/
Zet.declare('HeartbeatMonitor', {
    superclass : Messaging_Gateway.BaseService,
    defineBody : function(self){
        var DEFAULT_DELAY = 150;
        
        /** Initialize the heartbeat monitor service 
            @param gateway: The parent gateway for this service
            @param heartbeatNames: The names of each heartbeat being monitored
            @param delay: The delay allowed for each heartbeat to arrive.
            @param onSkipbeat: Function called if a beat is skipped, in form f(heartbeatName, self)
            @param offOnSkip: If true, turns off if beat skipped. 
                              Else, calls onSkipbeat repeatedly.
            @param id: The uuid for this service.
        **/
		self.construct = function construct(gateway, heartbeatNames, delay, 
                                            onSkipbeat, offOnSkip, id){
            self.inherited(construct, [id, gateway]);
            if (heartbeatNames == null) {heartbeatNames = [];}
            if (delay == null) {delay = DEFAULT_DELAY;}
            if (offOnSkip == null) {offOnSkip = false;}
            self._heartbeatNames = heartbeatNames;
            self._delay = delay;
            self._onSkipbeat = onSkipbeat;
            self._offOnSkip = offOnSkip;
            self._isActive = false;
            self._heartbeatTimes = {};
            self.resetHeartbeatTimes();
		};
        
        /** Receive messages. Only looks for messages with a heartbeat verb. 
            If heartbeat message hits, this updates the time for that heartbeat
            (stated as the 'object' message component).
        **/
        self.receiveMessage = function receiveMessage(msg){
            self.inherited(receiveMessage, [msg]);
            if (msg.getVerb() === HEARTBEAT_VERB){
                if (self._heartbeatNames.indexOf(msg.getObject()) >= 0){
                    self._heartbeatTimes[msg.getObject()] = new Date().getTime();
                }
            }
        };
        
        /** Start the heartbeat monitor, which resets all heartbeat monitors
            and starts the cycle that checks for any expired heartbeats.
            @param delay: The delay between when to check heartbeat monitors, in seconds.
        **/
        self.start = function start(delay){
            if (delay != null){
                self._delay = delay;
            }
            var monitorFunct = function(){
                if (self._isActive){
                    self.checkMonitors();
                    setTimeout(monitorFunct, self._delay*1000);
                }
            };
            self.resetHeartbeatTimes();
            if (self._isActive !== true){
                self._isActive = true;
                monitorFunct();
            }
        };
        
        /** Check all monitors to see if any have expired.
            If any have expired, run the onSkipbeat function.
        **/
        self.checkMonitors = function checkMonitors(){
            var key, time;
            var currentTime = new Date().getTime();
            for (key in self._heartbeatNames){
                key = self._heartbeatNames[key];
                time = self._heartbeatTimes[key];
                if (currentTime - time > self._delay*1000){
                    if (self._onSkipbeat){
                        self._onSkipbeat(key, self);
                        if (self._offOnSkip){
                            self.stop();
                        }
                    }
                }
            }
        };
        
        /** Reset the heartbeat monitor times, by setting them each to
            the current time, and clearing out any values not in the list 
            of monitored heartbeat names.
        **/
        self.resetHeartbeatTimes = function resetHeartbeatTimes(){
            var key;
            self._heartbeatTimes = {};
            for (key in self._heartbeatNames){
                key = self._heartbeatNames[key];
                self._heartbeatTimes[key] = new Date().getTime();
            }
        };
        
        /** Stop monitoring the heartbeats. **/
        self.stop = function stop(){
            self._isActive = false;
        };
    }
});

namespace.HEARTBEAT_VERB = HEARTBEAT_VERB;
namespace.HeartbeatService = HeartbeatService;
namespace.HeartbeatMonitor = HeartbeatMonitor;

SuperGLU.Heartbeat_Service = namespace;
})(window.Heartbeat_Service = window.Heartbeat_Service || {});
/** Data about this reference implementation **/
if (typeof window === "undefined") {
    var window = this;
}

(function(namespace, undefined) {

// Version Numbering
namespace.REFERENCE_IMPLEMENTATION_VERSION_KEY = "reference-implementation-version";
namespace.USER_AGENT_KEY = "UserAgent";
namespace.version = "1.0.1";

})(window.ReferenceData = window.ReferenceData || {});