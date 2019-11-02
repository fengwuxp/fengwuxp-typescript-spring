// /*
//  * a transpiler from AntPathMatcher.java to JavaScript
//  *
//  * @see https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/main/java/org/springframework/util/AntPathMatcher.java
//  *
//  */
//
//
//
// module.exports = antPathMatcher ;
//
//
// const StringBuilder = require('string-builder');
//
// const XRegExp = require('xregexp');
// const quotemeta = require('xregexp-quotemeta');
// quotemeta.addSupportTo(XRegExp);
//
//
// var caseSensitive = true ;
// var pathSeparator = '/' ;
//
//
// function tokenizePath( path) {
//     return path.split( pathSeparator).filter(x=>x).map(x=>x.trim()) ;
// }
//
// function tokenizePattern( pattern) {
//     return tokenizePath(pattern) ;
// }
//
//
// function patternQuote( s) {
//     var slashEIndex = s.indexOf("\\E");
//     if (slashEIndex == -1)
//         return "\\Q" + s + "\\E";
//
//     // var sb = new StringBuilder(s.length * 2);
//     var sb = new StringBuilder() ;
//
//     sb.append("\\Q");
//     slashEIndex = 0;
//     var current = 0;
//     while ((slashEIndex = s.indexOf("\\E", current)) != -1) {
//         sb.append(s.substring(current, slashEIndex));
//         current = slashEIndex + 2;
//         sb.append("\\E\\\\E\\Q");
//     }
//     sb.append(s.substring(current, s.length));
//     sb.append("\\E");
//     return sb.toString();
// }
//
// function quote( s, start , end) {
//     if( start==end)
//         return '' ;
//     return patternQuote( s.substring( start, end)) ;
// }
//
//
// function AntPathStringMatcher( pattern ,caseSensitive ) {
//
//     // var GLOB_PATTERN = new XRegExp("\\?|\\*|\\{((?:\\{[^/]+?\\}|[^/{}]|\\\\[{}])+?)\\}") ;
//     var GLOB_PATTERN = /\?|\*|\{((?:\{[^/]+?\}|[^/{}]|\\[{}])+?)\}/g ;
//
//     var DEFAULT_VARIABLE_PATTERN = "(.*)" ;
//
//     var variableNames = new Array() ;
//
//     var patternBuilder = new StringBuilder() ;
//     var end = 0;
//
//     while( null != ( matcher = GLOB_PATTERN.exec( pattern)))
//     {
//         patternBuilder.append( quote( pattern, end , matcher.index)) ;
//         var match = matcher[0] ;
//
//         if ("?"==match) {
//             patternBuilder.append('.');
//         }
//         else if ("*"==match) {
//             patternBuilder.append(".*");
//         }
//         else if ( match.startsWith("{") && match.endsWith("}")) {
//             var colonIdx = match.indexOf(':');
//             if (colonIdx == -1) {
//                 patternBuilder.append(DEFAULT_VARIABLE_PATTERN);
//                 variableNames.push ( matcher[1]);
//             }
//             else {
//                 var variablePattern = match.substring(colonIdx + 1, match.length - 1);
//                 patternBuilder.append('(');
//                 patternBuilder.append(variablePattern);
//                 patternBuilder.append(')');
//                 var variableName = match.substring(1, colonIdx);
//                 variableNames.push(variableName);
//             }
//         }
//
//         end = GLOB_PATTERN.lastIndex ;
//     }
//
//     patternBuilder.append( quote( pattern, end, pattern.length));
//
//     var o = new Object() ;
//     o.pattern =  caseSensitive ? new XRegExp(patternBuilder.toString(),'g') :  new XRegExp( patternBuilder.toString() ,'ig');
//
//     o.matchStrings = function(str) {
//         // var b = o.pattern.test(str) ;
//         var b = new XRegExp( '^' + o.pattern.source + '$' , 'g').test(str) ;
//         return b ;
//     } ;
//
//     return o ;
// }
//
// function getStringMatcher( pattern) {
//     return AntPathStringMatcher( pattern , caseSensitive) ;
// }
//
// function matchStrings( pattern , str) {
//     return getStringMatcher(pattern).matchStrings(str) ;
// }
//
// function doMatch( pattern , path , fullMatch) {
//     if( path.startsWith( pathSeparator) != pattern.startsWith( pathSeparator))
//         return false ;
//
//     var pattDirs = tokenizePattern( pattern) ;
//     var pathDirs = tokenizePath( path) ;
//
//     var pattIdxStart = 0;
//     var pattIdxEnd = pattDirs.length - 1;
//     var pathIdxStart = 0;
//     var pathIdxEnd = pathDirs.length - 1;
//
//     // Match all elements up to the first **
//     while ( pattIdxStart <= pattIdxEnd && pathIdxStart <= pathIdxEnd)
//     {
//         var pattDir = pattDirs[pattIdxStart];
//
//         if ("**" == pattDir )
//             break;
//
//         if ( ! matchStrings(pattDir, pathDirs[pathIdxStart], null))
//             return false;
//
//         pattIdxStart++;
//         pathIdxStart++;
//     }
//
//     if (pathIdxStart > pathIdxEnd) {
//         // Path is exhausted, only match if rest of pattern is * or **'s
//         if (pattIdxStart > pattIdxEnd) {
//             return (pattern.endsWith( pathSeparator) == path.endsWith( pathSeparator));
//         }
//         if (!fullMatch) {
//             return true;
//         }
//         if (pattIdxStart == pattIdxEnd && pattDirs[pattIdxStart] == "*" && path.endsWith( pathSeparator)) {
//             return true;
//         }
//         for (var i = pattIdxStart; i <= pattIdxEnd; i++) {
//             if ( ! (pattDirs[i] == "**")) {
//                 return false;
//             }
//         }
//         return true;
//     }
//
//     else if (pattIdxStart > pattIdxEnd) {
//         // String not exhausted, but pattern is. Failure.
//         return false;
//     }
//     else if ( ! (fullMatch && "**" == pattDirs[pattIdxStart])) {
//         // Path start definitely matches due to "**" part in pattern.
//         return true;
//     }
//
//     // up to last '**'
//     while (pattIdxStart <= pattIdxEnd && pathIdxStart <= pathIdxEnd) {
//         var pattDir = pattDirs[pattIdxEnd];
//         if (pattDir == "**") {
//             break;
//         }
//         if ( ! matchStrings( pattDir, pathDirs[pathIdxEnd], null)) {
//             return false;
//         }
//         pattIdxEnd--;
//         pathIdxEnd--;
//     }
//
//     if (pathIdxStart > pathIdxEnd) {
//         // String is exhausted
//         for ( var i = pattIdxStart; i <= pattIdxEnd; i++) {
//             if ( ! ( pattDirs[i] == "**")) {
//                 return false;
//             }
//         }
//         return true;
//     }
//
//     while (pattIdxStart != pattIdxEnd && pathIdxStart <= pathIdxEnd) {
//         var patIdxTmp = -1;
//         for ( var i = pattIdxStart + 1; i <= pattIdxEnd; i++) {
//             if (pattDirs[i] == "**") {
//                 patIdxTmp = i;
//                 break;
//             }
//         }
//         if (patIdxTmp == pattIdxStart + 1) {
//             // '**/**' situation, so skip one
//             pattIdxStart++;
//             continue;
//         }
//         // Find the pattern between padIdxStart & padIdxTmp in str between
//         // strIdxStart & strIdxEnd
//         var patLength = (patIdxTmp - pattIdxStart - 1);
//         var strLength = (pathIdxEnd - pathIdxStart + 1);
//         var foundIdx = -1;
//
//         strLoop:
//             for ( var i = 0; i <= strLength - patLength; i++) {
//                 for ( var j = 0; j < patLength; j++) {
//                     var subPat = pattDirs[pattIdxStart + j + 1];
//                     var subStr = pathDirs[pathIdxStart + i + j];
//                     if (! matchStrings(subPat, subStr, null)) {
//                         continue strLoop;
//                     }
//                 }
//                 foundIdx = pathIdxStart + i;
//                 break;
//             }
//
//         if (foundIdx == -1) {
//             return false;
//         }
//
//         pattIdxStart = patIdxTmp;
//         pathIdxStart = foundIdx + patLength;
//     }
//
//     for ( var i = pattIdxStart; i <= pattIdxEnd; i++) {
//         if ( ! (pattDirs[i] == "**")) {
//             return false;
//         }
//     }
//
//     return true ;
// }
//
//
// function antPathMatcher() {
//     var o = new Object() ;
//
//     o.match = function( pattern , path) {
//         return doMatch( pattern, path , true , null) ;
//     } ;
//
//     return o ;
// }
