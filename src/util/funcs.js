import _         from 'lodash'
import regexps   from 'Util/regexps'
import factories from 'Util/factories'

const funcs = {
    typeOnlyNums: e => !(regexps.onlyNums.test(e.key)) && e.preventDefault(),

    typeOnlyMax: (e, maxLength) => (e.keyCode != 8) ? e.target.value.length === maxLength && e.preventDefault() : true,

    cleanFields: ctx => {
        ctx.$refs.form.reset()
        window.setTimeout(() => ctx.errors.clear(), 10)
    },
    
    getTextClipboard: (e) => {
        let clipboardData = e.clipboardData || 
        e.originalEvent.clipboardData || 
        window.clipboardData
        return clipboardData.getData('text')
    },

    limitPasteField: (e, lengthPermit, regexp) => {
        let pastedData    = funcs.getTextClipboard(e),
            element       = e.target,
            currentText   = e.target.value,
            currentLength = e.target.value.length,
            posTextCursor = funcs.doGetCaretPosition(element),
            newMergedText = currentText

        if( (currentLength < lengthPermit) && ( !regexp || regexps[regexp].test(pastedData) ) )
        {
            let newText       = _.join( _.take(pastedData, lengthPermit - currentLength), '' )
            newMergedText 	  = _.join( _.dropRight( currentText, currentLength -  posTextCursor ), '' ) + newText +
                                _.join( _.drop( currentText, posTextCursor ), '' )
        }
        e.preventDefault()
        return newMergedText
    },
    doGetCaretPosition: oField => {
      var iCaretPos = 0;

      if (document.selection) {
        oField.focus();

        var oSel = document.selection.createRange();
        oSel.moveStart('character', -oField.value.length);
        iCaretPos = oSel.text.length;
      }
      else if (oField.selectionStart || oField.selectionStart == '0')
        iCaretPos = oField.selectionStart;

      return iCaretPos;
    },
    splitWordPascalCase(word, splitChar = ' ') {
        var wordRe = /($[a-z])|[A-Z][^A-Z]+/g;
        if (word.match(wordRe)) {
            return word.match(wordRe).join(splitChar)
        }else return word   
    },
    buildArrayColumnsDataTableVuetify(arrayColumns){
        let newArrayColumns = []
        arrayColumns.forEach((a,i) => {
            newArrayColumns.push({ text : this.splitWordPascalCase(a, " "),  value : a})
        })
        return newArrayColumns
    },
    stringNormalizeColumnsNames(word) {
        return word
            .normalize('NFD') //normaliza a String Eror en Internet Explorer
            .toLowerCase() //convierte a minúsculas
            .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")//remplaza acentos de vocales
            .normalize()//normaliza a String Eror en Internet Explorer
            .replace(/\b\w/g, l => l.toUpperCase()) //Capitalize String
            .replace(/\s/g, "") //quita espacios
    },

    getSplitNameProperties(word){
        return _.join(_.map(word, (letter, index) => index > 0 && _.toUpper(letter) === letter ? ` ${letter}` : letter), '')
    },

    inCaseEmpty: factories.inCase(_.isEmpty),

    insertItemInPos: (array, item, index) =>
      [...array.slice(0, index), ...item, ...array.slice(index, array.length)]
}

export default funcs