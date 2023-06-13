import * as XLSX from 'xlsx';
import { join } from 'path';
import { Post } from '@nestjs/common';

export class ValidateUpload {
  
    xlData;
    filePath;
    tbRoundOff;
    WHITE_SPACES = [
        " ",
        "\n",
        "\r",
        "\t",
        "\f",
        "\v",
        "\u00A0",
        "\u1680",
        "\u180E",
        "\u2000",
        "\u2001",
        "\u2002",
        "\u2003",
        "\u2004",
        "\u2005",
        "\u2006",
        "\u2007",
        "\u2008",
        "\u2009",
        "\u200A",
        "\u2028",
        "\u2029",
        "\u202F",
        "\u205F",
        "\u3000"
      ];
    
    constructor(filePath,tbRoundOff?){
        this.filePath = filePath
        this.init();
    }

   init(){
        // let workbook = XLSX.readFile(join(__dirname,'../../',this.filePath));
        let workbook=XLSX.readFile(join(__dirname,'../uploads/employee/',this.filePath))
        let sheet_name_list = workbook.SheetNames;
        this.xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]],{ blankrows: true});
   }

   getUniqueArray(arr = [], compareProps = []) {
    let modifiedArray = [];
    let duplicateArray = [];
    if (arr.length > 0) {
        if(compareProps.length === 0){
            compareProps.push(...Object.keys(arr[0]));
        }
        arr.map((item, index) => {
            if (modifiedArray.length === 0) {
                modifiedArray.push(item);
            } else {
                if (!modifiedArray.some(item2 =>
                    compareProps.every(eachProps => item2[eachProps] === item[eachProps])
                )) { modifiedArray.push(item); }
                else{
                    duplicateArray.push({item,index})
                }
            }
        });
        return {modifiedArray:modifiedArray,duplicateArray:duplicateArray};
    }
}

   validateExcel(){
       return new Promise((resolve, reject)=>{
        var compareProps = ['type1','type','fsg','ssg','glCode','glDescription'];
        var preprocessingErrors = [];

        var preProccessedData = this.xlData.map((ele,index)=>{
            let newEle = {}
            for(let key in ele){
                let convertToString = ele[key].toString()
                newEle[this.trim(this.camelCase(key))] = this.trim(convertToString);
            }
            // concat glCode with glDescription
            newEle['glDescription'] = `${newEle['glCode']}.${newEle['glDescription']}`
            if(!compareProps.every(eachProps => Object.keys(newEle).includes(eachProps))){
                preprocessingErrors.push({row:newEle,index,diff:compareProps.filter(x => !Object.keys(newEle).includes(x))})
            }
            return newEle;
        })
        let preprocessingErrorMsg = this.constructPreprocessingErrorMsg(preprocessingErrors)
        let uniqueness = this.getUniqueArray(preProccessedData,compareProps);
        let uniquenessErrorMsg = this.constructUniqunessErrorMsg(uniqueness.duplicateArray)
          
        if(preprocessingErrorMsg.length > 0 || uniquenessErrorMsg.length > 0){
            resolve({status:false,error:'validationError',data:[...preprocessingErrorMsg, ...uniquenessErrorMsg]})
        }
        else{
            resolve({status:true,data:uniqueness}) 
        }
       })
    }
    constructUniqunessErrorMsg(uniqueness){
        let errorDesc = []
        if(uniqueness.length > 0){
            let errorDesc = [];
            uniqueness.forEach((ele)=>{
                errorDesc.push({row:`Row ${ele['index']+2}`,desc:`glDesc ${ele['item']['glDescription']} - has Duplicate Entry.`}) 
            })
            return errorDesc
        }
        else{
            return errorDesc
        }
    }
    constructPreprocessingErrorMsg(preprocessingErrors){
        let errorDesc = []
        if(preprocessingErrors.length>0){
            preprocessingErrors.forEach((ele)=>{
                errorDesc.push({row:`Row ${ele['index']+2}`,desc:`${ele['diff'].join()} - fields missing in the Row.`}) 
            })
            return errorDesc;
        }
        else{
            return errorDesc
        }
    }
    roundOffCalc(value, places){
      var precalculatedPrecisions = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10]
      let precision = precalculatedPrecisions[places]
      return Math.round(value * precision + 1e-14) / precision ;
    }
    validateTbExcel(){
      return new Promise((resolve,reject)=>{
        var compareProps = ['empId','firstName','lastName','email','mobile','dob','bloodGroup','department','designation','company','gender','emergencyMobile','location'];
        var preprocessingErrors = [];         

        var preProccessedData = this.xlData.map((ele,index)=>{
            let newEle = {}
            for(let key in ele){
                  let convertToString = ele[key].toString()
                  let trimedValue = this.trim(convertToString);
                  // if(key.toLowerCase() != 'amount'){
                  //   newEle[this.trim(this.camelCase(key))] = trimedValue;
                  // }
                    newEle[this.trim(this.camelCase(key))] = trimedValue;
                // }
                // else{
                //   newEle[this.trim(this.camelCase(key))] = ele[key];
                // }
            }
            newEle['fullNumber'] = newEle['amount']
            newEle['amount'] = this.roundOffCalc(Number(newEle['amount']),Number(this.tbRoundOff))

            if(!compareProps.every(eachProps => Object.keys(newEle).includes(eachProps))){
                preprocessingErrors.push({row:newEle,index,diff:compareProps.filter(x => !Object.keys(newEle).includes(x))})
            }
            return newEle;
        })
   
        let preprocessingErrorMsg = this.constructPreprocessingErrorMsg(preprocessingErrors)
        preProccessedData.map((ele)=>{ ele['glDescription'] = `${ele['glCode']}.${ele['glDescription']}`})
        // let concatGlCodeAndGlDesc = this.concatGlCodeGlDesc(preProccessedData)
        let checkForNumber = this.checkForNumberValidation(preProccessedData)
        let uniqueness = this.getUniqueArray(preProccessedData,compareProps);
        let uniquenessErrorMsg = this.constructUniqunessErrorMsg(uniqueness.duplicateArray)
          
        if(preprocessingErrorMsg.length > 0 || uniquenessErrorMsg.length > 0 || checkForNumber.length > 0){
            resolve({status:false,error:'validationError',data:[...preprocessingErrorMsg, ...uniquenessErrorMsg, ...checkForNumber]})
        }
        else{
            resolve({status:true,data:uniqueness}) 
        }
      })
    }


    concatGlCodeGlDesc(jsonData){
      jsonData.map((ele)=>{ ele['glDescription'] = `${ele['glCode']}.${ele['glDescription']}`})
      return jsonData;
    }
    checkForNumberValidation(jsonData){
      let numberCheckError = [];
      let sum = 0;
      let jsonLength = jsonData.length;
      for(let i=0; i<jsonLength; i++){
        if(isNaN(jsonData[i]['amount'])){
          numberCheckError.push({row:`Row ${i+2}`, desc:`Value is not a Proper Number`})
        }
        else{
          sum += Number(jsonData[i]['amount'])
        }
      }
      if(Math.trunc(sum) != 0){
        numberCheckError.push({row: 'SUM ERROR', desc:`TB Total Not Equal to Zero, Current Sum is ${sum}`})
      }
      return numberCheckError;
    }
//    helpers


/**
 * Remove white-spaces from beginning and end of string.
 */
 trim(str, chars?) {
    chars = chars || this.WHITE_SPACES;
    return this.ltrim(this.rtrim(str, chars), chars);
  }
  
  /**
 * Remove chars from beginning of string.
 */
 ltrim(str, chars) {
    chars = chars || this.WHITE_SPACES;
  
    var start = 0,
      len = str.length,
      charLen = chars.length,
      found = true,
      i,
      c;
  
    while (found && start < len) {
      found = false;
      i = -1;
      c = str.charAt(start);
  
      while (++i < charLen) {
        if (c === chars[i]) {
          found = true;
          start++;
          break;
        }
      }
    }
  
    return start >= len ? "" : str.substr(start, len);
  }

  /**
 * Remove chars from end of string.
 */
 rtrim(str, chars) {
    chars = chars || this.WHITE_SPACES;
    var end = str.length - 1,
      charLen = chars.length,
      found = true,
      i,
      c;
  
    while (found && end >= 0) {
      found = false;
      i = -1;
      c = str.charAt(end);
  
      while (++i < charLen) {
        if (c === chars[i]) {
          found = true;
          end--;
          break;
        }
      }
    }
  
    return end >= 0 ? str.substring(0, end + 1) : "";
  }
  


/**
 * Convert string to camelCase text.
 */
 camelCase(str) {
    // str = replaceAccents(str);
    str = this.removeNonWord(str)
    str = this.lowerCase(str)
      .replace(/\-/g, " ") //convert all hyphens to spaces
      .replace(/\s[a-z]/g, this.upperCase) //convert first char of each word to UPPERCASE
      .replace(/\s+/g, "") //remove spaces
      .replace(/^[A-Z]/g, this.lowerCase); //convert first char to lowercase
    return str;
  }
/**
 * "Safer" String.toLowerCase()
 */
 lowerCase(str) {
    return str.toLowerCase();
  }
  
  /**
 * "Safer" String.toUpperCase()
 */
 upperCase(str) {
    return str.toUpperCase();
  }

  
  /**
 * Replaces all accented chars with regular ones
 */
 replaceAccents(str) {
    // verifies if the String has accents and replace them
    if (str.search(/[\xC0-\xFF]/g) > -1) {
      str = str
        .replace(/[\xC0-\xC5]/g, "A")
        .replace(/[\xC6]/g, "AE")
        .replace(/[\xC7]/g, "C")
        .replace(/[\xC8-\xCB]/g, "E")
        .replace(/[\xCC-\xCF]/g, "I")
        .replace(/[\xD0]/g, "D")
        .replace(/[\xD1]/g, "N")
        .replace(/[\xD2-\xD6\xD8]/g, "O")
        .replace(/[\xD9-\xDC]/g, "U")
        .replace(/[\xDD]/g, "Y")
        .replace(/[\xDE]/g, "P")
        .replace(/[\xE0-\xE5]/g, "a")
        .replace(/[\xE6]/g, "ae")
        .replace(/[\xE7]/g, "c")
        .replace(/[\xE8-\xEB]/g, "e")
        .replace(/[\xEC-\xEF]/g, "i")
        .replace(/[\xF1]/g, "n")
        .replace(/[\xF2-\xF6\xF8]/g, "o")
        .replace(/[\xF9-\xFC]/g, "u")
        .replace(/[\xFE]/g, "p")
        .replace(/[\xFD\xFF]/g, "y");
    }
  
    return str;
  }

  /**
 * Remove non-word chars.
 */
 removeNonWord(str) {
    return str.replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, "");
  }
  

}
